'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const ProductSchema = z.object({
    name: z.string().min(1, "Ürün adı zorunludur."),
    description: z.string().min(1, "Açıklama zorunludur."),
    images: z.string().min(1, "Görsel URL zorunludur."), // Simplified for now
    brandId: z.string().min(1, "Marka seçimi zorunludur."),
    categoryId: z.string().min(1, "Kategori seçimi zorunludur."),
    variants: z.array(z.object({
        size: z.string().min(1, "Ebat zorunludur."),
        price: z.coerce.number().min(0, "Fiyat 0'dan küçük olamaz."),
        stock: z.coerce.number().int().min(0, "Stok 0'dan küçük olamaz.")
    })).min(1, "En az bir varyant eklemelisiniz.")
});

export async function createProduct(prevState: any, formData: FormData) {
    // Parse variants from JSON string if needed, or handle structured data if passed differently.
    // However, handling dynamic arrays with FormData is tricky. 
    // It's often easier to accept a raw object for complex forms or parse specific patterns.
    // For this implementation, let's assume the form submits a JSON string for variants or we rely on a client-side conversion to a hidden field, 
    // OR we use a more modern approach like binding arguments.
    // Let's try to extract data from FormData assuming standard naming or a JSON payload for variants.
    
    // Simplest approach for dynamic lists in server actions without JS-heavy client logic interfering:
    // Pass everything as a JSON string in a hidden field 'variants' OR strictly named fields variants[0][size] etc.
    // Let's use the JSON string approach for the 'variants' field for simplicity in the Action.

    const rawVariants = formData.get('variants');
    let variantsData = [];
    try {
        variantsData = JSON.parse(rawVariants as string);
    } catch (e) {
        return { message: "Varyant verisi geçersiz." };
    }

    const validatedFields = ProductSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        images: formData.get('images'),
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
    redirect('/admin/products');
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({
            where: { id }
        });
        revalidatePath('/admin/products');
        revalidatePath('/urunler');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Ürün silinemedi.');
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

    const validatedFields = ProductSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        images: formData.get('images'),
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
    redirect('/admin/products');
}
