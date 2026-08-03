import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { ChevronRight, ShieldCheck, Flame, Star, Package, ShoppingBag } from "lucide-react";

export default function Home() {
  const mainProduct = products[0];

  return (
    <div className="min-h-screen text-zinc-50 font-sans selection:bg-orange-500/30">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="font-bold text-lg tracking-tighter bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            MẮM KHÍA 79
          </div>
          <Link href={`/${mainProduct.slug}`} className="text-sm font-medium hover:text-orange-400 transition-colors">
            Giỏ hàng
          </Link>
        </div>
      </header>

      <main className="pb-24">
        {/* HERO SECTION */}
        <section className="relative pt-8 pb-12 overflow-hidden px-4">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-orange-500/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-medium mb-4">
              <Flame className="w-3 h-3" /> Đặc sản Cà Mau
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter mb-4 leading-[1.1]">
              Đậm đà <br />
              <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
                Hương vị quê nhà
              </span>
            </h1>
            
            <p className="text-base text-zinc-400 mb-6 leading-relaxed">
              Mắm khía chua ngọt gia truyền. Miếng khía giòn rụm, tỏi ớt cay nồng đưa cơm.
            </p>
            
            <div className="w-full relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-orange-500/20 mb-8">
              <Image
                src={mainProduct.imageUrl}
                alt={mainProduct.name}
                fill
                className="object-cover"
                priority
              />
              {/* Floating Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-zinc-900/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Chứng nhận</div>
                    <div className="font-bold text-sm">An toàn vệ sinh</div>
                  </div>
                </div>
              </div>
            </div>
            
            <Link 
              href={`/${mainProduct.slug}`}
              className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-orange-500 text-white rounded-2xl font-bold active:scale-95 shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)] transition-transform"
            >
              <ShoppingBag className="w-5 h-5" />
              Mua Ngay Từ {mainProduct.basePrice.toLocaleString('vi-VN')}đ
            </Link>
            
            <div className="mt-6 flex items-center justify-center gap-3 text-xs text-zinc-500 font-medium">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border border-[#0a0a0a] flex items-center justify-center">
                    <Star className="w-2.5 h-2.5 text-orange-400 fill-orange-400" />
                  </div>
                ))}
              </div>
              <span>Hơn 2,000+ hũ đã bán</span>
            </div>
          </div>
        </section>

        {/* USP SECTION */}
        <section className="border-y border-white/5 bg-white/[0.02] py-12 px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Vì sao khách <span className="text-orange-400">nghiện?</span></h2>
            <p className="text-sm text-zinc-400">Bí quyết bán chạy số 1</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Package, title: 'Đóng gói kỹ', desc: 'Seal bạc chống tràn' },
              { icon: Flame, title: 'Cực hao cơm', desc: 'Chua cay mặn ngọt' },
              { icon: ShieldCheck, title: 'Sạch 100%', desc: 'Không hóa chất' },
              { icon: Star, title: 'Tươi ngon', desc: 'Khía sống Cà Mau' },
            ].map((feature, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <feature.icon className="w-6 h-6 text-orange-400 mb-3" />
                <h3 className="text-sm font-bold mb-1">{feature.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRODUCT LIST */}
        <section className="py-16 px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold tracking-tighter mb-2">
              Sản phẩm
            </h2>
          </div>
          
          <div className="flex flex-col gap-6">
            {products.map((product) => (
              <Link 
                href={`/${product.slug}`} 
                key={product.id}
                className="block p-3 rounded-3xl bg-zinc-900 border border-white/10 active:border-orange-500/50 transition-colors"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4">
                  <Image 
                    src={product.imageUrl} 
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="px-2">
                  <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                  <p className="text-zinc-400 text-xs mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-zinc-500 line-through">{product.originalPrice.toLocaleString('vi-VN')}đ</div>
                      <div className="text-lg font-bold text-orange-500">{product.basePrice.toLocaleString('vi-VN')}đ</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 text-center text-zinc-500 text-xs">
        <p>© 2026 Mắm Khía Cà Mau 79.</p>
      </footer>
    </div>
  );
}
