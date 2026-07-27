'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState<'register' | 'verify'>('register');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [success, setSuccess] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name');
        const emailValue = formData.get('email') as string;
        const password = formData.get('password');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email: emailValue, password }),
            });

            const data = await res.json();

            if (data.needsVerification) {
                setEmail(emailValue);
                setStep('verify');
                setResendCooldown(60);
            } else if (!res.ok) {
                setError(data.error || 'Bir hata oluştu.');
            }
        } catch {
            setError('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleCodeInput = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...verificationCode];
        newCode[index] = value.slice(-1);
        setVerificationCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newCode = [...verificationCode];
        for (let i = 0; i < pastedData.length; i++) {
            newCode[i] = pastedData[i];
        }
        setVerificationCode(newCode);
        // Focus the next empty input or the last one
        const nextEmpty = newCode.findIndex(c => !c);
        inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
    };

    const handleVerify = async () => {
        const code = verificationCode.join('');
        if (code.length !== 6) {
            setError('Lütfen 6 haneli kodu eksiksiz girin.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login?verified=true');
                }, 2000);
            } else {
                setError(data.error || 'Doğrulama başarısız.');
                setVerificationCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch {
            setError('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/resend-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setResendCooldown(60);
                setVerificationCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            } else {
                if (data.cooldown) {
                    setResendCooldown(data.cooldown);
                }
                setError(data.error || 'Kod gönderilemedi.');
            }
        } catch {
            setError('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // Success state
    if (success) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-secondary/30">
                <div className="w-full max-w-[400px] p-8 space-y-6 bg-background rounded-3xl shadow-xl border border-border text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight">Doğrulama Başarılı!</h1>
                    <p className="text-muted-foreground text-sm">
                        Hesabınız doğrulandı. Giriş sayfasına yönlendiriliyorsunuz...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex items-center justify-center min-h-screen bg-secondary/30">
            <div className="w-full max-w-[400px] p-8 space-y-8 bg-background rounded-3xl shadow-xl border border-border">

                {step === 'register' ? (
                    <>
                        {/* Register Step */}
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-black tracking-tight">Kayıt Ol</h1>
                            <p className="text-muted-foreground text-sm">Kaşkar Halı dünyasına katılın.</p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ad Soyad</label>
                                <input name="name" type="text" required className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none transition-colors" placeholder="Adınız Soyadınız" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">E-posta</label>
                                <input name="email" type="email" required className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none transition-colors" placeholder="ornek@email.com" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Şifre</label>
                                <input name="password" type="password" required minLength={6} className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none transition-colors" placeholder="En az 6 karakter" />
                            </div>

                            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

                            <button disabled={loading} className="w-full h-12 bg-foreground text-background rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50">
                                {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
                            </button>
                        </form>

                        <div className="text-center pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Zaten hesabınız var mı?{' '}
                                <Link href="/login" className="text-accent hover:underline font-bold">Giriş Yap</Link>
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Verification Step */}
                        <div className="text-center space-y-3">
                            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto">
                                <Mail className="text-accent" size={28} />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight">E-posta Doğrulama</h1>
                            <p className="text-muted-foreground text-sm">
                                <span className="font-bold text-foreground">{email}</span> adresine gönderilen 6 haneli kodu girin.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Code Input */}
                            <div className="flex justify-center gap-2" onPaste={handlePaste}>
                                {verificationCode.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeInput(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-xl font-black rounded-xl bg-secondary border-2 border-border focus:border-accent outline-none transition-all"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

                            <button
                                onClick={handleVerify}
                                disabled={loading || verificationCode.join('').length !== 6}
                                className="w-full h-12 bg-foreground text-background rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {loading ? 'Doğrulanıyor...' : 'Doğrula'}
                            </button>

                            {/* Resend */}
                            <div className="text-center space-y-3">
                                <p className="text-sm text-muted-foreground">Kod ulaşmadı mı?</p>
                                <button
                                    onClick={handleResendCode}
                                    disabled={resendCooldown > 0 || loading}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
                                >
                                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                                    {resendCooldown > 0 ? `Tekrar gönder (${resendCooldown}s)` : 'Tekrar Gönder'}
                                </button>
                            </div>

                            {/* Back */}
                            <button
                                onClick={() => { setStep('register'); setError(''); setVerificationCode(['', '', '', '', '', '']); }}
                                className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft size={14} />
                                Kayıt formuna geri dön
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
