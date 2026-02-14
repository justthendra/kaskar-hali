'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingBag, User, Search, Menu, LogOut, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { items, toggleCart } = useCart();

    // Hide Navbar on admin pages and auth pages
    if (pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/register') {
        return null;
    }

    return (
        <header className="fixed top-0 left-0 right-0 h-24 flex items-center justify-between px-[6%] bg-white/90 backdrop-blur-md border-b border-border z-50 transition-all duration-500">
            <Link href="/" className="flex items-center group">
                <div className="relative overflow-hidden w-12 h-12 flex items-center justify-center">
                    <Image src="/kaskar.png" alt="Logo" width={30} height={30} />
                </div>
                <span className="ml-3 text-xl font-medium text-primary transition-colors duration-300">Kaşkar <span className="text-accent font-bold">Halı</span></span>
            </Link>

            <nav className="hidden lg:flex items-center gap-10">
                <Link href="/urunler" className="text-[13px] font-bold uppercase tracking-[0.15em] opacity-60 hover:opacity-100 hover:text-accent transition-all duration-300 relative group">
                    Ürünler
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link href="/koleksiyonlar" className="text-[13px] font-bold uppercase tracking-[0.15em] opacity-60 hover:opacity-100 hover:text-accent transition-all duration-300 relative group">
                    Koleksiyonlar
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link href="/markalar" className="text-[13px] font-bold uppercase tracking-[0.15em] opacity-60 hover:opacity-100 hover:text-accent transition-all duration-300 relative group">
                    Markalar
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link href="/hakkimizda" className="text-[13px] font-bold uppercase tracking-[0.15em] opacity-60 hover:opacity-100 hover:text-accent transition-all duration-300 relative group">
                    Hakkımızda
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link href="/iletisim" className="text-[13px] font-bold uppercase tracking-[0.15em] opacity-60 hover:opacity-100 hover:text-accent transition-all duration-300 relative group">
                    İletişim
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
            </nav>

            <div className="flex items-center gap-4 md:gap-8">
                <button className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 group" aria-label="Search">
                    <Search size={22} className="group-hover:scale-110 group-hover:text-accent transition-all" />
                </button>

                <div className="hidden md:flex items-center gap-4">
                    {session ? (
                        <>
                            {session.user?.role === 'ADMIN' ? (
                                <Link href="/admin/dashboard" className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300" title="Dashboard">
                                    <LayoutDashboard size={22} />
                                </Link>
                            ) : (
                                <Link href="/profile" className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300" title="Profil">
                                    <User size={22} />
                                </Link>
                            )}
                            <button
                                className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 text-red-500/70 hover:text-red-500 cursor-pointer"
                                onClick={() => signOut()}
                                title="Çıkış Yap"
                            >
                                <LogOut size={22} />
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent cursor-pointer transition-all duration-300 shadow-xl shadow-primary/10">
                            <User size={14} />
                            Giriş
                        </Link>
                    )}
                </div>

                <div className="relative group">
                    <button onClick={toggleCart} className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer" aria-label="Shopping Cart">
                        <ShoppingBag size={22} className="group-hover:text-accent transition-colors" />
                    </button>
                    {items.length > 0 && (
                        <span className="absolute top-1 right-1 bg-accent text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg shadow-accent/40 animate-pulse">
                            {items.length}
                        </span>
                    )}
                </div>

                <button
                    className="lg:hidden p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu size={22} />
                </button>
            </div>
        </header>
    );
}
