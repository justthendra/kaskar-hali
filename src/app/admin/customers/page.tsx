
import prisma from "@/lib/prisma";
import { Trash2, User, MapPin, Phone, Mail, FileText, Plus, ShoppingBag, Banknote } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

function formatPrice(price: number) {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
}

async function deleteCustomer(id: string) {
    'use server';
    await prisma.customer.delete({ where: { id } });
    revalidatePath('/admin/customers');
}

async function createCustomer(formData: FormData) {
    'use server';
    const tcNo = formData.get('tcNo') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;

    await prisma.customer.upsert({
        where: { tcNo },
        update: { firstName, lastName, phone, email, address },
        create: { tcNo, firstName, lastName, phone, email, address }
    });
    revalidatePath('/admin/customers');
}

export default async function CustomersPage() {
    const customers = await prisma.customer.findMany({
        include: {
            orders: {
                select: {
                    id: true,
                    totalPrice: true,
                    status: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Müşteri Yönetimi</h1>

            {/* Add Customer Form */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Plus size={20} className="text-accent" />
                    Yeni Müşteri Ekle
                </h2>
                <form action={createCustomer} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input name="tcNo" type="text" placeholder="TC Kimlik No" className="h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none" required />
                    <input name="firstName" type="text" placeholder="Ad" className="h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none" required />
                    <input name="lastName" type="text" placeholder="Soyad" className="h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none" required />
                    <input name="phone" type="text" placeholder="Telefon" className="h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none" />
                    <input name="email" type="email" placeholder="E-Posta" className="h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none" />
                    <input name="address" type="text" placeholder="Adres" className="h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none md:col-span-3" />

                    <button type="submit" className="h-12 bg-foreground text-background rounded-xl font-bold hover:opacity-90 transition-opacity md:col-span-3">
                        Kaydet
                    </button>
                </form>
            </div>


            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-secondary/30">
                            <th className="p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground">TC / Ad Soyad</th>
                            <th className="p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground">İletişim</th>
                            <th className="p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground">Sipariş / Tutar</th>
                            <th className="p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {customers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-muted-foreground">
                                    Kayıtlı müşteri bulunamadı.
                                </td>
                            </tr>
                        ) : (
                            customers.map((customer: any) => {
                                const activeOrders = customer.orders.filter((o: any) => o.status !== 'CANCELLED');
                                const orderCount = activeOrders.length;
                                const totalSpent = activeOrders.reduce((sum: number, o: any) => sum + o.totalPrice, 0);

                                return (
                                    <tr key={customer.id} className="hover:bg-secondary/20 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-foreground">{customer.firstName} {customer.lastName}</div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <FileText size={12} />
                                                        {customer.tcNo}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 space-y-1">
                                            <div className="text-sm flex items-center gap-2 text-foreground/80">
                                                <Phone size={14} className="text-muted-foreground" />
                                                {customer.phone || '-'}
                                            </div>
                                            <div className="text-xs flex items-center gap-2 text-muted-foreground">
                                                <Mail size={14} />
                                                {customer.email || '-'}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <ShoppingBag size={14} className="text-muted-foreground" />
                                                    <span className="font-bold">{orderCount}</span>
                                                    <span className="text-muted-foreground text-xs">sipariş</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Banknote size={14} className="text-accent" />
                                                    <span className="font-black text-accent">{formatPrice(totalSpent)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <form action={deleteCustomer.bind(null, customer.id)}>
                                                <button className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
