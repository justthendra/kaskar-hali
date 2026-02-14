
import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            brand: true,
            category: true,
            variants: true
        }
    });

    if (!product) {
        notFound();
    }

    const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

    return <ProductForm brands={brands} categories={categories} product={product} />;
}
