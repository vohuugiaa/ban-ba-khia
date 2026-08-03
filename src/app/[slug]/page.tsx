"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, CheckCircle2, ShieldCheck, Truck, Package } from "lucide-react";
import { getProductBySlug } from "@/data/products";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  
  if (!product) {
    notFound();
  }

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Giả lập độ trễ mạng để tạo cảm giác thực
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // TODO: Connect to Google Sheets here
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const totalPrice = selectedVariant.price * quantity;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-white/10 p-8 rounded-3xl text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Đặt hàng thành công!</h1>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Cảm ơn bạn đã tin tưởng Mắm Khía Cà Mau 79. Chúng tôi sẽ gọi điện xác nhận đơn hàng trong thời gian sớm nhất.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-50 pb-24">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Quay lại</span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* PRODUCT INFO - LEFT COLUMN */}
          <div className="flex-1">
            <div className="aspect-square relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-8">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-orange-500">{product.basePrice.toLocaleString('vi-VN')}đ</span>
              <span className="text-lg text-zinc-500 line-through">{product.originalPrice.toLocaleString('vi-VN')}đ</span>
            </div>
            
            <p className="text-zinc-400 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-400" /> Cam kết chất lượng
              </h3>
              <ul className="space-y-3">
                {product.usp.map((item, idx) => (
                  <li key={idx} className="text-zinc-300 flex items-start gap-2">
                    <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CHECKOUT FORM - RIGHT COLUMN */}
          <div className="w-full md:w-[400px] shrink-0">
            <div className="sticky top-24 bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
              <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">Thông tin đặt hàng</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Variant Selection */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-3">Loại sản phẩm</label>
                  <div className="grid grid-cols-2 gap-3">
                    {product.variants.map((variant, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                          selectedVariant.name === variant.name 
                            ? 'border-orange-500 bg-orange-500/10 text-orange-500' 
                            : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10'
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div>
                    <input required type="text" placeholder="Họ và tên người nhận" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" />
                  </div>
                  <div>
                    <input required type="tel" placeholder="Số điện thoại" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" />
                  </div>
                  <div>
                    <textarea required placeholder="Địa chỉ giao hàng (Số nhà, đường, xã/phường...)" rows={3} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none" />
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between pt-4 pb-2 border-t border-white/10">
                  <span className="text-zinc-400 font-medium">Số lượng</span>
                  <div className="flex items-center gap-4 bg-black border border-white/10 rounded-xl px-2 py-1">
                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">-</button>
                    <span className="font-bold w-4 text-center">{quantity}</span>
                    <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">+</button>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pb-6">
                  <span className="text-zinc-400 font-medium">Tổng thanh toán</span>
                  <span className="text-2xl font-bold text-orange-500">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>

                {/* Submit */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Truck className="w-5 h-5" /> Đặt hàng ngay (COD)
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-zinc-500">Miễn phí giao hàng cho đơn từ 2kg</p>
              </form>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
