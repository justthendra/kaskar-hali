import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions/products";
import { ProductWithRelations } from "@/types/prisma";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            brand: true,
            category: true,
            variants: true
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ürün Yönetimi</h1>
                    <p className="text-muted-foreground">Toplam {products.length} ürün listeleniyor.</p>
                </div>
                <Link href="/admin/products/new" className="px-6 py-3 bg-foreground text-background rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <Plus size={18} />
                    Yeni Ürün Ekle
                </Link>
            </div>

            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-secondary/30">
                            <th className="p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground">Görsel</th>
                            <th className="p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground">Ürün Adı</th>
                            <th className="p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground">Marka & Kategori</th>
                            <th className="p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground">Varyant/Stok</th>
                            <th className="p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-muted-foreground">
                                    Henüz ürün eklenmemiş.
                                </td>
                            </tr>
                        ) : (
                            products.map((product: ProductWithRelations) => (
                                <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                                    <td className="p-6 w-24">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary border border-border">
                                            <img src={product.images} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="font-bold text-foreground">{product.name}</div>
                                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{product.description}</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="font-medium">{product.brand.name}</div>
                                        <div className="text-xs text-muted-foreground">{product.category.name}</div>
                                    </td>
                                    <td className="p-6">
                                        {product.variants.length > 0 ? (
                                            <div className="space-y-1">
                                                {product.variants.slice(0, 2).map((v: { id: string; size: string; stock: number }) => (
                                                    <div key={v.id} className="text-xs flex items-center gap-2">
                                                        <span className="font-bold text-accent">{v.size}</span>
                                                        <span className="text-muted-foreground">({v.stock} adet)</span>
                                                    </div>
                                                ))}
                                                {product.variants.length > 2 && (
                                                    <div className="text-xs text-muted-foreground">+ {product.variants.length - 2} varyant daha</div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-red-500 font-bold">Varyant Yok</span>
                                        )}
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Edit Button Placeholder */}
                                            {/* Edit Button */}
                                            <Link href={`/admin/products/${product.id}`} className="p-2 rounded-lg hover:bg-zinc-200 transition-colors text-zinc-600 hover:text-zinc-800">
                                                <Edit2 size={18} />
                                            </Link>

                                            {/* Delete Form */}
                                            <form action={async () => {
                                                'use server';
                                                await deleteProduct(product.id);
                                            }}>
                                                <button className="p-2 rounded-lg hover:bg-red-500/10 text-red-500/70 hover:text-red-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
