'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- Brands ---

export async function createBrand(formData: FormData) {
    const name = formData.get('name') as string;
    const logo = formData.get('logo') as string;

    if (!name) return { message: 'Marka adı zorunludur.' };

    try {
        await prisma.brand.create({
            data: { name, logo }
        });
        revalidatePath('/admin/brands');
        return { message: 'Marka başarıyla oluşturuldu.' };
    } catch (error) {
        return { message: 'Marka oluşturulurken hata oluştu.' };
    }
}

export async function deleteBrand(id: string) {
    try {
        await prisma.brand.delete({ where: { id } });
        revalidatePath('/admin/brands');
    } catch (error) {
        throw new Error('Marka silinemedi.');
    }
}

// --- Categories ---

export async function createCategory(formData: FormData) {
    const name = formData.get('name') as string;
    const brandId = formData.get('brandId') as string;

    if (!name || !brandId) return { message: 'Kategori adı ve Marka zorunludur.' };

    try {
        await prisma.category.create({
            data: { name, brandId }
        });
        revalidatePath('/admin/categories');
        return { message: 'Koleksiyon başarıyla oluşturuldu.' };
    } catch (error) {
         return { message: 'Koleksiyon oluşturulurken hata oluştu.' };
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({ where: { id } });
        revalidatePath('/admin/categories');
    } catch (error) {
        throw new Error('Koleksiyon silinemedi.');
    }
}
