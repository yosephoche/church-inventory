'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface UserProfile {
    id: string
    email: string
    full_name: string | null
    role: 'admin' | 'user'
    created_at: string
}

interface AuthContextType {
    user: User | null
    profile: UserProfile | null
    session: Session | null
    isLoading: boolean
    isAdmin: boolean
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>
    signOut: () => Promise<void>
    refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Error fetching profile:', error)
                return null
            }

            return data as UserProfile
        } catch (error) {
            console.error('Error fetching profile:', error)
            return null
        }
    }

    const refreshProfile = async () => {
        if (user) {
            const profile = await fetchProfile(user.id)
            setProfile(profile)
        }
    }

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('Error getting session:', error)
                    setIsLoading(false)
                    return
                }

                setSession(session)
                setUser(session?.user ?? null)

                if (session?.user) {
                    const profile = await fetchProfile(session.user.id)
                    setProfile(profile)
                }
            } catch (error) {
                console.error('Error in getInitialSession:', error)
            } finally {
                setIsLoading(false)
            }
        }

        getInitialSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session)
                setUser(session?.user ?? null)

                if (session?.user) {
                    const profile = await fetchProfile(session.user.id)
                    setProfile(profile)
                } else {
                    setProfile(null)
                }

                setIsLoading(false)
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                return { error }
            }

            return { error: null }
        } catch (error) {
            return { error: error as Error }
        }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
        setSession(null)
    }

    const value: AuthContextType = {
        user,
        profile,
        session,
        isLoading,
        isAdmin: profile?.role?.toLowerCase() === 'admin',
        signIn,
        signOut,
        refreshProfile,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
