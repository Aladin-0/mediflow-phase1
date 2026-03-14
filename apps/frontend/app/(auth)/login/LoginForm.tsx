'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth'
import { authApi } from '@/lib/apiClient'
import { useAuthStore } from '@/store/authStore'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2, Phone, Lock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export default function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [isShaking, setIsShaking] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { phone: '', password: '' },
        mode: 'onBlur'
    })

    const onSubmit = async (data: LoginFormValues) => {
        setServerError(null)
        setIsLoading(true)
        try {
            const response = await authApi.login(data.phone, data.password)
            useAuthStore.getState().setUser(response.user)
            if (response.user.outlet) {
                useAuthStore.getState().setOutlet(response.user.outlet)
            }

            // Store flag for mock auth in middleware if using dev mode
            if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
                sessionStorage.setItem('mediflow_mock_auth', 'true')
                document.cookie = "mediflow_mock_auth=true; path=/";
            }

            const redirectTo = searchParams.get('redirect') ?? '/dashboard'
            router.push(redirectTo)
        } catch (err: any) {
            setServerError(err?.error?.message ?? "Login failed. Please try again.")
            setIsShaking(true)
            setTimeout(() => setIsShaking(false), 600)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className={cn("w-full shadow-md", isShaking && "animate-shake")}>
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>Sign in to manage your pharmacy</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

                    {serverError && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700 flex gap-2 items-start animate-in fade-in">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                            <span>{serverError}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="phone">Mobile Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="phone"
                                type="tel"
                                inputMode="numeric"
                                placeholder="98765 43210"
                                maxLength={10}
                                autoComplete="tel"
                                className={cn("pl-10 text-base sm:text-sm", errors.phone && "border-red-500 focus-visible:ring-red-500")}
                                aria-invalid={!!errors.phone}
                                {...register("phone")}
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-sm text-red-600 mt-1 flex gap-1 items-center">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className={cn("pl-10 pr-10 text-base sm:text-sm", errors.password && "border-red-500 focus-visible:ring-red-500")}
                                aria-invalid={!!errors.password}
                                {...register("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-slate-900"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-600 mt-1 flex gap-1 items-center">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full mt-2" size="lg" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>

                    <a href="#" className="text-sm text-primary hover:underline text-center mt-4 block">
                        Forgot your PIN?
                    </a>

                    {process.env.NEXT_PUBLIC_USE_MOCK === 'true' && (
                        <div className="bg-slate-100 rounded p-2 mt-4 text-xs text-muted-foreground text-center animate-in slide-in-from-bottom flex flex-col items-center">
                            <p className="font-semibold mb-1">Dev Mode Credentials</p>
                            <p>Phone: <span className="font-mono">9876543210</span> | Password: <span className="font-mono">password123</span></p>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}
