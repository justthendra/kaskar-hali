'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Ruler, Share2, Info } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface Variant {
    id: string;
    size: string;
    price: number;
    stock: number;
}

interface Product {
    id: string;
    name: string;
    description: string;
    images: string;
    brand: { name: string; logo?: string | null };
    variants: Variant[];
}

export default function ProductDetailClient({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
        product.variants.length > 0 ? product.variants[0] : null
    );

    const handleAddToCart = () => {
        if (!selectedVariant) return;
        addToCart({
            productId: product.id,
            variantId: selectedVariant.id,
            name: product.name,
            price: selectedVariant.price,
            image: product.images, // Using the main image string directly
            size: selectedVariant.size,
            quantity: 1,
            maxStock: selectedVariant.stock
        });
        toast.success(product.name + ' sepete eklendi');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Image Gallery Section */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative group"
            >
                <div className="aspect-3/4 rounded-4xl overflow-hidden bg-secondary border border-border/30 relative shadow-2xl shadow-black/5">
                    <img
                        src={product.images}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />

                    {/* Floating Brand Tag */}
                    <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg">
                        <span className="text-xs font-black uppercase tracking-widest text-black">
                            {product.brand.name}
                        </span>
                    </div>

                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
            </motion.div>

            {/* Product Info Section */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col justify-center"
            >
                <div className="flex items-center gap-4 mb-6">
                    <span className="h-px w-12 bg-accent" />
                    <span className="text-accent text-xs font-bold uppercase tracking-[0.3em]">{product.brand.name}</span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight mb-8 leading-tight">
                    {product.name}
                </h1>

                <p className="text-muted-foreground text-lg leading-relaxed font-light mb-12 border-l-2 border-accent/20 pl-6">
                    {product.description}
                </p>

                {/* Variant Selection */}
                {product.variants.length > 0 ? (
                    <div className="space-y-8 mb-12">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold uppercase tracking-wider text-foreground">Ebat Seçiniz</span>
                                <button className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors">
                                    <Ruler size={14} /> Ölçü Rehberi
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant)}
                                        disabled={variant.stock === 0}
                                        className={`
                                            relative h-14 rounded-2xl font-bold text-sm transition-all duration-300 border
                                            ${selectedVariant?.id === variant.id
                                                ? 'bg-foreground text-background border-foreground shadow-lg'
                                                : 'bg-background text-foreground border-border hover:border-accent hover:text-accent'
                                            }
                                            ${variant.stock === 0 ? 'opacity-40 cursor-not-allowed bg-secondary' : ''}
                                        `}
                                    >
                                        {variant.size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Display */}
                        <div className="bg-secondary/50 p-8 rounded-3xl border border-border/50 flex items-center justify-between">
                            <div>
                                <span className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Toplam Tutar</span>
                                <div className="text-3xl font-black text-foreground tracking-tight">
                                    {selectedVariant
                                        ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(selectedVariant.price)
                                        : 'Varyant Seçiniz'}
                                </div>
                            </div>
                            {selectedVariant?.stock !== undefined && selectedVariant.stock > 0 ? (
                                <div className="px-4 py-2 bg-green-500/10 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Stokta Var
                                </div>
                            ) : (
                                <div className="px-4 py-2 bg-red-500/10 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Tükendi
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-6 bg-yellow-500/10 text-yellow-600 rounded-2xl mb-8 flex items-center gap-3">
                        <Info size={20} />
                        <span className="font-medium text-sm">Bu ürünün stok bilgisi bulunmamaktadır.</span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 h-16 bg-accent text-white rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-[#b08d2b] transition-all duration-300 shadow-xl shadow-accent/20 flex items-center justify-center gap-3 group"
                        disabled={!selectedVariant || selectedVariant.stock === 0}
                    >
                        <ShoppingBag className="group-hover:scale-110 transition-transform duration-300" />
                        <span>Sepete Ekle</span>
                    </button>
                    <button className="h-16 w-16 rounded-full border border-border hover:border-accent hover:text-accent flex items-center justify-center transition-all duration-300 bg-background">
                        <Share2 size={20} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
