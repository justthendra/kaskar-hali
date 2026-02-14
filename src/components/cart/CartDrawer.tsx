'use client';

import { useCart } from '@/context/CartContext';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
    const { items, isOpen, toggleCart, removeFromCart, updateQuantity, totalPrice } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        toggleCart();
        router.push('/siparis');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-accent" />
                                <h2 className="text-xl font-bold tracking-tight">Alışveriş Sepeti <span className="text-muted-foreground text-sm font-normal">({items.length} Ürün)</span></h2>
                            </div>
                            <button onClick={toggleCart} className="p-2 hover:bg-secondary rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
                                    <ShoppingBag size={48} className="opacity-20" />
                                    <p>Sepetinizde henüz ürün bulunmamaktadır.</p>
                                    <button onClick={toggleCart} className="text-accent font-bold hover:underline">Alışverişe Başla</button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.variantId} className="flex gap-4 group">
                                        <div className="relative w-24 h-32 rounded-xl overflow-hidden border border-border shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-sm line-clamp-2">{item.name}</h3>
                                                    <button onClick={() => removeFromCart(item.variantId)} className="text-muted-foreground hover:text-red-500 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">Ebat: <span className="text-foreground font-medium">{item.size}</span></p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 bg-secondary rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                                        className="w-6 h-6 flex items-center justify-center hover:bg-background rounded-md transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                                        className="w-6 h-6 flex items-center justify-center hover:bg-background rounded-md transition-colors"
                                                        disabled={item.quantity >= item.maxStock}
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <div className="text-sm font-black">
                                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.price * item.quantity)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-border bg-secondary/20 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Ara Toplam</span>
                                        <span className="font-bold">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalPrice)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Kargo</span>
                                        <span className="text-green-600 font-bold">Ücretsiz</span>
                                    </div>
                                    <div className="pt-4 border-t border-border flex items-center justify-between">
                                        <span className="font-black text-lg">Toplam</span>
                                        <span className="font-black text-2xl text-accent">
                                            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalPrice)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full h-14 bg-accent hover:bg-[#b08d2b] text-white rounded-xl font-black uppercase tracking-widest transition-colors shadow-lg shadow-accent/20"
                                >
                                    Sepeti Onayla
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
