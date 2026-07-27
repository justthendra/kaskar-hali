import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ error: 'E-posta ve doğrulama kodu gereklidir.' }, { status: 400 });
        }

        // Find the verification token
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                email,
                token: code,
            }
        });

        if (!verificationToken) {
            return NextResponse.json({ error: 'Geçersiz doğrulama kodu.' }, { status: 400 });
        }

        // Check if token has expired
        if (new Date() > verificationToken.expiresAt) {
            // Delete expired token
            await prisma.verificationToken.delete({
                where: { id: verificationToken.id }
            });
            return NextResponse.json({ error: 'Doğrulama kodunun süresi dolmuş. Lütfen yeni kod isteyin.' }, { status: 400 });
        }

        // Verify the user
        await prisma.user.update({
            where: { email },
            data: { emailVerified: true }
        });

        // Delete all tokens for this email
        await prisma.verificationToken.deleteMany({
            where: { email }
        });

        return NextResponse.json({
            success: true,
            message: 'E-posta adresiniz başarıyla doğrulandı!'
        });
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ error: 'Doğrulama sırasında bir hata oluştu.' }, { status: 500 });
    }
}
