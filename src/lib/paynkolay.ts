import crypto from 'crypto';

// PaynKolay configuration
const PAYNKOLAY_SX_TOKEN = process.env.PAYNKOLAY_SX_TOKEN || '';
const PAYNKOLAY_MERCHANT_SECRET = process.env.PAYNKOLAY_MERCHANT_SECRET || '';
const PAYNKOLAY_ENDPOINT = process.env.PAYNKOLAY_ENDPOINT || 'https://paynkolay.nkolayislem.com.tr/Vpos';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://kaskarhali.vercel.app';

/**
 * Generate hash for PaynKolay payment request
 * Formula: SHA512(sx|clientRefCode|amount|successUrl|failUrl|rnd|customerKey|merchantSecretKey) → Base64
 */
export function generatePaynKolayHash(params: {
    sx: string;
    clientRefCode: string;
    amount: string;
    successUrl: string;
    failUrl: string;
    rnd: string;
    merchantSecretKey: string;
}): string {
    const customerKey = '';

    const hashString = [
        params.sx,
        params.clientRefCode,
        params.amount,
        params.successUrl,
        params.failUrl,
        params.rnd,
        customerKey,
        params.merchantSecretKey,
    ].join('|');

    // SHA512 hash → Base64 (Standard PaynKolay Hash V2)
    const hash = crypto.createHash('sha512').update(hashString, 'utf-8').digest('base64');

    return hash;
}

/**
 * Create PaynKolay payment form data
 */
export function createPaymentFormData(order: {
    id: string;
    orderNumber: string;
    totalPrice: number;
    customerName: string;
    customerEmail?: string | null;
    customerPhone: string;
    customerTc: string;
}) {
    const rnd = Date.now().toString();
    // PaynKolay expects amount in kuruş (cents) as integer string
    // e.g. 100.00 TL = "10000", 70.00 TL = "7000"
    const amount = Math.round(order.totalPrice).toString();
    const successUrl = `${BASE_URL}/api/payment/callback?status=success&orderNumber=${order.orderNumber}`;
    const failUrl = `${BASE_URL}/api/payment/callback?status=fail&orderNumber=${order.orderNumber}`;
    const clientRefCode = order.orderNumber;
    const customerKey = '';

    const sx = PAYNKOLAY_SX_TOKEN;
    const secretKey = PAYNKOLAY_MERCHANT_SECRET;

    if (!sx || !secretKey) {
        console.error('PaynKolay: SX_TOKEN veya MERCHANT_SECRET ayarlanmamış!');
    }

    const hashData = generatePaynKolayHash({
        sx,
        clientRefCode,
        amount,
        successUrl,
        failUrl,
        rnd,
        merchantSecretKey: secretKey,
    });

    // Determine environment from endpoint URL
    const isTest = PAYNKOLAY_ENDPOINT.includes('test');

    const formData = {
        sx,
        clientRefCode,
        amount,
        currencyNumber: '949', // TRY
        successUrl,
        failUrl,
        rnd,
        customerKey,
        hashDataV2: hashData,
        transactionType: 'Sales',
        description: `Siparis ${order.orderNumber}`,
        installmentCount: '1',
        use3D: '1',
        clientIp: '127.0.0.1',
        environment: isTest ? 'T' : 'P',
        customerName: order.customerName,
        customerEmail: order.customerEmail || '',
        customerPhone: order.customerPhone.replace(/^0/, '').replace(/^\+90/, ''),
    };

    return {
        endpoint: PAYNKOLAY_ENDPOINT,
        formData,
    };
}

export { PAYNKOLAY_ENDPOINT, PAYNKOLAY_SX_TOKEN, PAYNKOLAY_MERCHANT_SECRET, BASE_URL };
