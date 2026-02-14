import prisma from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import { notFound } from "next/navigation";
import { ProductWithRelations } from "@/types/prisma";

export default async function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            brand: true,
            products: {
                include: {
                    variants: true,
                    brand: true,
                    category: true
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!category) {
        notFound();
    }

    const coverImage = category.products[0]?.images || '/placeholder-carpet.jpg';

    return (
        <main className="bg-background min-h-screen">
            {/* ... (Hero Section unchanged) */}
            <div className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={coverImage}
                        alt={category.name}
                        className="w-full h-full object-cover grayscale opacity-30 scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                </div>

                <div className="relative z-10 text-center px-6">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="h-[1px] w-12 bg-accent opacity-60" />
                        <span className="text-accent text-[11px] font-black uppercase tracking-[0.4em]">
                            {category.brand.name}
                        </span>
                        <span className="h-[1px] w-12 bg-accent opacity-60" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter mb-6">
                        {category.name}
                    </h1>

                    <p className="max-w-xl mx-auto text-muted-foreground font-light text-lg">
                        {category.products.length} adet özel tasarım ürün listeleniyor.
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            <section className="px-[6%] pb-32 max-w-[1800px] mx-auto">
                {category.products.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-border rounded-3xl opacity-50">
                        <p>Bu koleksiyonda henüz ürün bulunmuyor.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {category.products.map((product: ProductWithRelations) => {
                            const minPrice = product.variants.length > 0
                                ? Math.min(...product.variants.map((v: { price: number }) => v.price))
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
