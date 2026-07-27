import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateUsername } from "unique-username-generator";
import { sendVerificationEmail, generateVerificationCode } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Tüm alanlar zorunludur.' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Şifre en az 6 karakter olmalıdır.' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            // If user exists but not verified, resend code
            if (!existingUser.emailVerified) {
                const code = generateVerificationCode();
                const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

                // Delete old tokens for this email
                await prisma.verificationToken.deleteMany({
                    where: { email }
                });

                // Create new token
                await prisma.verificationToken.create({
                    data: { email, token: code, expiresAt }
                });

                // Send email
                await sendVerificationEmail(email, code);

                return NextResponse.json({
                    success: true,
                    needsVerification: true,
                    message: 'Bu e-posta ile kayıt mevcut. Doğrulama kodu tekrar gönderildi.'
                });
            }

            return NextResponse.json({ error: 'Bu e-posta adresi zaten kayıtlı.' }, { status: 400 });
        }

        // Create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const username = generateUsername("-");

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                username,
                role: 'USER',
                emailVerified: false
            }
        });

        // Generate verification code
        const code = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.verificationToken.create({
            data: { email, token: code, expiresAt }
        });

        // Send verification email
        await sendVerificationEmail(email, code);

        return NextResponse.json({
            success: true,
            needsVerification: true,
            message: 'Kayıt başarılı! Doğrulama kodu e-posta adresinize gönderildi.'
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Bir hata oluştu. Lütfen tekrar deneyin.' }, { status: 500 });
    }
}
