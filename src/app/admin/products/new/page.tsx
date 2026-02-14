
import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
    const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

    return <ProductForm brands={brands} categories={categories} />;
}
