import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Create admin client inside handler to handle missing env vars gracefully
function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        return null
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}

interface InviteUserRequest {
    email: string
    full_name?: string
    role: 'admin' | 'user'
}

interface ApiResponse {
    success?: boolean
    message?: string
    error?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // Get the authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' })
    }

    const accessToken = authHeader.replace('Bearer ', '')

    // Create a regular Supabase client to verify the user
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(500).json({ error: 'Server configuration error' })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Verify the user's session
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)

    if (authError || !user) {
        return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // Get the admin client early to use for profile lookup
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
        return res.status(500).json({
            error: 'Service role key not configured. Please set SUPABASE_SERVICE_ROLE_KEY in your environment variables.'
        })
    }

    // Check if the requesting user is an admin using admin client to bypass RLS
    const { data: profile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        return res.status(403).json({ error: 'User profile not found' })
    }

    if (profile.role !== 'admin') {
        return res.status(403).json({ error: 'Only administrators can invite users' })
    }

    // Validate request body
    const { email, full_name, role }: InviteUserRequest = req.body

    if (!email) {
        return res.status(400).json({ error: 'Email is required' })
    }

    if (!role || !['admin', 'user'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be "admin" or "user"' })
    }

    // Invite the user
    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: {
            full_name: full_name || '',
            role: role,
        },
    })

    if (inviteError) {
        console.error('Error inviting user:', inviteError)
        return res.status(400).json({ error: inviteError.message })
    }

    return res.status(200).json({
        success: true,
        message: `Invitation sent to ${email}`
    })
}
