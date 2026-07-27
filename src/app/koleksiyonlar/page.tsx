import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFirstProductImage } from "@/lib/product-utils";

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
    // Fetch all brands with their categories and 1 product for cover image
    const brands = await prisma.brand.findMany({
        include: {
            categories: {
                include: {
                    products: {
                        take: 1,
                        select: { images: true }
                    }
                }
            }
        },
        orderBy: { name: 'asc' }
    });

    return (
        <main className="bg-background min-h-screen">
            {/* Header Section */}
            <div className="relative pt-20 pb-16 px-[6%] text-center">
                <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
                    Seçkin Tasarımlar
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tighter">
                    Tüm Koleksiyonlar
                </h1>
                <div className="w-24 h-1 bg-accent mx-auto mt-8 rounded-full" />
            </div>

            {/* Collections Grid by Brand */}
            <div className="px-[6%] pb-32 max-w-[1800px] mx-auto space-y-32">
                {brands.map((brand) => (
                    brand.categories.length > 0 && (
                        <section key={brand.id}>
                            <div className="flex items-end justify-between mb-12 border-b border-border/40 pb-6">
                                <div>
                                    <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">
                                        {brand.name}
                                    </h2>
                                    <p className="text-muted-foreground font-light text-sm">
                                        {brand.categories.length} Farklı Seri
                                    </p>
                                </div>
                                <div className="text-accent text-[10px] font-black uppercase tracking-[0.2em]">
                                    Premium Quality
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {brand.categories.map((category) => {
                                    const coverImage = getFirstProductImage(category.products[0]?.images);

                                    return (
                                        <Link
                                            key={category.id}
                                            href={`/koleksiyonlar/${category.id}`}
                                            className="group relative h-[400px] rounded-[2.5rem] overflow-hidden bg-secondary border border-border/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                                        >
                                            <div className="absolute inset-0">
                                                <img
                                                    src={coverImage}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:via-black/40 transition-all duration-500" />
                                            </div>

                                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                    <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                        {brand.name}
                                                    </span>
                                                    <h3 className="text-2xl font-black text-white leading-tight mb-4">
                                                        {category.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                                                        <span>Ürünleri İncele</span>
                                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    )
                ))}

                {brands.length === 0 && (
                    <div className="text-center py-20 opacity-50">
                        Henüz koleksiyon bulunmuyor.
                    </div>
                )}
            </div>
        </main>
    );
}
