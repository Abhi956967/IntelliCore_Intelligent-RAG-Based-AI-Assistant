import { useState, useEffect } from 'react'

interface UserSession {
  id: string
  name: string
  email: string
  avatar_url: string
  created_at: string
}

interface SettingsModalProps {
  user: UserSession
  onClose: () => void
  onLogout: () => void
  onUpdateUser: (updatedUser: UserSession) => void
  darkMode: boolean
}

const PRISMA_SCHEMA = `model User {
  id         String   @id @default(uuid())
  name       String
  email      String   @unique
  avatarUrl  String   @map("avatar_url")
  createdAt  DateTime @default(now()) @map("created_at")
  chats      Chat[]
}

model Chat {
  id        String    @id @default(uuid())
  userId    String    @map("user_id")
  title     String
  createdAt DateTime  @default(now()) @map("created_at")
  user      User      @relation(fields: [userId], references: [id])
}

model Message {
  id        String   @id @default(uuid())
  chatId    String   @map("chat_id")
  role      String   // "user" | "assistant"
  content   String
  createdAt DateTime @default(now()) @map("created_at")
}`

export default function SettingsModal({ user, onClose, onLogout, onUpdateUser, darkMode }: SettingsModalProps) {
  const [tab, setTab] = useState<'profile' | 'schema'>('profile')
  const [editableName, setEditableName] = useState(user.name)
  const [editableAvatar, setEditableAvatar] = useState(user.avatar_url)

  useEffect(() => {
    setEditableName(user.name)
    setEditableAvatar(user.avatar_url)
  }, [user])

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name: editableName,
      avatar_url: editableAvatar
    })
    onClose()
  }

  const modalBg = darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
  const textLabel = darkMode ? 'text-slate-400' : 'text-slate-500'
  const inputBg = darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
  const readOnlyBg = darkMode ? 'bg-slate-950 border-slate-850 text-slate-350' : 'bg-slate-100 border-slate-200 text-slate-600'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-xl rounded-2xl border shadow-2xl p-6 overflow-hidden relative ${modalBg}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <h3 className="text-lg font-bold">Workspace Account Settings</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 font-bold px-2 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs mb-5 font-bold uppercase tracking-wider">
          <button 
            onClick={() => setTab('profile')}
            className={`pb-2.5 px-4 border-b-2 transition-all ${tab === 'profile' ? 'border-primary-500 text-primary-500' : 'border-transparent text-slate-500 hover:text-slate-850 dark:hover:text-slate-300'}`}
          >
            👤 Active Profile
          </button>
          <button 
            onClick={() => setTab('schema')}
            className={`pb-2.5 px-4 border-b-2 transition-all ${tab === 'schema' ? 'border-primary-500 text-primary-500' : 'border-transparent text-slate-500 hover:text-slate-855 dark:hover:text-slate-300'}`}
          >
            🗄️ Database Schemas
          </button>
        </div>

        {/* Tab 1: Profile Details */}
        {tab === 'profile' && (
          <div className="space-y-4">
            <div className="flex items-center gap-5">
              <img src={editableAvatar} alt="User Avatar" className="w-16 h-16 rounded-full border border-slate-350 dark:border-slate-700 shadow bg-slate-950" />
              <div className="space-y-1">
                <p className={`text-xs font-bold uppercase tracking-wider ${textLabel}`}>Select Avatar Preset</p>
                <div className="flex flex-wrap gap-2">
                  {['seed1', 'seed2', 'seed3', 'seed4', 'seed5'].map((seed) => (
                    <button
                      key={seed}
                      type="button"
                      onClick={() => {
                        const newAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`
                        setEditableAvatar(newAvatar)
                      }}
                      className={`px-2.5 py-1 border rounded-lg active:scale-95 transition-all text-xs font-bold ${
                        darkMode 
                          ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                      }`}
                    >
                      Preset {seed.slice(-1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] font-bold uppercase tracking-wider ${textLabel}`}>Account ID</label>
              <p className={`p-2.5 rounded-lg border font-mono text-xs truncate ${readOnlyBg}`}>{user.id}</p>
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] font-bold uppercase tracking-wider ${textLabel}`}>Name</label>
              <input
                type="text"
                value={editableName}
                onChange={(e) => setEditableName(e.target.value)}
                className={`w-full text-sm p-2.5 rounded-lg border outline-none focus:border-primary-500 font-medium ${inputBg}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] font-bold uppercase tracking-wider ${textLabel}`}>Email Address</label>
              <p className={`p-2.5 rounded-lg border font-mono text-xs ${readOnlyBg}`}>{user.email}</p>
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] font-bold uppercase tracking-wider ${textLabel}`}>Created At</label>
              <p className={`p-2.5 rounded-lg border font-mono text-xs ${readOnlyBg}`}>{new Date(user.created_at).toLocaleString()}</p>
            </div>

            <div className="flex justify-between items-center pt-4 mt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  onLogout()
                  onClose()
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow"
              >
                Sign Out Account
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition-all shadow"
              >
                Save Profile Updates
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Database Schema */}
        {tab === 'schema' && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Below is the relational **Prisma ORM** mapping schema generated for Postgres / Supabase, specifying User-Chat-Message constraints:
            </p>
            <pre className="text-[10px] font-mono p-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-950 text-emerald-400 overflow-y-auto max-h-[260px] leading-relaxed custom-scrollbar">
              {PRISMA_SCHEMA}
            </pre>
            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow"
              >
                Close Settings
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
