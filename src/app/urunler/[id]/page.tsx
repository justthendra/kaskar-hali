import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import Link from 'next/link';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            brand: true,
            variants: {
                orderBy: { price: 'asc' }
            }
        }
    });

    if (!product) {
        notFound();
    }

    return (
        <main className="bg-background min-h-screen">
            {/* Note: Navbar and Footer are in RootLayout, but if we need specific styling here we can adjust. 
                 However, RootLayout is applied globally.
                 The previous user edits removed Navbar/Footer from here, so I will rely on RootLayout.
             */}

            <section className="pt-20 lg:pt-32 pb-20 px-[6%] max-w-[1800px] mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-12 overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-accent transition-colors">Anasayfa</Link>
                    <span>/</span>
                    <Link href="/koleksiyonlar" className="hover:text-accent transition-colors">Koleksiyonlar</Link>
                    <span>/</span>
                    <span className="text-accent">{product.name}</span>
                </div>

                <ProductDetailClient product={product} />
            </section>
        </main>
    );
}
