import prisma from "@/lib/prisma";
import CategoryManager from "@/components/admin/CategoryManager";

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    const brands = await prisma.brand.findMany({
        include: {
            categories: {
                include: {
                    _count: { select: { products: true } }
                },
                orderBy: { name: 'asc' }
            }
        },
        orderBy: { name: 'asc' }
    });

    return <CategoryManager brands={brands} />;
}
