import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { token_hash, type } = req.query

    if (!token_hash || typeof token_hash !== 'string') {
        return res.redirect('/login?error=invalid_token')
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing Supabase configuration')
        return res.redirect('/login?error=server_error')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    try {
        // Verify the OTP token from the email link
        const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: (type as 'email' | 'invite' | 'recovery' | 'signup') || 'invite',
        })

        if (error) {
            console.error('Error verifying token:', error)
            return res.redirect('/login?error=invalid_link')
        }

        if (!data.session) {
            console.error('No session created after token verification')
            return res.redirect('/login?error=session_expired')
        }

        // For invitations, redirect to password setup page
        if (type === 'invite') {
            return res.redirect('/auth/set-password')
        }

        // For other auth types (recovery, signup), redirect to dashboard
        return res.redirect('/auth/set-password')
    } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        return res.redirect('/login?error=server_error')
    }
}

