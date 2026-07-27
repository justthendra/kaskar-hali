'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    productId: string;
    variantId: string;
    name: string;
    price: number;
    image: string;
    size: string;
    quantity: number;
    maxStock: number;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    addToCart: (item: CartItem) => void;
    removeFromCart: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (newItem: CartItem) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.variantId === newItem.variantId);
            if (existingItem) {
                return currentItems.map(item =>
                    item.variantId === newItem.variantId
                        ? {
                            ...item,
                            quantity: item.maxStock === -1
                                ? item.quantity + newItem.quantity
                                : Math.min(item.quantity + newItem.quantity, item.maxStock)
                          }
                        : item
                );
            }
            return [...currentItems, newItem];
        });
        setIsOpen(true); // Open cart when item is added
    };

    const removeFromCart = (variantId: string) => {
        setItems(currentItems => currentItems.filter(item => item.variantId !== variantId));
    };

    const updateQuantity = (variantId: string, quantity: number) => {
        setItems(currentItems =>
            currentItems.map(item =>
                item.variantId === variantId
                    ? {
                        ...item,
                        quantity: item.maxStock === -1
                            ? Math.max(1, quantity)
                            : Math.max(1, Math.min(quantity, item.maxStock))
                      }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('cart');
    };

    const toggleCart = () => setIsOpen(prev => !prev);

    const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, isOpen, addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
