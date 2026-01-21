'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface UserProfile {
    id: string
    email: string
    full_name: string | null
    role: 'admin' | 'user'
    created_at: string
}

interface InviteFormInput {
    email: string
    full_name: string
    role: 'admin' | 'user'
}

export default function UsersPage() {
    const { profile: currentUser } = useAuth()
    const [users, setUsers] = useState<UserProfile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isInviting, setIsInviting] = useState(false)
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<InviteFormInput>({
        defaultValues: {
            role: 'user',
        },
    })

    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setUsers(data || [])
        } catch (error) {
            console.error('Error fetching users:', error)
            showToast('Gagal memuat daftar pengguna', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const handleInviteUser = async (data: InviteFormInput) => {
        setIsInviting(true)
        try {
            // Get the current session for the authorization header
            const { data: sessionData } = await supabase.auth.getSession()
            if (!sessionData.session) {
                showToast('Sesi Anda telah berakhir. Silakan login kembali.', 'error')
                return
            }

            // Call the server-side API route to invite the user
            const response = await fetch('/api/invite-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionData.session.access_token}`,
                },
                body: JSON.stringify({
                    email: data.email,
                    full_name: data.full_name,
                    role: data.role,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Gagal mengirim undangan')
            }

            showToast(`Undangan berhasil dikirim ke ${data.email}`, 'success')
            reset()
            setIsInviteModalOpen(false)
            await fetchUsers()
        } catch (error: any) {
            console.error('Error inviting user:', error)
            showToast(error.message || 'Gagal mengirim undangan', 'error')
        } finally {
            setIsInviting(false)
        }
    }

    const handleRemoveUser = async (userId: string, userEmail: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus akses untuk ${userEmail}?`)) {
            return
        }

        try {
            const { error } = await supabase
                .from('user_profiles')
                .delete()
                .eq('id', userId)

            if (error) throw error
            showToast('Pengguna berhasil dihapus', 'success')
            await fetchUsers()
        } catch (error) {
            console.error('Error removing user:', error)
            showToast('Gagal menghapus pengguna', 'error')
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }

    return (
        <DashboardLayout title="Manajemen Pengguna" requireAdmin>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-gray-900">
                            Manajemen Pengguna
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Kelola akses pengguna ke sistem inventaris
                        </p>
                    </div>
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="btn-primary"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Undang Pengguna
                    </button>
                </div>

                {/* Info Card */}
                <div className="card p-4 bg-primary-50 border-primary-200">
                    <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-sm text-primary-800">
                                <strong>Catatan:</strong> Untuk mengundang pengguna baru, Anda perlu mengaktifkan fitur undangan email di pengaturan Supabase Authentication. Pengguna yang diundang akan menerima email untuk mengatur password mereka.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="card overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                            <p className="mt-4 text-gray-500">Memuat daftar pengguna...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
                                Belum ada pengguna
                            </h3>
                            <p className="text-gray-500">
                                Undang pengguna baru untuk memberikan akses ke sistem.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Pengguna
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Terdaftar
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50 animate-fade-in"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                        <span className="text-primary-700 font-semibold">
                                                            {user.full_name?.[0] || user.email[0].toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.full_name || '-'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`
                                                    badge
                                                    ${user.role === 'admin'
                                                        ? 'bg-primary-100 text-primary-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }
                                                `}>
                                                    {user.role === 'admin' ? 'Administrator' : 'Pengguna'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {user.id !== currentUser?.id && (
                                                    <button
                                                        onClick={() => handleRemoveUser(user.id, user.email)}
                                                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors"
                                                        title="Hapus akses"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity bg-gray-900/50"
                            onClick={() => setIsInviteModalOpen(false)}
                        />

                        <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl animate-scale-in">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-display font-semibold text-gray-900">
                                    Undang Pengguna Baru
                                </h3>
                                <button
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(handleInviteUser)} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="label">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        {...register('email', {
                                            required: 'Email wajib diisi',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Format email tidak valid',
                                            },
                                        })}
                                        className={errors.email ? 'input-error' : 'input'}
                                        placeholder="nama@email.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="full_name" className="label">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        id="full_name"
                                        type="text"
                                        {...register('full_name')}
                                        className="input"
                                        placeholder="Nama pengguna"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="role" className="label">
                                        Role <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="role"
                                        {...register('role', { required: 'Role wajib dipilih' })}
                                        className="select"
                                    >
                                        <option value="user">Pengguna</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Administrator dapat mengelola pengguna dan semua aset.
                                    </p>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsInviteModalOpen(false)}
                                        className="btn-secondary"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isInviting}
                                        className="btn-primary"
                                    >
                                        {isInviting ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Mengirim...
                                            </span>
                                        ) : (
                                            'Kirim Undangan'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
                    <div className={`
                        px-4 py-3 rounded-lg shadow-warm-lg flex items-center space-x-3
                        ${toast.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}
                    `}>
                        {toast.type === 'success' ? (
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        )}
                        <p className={`text-sm font-medium ${toast.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                            {toast.message}
                        </p>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}
