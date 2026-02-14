import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get('brandId');

    const where = brandId ? { brandId } : {};

    const categories = await prisma.category.findMany({
        where,
        include: { brand: true, _count: { select: { products: true } } },
        orderBy: { name: 'asc' }
    });
    return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, brandId } = await req.json();
        
        if (!brandId) {
            return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: { name, brandId },
            include: { brand: true }
        });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
