'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, CheckCircle, User, Phone, MapPin, CreditCard, FileText } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    const formatPrice = (price: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.get('name'),
                    customerEmail: formData.get('email'),
                    customerPhone: formData.get('phone'),
                    customerTc: formData.get('tc'),
                    customerAddress: formData.get('address'),
                    note: formData.get('note'),
                    items: items.map(item => ({
                        name: item.name,
                        image: item.image,
                        size: item.size,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                }),
            });

            const data = await res.json();

            if (res.ok) {
                clearCart();
                // Redirect to PaynKolay payment page
                router.push(`/odeme?orderId=${data.orderId}`);
            } else {
                setError(data.error || 'Sipariş oluşturulamadı.');
            }
        } catch {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    // Success state
    if (success) {
        return (
            <main className="min-h-screen bg-secondary/20 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-background rounded-3xl shadow-xl border border-border p-10 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="text-green-600" size={40} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black tracking-tight">Siparişiniz Alındı!</h1>
                        <p className="text-muted-foreground">Siparişiniz başarıyla oluşturuldu.</p>
                    </div>
                    <div className="bg-secondary rounded-2xl p-4 border border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Sipariş Numarası</p>
                        <p className="text-2xl font-black font-mono tracking-wider">{orderNumber}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Siparişiniz en kısa sürede hazırlanacaktır. Detaylar için bizimle iletişime geçebilirsiniz.
                    </p>
                    <Link href="/" className="inline-block w-full h-12 bg-foreground text-background rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity leading-[3rem] text-center">
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </main>
        );
    }

    // Empty cart redirect
    if (items.length === 0 && !success) {
        return (
            <main className="min-h-screen bg-secondary/20 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-background rounded-3xl shadow-xl border border-border p-10 text-center space-y-6">
                    <ShoppingBag size={48} className="mx-auto text-muted-foreground opacity-30" />
                    <h1 className="text-2xl font-black tracking-tight">Sepetiniz Boş</h1>
                    <p className="text-muted-foreground text-sm">Sipariş vermek için önce sepetinize ürün ekleyin.</p>
                    <Link href="/urunler" className="inline-block w-full h-12 bg-foreground text-background rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity leading-[3rem] text-center">
                        Ürünleri Keşfet
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-secondary/20">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                        <ArrowLeft size={16} />
                        Alışverişe Devam Et
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">Sipariş Bilgileri</h1>
                    <p className="text-muted-foreground mt-2">Siparişinizi tamamlamak için bilgilerinizi doldurun.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit} id="checkout-form" className="bg-background rounded-3xl shadow-xl border border-border p-8 space-y-8">
                            {/* Personal Info */}
                            <div>
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                                    <User size={20} className="text-accent" />
                                    Kişisel Bilgiler
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ad Soyad *</label>
                                        <input name="name" type="text" required className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none transition-colors" placeholder="Adınız Soyadınız" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">TC Kimlik No *</label>
                                        <input name="tc" type="text" required maxLength={11} pattern="\d{11}" className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none transition-colors font-mono" placeholder="12345678901" />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div>
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                                    <Phone size={20} className="text-accent" />
                                    İletişim Bilgileri
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Telefon *</label>
                                        <input name="phone" type="tel" required className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none transition-colors" placeholder="0532 123 4567" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">E-posta</label>
                                        <input name="email" type="email" className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none transition-colors" placeholder="ornek@email.com" />
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                                    <MapPin size={20} className="text-accent" />
                                    Teslimat Adresi
                                </h2>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Adres *</label>
                                    <textarea name="address" required rows={3} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-accent outline-none transition-colors resize-none" placeholder="Mahalle, Cadde/Sokak, Bina No, Daire No, İlçe/İl" />
                                </div>
                            </div>

                            {/* Note */}
                            <div>
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                                    <FileText size={20} className="text-accent" />
                                    Sipariş Notu
                                </h2>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Not (Opsiyonel)</label>
                                    <textarea name="note" rows={2} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-accent outline-none transition-colors resize-none" placeholder="Siparişle ilgili eklemek istediğiniz bir not var mı?" />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm font-medium">
                                    {error}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-background rounded-3xl shadow-xl border border-border p-8 sticky top-8 space-y-6">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <CreditCard size={20} className="text-accent" />
                                Sipariş Özeti
                            </h2>

                            {/* Items */}
                            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div key={item.variantId} className="flex gap-3">
                                        <div className="w-16 h-20 rounded-lg overflow-hidden border border-border shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Ebat: <span className="font-medium text-foreground">{item.size}</span></p>
                                            <p className="text-xs text-muted-foreground">Adet: <span className="font-medium text-foreground">{item.quantity}</span></p>
                                        </div>
                                        <p className="font-bold text-sm whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-border pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Ara Toplam</span>
                                    <span className="font-bold">{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Kargo</span>
                                    <span className="text-green-600 font-bold">Ücretsiz</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-border">
                                    <span className="font-black text-lg">Toplam</span>
                                    <span className="font-black text-2xl text-accent">{formatPrice(totalPrice)}</span>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={loading}
                                className="w-full h-14 bg-accent hover:bg-[#b08d2b] text-white rounded-xl font-black uppercase tracking-widest transition-colors shadow-lg shadow-accent/20 disabled:opacity-50"
                            >
                                {loading ? 'Sipariş Oluşturuluyor...' : 'Siparişi Tamamla'}
                            </button>

                            <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                                Siparişi tamamlayarak <Link href="/kullanim-kosullari" className="underline">kullanım koşullarını</Link> ve <Link href="/gizlilik-politikasi" className="underline">gizlilik politikasını</Link> kabul etmiş olursunuz.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
