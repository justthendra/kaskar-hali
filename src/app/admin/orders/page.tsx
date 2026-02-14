import prisma from "@/lib/prisma";
import { Package, Clock, CheckCircle, Truck, XCircle, Eye } from "lucide-react";
import Link from "next/link";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const dynamic = 'force-dynamic';

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    PENDING: { label: 'Beklemede', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: <Clock size={14} /> },
    CONFIRMED: { label: 'Onaylandı', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: <CheckCircle size={14} /> },
    SHIPPED: { label: 'Kargoda', color: 'text-purple-600 bg-purple-50 border-purple-200', icon: <Truck size={14} /> },
    DELIVERED: { label: 'Teslim Edildi', color: 'text-green-600 bg-green-50 border-green-200', icon: <CheckCircle size={14} /> },
    CANCELLED: { label: 'İptal', color: 'text-red-600 bg-red-50 border-red-200', icon: <XCircle size={14} /> },
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }).format(date);
}

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: 'desc' }
    });

    const pendingCount = orders.filter(o => o.status === 'PENDING').length;
    const totalRevenue = orders.filter(o => o.status !== 'CANCELLED').reduce((sum, o) => sum + o.totalPrice, 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Siparişler</h1>
                    <p className="text-muted-foreground">Tüm müşteri siparişlerini yönetin.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-2 text-center">
                        <p className="text-xs text-yellow-600 font-bold uppercase tracking-widest">Bekleyen</p>
                        <p className="text-2xl font-black text-yellow-700">{pendingCount}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-2 text-center">
                        <p className="text-xs text-green-600 font-bold uppercase tracking-widest">Toplam Gelir</p>
                        <p className="text-xl font-black text-green-700">{formatPrice(totalRevenue)}</p>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
                <div className="bg-secondary rounded-3xl border border-border p-12 text-center">
                    <Package size={48} className="mx-auto text-muted-foreground opacity-30 mb-4" />
                    <p className="text-muted-foreground">Henüz sipariş bulunmamaktadır.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const status = statusConfig[order.status] || statusConfig.PENDING;
                        return (
                            <div key={order.id} className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
                                {/* Order Header */}
                                <div className="p-6 flex flex-wrap items-center justify-between gap-4 border-b border-border bg-secondary/30">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <Link href={`/admin/orders/${order.id}`} className="font-mono font-black text-sm hover:underline">{order.orderNumber}</Link>
                                                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">Toplam</p>
                                            <p className="font-black text-lg text-accent">{formatPrice(order.totalPrice)}</p>
                                        </div>
                                        <div>
                                            {(order as any).paymentStatus === 'PAID' ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border text-green-600 bg-green-50 border-green-200">
                                                    💳 Ödendi
                                                </span>
                                            ) : (order as any).paymentStatus === 'FAILED' ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border text-red-600 bg-red-50 border-red-200">
                                                    💳 Başarısız
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border text-orange-600 bg-orange-50 border-orange-200">
                                                    💳 Bekliyor
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Info + Items */}
                                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Customer Info */}
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Müşteri Bilgileri</h3>
                                        <div className="space-y-1.5 text-sm">
                                            <p className="font-bold">{order.customerName}</p>
                                            <p className="text-muted-foreground">TC: <span className="font-mono text-foreground">{order.customerTc}</span></p>
                                            <p className="text-muted-foreground">Tel: <span className="text-foreground">{order.customerPhone}</span></p>
                                            {order.customerEmail && (
                                                <p className="text-muted-foreground">E-posta: <span className="text-foreground">{order.customerEmail}</span></p>
                                            )}
                                            <p className="text-muted-foreground">Adres: <span className="text-foreground">{order.customerAddress}</span></p>
                                            {order.note && (
                                                <p className="text-muted-foreground italic mt-2">Not: {order.note}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="lg:col-span-2">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Sipariş Ürünleri</h3>
                                        <div className="space-y-3">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex items-center gap-3 bg-secondary/50 rounded-xl p-3">
                                                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-border shrink-0">
                                                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm line-clamp-1">{item.productName}</p>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-xs bg-background border border-border rounded-md px-2 py-0.5 font-mono font-bold">
                                                                {item.variantSize}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                × {item.quantity}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="font-bold text-sm whitespace-nowrap">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
