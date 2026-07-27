import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    title: "Kaşkar Halı | Zerafetin Merkezi",
    description: "Lüks ve modern halı koleksiyonları.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
            <body className={`${outfit.variable} antialiased`} suppressHydrationWarning={true}>
                <Providers>
                    <Navbar />
                    <main className="min-h-screen pt-24 pb-20">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
