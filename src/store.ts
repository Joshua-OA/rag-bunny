import { createContext, useContext } from 'react'
import type { Chat, Document, Note } from './types'

export interface AppState {
  isLoggedIn: boolean
  chats: Chat[]
  currentChatId: string | null
  documents: Document[]
  notes: Note[]
}

export interface AppActions {
  login: () => void
  logout: () => void
  createChat: () => string
  selectChat: (id: string) => void
  sendMessage: (content: string) => void
  addDocument: (file: File) => void
  addNote: () => void
  updateNote: (id: string, title: string, content: string) => void
  deleteNote: (id: string) => void
}

export type AppContextType = AppState & AppActions

export const AppContext = createContext<AppContextType | null>(null)

export function useApp(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
