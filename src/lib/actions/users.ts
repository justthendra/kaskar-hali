
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const CreateUserSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

export async function createBranchUser(formData: FormData) {
  try {
    const rawData = {
        name: formData.get('name'),
        username: formData.get('username'),
        password: formData.get('password'),
    };

    const validatedData = CreateUserSchema.parse(rawData);
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    await prisma.user.create({
      data: {
        name: validatedData.name,
        username: validatedData.username,
        email: `${validatedData.username}@kaskar.local`, // Dummy email generator
        password: hashedPassword,
        role: 'ADMIN', // Branch role (must be ADMIN to access panel)
      },
    });

    revalidatePath('/admin/settings');
    return { success: true, message: 'Şube başarıyla oluşturuldu.' };
  } catch (error) {
    console.error('Failed to create user:', error);
    return { success: false, message: 'Şube oluşturulamadı. Kullanıcı adı benzersiz olmalı.' };
  }
}

export async function deleteUser(userId: string) {
    try {
        await prisma.user.delete({
            where: { id: userId }
        });
        revalidatePath('/admin/settings');
        return { success: true, message: 'Kullanıcı silindi.' };
    } catch (error) {
        return { success: false, message: 'Kullanıcı silinemedi.' };
    }
}
