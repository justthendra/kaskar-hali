import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    const products = await prisma.product.findMany({
        include: {
            brand: true,
            category: true,
            variants: true
        },
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, description, images, brandId, categoryId, variants } = await req.json(); // variants: { size, price, stock }[]

        const product = await prisma.product.create({
            data: {
                name,
                description,
                images,
                brandId,
                categoryId,
                variants: {
                    create: variants.map((v: any) => ({
                        size: v.size,
                        price: parseFloat(v.price),
                        stock: parseInt(v.stock)
                    }))
                }
            },
            include: { variants: true }
        });
        return NextResponse.json(product);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
