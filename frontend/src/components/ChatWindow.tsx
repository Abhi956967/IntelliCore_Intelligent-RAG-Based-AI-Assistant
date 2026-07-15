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
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

interface Message {
  message_id?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
}

interface Conversation {
  conversation_id: string
  thread_id: string
  title: string
  pinned: boolean
  created_at: string
  updated_at: string
}

const API_URL = (import.meta as any).env?.VITE_API_URL || ''
const CHAT_MODEL = 'llama-3.1-8b-instant'
const CURRENT_CONVERSATION_KEY = 'intellicore.currentConversationId'
const THEME_KEY = 'intellicore.theme'

const starterPrompts = [
  'Summarize Abhishek from the uploaded resume',
  'What AI projects has Abhishek built?',
  'Is Abhishek suitable for an AI Engineer role?',
  'Search the web for current LangGraph updates',
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

export default function ChatWindow() {
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

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
    ? 'bg-slate-950 text-slate-100'
    : 'bg-slate-100 text-slate-950'

  const panelClass = darkMode
    ? 'bg-slate-900 border-slate-800'
    : 'bg-white border-slate-200'

  useEffect(() => {
    loadConversations()
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

  const loadConversations = async (query = '') => {
    const url = new URL(`${API_URL}/api/conversations`)
    if (query.trim()) url.searchParams.set('q', query.trim())

    const response = await fetch(url)
    const data = await response.json()
    const items: Conversation[] = data.conversations || []

    setConversations(items)
    setHistoryLoading(false)

    if (!activeConversationId && items.length > 0) {
      setActiveConversationId(items[0].conversation_id)
    }
  }

  const loadMessages = async (conversationId: string) => {
    const response = await fetch(`${API_URL}/api/conversations/${conversationId}/messages`)

    if (!response.ok) {
      setMessages([])
      return
    }

    const data = await response.json()
    setMessages((data.messages || []).filter((msg: Message) => msg.role !== 'system'))
  }

  const createConversation = async (title = 'New Chat') => {
    const response = await fetch(`${API_URL}/api/conversations`, {
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
    const response = await fetch(`${API_URL}/api/conversations/${conversationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) return

    const updated: Conversation = await response.json()
    setConversations(prev => prev.map(item => item.conversation_id === conversationId ? updated : item))
  }

  const deleteConversationById = async (conversationId: string) => {
    await fetch(`${API_URL}/api/conversations/${conversationId}`, { method: 'DELETE' })
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

    await fetch(`${API_URL}/api/conversations`, { method: 'DELETE' })
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

    let assistantMessageIndex = 0

    try {
      setMessages(prev => {
        assistantMessageIndex = prev.length
        return [...prev, { role: 'assistant', content: '' }]
      })

      const response = await fetch(`${API_URL}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversation_id: conversationId,
          model: CHAT_MODEL,
        }),
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
            if (data.token) {
              fullMessage += data.token
              updateAssistantMessage(assistantMessageIndex, fullMessage)
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
      const content = error instanceof Error && error.message
        ? `I ran into an error: ${error.message}`
        : 'I ran into an error processing your message. Please try again.'
      updateAssistantMessage(assistantMessageIndex, content)
    } finally {
      setLoading(false)
      textAreaRef.current?.focus()
    }
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

  const renderSidebar = () => (
    <aside className={`${sidebarCollapsed ? 'w-[76px]' : 'w-[292px]'} ${darkMode ? 'bg-black border-slate-800' : 'bg-white border-slate-200'} border-r flex flex-col transition-all duration-300 h-full`}>
      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          {!sidebarCollapsed && (
            <button
              onClick={() => createConversation()}
              className={`flex-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${darkMode ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-100 hover:bg-slate-200'}`}
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
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search chats"
              className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3 custom-scrollbar">
        {historyLoading && !sidebarCollapsed && <p className="px-3 py-2 text-sm text-slate-500">Loading chats...</p>}
        {!historyLoading && conversations.length === 0 && !sidebarCollapsed && <p className="px-3 py-2 text-sm text-slate-500">No chats yet</p>}

        {!sidebarCollapsed && Object.entries(groupedConversations).map(([group, items]) => (
          <div key={group} className="mb-4">
            <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-500">{group}</p>
            <div className="space-y-1">
              {items.map((conversation) => {
                const active = conversation.conversation_id === activeConversationId
                return (
                  <div
                    key={conversation.conversation_id}
                    className={`group flex items-center gap-1 rounded-lg px-2 py-1.5 ${active ? darkMode ? 'bg-slate-800' : 'bg-primary-50 text-primary-800' : darkMode ? 'hover:bg-slate-900' : 'hover:bg-slate-100'}`}
                  >
                    <button
                      onClick={() => {
                        setActiveConversationId(conversation.conversation_id)
                        setMobileSidebarOpen(false)
                      }}
                      className="flex-1 min-w-0 text-left px-1"
                    >
                      <p className="truncate text-sm">{conversation.title}</p>
                    </button>
                    <button onClick={() => patchConversation(conversation.conversation_id, { pinned: !conversation.pinned })} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-black/10" title={conversation.pinned ? 'Unpin' : 'Pin'}>
                      {conversation.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => renameConversation(conversation)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-black/10" title="Rename">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteConversationById(conversation.conversation_id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-black/10" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={`p-3 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'} space-y-2`}>
        <button
          onClick={() => setDarkMode(prev => !prev)}
          className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} rounded-lg px-3 py-2 text-sm ${darkMode ? 'hover:bg-slate-900' : 'hover:bg-slate-100'}`}
          title="Toggle theme"
        >
          {!sidebarCollapsed && <span>{darkMode ? 'Dark mode' : 'Light mode'}</span>}
          {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
        {!sidebarCollapsed && (
          <>
            <button onClick={deleteAll} className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4" />
              Delete all chats
            </button>
            <div className={`flex items-center gap-3 rounded-lg px-3 py-2 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold">AM</div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">Abhishek Maurya</p>
                <p className="text-xs text-slate-500 truncate">AI Engineer Portfolio</p>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  )

  return (
    <div className={`h-full flex overflow-hidden rounded-lg border shadow-xl ${shellClass} ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
      <div className="hidden md:block h-full">
        {renderSidebar()}
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebarOpen(false)} aria-label="Close sidebar" />
          <div className="relative h-full w-[292px]">
            {renderSidebar()}
          </div>
        </div>
      )}

      <main className={`flex-1 flex flex-col min-w-0 ${panelClass}`}>
        <header className={`h-16 px-4 md:px-6 border-b flex items-center justify-between ${darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-slate-500/10">
              <Menu className="w-5 h-5" />
            </button>
            <div className="p-2 bg-primary-600 text-white rounded-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold truncate">{activeConversation?.title || 'IntelliCore Chat'}</h2>
              <p className="text-xs text-slate-500">Groq-powered RAG agent - {CHAT_MODEL}</p>
            </div>
          </div>
          <button onClick={() => createConversation()} className="hidden sm:flex items-center gap-2 rounded-lg bg-primary-600 text-white px-3 py-2 text-sm font-semibold hover:bg-primary-700">
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </header>

        <section className={`flex-1 overflow-y-auto custom-scrollbar ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            {messages.length === 0 && (
              <div className="min-h-[48vh] flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center mb-5 shadow-lg">
                  <Bot className="w-7 h-7" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">What can IntelliCore help with?</h1>
                <p className="text-slate-500 max-w-xl mb-8">Ask about Abhishek's portfolio, upload a resume, search the web, or continue any saved conversation from the sidebar.</p>
                <div className="grid sm:grid-cols-2 gap-3 w-full">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSendMessage(prompt)}
                      className={`text-left border rounded-lg p-4 text-sm transition-all ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-primary-500' : 'bg-slate-50 border-slate-200 hover:bg-primary-50 hover:border-primary-300'}`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={`${msg.message_id || idx}-${idx}`} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className={`group flex gap-2 max-w-[min(760px,88%)] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`px-4 py-3 rounded-2xl break-words shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-md'
                      : darkMode
                        ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-md'
                        : 'bg-slate-50 border border-slate-200 text-slate-900 rounded-bl-md'
                  }`}>
                    {msg.content ? (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Loader className="w-4 h-4 animate-spin text-primary-600" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    )}
                  </div>
                  {msg.role === 'assistant' && msg.content && (
                    <button
                      onClick={() => copyToClipboard(msg.content, idx)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-slate-500/10 rounded-lg h-9"
                      title="Copy message"
                    >
                      {copied === idx ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    </button>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-500/10 text-primary-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </section>

        <footer className={`border-t p-4 ${darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
          <div className="max-w-4xl mx-auto space-y-3">
            {file && (
              <div className={`flex items-center justify-between text-sm border p-3 rounded-lg ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-primary-50 border-primary-200 text-primary-800'}`}>
                <span className="flex items-center gap-2 min-w-0">
                  <Paperclip className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{file.name}</span>
                </span>
                <button onClick={() => setFile(null)} className="font-bold px-2">x</button>
              </div>
            )}
            <div className={`flex gap-2 items-end rounded-2xl border p-2 shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
              <label className="flex-shrink-0">
                <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.docx,.txt,.md,.py,.csv" disabled={loading} />
                <div className="h-10 w-10 rounded-xl hover:bg-slate-500/10 cursor-pointer transition-colors flex items-center justify-center">
                  <Upload className="w-5 h-5 text-slate-500" />
                </div>
              </label>
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
                placeholder="Ask anything"
                disabled={loading}
                rows={1}
                className="flex-1 min-h-10 max-h-32 resize-none bg-transparent px-2 py-2 outline-none disabled:opacity-60 text-sm leading-relaxed"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={loading || !input.trim()}
                className="h-10 w-10 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
