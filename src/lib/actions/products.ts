'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const ProductSchema = z.object({
    name: z.string().min(1, "Ürün adı zorunludur."),
    description: z.string().min(1, "Açıklama zorunludur."),
    images: z.string().min(1, "En az bir resim eklemelisiniz."),
    brandId: z.string().min(1, "Marka seçimi zorunludur."),
    categoryId: z.string().min(1, "Kategori seçimi zorunludur."),
    variants: z.array(z.object({
        size: z.string().min(1, "Ebat zorunludur."),
        price: z.coerce.number().min(0, "Fiyat 0'dan küçük olamaz."),
        stock: z.coerce.number().int().min(-1, "Stok geçersiz.")
    })).min(1, "En az bir varyant eklemelisiniz.")
});

export async function createProduct(prevState: any, formData: FormData) {
    const rawVariants = formData.get('variants');
    let variantsData = [];
    try {
        variantsData = JSON.parse(rawVariants as string);
    } catch (e) {
        return { message: "Varyant verisi geçersiz." };
    }

    const rawImages = formData.get('images') as string;
    let formattedImages = rawImages;

    try {
        const parsedImages = JSON.parse(rawImages);
        if (Array.isArray(parsedImages)) {
            const valid = parsedImages.filter((u: any) => typeof u === 'string' && u.trim().length > 0);
            if (valid.length === 0) {
                return { message: "En az 1 adet geçerli resim URL'si eklemelisiniz." };
            }
            formattedImages = JSON.stringify(valid);
        }
    } catch {
        if (!rawImages || !rawImages.trim()) {
            return { message: "En az bir resim URL'si girmelisiniz." };
        }
        formattedImages = JSON.stringify([rawImages.trim()]);
    }

    const validatedFields = ProductSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        images: formattedImages,
        brandId: formData.get('brandId'),
        categoryId: formData.get('categoryId'),
        variants: variantsData
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Eksik veya hatalı alanlar var. Lütfen kontrol edin.',
        };
    }

    const { name, description, images, brandId, categoryId, variants } = validatedFields.data;

    try {
        await prisma.product.create({
            data: {
                name,
                description,
                images,
                brandId,
                categoryId,
                variants: {
                    create: variants
                }
            }
        });
    } catch (error) {
        console.error('Database Error:', error);
        return { message: 'Veritabanı hatası: Ürün oluşturulamadı.' };
    }

    revalidatePath('/admin/products');
    revalidatePath('/urunler');
    revalidatePath('/koleksiyonlar');
    revalidatePath('/');
    redirect('/admin/products');
}

export async function deleteProduct(id: string) {
    try {
        // First delete all related variants to ensure constraint compliance
        await prisma.productVariant.deleteMany({
            where: { productId: id }
        });

        // Delete product
        await prisma.product.delete({
            where: { id }
        });

        revalidatePath('/admin/products');
        revalidatePath('/urunler');
        revalidatePath('/koleksiyonlar');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Database Error during product deletion:', error);
        return { error: 'Ürün silinirken bir hata oluştu.' };
    }
}

export async function updateProduct(id: string, prevState: any, formData: FormData) {
    const rawVariants = formData.get('variants');
    let variantsData = [];
    try {
        variantsData = JSON.parse(rawVariants as string);
    } catch (e) {
        return { message: "Varyant verisi geçersiz." };
    }

    const rawImages = formData.get('images') as string;
    let formattedImages = rawImages;

    try {
        const parsedImages = JSON.parse(rawImages);
        if (Array.isArray(parsedImages)) {
            const valid = parsedImages.filter((u: any) => typeof u === 'string' && u.trim().length > 0);
            if (valid.length === 0) {
                return { message: "En az 1 adet geçerli resim URL'si eklemelisiniz." };
            }
            formattedImages = JSON.stringify(valid);
        }
    } catch {
        if (!rawImages || !rawImages.trim()) {
            return { message: "En az bir resim URL'si girmelisiniz." };
        }
        formattedImages = JSON.stringify([rawImages.trim()]);
    }

    const validatedFields = ProductSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        images: formattedImages,
        brandId: formData.get('brandId'),
        categoryId: formData.get('categoryId'),
        variants: variantsData
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Eksik veya hatalı alanlar var. Lütfen kontrol edin.',
        };
    }

    const { name, description, images, brandId, categoryId, variants } = validatedFields.data;

    try {
        await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                images,
                brandId,
                categoryId,
                variants: {
                    deleteMany: {}, // Delete all existing variants
                    create: variants // Create new ones
                }
            }
        });
    } catch (error) {
        console.error('Database Error:', error);
        return { message: 'Veritabanı hatası: Ürün güncellenemedi.' };
    }

    revalidatePath('/admin/products');
    revalidatePath('/urunler');
    revalidatePath('/koleksiyonlar');
    revalidatePath('/');
    redirect('/admin/products');
}
