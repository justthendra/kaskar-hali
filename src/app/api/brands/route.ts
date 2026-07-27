import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    const brands = await prisma.brand.findMany({
        include: {
            _count: { select: { products: true, categories: true } }
        },
        orderBy: { name: 'asc' }
    });
    return NextResponse.json(brands);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, logo } = await req.json();
        const brand = await prisma.brand.create({
            data: { name, logo }
        });
        return NextResponse.json(brand);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
    }
}
