'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useEffect, Suspense } from 'react';
import { toast } from 'sonner';

function PaymentResultContent() {
    const searchParams = useSearchParams();
    const status = searchParams?.get('status');
    const orderNumber = searchParams?.get('orderNumber');
    const message = searchParams?.get('message');

    const isSuccess = status === 'success';

    useEffect(() => {
        if (isSuccess) {
            toast.success('Ödeme Başarılı! Siparişiniz onaylandı.');
        } else if (status === 'failure') {
            toast.error(message || 'Ödeme işlemi başarısız oldu.');
        }
    }, [isSuccess, status, message]);

    return (
        <main className="min-h-screen bg-secondary/20 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-background rounded-3xl shadow-xl border border-border p-10 text-center space-y-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
                    {isSuccess ? (
                        <CheckCircle className="text-green-600" size={40} />
                    ) : (
                        <XCircle className="text-red-600" size={40} />
                    )}
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-black tracking-tight">
                        {isSuccess ? 'Ödeme Başarılı!' : 'Ödeme Başarısız'}
                    </h1>
                    <p className="text-muted-foreground">
                        {isSuccess
                            ? 'Ödemeniz başarıyla alınmıştır. Siparişiniz onaylanmıştır.'
                            : message || 'Ödeme işlemi gerçekleştirilemedi. Lütfen tekrar deneyin.'}
                    </p>
                </div>

                {isSuccess && orderNumber && (
                    <div className="bg-secondary rounded-2xl p-4 border border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Sipariş Numarası</p>
                        <p className="text-2xl font-black font-mono tracking-wider">{orderNumber}</p>
                    </div>
                )}

                {isSuccess ? (
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Siparişiniz en kısa sürede hazırlanacaktır. Detaylar için bizimle iletişime geçebilirsiniz.
                        </p>
                        <Link href="/" className="inline-block w-full h-12 bg-foreground text-background rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity leading-[3rem] text-center">
                            Ana Sayfaya Dön
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <Link href="/siparis" className="inline-block w-full h-12 bg-accent text-white rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity leading-[3rem] text-center">
                            Tekrar Dene
                        </Link>
                        <Link href="/" className="inline-block w-full h-12 bg-secondary text-foreground rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity leading-[3rem] text-center border border-border">
                            Ana Sayfaya Dön
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function PaymentResultPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <div className="text-center text-muted-foreground">Yükleniyor...</div>
            </div>
        }>
            <PaymentResultContent />
        </Suspense>
    );
}
