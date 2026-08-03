import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const order = await prisma.order.create({
      data: {
        productId: body.productId,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        address: body.address,
        note: body.note,
        quantity: body.quantity,
        totalPrice: body.totalPrice,
        variants: body.variants,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Failed to create order', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
