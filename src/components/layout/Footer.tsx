'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();

    // Hide Footer on admin pages and auth pages
    if (pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/register') {
        return null;
    }

    return (
        <footer className="bg-primary text-white pt-20 pb-10 rounded-t-[3rem] mt-20">
            <div className="px-[6%] max-w-[1800px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="text-2xl font-medium">Kaşkar <span className="text-accent font-bold">Halı</span></span>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Evinizin zarafetini tamamlayan, modern ve klasik tasarımların buluşma noktası.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/kaskarhali/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent transition-colors">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-accent text-xs font-black uppercase tracking-widest mb-6">Kurumsal</h4>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li><Link href="/hakkimizda" className="hover:text-white transition-colors">Hakkımızda</Link></li>
                            <li><Link href="/magazalarimiz" className="hover:text-white transition-colors">Mağazalarımız</Link></li>
                            <li><Link href="/iletisim" className="hover:text-white transition-colors">İletişim</Link></li>
                            <li><Link href="/sss" className="hover:text-white transition-colors">Sıkça Sorulan Sorular</Link></li>
                        </ul>
                    </div>

                    {/* Collections */}
                    <div>
                        <h4 className="text-accent text-xs font-black uppercase tracking-widest mb-6">Koleksiyonlar</h4>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li><Link href="/koleksiyonlar" className="hover:text-white transition-colors">Tüm Koleksiyonlar</Link></li>
                            <li><Link href="/markalar" className="hover:text-white transition-colors">Markalar</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Yeni Sezon</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Outlet</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-accent text-xs font-black uppercase tracking-widest mb-6">Bize Ulaşın</h4>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li>info@kaskarhali.com</li>
                            <li>+90 (545) 201 66 89</li>
                            <li>Haznedar, Bağcılar Cd. No:96,<br /> 34600 Güngören/İstanbul</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/40">
                    <p>&copy; {new Date().getFullYear()} Kaşkar Halı. Tüm hakları saklıdır.</p>
                    <div className="flex gap-6">
                        <Link href="/gizlilik-politikasi" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
                        <Link href="/kullanim-kosullari" className="hover:text-white transition-colors">Kullanım Koşulları</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
