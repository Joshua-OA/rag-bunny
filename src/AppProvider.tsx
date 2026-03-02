import { useState, useCallback, type ReactNode } from 'react'
import { AppContext, generateId, type AppState } from './store'
import type { Chat, Message } from './types'

const MOCK_RESPONSES = [
  "I've analyzed your query. Based on the documents you've uploaded, here's what I found...",
  "That's an interesting question. Let me search through your knowledge base...",
  "Based on the context from your uploaded documents, I can provide the following insights...",
  "I found several relevant passages in your documents that address this topic.",
  "Let me help you with that. Here's a summary based on your uploaded materials...",
]

function getMockResponse(): string {
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isLoggedIn: false,
    chats: [],
    currentChatId: null,
    documents: [],
    notes: [],
  })

  const login = useCallback(() => {
    setState(s => ({ ...s, isLoggedIn: true }))
  }, [])

  const logout = useCallback(() => {
    setState(s => ({ ...s, isLoggedIn: false }))
  }, [])

  const createChat = useCallback((): string => {
    const id = generateId()
    const chat: Chat = {
      id,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    }
    setState(s => ({
      ...s,
      chats: [chat, ...s.chats],
      currentChatId: id,
    }))
    return id
  }, [])

  const selectChat = useCallback((id: string) => {
    setState(s => ({ ...s, currentChatId: id }))
  }, [])

  const sendMessage = useCallback((content: string) => {
    setState(s => {
      let chatId = s.currentChatId
      let chats = [...s.chats]

      if (!chatId) {
        chatId = generateId()
        chats = [
          { id: chatId, title: content.slice(0, 40), messages: [], createdAt: Date.now() },
          ...chats,
        ]
      }

      const userMsg: Message = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: Date.now(),
      }

      const assistantMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: getMockResponse(),
        timestamp: Date.now() + 1,
      }

      chats = chats.map(c => {
        if (c.id !== chatId) return c
        const isNew = c.messages.length === 0
        return {
          ...c,
          title: isNew ? content.slice(0, 40) : c.title,
          messages: [...c.messages, userMsg, assistantMsg],
        }
      })

      return { ...s, chats, currentChatId: chatId }
    })
  }, [])

  const addDocument = useCallback((file: File) => {
    setState(s => ({
      ...s,
      documents: [
        ...s.documents,
        { id: generateId(), name: file.name, size: file.size, uploadedAt: Date.now() },
      ],
    }))
  }, [])

  const addNote = useCallback(() => {
    setState(s => ({
      ...s,
      notes: [
        { id: generateId(), title: 'Untitled Note', content: '', createdAt: Date.now() },
        ...s.notes,
      ],
    }))
  }, [])

  const updateNote = useCallback((id: string, title: string, content: string) => {
    setState(s => ({
      ...s,
      notes: s.notes.map(n => (n.id === id ? { ...n, title, content } : n)),
    }))
  }, [])

  const deleteNote = useCallback((id: string) => {
    setState(s => ({
      ...s,
      notes: s.notes.filter(n => n.id !== id),
    }))
  }, [])

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        createChat,
        selectChat,
        sendMessage,
        addDocument,
        addNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
