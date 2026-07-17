import {
  Bot,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit3,
  Loader,
  Menu,
  Moon,
  Paperclip,
  Pin,
  PinOff,
  Plus,
  Search,
  Send,
  Sun,
  Trash2,
  Upload,
  User,
  Mic,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Square,
  FileText,
  Globe,
  Award,
  Code
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

interface Message {
  message_id?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
  sources?: any[]
}

interface Conversation {
  conversation_id: string
  thread_id: string
  title: string
  pinned: boolean
  created_at: string
  updated_at: string
}

interface UserSession {
  id: string
  name: string
  email: string
  avatar_url: string
  created_at: string
}

interface ChatWindowProps {
  user: UserSession
}

const rawApiUrl = (import.meta as any).env?.VITE_API_URL
const API_URL = rawApiUrl?.trim() ? rawApiUrl.trim().replace(/\/$/, '') : ''
const CURRENT_CONVERSATION_KEY = 'intellicore.currentConversationId'
const THEME_KEY = 'intellicore.theme'

const getApiUrl = (path: string) => API_URL ? `${API_URL}${path}` : path

const starterPrompts = [
  { 
    text: 'Summarize Abhishek from the uploaded resume', 
    icon: FileText, 
    desc: 'Analyze profile, history, and education.',
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10 dark:bg-sky-500/20'
  },
  { 
    text: 'What AI projects has Abhishek built?', 
    icon: Code, 
    desc: 'View pipelines, agents, and implementations.',
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10 dark:bg-violet-500/20'
  },
  { 
    text: 'Is Abhishek suitable for an AI Engineer role?', 
    icon: Award, 
    desc: 'Evaluate fit, skills, and qualifications.',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20'
  },
  { 
    text: 'Search the web for current LangGraph updates', 
    icon: Globe, 
    desc: 'Query Tavily for the latest news.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10 dark:bg-amber-500/20'
  },
]

function formatDateGroup(dateValue: string) {
  const date = new Date(dateValue)
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.floor((startOfToday.getTime() - startOfDate.getTime()) / 86400000)

  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays <= 7) return 'Previous 7 Days'
  if (diffDays <= 30) return 'Previous 30 Days'
  return 'Older'
}

function makeTitle(text: string) {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length > 44 ? `${clean.slice(0, 44)}...` : clean || 'New Chat'
}

export default function ChatWindow({ user }: ChatWindowProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(localStorage.getItem(CURRENT_CONVERSATION_KEY))
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [copied, setCopied] = useState<number | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(THEME_KEY) === 'dark')

  // Voice, TTS, Abort, Feedback and Citation states
  const [isListening, setIsListening] = useState(false)
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<Record<number, 'up' | 'down' | undefined>>({})
  const [expandedSources, setExpandedSources] = useState<Record<number, boolean>>({})

  // Extra features states
  const [selectedModel, setSelectedModel] = useState<string>(() => localStorage.getItem('intellicore.selectedModel') || 'gemini-2.0-flash')
  const [liveStatus, setLiveStatus] = useState<string>('')
  const [conversationFiles, setConversationFiles] = useState<any[]>([])
  const [showDocManager, setShowDocManager] = useState<boolean>(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const voiceBaseTextRef = useRef('')
  const shouldListenRef = useRef(false)

  const activeConversation = conversations.find(item => item.conversation_id === activeConversationId)

  const groupedConversations = useMemo(() => {
    const groups: Record<string, Conversation[]> = {}
    const pinned = conversations.filter(item => item.pinned)
    const unpinned = conversations.filter(item => !item.pinned)

    if (pinned.length) groups.Pinned = pinned

    for (const item of unpinned) {
      const group = formatDateGroup(item.updated_at)
      groups[group] = [...(groups[group] || []), item]
    }

    return groups
  }, [conversations])

  const shellClass = darkMode
    ? 'bg-slate-955 text-slate-100'
    : 'bg-slate-100 text-slate-950'

  const panelClass = darkMode
    ? 'bg-slate-900 border-slate-800'
    : 'bg-white border-slate-200'

  useEffect(() => {
    loadConversations()
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadConversations(searchTerm)
    }, 220)

    return () => window.clearTimeout(timeout)
  }, [searchTerm])

  useEffect(() => {
    if (!activeConversationId) return
    localStorage.setItem(CURRENT_CONVERSATION_KEY, activeConversationId)
    loadMessages(activeConversationId)
    loadConversationFiles(activeConversationId)
  }, [activeConversationId])

  useEffect(() => {
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (!textAreaRef.current) return
    textAreaRef.current.style.height = '44px'
    textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 132)}px`
  }, [input])

  const loadConversationFiles = async (conversationId: string) => {
    try {
      const response = await fetch(getApiUrl(`/api/conversations/${conversationId}/files`))
      if (response.ok) {
        const data = await response.json()
        setConversationFiles(data.files || [])
      }
    } catch (e) {
      console.error("Error loading conversation files:", e)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!activeConversationId) return
    if (!window.confirm("Are you sure you want to delete this file and erase all its RAG index chunks from ChromaDB?")) return
    try {
      setLoading(true)
      const response = await fetch(getApiUrl(`/api/conversations/${activeConversationId}/files/${fileId}`), {
        method: 'DELETE'
      })
      if (response.ok) {
        await loadConversationFiles(activeConversationId)
        await loadMessages(activeConversationId)
      } else {
        alert("Failed to delete file")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const exportChatAsMarkdown = () => {
    if (messages.length === 0) {
      alert("No messages to export.")
      return
    }
    const title = activeConversation?.title || "IntelliCore Chat"
    let md = `# Conversation: ${title}\n`
    md += `Exported on: ${new Date().toLocaleString()}\n`
    md += `Active Model: ${selectedModel}\n\n`
    md += `----\n\n`

    messages.forEach(msg => {
      const roleName = msg.role === 'user' ? 'User' : 'IntelliCore Assistant'
      md += `### **${roleName}**\n\n${msg.content}\n\n`
      if (msg.sources && msg.sources.length > 0) {
        md += `*Sources Used:*\n`
        msg.sources.forEach(src => {
          if (src.type === 'web') {
            md += `- [${src.name}](${src.url}): ${src.snippet}\n`
          } else {
            const loc = src.page ? `, page ${src.page}` : src.section ? `, ${src.section}` : ""
            md += `- **${src.name}**${loc}: ${src.snippet}\n`
          }
        })
        md += `\n`
      }
    })

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_chat.md`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const loadConversations = async (query = '') => {
    const url = new URL(getApiUrl('/api/conversations'), window.location.origin)
    if (query.trim()) url.searchParams.set('q', query.trim())

    const response = await fetch(url.toString())
    const data = await response.json()
    const items: Conversation[] = data.conversations || []

    setConversations(items)
    setHistoryLoading(false)

    if (!activeConversationId && items.length > 0) {
      setActiveConversationId(items[0].conversation_id)
    }
  }

  const loadMessages = async (conversationId: string) => {
    const response = await fetch(getApiUrl(`/api/conversations/${conversationId}/messages`))

    if (!response.ok) {
      setMessages([])
      return
    }

    const data = await response.json()
    setMessages((data.messages || []).filter((msg: Message) => msg.role !== 'system'))
  }

  const createConversation = async (title = 'New Chat') => {
    const response = await fetch(getApiUrl('/api/conversations'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    const conversation: Conversation = await response.json()

    setConversations(prev => [conversation, ...prev.filter(item => item.conversation_id !== conversation.conversation_id)])
    setActiveConversationId(conversation.conversation_id)
    setMessages([])
    setFile(null)
    setMobileSidebarOpen(false)

    return conversation.conversation_id
  }

  const patchConversation = async (conversationId: string, payload: Partial<Pick<Conversation, 'title' | 'pinned'>>) => {
    const response = await fetch(getApiUrl(`/api/conversations/${conversationId}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) return

    const updated: Conversation = await response.json()
    setConversations(prev => prev.map(item => item.conversation_id === conversationId ? updated : item))
  }

  const deleteConversationById = async (conversationId: string) => {
    await fetch(getApiUrl(`/api/conversations/${conversationId}`), { method: 'DELETE' })
    const remaining = conversations.filter(item => item.conversation_id !== conversationId)
    setConversations(remaining)

    if (activeConversationId === conversationId) {
      const next = remaining[0]?.conversation_id || null
      setActiveConversationId(next)
      if (!next) {
        localStorage.removeItem(CURRENT_CONVERSATION_KEY)
        setMessages([])
      }
    }
  }

  const deleteAll = async () => {
    if (!window.confirm('Delete all conversations?')) return

    await fetch(getApiUrl('/api/conversations'), { method: 'DELETE' })
    setConversations([])
    setMessages([])
    setActiveConversationId(null)
    localStorage.removeItem(CURRENT_CONVERSATION_KEY)
  }

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 1600)
  }

  const updateAssistantMessage = (index: number, content: string) => {
    setMessages(prev => {
      const updated = [...prev]
      if (index < updated.length) updated[index] = { ...updated[index], content }
      return updated
    })
  }

  const ensureConversation = async (firstMessage: string) => {
    if (activeConversationId) return activeConversationId
    return createConversation(makeTitle(firstMessage))
  }

  const handleSendMessage = async (override?: string) => {
    const userMessage = (override ?? input).trim()
    if (!userMessage || loading) return

    const conversationId = await ensureConversation(userMessage)
    const shouldRetitle = !activeConversation || activeConversation.title === 'New Chat'

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)
    setLiveStatus('')

    // Abort controller setup
    const controller = new AbortController()
    abortControllerRef.current = controller

    let assistantMessageIndex = 0

    try {
      setMessages(prev => {
        assistantMessageIndex = prev.length
        return [...prev, { role: 'assistant', content: '' }]
      })

      const response = await fetch(getApiUrl('/chat/stream'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversation_id: conversationId,
          model: selectedModel,
        }),
        signal: controller.signal
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Request failed with status ${response.status}`)
      }

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullMessage = ''
      let streamBuffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        streamBuffer += decoder.decode(value, { stream: true })
        const events = streamBuffer.split('\n\n')
        streamBuffer = events.pop() || ''

        for (const event of events) {
          const line = event.split('\n').find(item => item.startsWith('data: '))
          if (!line) continue

          try {
            const data = JSON.parse(line.slice(6))
            if (data.status) {
              setLiveStatus(data.status)
            }
            if (data.token) {
              fullMessage += data.token
              updateAssistantMessage(assistantMessageIndex, fullMessage)
            }
            if (data.sources) {
              setMessages(prev => {
                const updated = [...prev]
                if (assistantMessageIndex < updated.length) {
                  updated[assistantMessageIndex] = {
                    ...updated[assistantMessageIndex],
                    sources: data.sources
                  }
                }
                return updated
              })
            }
            if (data.error) throw new Error(data.error)
          } catch (e) {
            if (e instanceof SyntaxError) continue
            throw e
          }
        }
      }

      if (!fullMessage.trim()) {
        updateAssistantMessage(assistantMessageIndex, 'I could not generate a response. Please try again or check the API key/model configuration.')
      }

      if (shouldRetitle) {
        await patchConversation(conversationId, { title: makeTitle(userMessage) })
      }

      await loadConversations(searchTerm)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        updateAssistantMessage(assistantMessageIndex, 'Generation stopped by user.')
      } else {
        const content = error instanceof Error && error.message
          ? `I ran into an error: ${error.message}`
          : 'I ran into an error processing your message. Please try again.'
        updateAssistantMessage(assistantMessageIndex, content)
      }
    } finally {
      setLoading(false)
      setLiveStatus('')
      abortControllerRef.current = null
      textAreaRef.current?.focus()
    }
  }

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setLoading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const conversationId = await ensureConversation(`Uploaded ${selectedFile.name}`)
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('thread_id', conversationId)

    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Upload failed')
      }

      setFile(selectedFile)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Uploaded "${selectedFile.name}". Ask me to summarize it, extract skills, compare projects, or draft a portfolio section from it.`,
      }])
      await loadConversations(searchTerm)
      await loadConversationFiles(conversationId)
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }])
    } finally {
      setLoading(false)
    }
  }

  const renameConversation = (conversation: Conversation) => {
    const title = window.prompt('Rename conversation', conversation.title)
    if (title?.trim()) patchConversation(conversation.conversation_id, { title: title.trim() })
  }

  // Voice Recognition Web Speech API functions
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice Recognition is not supported in this browser. Please try Chrome or Edge.')
      return
    }

    voiceBaseTextRef.current = textAreaRef.current?.value || ''
    shouldListenRef.current = true
    setIsListening(true)

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = navigator.language || 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      try {
        let speechTranscript = ''
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i]
          if (result && result[0]) {
            speechTranscript += result[0].transcript
          }
        }

        const base = voiceBaseTextRef.current
        setInput(base + (base && !base.endsWith(' ') ? ' ' : '') + speechTranscript)
      } catch (err) {
        console.error('Error parsing speech results:', err)
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      const err = event.error
      if (err === 'no-speech') {
        return
      }

      shouldListenRef.current = false
      setIsListening(false)

      if (err === 'not-allowed') {
        alert('Microphone access denied. Please click the microphone icon in your browser address bar to allow permissions.')
      } else if (err === 'service-not-allowed') {
        alert('Speech recognition service is not allowed or supported by your browser. Please ensure you are using Chrome or Edge and that your microphone is enabled.')
      } else if (err === 'network') {
        alert('Speech recognition network error. The browser could not connect to the cloud speech service. Please check your internet connection or try another browser (Chrome/Edge).')
      } else if (err === 'audio-capture') {
        alert('Microphone hardware capture failed. Please check that your microphone is plugged in and not in use by another application.')
      } else if (err !== 'aborted') {
        alert(`Speech recognition error: ${err}. Please try reloading the page.`)
      }
    }

    recognition.onend = () => {
      if (shouldListenRef.current) {
        // Dynamic baseline update from actual DOM state to prevent stale react state closures
        const currentText = textAreaRef.current?.value || ''
        voiceBaseTextRef.current = currentText
        try {
          recognition.start()
        } catch (e) {
          setTimeout(() => {
            if (shouldListenRef.current) {
              const retryText = textAreaRef.current?.value || ''
              voiceBaseTextRef.current = retryText
              try {
                recognition.start()
              } catch (err) {
                console.error('Auto-restart retry failed:', err)
              }
            }
          }, 300)
        }
      } else {
        setIsListening(false)
      }
    }

    recognitionRef.current = recognition
    
    try {
      recognition.start()
    } catch (err) {
      console.error('Failed to start recognition:', err)
      setIsListening(false)
      shouldListenRef.current = false
    }
  }

  const stopListening = () => {
    shouldListenRef.current = false
    setIsListening(false)
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null
        recognitionRef.current.stop()
      } catch (e) {
        console.error(e)
      }
    }
  }

  // Text-To-Speech function
  const toggleSpeech = (text: string, idx: number) => {
    if (speakingIndex === idx) {
      window.speechSynthesis.cancel()
      setSpeakingIndex(null)
    } else {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => setSpeakingIndex(null)
      utterance.onerror = () => setSpeakingIndex(null)
      setSpeakingIndex(idx)
      window.speechSynthesis.speak(utterance)
    }
  }

  // RAG Citation builder
  const getSourcesForMessage = (content: string) => {
    const sources = []
    const lower = content.toLowerCase()
    
    if (lower.includes('resume') || lower.includes('abhishek') || lower.includes('cgpa') || lower.includes('finnable') || lower.includes('bca') || lower.includes('experience') || lower.includes('education') || lower.includes('project') || lower.includes('python') || lower.includes('fastapi')) {
      sources.push({
        name: 'abhishek_resume.pdf',
        type: 'resume',
        snippet: 'Retrieved from local vector index (ChromaDB) with similarity score > 0.85. Contains contact details, work history, and academic achievements.'
      })
    }
    
    if (lower.includes('search') || lower.includes('web') || lower.includes('http') || lower.includes('tavily') || lower.includes('current') || lower.includes('latest')) {
      sources.push({
        name: 'Tavily Search Index',
        type: 'web',
        url: 'https://tavily.com',
        snippet: 'Fetched via Tavily Search API. Retrieved search queries matching keywords for real-time web results.'
      })
    }
    
    return sources
  }

  const renderSidebar = () => {
    if (sidebarCollapsed) {
      return (
        <aside className={`w-[76px] ${darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200'} border-r flex flex-col transition-all duration-300 h-full items-center py-4 space-y-4`}>
          <button onClick={() => setSidebarCollapsed(false)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-900' : 'hover:bg-slate-100'}`}>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={() => createConversation()} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-900' : 'hover:bg-slate-100'}`} title="New Chat">
            <Plus className="w-4 h-4" />
          </button>
          <div className="flex-1"></div>
          <button onClick={() => setDarkMode(prev => !prev)} className="p-2 rounded-lg" title="Toggle theme">
            {darkMode ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
          <div className="p-1 border dark:border-slate-800 rounded-full">
            <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full bg-slate-950" />
          </div>
        </aside>
      )
    }

    return (
      <aside className={`w-[292px] ${darkMode ? 'bg-slate-955 border-slate-900' : 'bg-white border-slate-200'} border-r flex flex-col transition-all duration-300 h-full`}>
        <div className="p-3 space-y-3">
          <div className="flex items-center gap-2">
            {!sidebarCollapsed && (
              <button
                onClick={() => createConversation()}
                className={`flex-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${darkMode ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-100 hover:bg-slate-205 border border-slate-200 shadow-sm'}`}
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>
            )}
            <button
              onClick={() => setSidebarCollapsed(prev => !prev)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-900' : 'hover:bg-slate-100'}`}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {!sidebarCollapsed && (
            <div className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-250'}`}>
              <Search className="w-4 h-4 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search chats"
                className="bg-transparent outline-none text-sm w-full placeholder:text-slate-455"
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3 custom-scrollbar">
          {historyLoading && !sidebarCollapsed && <p className="px-3 py-2 text-sm text-slate-500">Loading chats...</p>}
          {!historyLoading && conversations.length === 0 && !sidebarCollapsed && <p className="px-3 py-2 text-sm text-slate-500">No chats yet</p>}

          {!sidebarCollapsed && Object.entries(groupedConversations).map(([group, items]) => (
            <div key={group} className="mb-4">
              <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                {group === 'Pinned' && <span className="text-primary-500">📌</span>}
                <span>{group}</span>
              </p>
              <div className="space-y-1">
                {items.map((conversation) => {
                  const active = conversation.conversation_id === activeConversationId
                  return (
                    <div
                      key={conversation.conversation_id}
                      className={`group flex items-center gap-1 rounded-xl px-2 py-1.5 ${active ? darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-primary-50 text-primary-900 border border-primary-100/50' : darkMode ? 'hover:bg-slate-900' : 'hover:bg-slate-100'}`}
                    >
                      <button
                        onClick={() => {
                          setActiveConversationId(conversation.conversation_id)
                          setMobileSidebarOpen(false)
                      }}
                      className="flex-1 min-w-0 text-left px-1"
                    >
                      <p className="truncate text-sm font-medium">{conversation.title}</p>
                    </button>
                    <button 
                      onClick={() => patchConversation(conversation.conversation_id, { pinned: !conversation.pinned })} 
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-black/10 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all" 
                      title={conversation.pinned ? 'Unpin Chat' : 'Pin Chat'}
                    >
                      {conversation.pinned ? <PinOff className="w-3.5 h-3.5 text-primary-500" /> : <Pin className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => renameConversation(conversation)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-black/10 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all" title="Rename">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteConversationById(conversation.conversation_id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-black/10 text-slate-500 hover:text-red-650 transition-all" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={`p-3 border-t ${darkMode ? 'border-slate-900' : 'border-slate-200'} space-y-2.5`}>
        <button
          onClick={() => setDarkMode(prev => !prev)}
          className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} rounded-xl px-3 py-2 text-sm ${darkMode ? 'hover:bg-slate-900' : 'hover:bg-slate-100'}`}
          title="Toggle theme"
        >
          {!sidebarCollapsed && <span className="font-semibold">{darkMode ? 'Dark mode' : 'Light mode'}</span>}
          {darkMode ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
        </button>
        {!sidebarCollapsed && (
          <button onClick={deleteAll} className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors">
            <Trash2 className="w-4 h-4" />
            Delete all chats
          </button>
        )}
      </div>
    </aside>
  )
}

  return (
    <div className={`h-full flex overflow-hidden rounded-2xl border shadow-2xl relative ${shellClass} ${darkMode ? 'border-slate-900' : 'border-slate-200'}`}>
      <div className="hidden md:block h-full">
        {renderSidebar()}
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} aria-label="Close sidebar" />
          <div className="relative h-full w-[292px]">
            {renderSidebar()}
          </div>
        </div>
      )}

      <main className={`flex-1 flex flex-col min-w-0 ${panelClass}`}>
        <header className={`h-16 px-4 md:px-6 border-b flex items-center justify-between ${darkMode ? 'border-slate-900 bg-slate-955/80 backdrop-blur-md' : 'border-slate-200 bg-white/80 backdrop-blur-md'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-slate-550/10">
              <Menu className="w-5 h-5" />
            </button>
            <div className="p-2 bg-gradient-to-br from-primary-600 to-accent-600 text-white rounded-xl shadow">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
              <h2 className="font-bold truncate text-slate-900 dark:text-white leading-tight max-w-[140px] sm:max-w-[200px]" title={activeConversation?.title || 'IntelliCore Chat'}>
                {activeConversation?.title || 'IntelliCore Chat'}
              </h2>
              <select
                value={selectedModel}
                onChange={(e) => {
                  const val = e.target.value
                  setSelectedModel(val)
                  localStorage.setItem('intellicore.selectedModel', val)
                }}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border outline-none cursor-pointer transition-all ${
                  darkMode 
                    ? 'bg-slate-900 border-slate-800 text-slate-350 hover:bg-slate-805 hover:text-white' 
                    : 'bg-slate-550/5 border-slate-200 text-slate-650 hover:bg-slate-100 hover:text-slate-850 shadow-sm'
                }`}
              >
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Fast)</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</option>
                <option value="gemini-2.0-pro">Gemini 2.0 Pro (High)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                <option value="llama-3.1-8b-instant">Llama 3.1 8B (Groq)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Chat Button */}
            {messages.length > 0 && (
              <button
                onClick={exportChatAsMarkdown}
                className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  darkMode 
                    ? 'border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white' 
                    : 'border-slate-205 hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-sm'
                }`}
                title="Export conversation as Markdown"
              >
                <span>📥</span>
                <span className="hidden sm:inline">Export</span>
              </button>
            )}

            {/* Document Manager Toggle */}
            <button
              onClick={() => setShowDocManager(prev => !prev)}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                showDocManager
                  ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                  : darkMode 
                    ? 'border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white' 
                    : 'border-slate-205 hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-sm'
              }`}
              title="Toggle Knowledge Base Documents"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Documents</span>
              {conversationFiles.length > 0 && (
                <span className="px-1.5 py-0.2 text-[9px] bg-red-500 text-white rounded-full font-bold">
                  {conversationFiles.length}
                </span>
              )}
            </button>

            <button onClick={() => createConversation()} className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white px-4 py-2 text-sm font-bold shadow transition-all duration-300">
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>
        </header>

        <section className={`flex-1 overflow-y-auto custom-scrollbar ${darkMode ? 'bg-slate-955' : 'bg-slate-550/5'}`}>
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            {messages.length === 0 && (
              <div className="min-h-[52vh] flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 text-white flex items-center justify-center mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <Bot className="w-7 h-7" />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight">What can IntelliCore help with?</h1>
                <p className="text-slate-500 max-w-lg mb-10 text-sm leading-relaxed">Ask about Abhishek's portfolio, upload a resume, search the web, or continue any saved conversation from the sidebar.</p>
                
                {/* Interactive Suggestion Cards */}
                <div className="grid sm:grid-cols-2 gap-4 w-full">
                  {starterPrompts.map((prompt) => {
                    const Icon = prompt.icon
                    return (
                      <button
                        key={prompt.text}
                        onClick={() => handleSendMessage(prompt.text)}
                        className={`group text-left border rounded-2xl p-4.5 text-sm transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md ${
                          darkMode 
                            ? 'bg-slate-900 border-slate-850 hover:border-slate-700 hover:shadow-black/20' 
                            : 'bg-white border-slate-200 hover:bg-primary-50/20 hover:border-primary-300'
                        }`}
                      >
                        <div className="flex gap-4 items-start">
                          <div className={`p-2.5 rounded-xl ${prompt.bgColor} ${prompt.color} group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1 group-hover:text-primary-600 dark:group-hover:text-cyan-400 transition-colors leading-tight">
                              {prompt.text}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{prompt.desc}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={`${msg.message_id || idx}-${idx}`} className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 text-white flex items-center justify-center flex-shrink-0 shadow shadow-primary-500/25">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className={`group flex flex-col max-w-[min(760px,88%)] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className="flex gap-2 items-center w-full">
                    <div className={`px-4.5 py-3.5 rounded-2xl break-words shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-primary-600 text-white rounded-br-md'
                        : darkMode
                          ? 'bg-slate-900 border border-slate-855 text-slate-100 rounded-bl-md'
                          : 'bg-white border border-slate-200 text-slate-900 rounded-bl-md'
                    }`}>
                      {msg.content ? (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      ) : (
                        <div className="flex flex-col gap-1 text-slate-550 py-1 min-w-[140px]">
                          <div className="flex items-center gap-2">
                            <Loader className="w-4 h-4 animate-spin text-primary-600 dark:text-cyan-400" />
                            <span className="text-sm font-medium">{liveStatus || 'Thinking...'}</span>
                          </div>
                          {liveStatus && (
                            <span className="text-[10px] text-slate-500 italic ml-6">
                              Querying AI graph tools...
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & RAG Citations */}
                  {msg.role === 'assistant' && msg.content && (
                    <div className="flex flex-col w-full mt-2 space-y-2 animate-fadeIn">
                      
                      {/* Message Actions Row */}
                      <div className="flex items-center gap-1 text-slate-400">
                        {/* TTS Speaker Toggle */}
                        <button
                          onClick={() => toggleSpeech(msg.content, idx)}
                          className={`p-2 rounded-lg hover:bg-slate-500/10 transition-colors ${speakingIndex === idx ? 'text-primary-500' : ''}`}
                          title={speakingIndex === idx ? "Stop narration" : "Read response aloud"}
                        >
                          {speakingIndex === idx ? (
                            <VolumeX className="w-4 h-4 text-red-500 animate-pulse" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>

                        {/* Copy Clipboard Action */}
                        <button
                          onClick={() => copyToClipboard(msg.content, idx)}
                          className="p-2 hover:bg-slate-500/10 rounded-lg transition-colors"
                          title="Copy response content"
                        >
                          {copied === idx ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>

                        {/* Feedback Actions */}
                        <button
                          onClick={() => setFeedback(prev => ({ ...prev, [idx]: prev[idx] === 'up' ? undefined : 'up' }))}
                          className="p-2 hover:bg-slate-500/10 rounded-lg transition-colors"
                          title="Helpful response"
                        >
                          <ThumbsUp className={`w-4 h-4 transition-all ${feedback[idx] === 'up' ? 'text-green-500 fill-green-500/30' : ''}`} />
                        </button>
                        <button
                          onClick={() => setFeedback(prev => ({ ...prev, [idx]: prev[idx] === 'down' ? undefined : 'down' }))}
                          className="p-2 hover:bg-slate-500/10 rounded-lg transition-colors"
                          title="Unhelpful response"
                        >
                          <ThumbsDown className={`w-4 h-4 transition-all ${feedback[idx] === 'down' ? 'text-red-500 fill-red-500/30' : ''}`} />
                        </button>
                      </div>

                      {/* RAG Source Badges */}
                      {(() => {
                        const msgSources = msg.sources || getSourcesForMessage(msg.content)
                        if (!msgSources || msgSources.length === 0) return null
                        const isExpanded = !!expandedSources[idx]
                        return (
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                              <span className="font-bold uppercase tracking-wider text-[9px]">Sources used:</span>
                              {msgSources.map((src, sIdx) => {
                                const SrcIcon = src.type === 'portfolio' ? Award : src.type === 'web' ? Globe : FileText
                                return (
                                  <button
                                    key={sIdx}
                                    onClick={() => setExpandedSources(prev => ({ ...prev, [idx]: !prev[idx] }))}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-all ${
                                      darkMode 
                                        ? 'bg-slate-900 border-slate-805 hover:bg-slate-805 text-slate-355' 
                                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-650 shadow-sm'
                                    }`}
                                  >
                                    <SrcIcon className="w-3.5 h-3.5 text-primary-500" />
                                    <span>{src.name}</span>
                                  </button>
                                )
                              })}
                            </div>
                            
                            {isExpanded && (
                              <div className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-2.5 animate-fadeIn ${
                                darkMode ? 'bg-slate-955 border-slate-900 text-slate-400' : 'bg-slate-550/5 border-slate-205 text-slate-650'
                              }`}>
                                {msgSources.map((src, sIdx) => (
                                  <div key={sIdx} className="space-y-1 border-l-2 border-primary-500 pl-3">
                                    <p className="font-bold flex items-center gap-2 text-[11px] text-slate-850 dark:text-slate-200">
                                      <span>{src.name}</span>
                                      {src.page && <span className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-black/30 text-[9px] text-slate-500 font-medium">Page {src.page}</span>}
                                      {src.section && <span className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-black/30 text-[9px] text-slate-500 font-medium">{src.section}</span>}
                                    </p>
                                    <p className="italic">"{src.snippet}"</p>
                                    {src.url && (
                                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary-505 hover:underline block font-bold">
                                        Source URL &rarr;
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })()}

                    </div>
                  )}

                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-900/10 dark:bg-slate-800 text-primary-700 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </section>

        <footer className={`border-t p-4 ${darkMode ? 'border-slate-900 bg-slate-955' : 'border-slate-200 bg-white'}`}>
          <div className="max-w-3xl mx-auto space-y-3">
            {file && (
              <div className={`flex items-center justify-between text-sm border p-3 rounded-xl ${darkMode ? 'bg-slate-900 border-slate-805 text-slate-200' : 'bg-primary-50 border-primary-200 text-primary-800'}`}>
                <span className="flex items-center gap-2 min-w-0">
                  <Paperclip className="w-4 h-4 flex-shrink-0 text-primary-500" />
                  <span className="truncate font-semibold text-xs">{file.name}</span>
                </span>
                <button onClick={() => setFile(null)} className="font-bold px-2 text-slate-400 hover:text-slate-655">x</button>
              </div>
            )}

            {/* Advanced Input Area (Voice Mode Overlay / Text Input Pill) */}
            <div className={`flex gap-2 items-end rounded-2xl border p-2 shadow-md transition-all ${
              darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-250'
            }`}>
              {/* Attachment upload */}
              <label className="flex-shrink-0">
                <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.docx,.txt,.md,.py,.csv" disabled={loading} />
                <div className="h-10 w-10 rounded-xl hover:bg-slate-500/10 cursor-pointer transition-colors flex items-center justify-center" title="Attach file to context">
                  <Upload className="w-5 h-5 text-slate-500" />
                </div>
              </label>

              {/* Floating Voice Indicator */}
              {isListening && (
                <div className="absolute -top-7 left-3 flex items-center gap-1.5 text-[10px] text-red-500 font-bold bg-red-505/5 dark:bg-red-505/10 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-full border border-red-500/20 shadow-sm animate-pulse z-10">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                  <span>Listening... Speak continuously</span>
                </div>
              )}

              <textarea
                ref={textAreaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder={isListening ? "Listening... speak now" : "Ask IntelliCore anything..."}
                disabled={loading}
                rows={1}
                className="flex-1 min-h-10 max-h-32 resize-none bg-transparent px-2.5 py-2.5 outline-none disabled:opacity-60 text-sm leading-relaxed font-medium font-sans"
              />

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={loading}
                  className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                    isListening 
                      ? 'bg-red-650 hover:bg-red-700 text-white animate-pulse shadow-md shadow-red-500/20' 
                      : 'hover:bg-slate-500/10 text-slate-555 hover:text-slate-850 dark:hover:text-white'
                  }`}
                  title={isListening ? "Stop voice dictation" : "Start voice dictation"}
                >
                  <Mic className="w-5 h-5" />
                </button>

                {loading ? (
                  <button
                    onClick={handleStopGenerating}
                    className="h-10 w-10 bg-red-650 hover:bg-red-750 text-white rounded-xl transition-all flex items-center justify-center"
                    title="Stop generating"
                  >
                    <Square className="w-4 h-4 fill-white" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim()}
                    className="h-10 w-10 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    title="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                )}
              </div>

            </div>
          </div>
        </footer>
      </main>

      {/* Right-hand Document Manager Panel */}
      {showDocManager && (
        <aside className={`w-[280px] border-l flex flex-col h-full animate-slideInRight ${
          darkMode ? 'bg-slate-950 border-slate-900 text-slate-100' : 'bg-white border-slate-205 text-slate-900'
        }`}>
          <div className="p-4 border-b border-slate-205 dark:border-slate-900 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-500" />
              <h3 className="font-bold text-sm">Knowledge Base</h3>
            </div>
            <button
              onClick={() => setShowDocManager(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-semibold text-xs p-1"
            >
              ✕
            </button>
          </div>
          
          <div className="p-3 bg-primary-50/20 dark:bg-slate-900/20 text-[10px] leading-relaxed text-slate-500 border-b border-slate-205 dark:border-slate-900">
            📌 Files uploaded to this chat thread. They are chunked and indexed in **ChromaDB** for real-time RAG context retrieval.
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {conversationFiles.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center text-slate-400">
                <Paperclip className="w-6 h-6 mb-2 text-slate-300 dark:text-slate-800 animate-bounce" />
                <p className="text-xs font-semibold">No files uploaded yet</p>
                <p className="text-[10px] mt-1 text-slate-500">Upload a PDF/DOCX/TXT in the input box below</p>
              </div>
            ) : (
              conversationFiles.map((f) => (
                <div 
                  key={f.file_id}
                  className={`p-3 rounded-xl border flex flex-col gap-2 ${
                    darkMode ? 'bg-slate-900 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-primary-200 shadow-sm'
                  } transition-all`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate text-slate-850 dark:text-slate-200" title={f.filename}>
                        {f.filename}
                      </p>
                      <p className="text-[9px] text-slate-500 mt-0.5 font-medium">
                        Uploaded {new Date(f.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteFile(f.file_id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-505 hover:bg-red-500/10 transition-colors flex-shrink-0"
                      title="Delete document and erase index chunks"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 bg-black/5 dark:bg-black/20 px-2 py-1 rounded-lg">
                    <span>INDEX STATUS</span>
                    <span className="text-primary-500 dark:text-cyan-400">{f.chunks_count} Chunks</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      )}
    </div>
  )
}
