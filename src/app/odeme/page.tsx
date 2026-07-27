'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CreditCard } from 'lucide-react';

function PaymentContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams?.get('orderId');
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [paymentData, setPaymentData] = useState<{
        endpoint: string;
        formData: Record<string, string>;
    } | null>(null);

    useEffect(() => {
        if (!orderId) {
            setError('Sipariş bilgisi bulunamadı.');
            setLoading(false);
            return;
        }

        async function initiatePayment() {
            try {
                const res = await fetch('/api/payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || 'Ödeme başlatılamadı.');
                    setLoading(false);
                    return;
                }

                setPaymentData({
                    endpoint: data.endpoint,
                    formData: data.formData,
                });
            } catch {
                setError('Ödeme başlatılırken bir hata oluştu.');
                setLoading(false);
            }
        }

        initiatePayment();
    }, [orderId]);

    // Auto-submit form when payment data is ready
    useEffect(() => {
        if (paymentData && formRef.current) {
            formRef.current.submit();
        }
    }, [paymentData]);

    if (error) {
        return (
            <main className="min-h-screen bg-secondary/20 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-background rounded-3xl shadow-xl border border-border p-10 text-center space-y-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <CreditCard className="text-red-600" size={40} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black tracking-tight">Ödeme Hatası</h1>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                    <a href="/" className="inline-block w-full h-12 bg-foreground text-background rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity leading-[3rem] text-center">
                        Ana Sayfaya Dön
                    </a>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-secondary/20 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-background rounded-3xl shadow-xl border border-border p-10 text-center space-y-6">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                    <Loader2 className="text-accent animate-spin" size={40} />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-black tracking-tight">Ödeme Sayfasına Yönlendiriliyorsunuz</h1>
                    <p className="text-muted-foreground">Lütfen bekleyin, güvenli ödeme sayfasına yönlendiriliyorsunuz...</p>
                </div>
                <div className="flex justify-center">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>

            {/* Hidden form that auto-submits to PaynKolay */}
            {paymentData && (
                <form ref={formRef} method="POST" action={paymentData.endpoint} style={{ display: 'none' }}>
                    {Object.entries(paymentData.formData).map(([key, value]) => (
                        <input key={key} type="hidden" name={key} value={value} />
                    ))}
                </form>
            )}
        </main>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-muted-foreground" size={40} />
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}
