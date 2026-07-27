import Hero from '@/components/ui/Hero';
import ProductCard from '@/components/ui/ProductCard';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ProductWithRelations } from '@/types/prisma';
import { getFirstProductImage } from '@/lib/product-utils';

export const dynamic = 'force-dynamic';


export default async function Home() {
    // Fetch latest products
    const latestProducts = await prisma.product.findMany({
        take: 4,
        include: {
            brand: true,
            category: true,
            variants: {
                orderBy: { price: 'asc' },
                take: 1
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <main className="bg-background min-h-screen">
            <Hero />

            {/* Featured Products Section */}
            <section className="py-24 px-[6%] max-w-[1800px] mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">
                            Özenle Seçilenler
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
                            Yeni Koleksiyon
                        </h2>
                    </div>
                    <Link href="/koleksiyonlar" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                        Tümünü Gör
                        <span className="block h-[1px] w-8 bg-current transition-all duration-300 group-hover:w-16" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {latestProducts.map((product: ProductWithRelations) => {
                        const minPrice = product.variants.length > 0 ? product.variants[0].price : 0;
                        return (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                brand={product.brand.name}
                                price={minPrice}
                                image={getFirstProductImage(product.images)}
                            />
                        );
                    })}
                    {latestProducts.length === 0 && (
                        <div className="col-span-full py-20 text-center border border-dashed border-border rounded-[2rem] opacity-50">
                            <p className="text-muted-foreground">Henüz ürün eklenmemiş.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
