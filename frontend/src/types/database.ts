export interface User {
  id: string
  name: string
  email: string
  avatar_url: string
  created_at: string
}

export interface Chat {
  id: string
  user_id: string
  title: string
  created_at: string
}

export interface Message {
  id: string
  chat_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}
