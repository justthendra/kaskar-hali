import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { sendVerificationEmail, generateVerificationCode } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'E-posta adresi gereklidir.' }, { status: 400 });
        }

        // Check if user exists and is not verified
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ error: 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.' }, { status: 404 });
        }

        if (user.emailVerified) {
            return NextResponse.json({ error: 'Bu e-posta adresi zaten doğrulanmış.' }, { status: 400 });
        }

        // Check cooldown (last token created < 60 seconds ago)
        const lastToken = await prisma.verificationToken.findFirst({
            where: { email },
            orderBy: { createdAt: 'desc' }
        });

        if (lastToken) {
            const timeSinceLastSend = Date.now() - lastToken.createdAt.getTime();
            if (timeSinceLastSend < 60000) { // 60 seconds
                const remainingSeconds = Math.ceil((60000 - timeSinceLastSend) / 1000);
                return NextResponse.json({
                    error: `Lütfen ${remainingSeconds} saniye bekleyin.`,
                    cooldown: remainingSeconds
                }, { status: 429 });
            }
        }

        // Delete old tokens
        await prisma.verificationToken.deleteMany({
            where: { email }
        });

        // Generate and send new code
        const code = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.verificationToken.create({
            data: { email, token: code, expiresAt }
        });

        await sendVerificationEmail(email, code);

        return NextResponse.json({
            success: true,
            message: 'Yeni doğrulama kodu gönderildi.'
        });
    } catch (error) {
        console.error('Resend code error:', error);
        return NextResponse.json({ error: 'Kod gönderilirken bir hata oluştu.' }, { status: 500 });
    }
}
