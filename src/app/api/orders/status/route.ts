import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return NextResponse.json({ error: 'orderId ve status gereklidir.' }, { status: 400 });
        }

        if (!VALID_STATUSES.includes(status)) {
            return NextResponse.json({ error: 'Geçersiz sipariş durumu.' }, { status: 400 });
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error('Order status update error:', error);
        return NextResponse.json({ error: 'Sipariş durumu güncellenirken hata oluştu.' }, { status: 500 });
    }
}
