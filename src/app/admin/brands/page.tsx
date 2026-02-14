
import prisma from "@/lib/prisma";
import { createBrand, deleteBrand } from "@/lib/actions/definitions";
import { Trash2, Plus, Tag } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
    const brands = await prisma.brand.findMany({
        include: { _count: { select: { products: true, categories: true } } },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Marka Yönetimi</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="md:col-span-1">
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm sticky top-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Plus size={20} className="text-accent" />
                            Yeni Marka Ekle
                        </h2>
                        <form action={async (formData: FormData) => {
                            'use server';
                            await createBrand(formData);
                        }} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Marka Adı</label>
                                <input name="name" type="text" className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none" placeholder="Örn: Royal Halı" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Logo URL (Opsiyonel)</label>
                                <input name="logo" type="url" className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none" placeholder="https://..." />
                            </div>
                            <button type="submit" className="w-full h-12 bg-foreground text-background rounded-xl font-bold hover:opacity-90 transition-opacity">
                                Ekle
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="md:col-span-2 space-y-4">
                    {brands.map((brand: any) => (
                        <div key={brand.id} className="flex items-center justify-between p-4 bg-secondary/20 border border-border/50 rounded-2xl hover:border-accent/50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2 shadow-sm">
                                    {brand.logo ? (
                                        <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        <Tag className="text-gray-300" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{brand.name}</h3>
                                    <div className="flex gap-4 text-xs text-muted-foreground">
                                        <span>{brand._count.products} Ürün</span>
                                        <span>{brand._count.categories} Koleksiyon</span>
                                    </div>
                                </div>
                            </div>
                            <form action={async () => {
                                'use server';
                                await deleteBrand(brand.id);
                            }}>
                                <button className="p-3 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </form>
                        </div>
                    ))}
                    {brands.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            Henüz marka eklenmemiş.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
