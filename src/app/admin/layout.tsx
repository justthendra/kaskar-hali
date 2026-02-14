import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Layers, Tag, Settings, LogOut, Users, Package } from 'lucide-react';
import { signOut } from '@/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <title>Kaşkar Halı - Yönetim Paneli</title>
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-secondary border-r border-border p-6 flex flex-col z-50 print:hidden">
                <div className="mb-10 px-2">
                    <Link href="/" className="text-xl font-black tracking-tighter">KAŞKAR <span className="text-accent">PANEL</span></Link>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavLink href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Genel Bakış" />
                    <NavLink href="/admin/products" icon={<ShoppingBag size={20} />} label="Ürünler" />
                    <NavLink href="/admin/orders" icon={<Package size={20} />} label="Siparişler" />
                    <NavLink href="/admin/brands" icon={<Tag size={20} />} label="Markalar" />
                    <NavLink href="/admin/categories" icon={<Layers size={20} />} label="Koleksiyonlar" />
                    <NavLink href="/admin/customers" icon={<Users size={20} />} label="Müşteriler" />
                    <NavLink href="/admin/settings" icon={<Settings size={20} />} label="Ayarlar" />
                </nav>

                <div className="pt-6 border-t border-border">
                    <form action={async () => {
                        'use server';
                        await signOut({ redirectTo: '/login' });
                    }}>
                        <button className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium text-sm">
                            <LogOut size={20} />
                            <span>Çıkış Yap</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8 print:ml-0 print:p-0">
                {children}
            </main>
        </div>
    );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-background rounded-xl transition-all font-medium text-sm">
            {icon}
            <span>{label}</span>
        </Link>
    );
}
