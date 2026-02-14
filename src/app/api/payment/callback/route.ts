import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

async function handleCallback(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const status = searchParams.get('status');
        const orderNumber = searchParams.get('orderNumber') || '';

        // Log ALL received data for debugging
        let allFormFields: Record<string, string> = {};
        try {
            const formData = await req.formData();
            formData.forEach((value, key) => {
                allFormFields[key] = value.toString();
            });
        } catch {
            // GET requests won't have form data
        }

        // Also check URL params for any PaynKolay data
        searchParams.forEach((value, key) => {
            if (!allFormFields[key]) {
                allFormFields[key] = value;
            }
        });

        console.log('=== PaynKolay Callback Debug ===');
        console.log('Method:', req.method);
        console.log('Status:', status);
        console.log('OrderNumber:', orderNumber);
        console.log('All received fields:', JSON.stringify(allFormFields, null, 2));
        console.log('================================');

        // Try to get orderNumber from various sources
        const finalOrderNumber = orderNumber 
            || allFormFields['clientRefCode'] 
            || allFormFields['orderNumber']
            || allFormFields['CLIENT_REFERENCE_CODE']
            || allFormFields['REFERENCE_CODE']
            || '';

        if (!finalOrderNumber) {
            return NextResponse.redirect(new URL('/odeme/sonuc?status=fail&message=Sipariş referansı bulunamadı', req.url));
        }

        const order = await prisma.order.findUnique({
            where: { orderNumber: finalOrderNumber },
        });

        if (!order) {
            return NextResponse.redirect(new URL('/odeme/sonuc?status=fail&message=Sipariş bulunamadı', req.url));
        }

        const paymentId = allFormFields['transactionId'] || allFormFields['paymentId'] || '';
        const resultCode = allFormFields['resultCode'] || allFormFields['ErrorCode'] || '';
        const resultMessage = allFormFields['resultMessage'] || allFormFields['ErrorMSG'] || allFormFields['error_message'] || '';

        if (status === 'success' && (resultCode === '00' || resultCode === '0' || resultCode === '' || !resultCode)) {
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: 'PAID',
                    paymentId: paymentId || null,
                    status: 'CONFIRMED',
                },
            });

            return NextResponse.redirect(
                new URL(`/odeme/sonuc?status=success&orderNumber=${order.orderNumber}`, req.url)
            );
        } else {
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: 'FAILED',
                    paymentId: paymentId || null,
                },
            });

            const errorMsg = resultMessage || 'Ödeme işlemi başarısız oldu.';
            return NextResponse.redirect(
                new URL(`/odeme/sonuc?status=fail&orderNumber=${order.orderNumber}&message=${encodeURIComponent(errorMsg)}`, req.url)
            );
        }
    } catch (error) {
        console.error('Payment callback error:', error);
        return NextResponse.redirect(new URL('/odeme/sonuc?status=fail&message=Beklenmeyen bir hata oluştu', req.url));
    }
}

export async function POST(req: NextRequest) {
    return handleCallback(req);
}

export async function GET(req: NextRequest) {
    return handleCallback(req);
}
