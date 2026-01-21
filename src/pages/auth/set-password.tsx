'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import { supabase } from '@/lib/supabase'

interface PasswordFormInput {
    password: string
    confirmPassword: string
}

export default function SetPasswordPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const router = useRouter()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<PasswordFormInput>()

    const password = watch('password')

    useEffect(() => {
        // Check if user has a valid session and needs password setup
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.replace('/login?error=session_expired')
            } else if (session.user.user_metadata?.password_set !== false) {
                // Password already set, redirect to dashboard
                router.replace('/dashboard')
            }
        }
        checkSession()
    }, [router])

    const onSubmit = async (data: PasswordFormInput) => {
        setIsSubmitting(true)
        setErrorMessage('')
        setSuccessMessage('')

        try {
            // Update the user's password and mark as set
            const { error } = await supabase.auth.updateUser({
                password: data.password,
                data: {
                    password_set: true,  // Mark password as set in metadata
                },
            })

            if (error) {
                console.error('Error updating password:', error)
                setErrorMessage('Gagal mengatur password. Silakan coba lagi.')
                setIsSubmitting(false)
                return
            }

            setSuccessMessage('Password berhasil diatur! Mengalihkan ke dashboard...')

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                router.push('/dashboard')
            }, 1500)
        } catch (error) {
            console.error('Unexpected error:', error)
            setErrorMessage('Terjadi kesalahan. Silakan coba lagi.')
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Head>
                <title>Atur Password - Church Inventory System</title>
                <meta name="description" content="Set your password for Church Inventory System" />
            </Head>

            <div className="min-h-screen bg-surface flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto bg-primary-500 rounded-2xl flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-display font-bold text-gray-900">
                            Church Inventory
                        </h1>
                    </div>

                    <div className="card p-8 animate-fade-in">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-display font-bold text-gray-900">
                                Atur Password Anda
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Buat password untuk melindungi akun Anda
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="label">
                                    Password Baru
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    {...register('password', {
                                        required: 'Password wajib diisi',
                                        minLength: {
                                            value: 8,
                                            message: 'Password minimal 8 karakter',
                                        },
                                    })}
                                    className={errors.password ? 'input-error' : 'input'}
                                    placeholder="Masukkan password baru"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="label">
                                    Konfirmasi Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    {...register('confirmPassword', {
                                        required: 'Konfirmasi password wajib diisi',
                                        validate: (value) =>
                                            value === password || 'Password tidak cocok',
                                    })}
                                    className={errors.confirmPassword ? 'input-error' : 'input'}
                                    placeholder="Masukkan ulang password"
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            {/* Error Message */}
                            {errorMessage && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <p className="ml-3 text-sm text-red-700">{errorMessage}</p>
                                    </div>
                                </div>
                            )}

                            {/* Success Message */}
                            {successMessage && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <p className="ml-3 text-sm text-green-700">{successMessage}</p>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </span>
                                ) : (
                                    'Atur Password'
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Setelah mengatur password, Anda dapat masuk dengan email dan password baru Anda
                    </p>
                </div>
            </div>
        </>
    )
}
