export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: number
}

export interface Document {
  id: string
  name: string
  size: number
  uploadedAt: number
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
}
