'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Ruler, Share2, Info, Store, ChevronDown, FileText, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { parseProductImages, getFirstProductImage } from '@/lib/product-utils';

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
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    const imageList = parseProductImages(product.images);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const activeImage = imageList[selectedImageIndex] || imageList[0] || '/placeholder-carpet.jpg';

    const handleAddToCart = () => {
        if (!selectedVariant) return;
        addToCart({
            productId: product.id,
            variantId: selectedVariant.id,
            name: product.name,
            price: selectedVariant.price,
            image: getFirstProductImage(product.images),
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
                className="space-y-4"
            >
                <div
                    onClick={() => setIsZoomOpen(true)}
                    className="aspect-3/4 overflow-hidden bg-secondary border border-border/30 relative shadow-2xl shadow-black/5 group flex items-center justify-center p-2 cursor-zoom-in"
                    title="Fotoğrafı büyütmek için tıklayın"
                >
                    <img
                        key={activeImage}
                        src={activeImage}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Zoom Icon Badge */}
                    <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md text-white p-2.5 shadow-lg opacity-80 group-hover:opacity-100 transition-opacity">
                        <ZoomIn size={18} />
                    </div>

                    <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
                </div>

                {/* Multiple Images Thumbnail Gallery */}
                {imageList.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-2 scrollbar-none">
                        {imageList.map((imgUrl, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setSelectedImageIndex(index)}
                                className={`relative w-20 h-20 overflow-hidden border-2 transition-all duration-300 shrink-0 bg-secondary/40 ${
                                    selectedImageIndex === index
                                        ? 'border-accent scale-105 shadow-md ring-2 ring-accent/20'
                                        : 'border-border/50 hover:border-border opacity-70 hover:opacity-100'
                                }`}
                            >
                                <img
                                    src={imgUrl}
                                    alt={`${product.name} - Görsel ${index + 1}`}
                                    className="w-full h-full object-contain p-1"
                                />
                            </button>
                        ))}
                    </div>
                )}
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

                {/* Collapsible Product Description Accordion */}
                <div className="border border-border/60 rounded-2xl overflow-hidden bg-secondary/20 mb-8 transition-all shadow-xs">
                    <button
                        type="button"
                        onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                        className="w-full p-4 flex items-center justify-between font-bold text-sm text-foreground hover:bg-secondary/40 transition-colors text-left"
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                                <FileText size={16} />
                            </div>
                            <span className="font-bold">Ürün Açıklaması ve Detayları</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{isDescriptionOpen ? 'Daralt' : 'Genişlet'}</span>
                            <ChevronDown
                                size={16}
                                className={`transition-transform duration-300 ${isDescriptionOpen ? 'rotate-180 text-accent' : ''}`}
                            />
                        </div>
                    </button>

                    <AnimatePresence initial={false}>
                        {isDescriptionOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div
                                    className="p-5 border-t border-border/40 text-muted-foreground text-sm leading-relaxed font-light space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_b]:font-bold [&_b]:text-foreground [&_strong]:font-bold [&_strong]:text-foreground [&_i]:italic [&_em]:italic [&_u]:underline [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-3 [&_h3]:mb-1"
                                    dangerouslySetInnerHTML={{ __html: product.description || '' }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

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

                            {/* Custom Size Notice Banner */}
                            <div className="mt-5 p-4 rounded-2xl bg-accent/10 border border-accent/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
                                        <Ruler size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-foreground">Özel Ölçü Siparişi</h4>
                                        <p className="text-xs text-muted-foreground font-light">
                                            Aradığınız ebat listede yok mu? Özel ölçü talepleriniz için mağazamızla iletişime geçebilirsiniz.
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href="/iletisim"
                                    className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold whitespace-nowrap hover:bg-[#b08d2b] transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
                                >
                                    <Store size={14} />
                                    <span>İletişime Geçin</span>
                                </Link>
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
                            {selectedVariant?.stock !== undefined && (selectedVariant.stock > 0 || selectedVariant.stock === -1) ? (
                                <div className="px-4 py-2 bg-green-500/10 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {selectedVariant.stock === -1 ? 'Sınırsız Stok' : 'Stokta Var'}
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
                        disabled={!selectedVariant || (selectedVariant.stock !== -1 && selectedVariant.stock === 0)}
                    >
                        <ShoppingBag className="group-hover:scale-110 transition-transform duration-300" />
                        <span>Sepete Ekle</span>
                    </button>
                </div>
            </motion.div>

            {/* Fullscreen Image Zoom / Lightbox Modal */}
            <AnimatePresence>
                {isZoomOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsZoomOpen(false)}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => setIsZoomOpen(false)}
                            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center z-10"
                            title="Kapat"
                        >
                            <X size={24} />
                        </button>

                        {/* Previous Image Button */}
                        {imageList.length > 1 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImageIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
                                }}
                                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center z-10"
                                title="Önceki Görsel"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}

                        {/* Next Image Button */}
                        {imageList.length > 1 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImageIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
                                }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center z-10"
                                title="Sonraki Görsel"
                            >
                                <ChevronRight size={24} />
                            </button>
                        )}

                        {/* Zoomed Image */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-7xl max-h-[90vh] flex items-center justify-center p-2 cursor-default"
                        >
                            <img
                                src={activeImage}
                                alt={product.name}
                                className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
