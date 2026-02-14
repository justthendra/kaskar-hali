
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import { ProductWithRelations } from "@/types/prisma";
import { SlidersHorizontal } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const sort = typeof params.sort === 'string' ? params.sort : 'newest';

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { variants: { _count: 'desc' } }; // Simplified, ideally strictly by price but variants make it complex logic in Prisma without raw query or aggregation
    // For simplicity in this step, let's keep it simple 'newest' mostly. Smart sorting needs more logic.

    const products = await prisma.product.findMany({
        include: {
            brand: true,
            category: true,
            variants: true
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <main className="bg-background min-h-screen">
            {/* Header */}
            <div className="relative pt-20 pb-12 px-[6%] bg-secondary/20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-[1800px] mx-auto">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-4">
                            Tüm Ürünler
                        </h1>
                        <p className="text-muted-foreground font-light text-lg">
                            {products.length} adet özel tasarım halı listeleniyor.
                        </p>
                    </div>

                    {/* Simple Filter/Sort UI (Visual only for now, can be expanded) */}
                    <div className="flex items-center gap-4">
                        <button className="h-12 px-6 bg-white border border-border/50 rounded-full flex items-center gap-2 font-bold text-xs uppercase tracking-widest hover:border-accent transition-colors shadow-sm">
                            <SlidersHorizontal size={16} />
                            <span>Filtrele</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <section className="px-[6%] py-12 max-w-[1800px] mx-auto">
                {products.length === 0 ? (
                    <div className="text-center py-32 border border-dashed border-border rounded-[3rem] opacity-50">
                        <p className="text-xl font-light">Aradığınız kriterlere uygun ürün bulunamadı.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {products.map((product) => {
                            // Calculate min price from variants
                            const minPrice = product.variants.length > 0
                                ? Math.min(...product.variants.map((v) => v.price))
                                : 0;

                            return (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    brand={product.brand.name}
                                    price={minPrice}
                                    image={product.images}
                                />
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}
