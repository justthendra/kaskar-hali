import { BrandWithRelations } from '@/types/prisma';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';


export default async function BrandsPage() {
    const brands = await prisma.brand.findMany({
        include: {
            categories: true,
            _count: {
                select: { products: true }
            }
        },
        orderBy: { name: 'asc' }
    });

    return (
        <main className="bg-background min-h-screen">
            {/* Brands Grid */}
            <div className="px-[6%] pb-32 max-w-[1800px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {brands.map((brand: BrandWithRelations) => (
                        <Link
                            key={brand.id}
                            href={`/koleksiyonlar`}
                            className="group relative h-[300px] rounded-[2.5rem] overflow-hidden bg-secondary border border-border/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Logo Placeholder or Text if no logo */}
                            {brand.logo ? (
                                <img src={brand.logo} alt={brand.name} className="max-w-[70%] max-h-[100px] object-contain mb-8 grayscale group-hover:grayscale-0 transition-all duration-500" />
                            ) : (
                                <h2 className="text-4xl font-black text-foreground tracking-tighter mb-4 group-hover:text-accent transition-colors">
                                    {brand.name}
                                </h2>
                            )}

                            <div className="space-y-1">
                                <p className="text-muted-foreground font-medium text-sm">
                                    {brand.categories.length} Koleksiyon
                                </p>
                                <p className="text-muted-foreground/60 text-xs">
                                    {brand._count.products} Ürün
                                </p>
                            </div>

                            <div className="mt-8 flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-widest opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                <span>Koleksiyonları İncele</span>
                                <ArrowRight size={14} />
                            </div>
                        </Link>
                    ))}
                </div>

                {brands.length === 0 && (
                    <div className="text-center py-20 opacity-50">
                        Henüz marka bulunmuyor.
                    </div>
                )}
            </div>
        </main>
    );
}
