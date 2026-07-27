'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle, Truck, XCircle, Loader2 } from 'lucide-react';

const statusOptions = [
    { value: 'PENDING', label: 'Beklemede', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: Clock },
    { value: 'CONFIRMED', label: 'Onaylandı', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: CheckCircle },
    { value: 'SHIPPED', label: 'Kargoda', color: 'text-purple-600 bg-purple-50 border-purple-200', icon: Truck },
    { value: 'DELIVERED', label: 'Teslim Edildi', color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle },
    { value: 'CANCELLED', label: 'İptal', color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle },
];

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState(currentStatus);

    const currentOption = statusOptions.find(s => s.value === status) || statusOptions[0];

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setStatus(newStatus);

        try {
            const res = await fetch('/api/orders/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus }),
            });

            if (!res.ok) {
                setStatus(currentStatus); // revert on error
                alert('Durum güncellenemedi!');
                return;
            }

            startTransition(() => {
                router.refresh();
            });
        } catch {
            setStatus(currentStatus); // revert on error
            alert('Bir hata oluştu!');
        }
    };

    return (
        <div className="relative inline-flex items-center">
            {isPending && (
                <Loader2 size={14} className="animate-spin absolute -left-5 text-muted-foreground" />
            )}
            <select
                value={status}
                onChange={handleChange}
                disabled={isPending}
                className={`appearance-none cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold border outline-none transition-all ${currentOption.color} disabled:opacity-50`}
            >
                {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
