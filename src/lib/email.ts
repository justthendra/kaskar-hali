import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendVerificationEmail(email: string, code: string) {
    const mailOptions = {
        from: process.env.SMTP_FROM || `Kaşkar Halı <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Kaşkar Halı - E-posta Doğrulama Kodu',
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #fafafa;">
                <div style="background: white; border-radius: 16px; padding: 40px 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border: 1px solid #eee;">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <h1 style="font-size: 20px; font-weight: 900; color: #111; letter-spacing: -0.5px; margin: 0;">
                            KAŞKAR HALI
                        </h1>
                        <p style="color: #888; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 2px;">
                            E-posta Doğrulama
                        </p>
                    </div>

                    <p style="color: #333; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                        Merhaba,<br/>
                        Hesabınızı doğrulamak için aşağıdaki kodu kullanın:
                    </p>

                    <div style="background: #f5f5f5; border: 2px dashed #ddd; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                        <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #111; font-family: monospace;">
                            ${code}
                        </span>
                    </div>

                    <p style="color: #888; font-size: 13px; text-align: center; margin-top: 24px;">
                        Bu kod <strong>10 dakika</strong> içinde geçerliliğini yitirecektir.
                    </p>

                    <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px;" />

                    <p style="color: #aaa; font-size: 11px; text-align: center;">
                        Bu e-postayı siz talep etmediyseniz, lütfen dikkate almayın.
                    </p>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
}

export function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
