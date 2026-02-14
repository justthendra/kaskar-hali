import { Prisma, PrismaClient } from '@prisma/client';

// Helper to determine the return type of a function
// This avoids relying on Prisma.PromiseReturnType which might be strict about the promise type
type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R> ? R : any;

// We use a dummy instance for type inference only
// We don't export it to avoid runtime usage
const prisma = new PrismaClient();

async function getProductWithRelations() {
  return await prisma.product.findFirst({
    include: {
      brand: true,
      category: true,
      variants: true,
    },
  });
}

// Infer the type from the function return
// We use NonNullable because findFirst can return null
export type ProductWithRelations = NonNullable<AsyncReturnType<typeof getProductWithRelations>>;


async function getBrandWithRelations() {
  return await prisma.brand.findFirst({
    include: {
      categories: true,
      _count: {
        select: { products: true },
      },
    },
  });
}

export type BrandWithRelations = NonNullable<AsyncReturnType<typeof getBrandWithRelations>>;
