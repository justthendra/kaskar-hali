import Link from 'next/link';

interface ProductCardProps {
    id: string;
    name: string;
    brand: string;
    price: number;
    oldPrice?: number;
    image: string;
}

export default function ProductCard({ id, name, brand, price, oldPrice, image }: ProductCardProps) {
    return (
        <Link href={`/urunler/${id}`} className="group block h-full">
            <div className="relative h-full flex flex-col rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20">
                {/* Image Section */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    {/* Badge */}
                    <div className="absolute top-6 left-6 z-10">
                        <span className="px-5 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                            Yeni Sezon
                        </span>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Footer Section */}
                <div className="bg-[#111] p-8 flex flex-col justify-between flex-grow relative z-20 border-t border-white/5 group-hover:bg-[#080808] transition-colors duration-500">
                    <div className="flex flex-col gap-4">
                        {/* Brand & Decoration */}
                        <div className="flex items-center justify-between">
                            <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em]">
                                {brand}
                            </span>
                            <div className="flex gap-1.5 opacity-30">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-[3px] h-[3px] rounded-full bg-[#D4AF37]" />
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-[#888] font-bold text-lg leading-snug line-clamp-2 group-hover:text-white transition-colors duration-300">
                            {name}
                        </h3>
                    </div>

                    {/* Price - Subtle appearance on hover */}
                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-white font-medium text-lg tracking-tight">
                            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price)}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
