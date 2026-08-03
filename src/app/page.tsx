import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { ChevronRight, ShieldCheck, Flame, Star, Package, ShoppingBag } from "lucide-react";

export default function Home() {
  const mainProduct = products[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-50 font-sans selection:bg-orange-500/30">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            MẮM KHÍA 79
          </div>
          <Link href={`/${mainProduct.slug}`} className="text-sm font-medium hover:text-orange-400 transition-colors">
            Đặt hàng
          </Link>
        </div>
      </header>

      <main className="pb-24 pt-16">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-orange-400 text-sm font-medium mb-6">
                <Flame className="w-4 h-4" /> Đặc sản Cà Mau chính gốc
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.1]">
                Đậm đà <br />
                <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
                  Hương vị quê nhà
                </span>
              </h1>
              <p className="text-lg text-zinc-400 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                Mắm khía chua ngọt gia truyền. Từng miếng khía giòn rụm hòa quyện cùng tỏi ớt cay nồng, đánh thức mọi giác quan.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <Link 
                  href={`/${mainProduct.slug}`}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)]"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Mua Ngay Từ {mainProduct.basePrice.toLocaleString('vi-VN')}đ
                </Link>
              </div>
              
              <div className="mt-10 flex items-center justify-center md:justify-start gap-4 text-sm text-zinc-500 font-medium">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#0a0a0a] flex items-center justify-center">
                      <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                    </div>
                  ))}
                </div>
                <span>Hơn 2,000+ hũ đã bán</span>
              </div>
            </div>
            
            <div className="flex-1 relative w-full max-w-md">
              <div className="aspect-[4/5] relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-orange-500/20">
                <Image
                  src={mainProduct.imageUrl}
                  alt={mainProduct.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-zinc-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Chứng nhận</div>
                  <div className="font-bold">An toàn vệ sinh</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* USP SECTION */}
        <section className="border-y border-white/5 bg-white/[0.02] py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Tại sao khách hàng <span className="text-orange-400">nghiện</span> Mắm Khía 79?</h2>
              <p className="text-zinc-400">Bí quyết làm nên thương hiệu mắm khía bán chạy nhất</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Package, title: 'Đóng gói kỹ', desc: 'Hũ pet an toàn, seal nắp bạc chống tràn tuyệt đối.' },
                { icon: Flame, title: 'Vị cực hao cơm', desc: 'Chua, cay, mặn, ngọt cân bằng hoàn hảo.' },
                { icon: ShieldCheck, title: 'Sạch 100%', desc: 'Không hóa chất, không chất bảo quản công nghiệp.' },
                { icon: Star, title: 'Đánh bắt tươi', desc: 'Sử dụng khía sống tươi ngon từ rừng ngập mặn.' },
              ].map((feature, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <feature.icon className="w-8 h-8 text-orange-400 mb-4" />
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCT LIST */}
        <section className="py-32">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-16">
              Sản phẩm của chúng tôi
            </h2>
            
            <div className="grid md:grid-cols-1 gap-8 max-w-xl mx-auto text-left">
              {products.map((product) => (
                <Link 
                  href={`/${product.slug}`} 
                  key={product.id}
                  className="group flex flex-col sm:flex-row gap-6 p-4 rounded-3xl bg-zinc-900 border border-white/10 hover:border-orange-500/50 transition-all hover:bg-zinc-800/80"
                >
                  <div className="relative w-full sm:w-48 aspect-square rounded-2xl overflow-hidden shrink-0">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-center py-2 flex-1">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-orange-400 transition-colors">{product.name}</h3>
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <div className="text-sm text-zinc-500 line-through">{product.originalPrice.toLocaleString('vi-VN')}đ</div>
                        <div className="text-xl font-bold text-orange-500">{product.basePrice.toLocaleString('vi-VN')}đ</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                        <ChevronRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 text-center text-zinc-500 text-sm">
        <div className="max-w-5xl mx-auto px-6">
          <p>© 2026 Mắm Khía Cà Mau 79. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
