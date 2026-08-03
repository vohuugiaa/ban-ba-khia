import ProductClient from '@/components/ProductClient';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Try to find by ID
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    return notFound();
  }

  return (
    <main className="bg-[#e5e5e5] min-h-screen">
      <ProductClient product={product} />
    </main>
  );
}
