'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { createProduct, updateProduct } from '@/lib/actions/products'; // Added updateProduct
import { Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { ProductWithRelations } from '@/types/prisma'; // Added type import

// Simple types for props
interface Brand {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
}

interface ProductFormProps {
    brands: Brand[];
    categories: Category[];
    product?: ProductWithRelations; // Added product prop
}

export default function ProductForm({ brands, categories, product }: ProductFormProps) {
    const initialState = { message: '', errors: {} };
    const isEditing = !!product;

    // Bind the ID if editing, otherwise use createProduct
    const action = isEditing ? updateProduct.bind(null, product.id) : createProduct;

    const [state, formAction, isPending] = useActionState(action, initialState);

    // Local state for variants
    const [variants, setVariants] = useState(
        product?.variants.map(v => ({
            size: v.size,
            price: v.price.toString(),
            stock: v.stock.toString()
        })) || [{ size: '', price: '', stock: '' }]
    );
    // Filtered categories based on selected brand could be added, but for now show all or just grouped.
    // Better: Allow selecting Brand, then filter Categories. 
    // For MVP/Restoration: Show all categories.

    const addVariant = () => {
        setVariants([...variants, { size: '', price: '', stock: '' }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index: number, field: string, value: string) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };

    return (
        <form action={formAction} className="space-y-8 max-w-4xl">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                </h1>
                <div className="flex gap-4">
                    <Link href="/admin/products" className="px-6 py-3 border border-border rounded-xl font-bold hover:bg-secondary transition-colors">
                        İptal
                    </Link>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-6 py-3 bg-foreground text-background rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isPending ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm">
                {/* General Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ürün Adı</label>
                        <input
                            name="name"
                            defaultValue={product?.name}
                            type="text"
                            className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none"
                            placeholder="Örn: Klasik Hereke"
                            required
                        />
                        {state.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Açıklama</label>
                    <textarea
                        name="description"
                        defaultValue={product?.description}
                        className="w-full h-32 p-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none resize-none"
                        placeholder="Ürün detayları..."
                        required
                    />
                    {state.errors?.description && <p className="text-red-500 text-sm">{state.errors.description}</p>}

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Marka</label>
                        <select
                            name="brandId"
                            defaultValue={product?.brandId}
                            className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none"
                            required
                        >
                            <option value="">Marka Seçiniz</option>
                            {brands.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                        {state.errors?.brandId && <p className="text-red-500 text-sm">{state.errors.brandId}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Kategori (Koleksiyon)</label>
                        <select
                            name="categoryId"
                            defaultValue={product?.categoryId}
                            className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none"
                            required
                        >
                            <option value="">Kategori Seçiniz</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        {state.errors?.categoryId && <p className="text-red-500 text-sm">{state.errors.categoryId}</p>}

                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Görsel URL</label>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <input
                                name="images"
                                defaultValue={product?.images}
                                type="url"
                                className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none"
                                placeholder="https://..."
                                required
                            />
                        </div>
                    </div>
                    {state.errors?.images && <p className="text-red-500 text-sm">{state.errors.images}</p>}
                </div>
            </div>

            {/* Variants */}
            <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Varyantlar (Ebat & Fiyat)</h2>
                    <button type="button" onClick={addVariant} className="text-xs font-bold uppercase tracking-widest text-accent hover:underline flex items-center gap-1">
                        <Plus size={14} /> Varyant Ekle
                    </button>
                </div>

                {state.message && (
                    <div className="p-4 bg-red-500/10 text-red-500 rounded-xl mb-4">
                        {state.message}
                    </div>
                )}


                {/* Hidden input to pass variants data as JSON */}
                <input type="hidden" name="variants" value={JSON.stringify(variants)} />

                <div className="space-y-4">
                    {variants.map((variant, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-end p-4 bg-secondary/30 rounded-2xl border border-border/50">
                            <div className="flex-1 space-y-2 w-full">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ebat (Örn: 160x230)</label>
                                <input
                                    type="text"
                                    value={variant.size}
                                    onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg bg-background border border-border focus:border-accent outline-none"
                                    placeholder="160x230"
                                />
                            </div>
                            <div className="flex-1 space-y-2 w-full">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fiyat (TL)</label>
                                <input
                                    type="number"
                                    value={variant.price}
                                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg bg-background border border-border focus:border-accent outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex-1 space-y-2 w-full">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stok Adedi</label>
                                <input
                                    type="number"
                                    value={variant.stock}
                                    onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg bg-background border border-border focus:border-accent outline-none"
                                    placeholder="0"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeVariant(index)}
                                className="p-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
                {state.errors?.variants && <p className="text-red-500 text-sm">Lütfen tüm varyant bilgilerini eksiksiz doldurun.</p>}
            </div>
        </form>
    );
}
