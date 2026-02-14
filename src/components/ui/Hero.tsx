'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
            {/* Background Image Placeholder */}
            <div className="absolute inset-0 opacity-40">
                <div className="w-full h-full bg-gradient-to-r from-gray-900 to-black" />
            </div>

            <div className="relative z-10 px-[6%] max-w-[1800px] w-full">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-2 px-6 rounded-full border border-white/20 text-white/80 text-xs font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
                            2025 Koleksiyonu Yayında
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-10"
                    >
                        Zerafetin <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F1D789]">
                            Dokusu
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-white/60 max-w-xl font-light leading-relaxed mb-12"
                    >
                        Modern tasarım anlayışını geleneksel dokuma sanatıyla buluşturuyoruz.
                        Evinizin her köşesi için özel olarak tasarlanmış, el emeği ve sanatın
                        eşsiz uyumunu keşfedin.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-wrap gap-6"
                    >
                        <Link href="/koleksiyonlar" className="px-10 py-5 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#D4AF37] hover:text-white transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)]">
                            Koleksiyonu Keşfet
                        </Link>
                        <Link href="/iletisim" className="px-10 py-5 bg-transparent border border-white/20 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all duration-500 backdrop-blur-sm">
                            Bize Ulaşın
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
