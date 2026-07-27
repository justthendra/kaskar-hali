import prisma from "@/lib/prisma";
import { createPaymentFormData } from "@/lib/paynkolay";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ error: 'Sipariş ID gereklidir.' }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 });
        }

        if (order.paymentStatus === 'PAID') {
            return NextResponse.json({ error: 'Bu sipariş zaten ödenmiş.' }, { status: 400 });
        }

        const paymentData = createPaymentFormData({
            id: order.id,
            orderNumber: order.orderNumber,
            totalPrice: order.totalPrice,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            customerTc: order.customerTc,
        });

        return NextResponse.json({
            success: true,
            endpoint: paymentData.endpoint,
            formData: paymentData.formData,
        });
    } catch (error) {
        console.error('Payment initiation error:', error);
        return NextResponse.json({ error: 'Ödeme başlatılırken bir hata oluştu.' }, { status: 500 });
    }
}
