import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  username: string
  email: string
  createdAt: string
}

interface UserContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const sessionData = await spark.kv.get<{ userId: string; lastActivity: string }>('world-clock-session')
        
        if (sessionData) {
          // Check if session is still valid (24 hours)
          const lastActivity = new Date(sessionData.lastActivity)
          const now = new Date()
          const hoursSinceLastActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60)
          
          if (hoursSinceLastActivity < 24) {
            // Session is still valid, load user data
            const users = await spark.kv.get<Record<string, any>>('world-clock-users') || {}
            const userData = users[sessionData.userId]
            
            if (userData) {
              const user: User = {
                id: sessionData.userId,
                username: userData.username,
                email: userData.email,
                createdAt: userData.createdAt
              }
              setUser(user)
              
              // Update last activity
              await spark.kv.set('world-clock-session', {
                userId: sessionData.userId,
                lastActivity: now.toISOString()
              })
            }
          } else {
            // Session expired, clear it
            await spark.kv.delete('world-clock-session')
          }
        }
      } catch (error) {
        console.error('Error checking existing session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkExistingSession()
  }, [])

  const login = async (userData: User) => {
    setUser(userData)
    
    // Save session
    await spark.kv.set('world-clock-session', {
      userId: userData.id,
      lastActivity: new Date().toISOString()
    })
  }

  const logout = async () => {
    setUser(null)
    
    // Clear session
    await spark.kv.delete('world-clock-session')
  }

  const contextValue: UserContextType = {
    user,
    login,
    logout,
    isLoading
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}