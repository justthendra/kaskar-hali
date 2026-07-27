import prisma from "@/lib/prisma";
import { ShoppingBag, Users, Layers, Tag } from "lucide-react";

export const dynamic = 'force-dynamic';

import { auth } from "@/auth";

import Link from "next/link";
import SalesChart from "@/components/dashboard/SalesChart";

export default async function AdminDashboard() {
    const session = await auth();
    const user = session?.user;

    // Calculate dates for the last 7 days
    const todayDate = new Date();
    const lastTheWeek = new Date(todayDate);
    lastTheWeek.setDate(lastTheWeek.getDate() - 6); // 6 days ago + today = 7 days
    lastTheWeek.setHours(0, 0, 0, 0);

    const [
        productCount,
        categoryCount,
        brandCount,
        customerCount,
        orderCount,
        revenueData,
        recentOrders,
        weeklyOrders
    ] = await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.brand.count(),
        prisma.customer.count(),
        prisma.order.count(),
        prisma.order.aggregate({
            _sum: { totalPrice: true },
            where: { paymentStatus: 'PAID' }
        }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.order.findMany({
            where: {
                createdAt: { gte: lastTheWeek },
                paymentStatus: 'PAID'
            },
            select: {
                createdAt: true,
                totalPrice: true
            }
        })
    ]);

    // Process weekly orders for chart
    const chartDataMap = new Map<string, number>();

    // Initialize last 7 days with 0
    for (let i = 0; i < 7; i++) {
        const d = new Date(todayDate);
        d.setDate(d.getDate() - i);
        const dateKey = d.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric' }); // "Pzt 14"
        // We want chronological order, so we'll reverse later or build array differently
    }

    // Better approach: Create array of last 7 days in order
    const chartData = [];
    const locale = 'tr-TR';

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = d.toLocaleDateString(locale, { weekday: 'short' }); // "Pzt"
        // Key for matching data (YYYY-MM-DD for simpler comparison might be safer, but let's compare dates)
        // Let's filter weeklyOrders for this specific day
        const dailyTotal = weeklyOrders
            .filter(o => {
                const orderDate = new Date(o.createdAt);
                return orderDate.getDate() === d.getDate() &&
                    orderDate.getMonth() === d.getMonth() &&
                    orderDate.getFullYear() === d.getFullYear();
            })
            .reduce((sum, order) => sum + order.totalPrice, 0);

        chartData.push({
            name: dayName,
            total: dailyTotal
        });
    }

    const totalRevenue = revenueData._sum?.totalPrice || 0;
    const todayStr = new Date().toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="space-y-8">
            {/* Header Section with Gradient */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-secondary to-background border border-border p-8 md:p-12">
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Hoşgeldiniz, <span className="text-primary">{user?.name || 'Yönetici'}</span>
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground font-medium">
                        {todayStr} · Mağaza genel durum özeti
                    </p>
                </div>
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Toplam Gelir"
                    value={`₺${totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
                    icon={<div className="text-green-500 font-bold text-xl">₺</div>}
                    trend="up"
                />
                <StatCard
                    title="Toplam Sipariş"
                    value={orderCount}
                    icon={<ShoppingBag className="text-blue-500" />}
                />
                <StatCard
                    title="Müşteriler"
                    value={customerCount}
                    icon={<Users className="text-purple-500" />}
                />
                <StatCard
                    title="Ürün & Koleksiyon"
                    value={`${productCount} / ${categoryCount}`}
                    icon={<Tag className="text-orange-500" />}
                />
            </div>

            {/* Chart Section */}
            <SalesChart data={chartData} />

            {/* Recent Orders Table */}
            <div className="bg-secondary/30 rounded-3xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6 px-2">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Layers className="w-5 h-5 text-primary" />
                        Son Siparişler
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-muted-foreground border-b border-border/50">
                            <tr>
                                <th className="px-6 py-4 font-medium">Sipariş No</th>
                                <th className="px-6 py-4 font-medium">Müşteri</th>
                                <th className="px-6 py-4 font-medium">Tarih</th>
                                <th className="px-6 py-4 font-medium">Tutar</th>
                                <th className="px-6 py-4 font-medium">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        Henüz sipariş bulunmuyor.
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-background/80 transition-colors group cursor-default">
                                        <td className="px-6 py-4 font-medium font-mono text-foreground/80 group-hover:text-primary transition-colors">
                                            <Link href={`/admin/orders/${order.id}`} className="hover:underline z-10 relative">
                                                {order.orderNumber}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">{order.customerName}</td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            ₺{order.totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${order.paymentStatus === 'PAID'
                                                ? 'bg-green-500/10 text-green-600 border-green-500/20'
                                                : order.paymentStatus === 'FAILED'
                                                    ? 'bg-red-500/10 text-red-600 border-red-500/20'
                                                    : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                                                }`}>
                                                {order.paymentStatus === 'PAID' ? 'Ödendi' :
                                                    order.paymentStatus === 'FAILED' ? 'Başarısız' : 'Bekliyor'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend }: { title: string; value: number | string; icon: React.ReactNode, trend?: 'up' | 'down' }) {
    return (
        <div className="group p-6 rounded-3xl bg-secondary/50 hover:bg-secondary border border-border flex items-center justify-between shadow-sm hover:shadow-lg transition-all duration-300">
            <div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</p>
                <h3 className="text-2xl font-black mt-2 tracking-tight">{value}</h3>
            </div>
            <div className={`p-4 rounded-2xl border border-border transition-colors ${trend ? 'bg-green-500/10 border-green-500/20' : 'bg-background group-hover:border-primary/20'}`}>
                {icon}
            </div>
        </div>
    );
}
