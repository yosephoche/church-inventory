'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import { useAuth } from '@/contexts/AuthContext'

interface LoginFormInput {
    email: string
    password: string
    rememberMe: boolean
}

export default function LoginPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { signIn, user, isLoading } = useAuth()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInput>({
        defaultValues: {
            rememberMe: false,
        },
    })

    useEffect(() => {
        if (!isLoading && user) {
            router.replace('/dashboard')
        }
    }, [user, isLoading, router])

    const onSubmit = async (data: LoginFormInput) => {
        setIsSubmitting(true)
        setErrorMessage('')

        try {
            const { error } = await signIn(data.email, data.password)

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    setErrorMessage('Email atau password salah. Silakan coba lagi.')
                } else if (error.message.includes('Email not confirmed')) {
                    setErrorMessage('Email belum dikonfirmasi. Silakan cek inbox email Anda.')
                } else {
                    setErrorMessage('Terjadi kesalahan saat login. Silakan coba lagi.')
                }
                return
            }

            router.push('/dashboard')
        } catch (error) {
            console.error('Login error:', error)
            setErrorMessage('Terjadi kesalahan. Silakan coba lagi.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
        )
    }

    if (user) {
        return null
    }

    return (
        <>
            <Head>
                <title>Login - Church Inventory System</title>
                <meta name="description" content="Login to Church Inventory System" />
            </Head>

            <div className="min-h-screen bg-surface flex">
                {/* Left side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-primary-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700"></div>
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold-500 rounded-full translate-x-1/3 translate-y-1/3"></div>
                    </div>
                    <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                        <div className="mb-8">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-10 h-10 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-4xl font-display font-bold mb-4">
                            Church Inventory System
                        </h1>
                        <p className="text-lg text-primary-100 leading-relaxed max-w-md">
                            Kelola aset gereja dengan mudah dan efisien. Sistem inventaris modern dengan dukungan QR Code.
                        </p>
                        <div className="mt-12 flex items-center space-x-4 text-sm text-primary-200">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                QR Code Otomatis
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Pencatatan Lengkap
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md">
                        {/* Mobile logo */}
                        <div className="lg:hidden text-center mb-8">
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
                                    Selamat Datang
                                </h2>
                                <p className="mt-2 text-gray-600">
                                    Masuk ke akun Anda untuk melanjutkan
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="label">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
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

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="label">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        {...register('password', {
                                            required: 'Password wajib diisi',
                                            minLength: {
                                                value: 6,
                                                message: 'Password minimal 6 karakter',
                                            },
                                        })}
                                        className={errors.password ? 'input-error' : 'input'}
                                        placeholder="Masukkan password"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                    )}
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            {...register('rememberMe')}
                                            className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                                    </label>
                                    <button
                                        type="button"
                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Lupa password?
                                    </button>
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
                                        'Masuk'
                                    )}
                                </button>
                            </form>
                        </div>

                        <p className="mt-6 text-center text-sm text-gray-500">
                            Hubungi administrator untuk mendapatkan akun
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
