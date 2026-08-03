"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, CheckCircle2, ShieldCheck, Truck, Star } from "lucide-react";
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
    
    // Giả lập độ trễ
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // TODO: Gắn link SheetMonkey ở đây
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const totalPrice = selectedVariant.price * quantity;

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a]">
        <div className="w-full bg-zinc-900 border border-white/10 p-8 rounded-3xl text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Đặt hàng thành công!</h1>
          <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
            Cảm ơn bạn đã tin tưởng. Chúng tôi sẽ gọi điện xác nhận đơn hàng sớm nhất.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full py-4 rounded-2xl bg-white/10 text-white font-medium active:bg-white/20"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-zinc-50 pb-32">
      {/* HEADER */}
      <header className="fixed top-0 w-full max-w-[480px] z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
        <div className="px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium text-sm">Quay lại</span>
          </Link>
        </div>
      </header>

      <main className="pt-14">
        {/* PRODUCT IMAGE */}
        <div className="aspect-square relative w-full bg-black">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* PRODUCT INFO */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3 text-xs text-orange-400 font-medium mb-3">
            <span className="bg-orange-500/20 px-2 py-1 rounded-md">Bán chạy nhất</span>
            <div className="flex -space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3 h-3 fill-orange-400" />
              ))}
            </div>
          </div>
          <h1 className="text-2xl font-extrabold mb-2 leading-tight">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-orange-500">{product.basePrice.toLocaleString('vi-VN')}đ</span>
            <span className="text-sm text-zinc-500 line-through">{product.originalPrice.toLocaleString('vi-VN')}đ</span>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* USPS */}
        <div className="p-4 border-b border-white/10 bg-white/[0.02]">
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-400" /> Cam kết chất lượng
          </h3>
          <ul className="space-y-3">
            {product.usp.map((item, idx) => (
              <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2">
                <span className="mt-1.5 block w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CHECKOUT FORM */}
        <div className="p-4" id="order-form">
          <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-400" /> Thông tin nhận hàng
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Variant */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Loại sản phẩm</label>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((variant, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`py-3 px-2 text-center rounded-xl border text-sm font-bold transition-all ${
                      selectedVariant.name === variant.name 
                        ? 'border-orange-500 bg-orange-500/10 text-orange-500' 
                        : 'border-white/10 bg-white/5 text-zinc-400'
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3 pt-2">
              <input required type="text" placeholder="Họ và tên người nhận" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-orange-500 focus:outline-none" />
              <input required type="tel" placeholder="Số điện thoại" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-orange-500 focus:outline-none" />
              <textarea required placeholder="Địa chỉ giao hàng chi tiết" rows={2} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-orange-500 focus:outline-none resize-none" />
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <span className="text-sm font-medium">Số lượng</span>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-zinc-400 active:bg-white/10">-</button>
                <span className="font-bold w-4 text-center">{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-zinc-400 active:bg-white/10">+</button>
              </div>
            </div>

          </form>
        </div>
      </main>

      {/* STICKY BOTTOM BUY BUTTON */}
      <div className="fixed bottom-0 w-full max-w-[480px] p-4 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/10 z-50">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-sm text-zinc-400">Tổng thanh toán:</span>
          <span className="text-xl font-bold text-orange-500">{totalPrice.toLocaleString('vi-VN')}đ</span>
        </div>
        <button 
          onClick={(e) => {
            const form = document.querySelector('form');
            if (form) {
              if (form.checkValidity()) {
                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
              } else {
                form.reportValidity();
              }
            }
          }}
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl font-bold text-white bg-orange-500 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center shadow-[0_0_30px_-10px_rgba(249,115,22,0.5)]"
        >
          {isSubmitting ? 'Đang xử lý...' : 'ĐẶT HÀNG NGAY'}
        </button>
      </div>
    </div>
  );
}
