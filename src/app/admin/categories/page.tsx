
import prisma from "@/lib/prisma";
import { createCategory, deleteCategory } from "@/lib/actions/definitions";
import { Trash2, Plus, Layers } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            brand: true,
            _count: { select: { products: true } }
        },
        orderBy: { name: 'asc' }
    });

    const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Koleksiyon Yönetimi</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="md:col-span-1">
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm sticky top-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Plus size={20} className="text-accent" />
                            Yeni Koleksiyon
                        </h2>
                        <form action={async (formData: FormData) => {
                            'use server';
                            await createCategory(formData);
                        }} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bağlı Olduğu Marka</label>
                                <select name="brandId" className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none" required>
                                    <option value="">Marka Seçiniz</option>
                                    {brands.map((b: any) => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Koleksiyon Adı</label>
                                <input name="name" type="text" className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none" placeholder="Örn: Pierre Cardin" required />
                            </div>
                            <button type="submit" className="w-full h-12 bg-foreground text-background rounded-xl font-bold hover:opacity-90 transition-opacity">
                                Ekle
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="md:col-span-2 space-y-4">
                    {categories.map((category: any) => (
                        <div key={category.id} className="flex items-center justify-between p-4 bg-secondary/20 border border-border/50 rounded-2xl hover:border-accent/50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shadow-sm">
                                    <Layers size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{category.name}</h3>
                                    <div className="flex gap-4 text-xs text-muted-foreground">
                                        <span className="text-foreground/80 font-medium">{category.brand.name}</span>
                                        <span>•</span>
                                        <span>{category._count.products} Ürün</span>
                                    </div>
                                </div>
                            </div>
                            <form action={async () => {
                                'use server';
                                await deleteCategory(category.id);
                            }}>
                                <button className="p-3 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </form>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            Henüz koleksiyon eklenmemiş.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
