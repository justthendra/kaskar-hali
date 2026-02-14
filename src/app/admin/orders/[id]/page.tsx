import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, Printer, MapPin, Phone, Mail, User, CreditCard, Calendar, Package } from "lucide-react";
import Link from "next/link";
import PrintButton from "@/components/admin/PrintButton";

type Props = {
    params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: Props) {
    const { id } = await params;
    const session = await auth();

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: true,
            customer: true,
        }
    });

    if (!order) {
        notFound();
    }

    return (
        <div className="space-y-8 print:p-0 print:space-y-4">
            {/* Header - Hidden in Print */}
            <div className="flex items-center justify-between print:hidden">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Sipariş Detayı</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            #{order.orderNumber}
                            <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                            {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
                <PrintButton />
            </div>

            {/* Print Header */}
            <div className="hidden print:flex items-center justify-between mb-8 print:-mt-[104px] border-b pb-4">
                <div className="flex items-center gap-4">
                    {/* Logo for Print */}
                    <img src="/kaskar.png" alt="Kaşkar Halı" className="w-20" />
                    <div>
                        <h1 className="text-2xl font-black">KAŞKAR HALI</h1>
                        <p className="text-sm text-gray-500">Sipariş Fişi</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print:block print:space-y-6">

                {/* Main Content (Order Items) */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-3xl p-6 print:border-none print:p-0 print:shadow-none shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 print:mb-2">
                            <Package className="text-primary print:hidden" />
                            Ürünler
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-secondary/50 print:bg-gray-100 text-muted-foreground font-medium rounded-xl">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-xl print:rounded-none">Ürün</th>
                                        <th className="px-4 py-3">Beden</th>
                                        <th className="px-4 py-3 text-center">Adet</th>
                                        <th className="px-4 py-3 text-right">Birim Fiyat</th>
                                        <th className="px-4 py-3 text-right rounded-r-xl print:rounded-none">Toplam</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-4 font-medium flex items-center gap-3">
                                                {/* Image could be added here if available in URL format */}
                                                <span>{item.productName}</span>
                                            </td>
                                            <td className="px-4 py-4 text-muted-foreground">{item.variantSize}</td>
                                            <td className="px-4 py-4 text-center font-bold">{item.quantity}</td>
                                            <td className="px-4 py-4 text-right">₺{item.price.toLocaleString('tr-TR')}</td>
                                            <td className="px-4 py-4 text-right font-bold">
                                                ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-secondary/20 font-bold">
                                    <tr>
                                        <td colSpan={4} className="px-4 py-4 text-right">Genel Toplam</td>
                                        <td className="px-4 py-4 text-right text-lg">
                                            ₺{order.totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {order.note && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 text-yellow-700 print:border print:border-gray-200 print:text-black">
                            <span className="font-bold flex items-center gap-2 mb-1">
                                <Mail size={16} /> Müşteri Notu:
                            </span>
                            <p className="text-sm">{order.note}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar (Customer & Payment Info) */}
                <div className="space-y-6 print:grid print:grid-cols-2 print:gap-8 print:space-y-0">

                    {/* Customer Info */}
                    <div className="bg-card border border-border rounded-3xl p-6 print:border print:rounded-xl print:shadow-none shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 print:text-lg">
                            <User className="text-blue-500 print:hidden" />
                            Müşteri Bilgileri
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Ad Soyad</label>
                                <p className="font-medium text-lg">{order.customerName}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">TC Kimlik</label>
                                <p className="font-mono">{order.customerTc}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Telefon</label>
                                <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-muted-foreground print:hidden" />
                                    <p>{order.customerPhone}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">E-posta</label>
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail size={14} className="text-muted-foreground print:hidden" />
                                    <p>{order.customerEmail || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-card border border-border rounded-3xl p-6 print:border print:rounded-xl print:shadow-none shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 print:text-lg">
                            <MapPin className="text-red-500 print:hidden" />
                            Teslimat Adresi
                        </h2>
                        <p className="whitespace-pre-line text-sm leading-relaxed">
                            {order.customerAddress}
                        </p>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-card border border-border rounded-3xl p-6 print:border print:rounded-xl print:shadow-none shadow-sm md:col-span-2 md:col-start-1 print:col-span-2">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 print:text-lg">
                            <CreditCard className="text-green-500 print:hidden" />
                            Ödeme Bilgileri
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Ödeme Durumu</label>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                                    order.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {order.paymentStatus === 'PAID' ? 'ÖDENDİ' :
                                        order.paymentStatus === 'FAILED' ? 'BAŞARISIZ' : 'BEKLİYOR'}
                                </span>
                            </div>
                            {order.paymentId && (
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">İşlem ID</label>
                                    <p className="font-mono text-xs">{order.paymentId}</p>
                                </div>
                            )}
                            <div className="col-span-2 pt-2 border-t mt-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-muted-foreground">Toplam Tutar</span>
                                    <span className="text-2xl font-black">₺{order.totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Friendly Footer */}
            <div className="hidden print:block mt-8 text-center text-xs text-gray-400 pt-8 border-t">
                <p>Kaşkar Halı - www.kaskarhali.com</p>
                <p>Bu belge {new Date().toLocaleDateString('tr-TR')} tarihinde oluşturulmuştur.</p>
            </div>

        </div>
    );
}
