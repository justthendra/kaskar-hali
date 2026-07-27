'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- Brands ---

export async function createBrand(formData: FormData) {
    const name = formData.get('name') as string;
    const logo = formData.get('logo') as string;

    if (!name || !name.trim()) return { message: 'Marka adı zorunludur.' };

    try {
        await prisma.brand.create({
            data: { name: name.trim(), logo: logo?.trim() || null }
        });
        revalidatePath('/admin/brands');
        revalidatePath('/admin/categories');
        revalidatePath('/markalar');
        revalidatePath('/koleksiyonlar');
        return { message: 'Marka başarıyla oluşturuldu.' };
    } catch (error) {
        console.error('Error creating brand:', error);
        return { message: 'Marka oluşturulurken hata oluştu.' };
    }
}

export async function deleteBrand(id: string) {
    try {
        const productCount = await prisma.product.count({ where: { brandId: id } });
        if (productCount > 0) {
            return { error: `Bu markaya ait ${productCount} adet ürün bulunuyor. Markayı silmeden önce ürünleri silmeli veya başka bir markaya taşımalısınız.` };
        }

        // Delete associated categories first
        await prisma.category.deleteMany({ where: { brandId: id } });
        await prisma.brand.delete({ where: { id } });

        revalidatePath('/admin/brands');
        revalidatePath('/admin/categories');
        revalidatePath('/markalar');
        revalidatePath('/koleksiyonlar');
        return { success: true };
    } catch (error) {
        console.error('Error deleting brand:', error);
        return { error: 'Marka silinirken bir hata oluştu.' };
    }
}

// --- Categories (Collections) ---

export async function createCategory(formData: FormData) {
    const name = formData.get('name') as string;
    const brandId = formData.get('brandId') as string;

    if (!name || !name.trim() || !brandId) return { message: 'Koleksiyon adı ve Marka seçimi zorunludur.' };

    try {
        await prisma.category.create({
            data: { name: name.trim(), brandId }
        });
        revalidatePath('/admin/categories');
        revalidatePath('/koleksiyonlar');
        revalidatePath('/urunler');
        return { message: 'Koleksiyon başarıyla oluşturuldu.' };
    } catch (error) {
        console.error('Error creating category:', error);
        return { message: 'Koleksiyon oluşturulurken hata oluştu.' };
    }
}

export async function deleteCategory(id: string) {
    try {
        const productCount = await prisma.product.count({ where: { categoryId: id } });
        if (productCount > 0) {
            return { error: `Bu koleksiyona ait ${productCount} adet ürün bulunuyor. Koleksiyonu silmeden önce ürünleri silmeli veya başka bir koleksiyona taşımalısınız.` };
        }

        await prisma.category.delete({ where: { id } });

        revalidatePath('/admin/categories');
        revalidatePath('/koleksiyonlar');
        revalidatePath('/urunler');
        return { success: true };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { error: 'Koleksiyon silinirken bir hata oluştu.' };
    }
}
