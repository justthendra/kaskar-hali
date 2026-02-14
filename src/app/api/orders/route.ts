import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

function generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `KH${year}${month}${day}-${random}`;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { customerName, customerEmail, customerPhone, customerTc, customerAddress, items, note } = body;

        // Validation
        if (!customerName || !customerPhone || !customerTc || !customerAddress) {
            return NextResponse.json({ error: 'Lütfen tüm zorunlu alanları doldurun.' }, { status: 400 });
        }

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Sepetiniz boş.' }, { status: 400 });
        }

        // TC validation (11 digits)
        if (!/^\d{11}$/.test(customerTc)) {
            return NextResponse.json({ error: 'Geçerli bir TC Kimlik Numarası girin (11 haneli).' }, { status: 400 });
        }

        // Phone validation
        if (!/^[\d\s\+\-\(\)]{10,15}$/.test(customerPhone)) {
            return NextResponse.json({ error: 'Geçerli bir telefon numarası girin.' }, { status: 400 });
        }

        // Calculate total
        const totalPrice = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0);

        // Generate unique order number
        let orderNumber = generateOrderNumber();
        let exists = await prisma.order.findUnique({ where: { orderNumber } });
        while (exists) {
            orderNumber = generateOrderNumber();
            exists = await prisma.order.findUnique({ where: { orderNumber } });
        }

        // Find or create customer by TC
        const nameParts = customerName.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const customer = await prisma.customer.upsert({
            where: { tcNo: customerTc },
            update: {
                phone: customerPhone || undefined,
                email: customerEmail || undefined,
                address: customerAddress || undefined,
            },
            create: {
                tcNo: customerTc,
                firstName,
                lastName,
                phone: customerPhone || null,
                email: customerEmail || null,
                address: customerAddress || null,
            },
        });

        // Create order with items
        const order = await prisma.order.create({
            data: {
                orderNumber,
                customerName,
                customerEmail: customerEmail || null,
                customerPhone,
                customerTc,
                customerAddress,
                totalPrice,
                note: note || null,
                status: 'PENDING',
                customerId: customer.id,
                items: {
                    create: items.map((item: { name: string; image: string; size: string; price: number; quantity: number }) => ({
                        productName: item.name,
                        productImage: item.image,
                        variantSize: item.size,
                        price: item.price,
                        quantity: item.quantity,
                    }))
                }
            },
            include: { items: true }
        });

        return NextResponse.json({ success: true, orderNumber: order.orderNumber, orderId: order.id });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ error: 'Sipariş oluşturulurken bir hata oluştu.' }, { status: 500 });
    }
}
