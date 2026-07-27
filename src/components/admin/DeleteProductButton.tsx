'use client';

import { useState, useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteProduct } from '@/lib/actions/products';

interface DeleteProductButtonProps {
    productId: string;
    productName: string;
}

export default function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [isConfirming, setIsConfirming] = useState(false);

    const handleDelete = () => {
        startTransition(async () => {
            const res = await deleteProduct(productId);
            if (res && 'error' in res && res.error) {
                alert(res.error);
            }
            setIsConfirming(false);
        });
    };

    if (isConfirming) {
        return (
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    className="px-3 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 disabled:opacity-50 shadow-sm"
                >
                    {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                    Evet, Sil
                </button>
                <button
                    type="button"
                    onClick={() => setIsConfirming(false)}
                    disabled={isPending}
                    className="px-3 py-1.5 text-xs font-medium bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                    Vazgeç
                </button>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setIsConfirming(true)}
            className="p-2 rounded-lg hover:bg-red-500/10 text-red-500/70 hover:text-red-500 transition-colors"
            title={`${productName} ürününü sil`}
        >
            <Trash2 size={18} />
        </button>
    );
}
