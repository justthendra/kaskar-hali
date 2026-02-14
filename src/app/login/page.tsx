'use client';

import { Suspense } from 'react';
import { useActionState, useState } from 'react';
import { authenticate } from '@/lib/actions';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get('callbackUrl') || '/admin/dashboard';
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined
    );

    const [isBranchLogin, setIsBranchLogin] = useState(false);

    return (
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-6 p-4">

            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black tracking-tight">
                    {isBranchLogin ? 'Şube Girişi' : 'Müşteri Girişi'}
                </h1>
                <p className="text-muted-foreground text-sm">
                    Kaşkar Halı {isBranchLogin ? 'Personel Paneli' : 'Dünyasına Hoşgeldiniz'}
                </p>
            </div>

            {/* Toggle */}
            <div className="flex bg-secondary p-1 rounded-xl border border-border">
                <button
                    onClick={() => setIsBranchLogin(false)}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${!isBranchLogin ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Müşteri
                </button>
                <button
                    onClick={() => setIsBranchLogin(true)}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${isBranchLogin ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Şube/Personel
                </button>
            </div>

            <form action={formAction} className="space-y-6 bg-background p-8 rounded-3xl shadow-xl border border-border">
                <div className="space-y-4">
                    <div>
                        <label
                            className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground"
                            htmlFor="email"
                        >
                            {isBranchLogin ? 'Kullanıcı Adı / Email' : 'Email Adresi'}
                        </label>
                        <div className="relative">
                            <input
                                className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none transition-colors"
                                id="email"
                                type={isBranchLogin ? "text" : "email"}
                                name="email"
                                placeholder={isBranchLogin ? "kaskarsube" : "ornek@email.com"}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground"
                            htmlFor="password"
                        >
                            Şifre
                        </label>
                        <div className="relative">
                            <input
                                className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none transition-colors"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="******"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>
                </div>
                <input type="hidden" name="redirectTo" value={isBranchLogin ? '/admin/dashboard' : '/'} />

                <button
                    className={`w-full h-12 text-white rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 ${isBranchLogin ? 'bg-black' : 'bg-accent'}`}
                    disabled={isPending}
                >
                    {isPending ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </button>

                <div
                    className="flex h-8 items-end space-x-1 justify-center"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {errorMessage && (
                        <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
                    )}
                </div>
            </form>

            {!isBranchLogin && (
                <div className="text-center pt-2">
                    <p className="text-sm text-muted-foreground">
                        Hesabınız yok mu?{' '}
                        <Link href="/register" className="text-accent hover:underline font-bold">Kayıt Olun</Link>
                    </p>
                </div>
            )}
        </div>
    );
}

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-secondary/30">
            <Suspense fallback={
                <div className="text-center text-muted-foreground">Yükleniyor...</div>
            }>
                <LoginForm />
            </Suspense>
        </main>
    );
}
