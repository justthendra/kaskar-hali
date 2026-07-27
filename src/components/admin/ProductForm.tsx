'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { createProduct, updateProduct } from '@/lib/actions/products';
import { Plus, Trash2, Save, Image as ImageIcon, Star } from 'lucide-react';
import Link from 'next/link';
import { ProductWithRelations } from '@/types/prisma';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { parseProductImages } from '@/lib/product-utils';

interface Brand {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
    brandId: string;
}

interface ProductFormProps {
    brands: Brand[];
    categories: Category[];
    product?: ProductWithRelations;
}

export default function ProductForm({ brands, categories, product }: ProductFormProps) {
    const initialState = { message: '', errors: {} };
    const isEditing = !!product;

    const action = isEditing ? updateProduct.bind(null, product.id) : createProduct;
    const [state, formAction, isPending] = useActionState(action, initialState);

    // Selected brand and category filtering state
    const [selectedBrandId, setSelectedBrandId] = useState<string>(product?.brandId || '');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(product?.categoryId || '');

    const handleBrandChange = (brandId: string) => {
        setSelectedBrandId(brandId);
        const validCategory = categories.find(c => c.brandId === brandId && c.id === selectedCategoryId);
        if (!validCategory) {
            setSelectedCategoryId('');
        }
    };

    const filteredCategories = selectedBrandId
        ? categories.filter(c => c.brandId === selectedBrandId)
        : categories;

    // Multi-image state
    const [imageUrls, setImageUrls] = useState<string[]>(() => {
        const parsed = parseProductImages(product?.images);
        return parsed.length > 0 ? parsed : [''];
    });

    // Variants state
    const [variants, setVariants] = useState(
        product?.variants.map(v => ({
            size: v.size,
            price: v.price.toString(),
            stock: v.stock.toString()
        })) || [{ size: '', price: '', stock: '' }]
    );

    // Image Handlers
    const addImageField = () => {
        setImageUrls([...imageUrls, '']);
    };

    const removeImageField = (index: number) => {
        if (imageUrls.length === 1) {
            setImageUrls(['']);
            return;
        }
        setImageUrls(imageUrls.filter((_, i) => i !== index));
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...imageUrls];
        newImages[index] = value;
        setImageUrls(newImages);
    };

    const setAsPrimaryImage = (index: number) => {
        if (index === 0) return;
        const newImages = [...imageUrls];
        const [selected] = newImages.splice(index, 1);
        newImages.unshift(selected);
        setImageUrls(newImages);
    };

    // Variant Handlers
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

    const validImages = imageUrls.filter(url => url.trim().length > 0);

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
                    <RichTextEditor
                        name="description"
                        defaultValue={product?.description}
                        placeholder="Ürün detayları, özel dokuma bilgileri, bakım talimatları..."
                    />
                    {state.errors?.description && <p className="text-red-500 text-sm">{state.errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Marka</label>
                        <select
                            name="brandId"
                            value={selectedBrandId}
                            onChange={(e) => handleBrandChange(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none font-medium"
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
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            disabled={!selectedBrandId}
                            className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            required
                        >
                            {!selectedBrandId ? (
                                <option value="">Önce Marka Seçiniz</option>
                            ) : filteredCategories.length === 0 ? (
                                <option value="" disabled>Bu markaya ait henüz koleksiyon bulunmuyor</option>
                            ) : (
                                <>
                                    <option value="">Koleksiyon Seçiniz</option>
                                    {filteredCategories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </>
                            )}
                        </select>
                        {state.errors?.categoryId && <p className="text-red-500 text-sm">{state.errors.categoryId}</p>}
                    </div>
                </div>

                {/* Multiple Images Section */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold">Ürün Görselleri</h2>
                            <p className="text-xs text-muted-foreground">Birden fazla görsel URL'si ekleyebilirsiniz. İlk sıradaki görsel ana kapak resmi olarak kullanılacaktır.</p>
                        </div>
                        <button
                            type="button"
                            onClick={addImageField}
                            className="text-xs font-bold uppercase tracking-widest text-accent hover:underline flex items-center gap-1"
                        >
                            <Plus size={14} /> Görsel Ekle
                        </button>
                    </div>

                    {/* Hidden input to pass multi-image array as JSON string */}
                    <input type="hidden" name="images" value={JSON.stringify(validImages)} />

                    <div className="space-y-3">
                        {imageUrls.map((url, index) => (
                            <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-secondary/30 rounded-2xl border border-border/50">
                                {/* Thumbnail Preview */}
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary border border-border shrink-0 flex items-center justify-center relative">
                                    {url.trim() ? (
                                        <img src={url} alt={`Önizleme ${index + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                                    ) : (
                                        <ImageIcon className="text-muted-foreground" size={20} />
                                    )}
                                    {index === 0 && (
                                        <span className="absolute top-1 left-1 bg-accent text-white p-0.5 rounded-full" title="Ana Görsel">
                                            <Star size={10} fill="currentColor" />
                                        </span>
                                    )}
                                </div>

                                {/* URL Input */}
                                <div className="relative flex-1">
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                        className="w-full h-11 px-4 rounded-xl bg-background border border-border focus:border-accent outline-none text-sm"
                                        placeholder={`Görsel URL ${index + 1} (https://...)`}
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {index !== 0 && url.trim() && (
                                        <button
                                            type="button"
                                            onClick={() => setAsPrimaryImage(index)}
                                            className="px-3 py-2 text-xs font-semibold bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-white transition-colors"
                                            title="Ana Görsel Yap"
                                        >
                                            Ana Görsel Yap
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImageField(index)}
                                        className="p-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                        title="Görseli Sil"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
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
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stok Adedi</label>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent cursor-pointer flex items-center gap-1 hover:underline">
                                        <input
                                            type="checkbox"
                                            checked={variant.stock === '-1'}
                                            onChange={(e) => handleVariantChange(index, 'stock', e.target.checked ? '-1' : '0')}
                                            className="rounded border-border text-accent focus:ring-accent accent-accent"
                                        />
                                        <span>Sınırsız</span>
                                    </label>
                                </div>
                                <input
                                    type={variant.stock === '-1' ? 'text' : 'number'}
                                    value={variant.stock === '-1' ? 'Sınırsız (∞)' : variant.stock}
                                    disabled={variant.stock === '-1'}
                                    onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                    className={`w-full h-10 px-3 rounded-lg border outline-none font-medium transition-colors ${
                                        variant.stock === '-1'
                                            ? 'bg-accent/10 border-accent/30 text-accent font-bold cursor-not-allowed'
                                            : 'bg-background border-border focus:border-accent'
                                    }`}
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
