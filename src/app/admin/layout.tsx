import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-gray-900 text-white shadow-xl flex flex-col transition-all duration-300">
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-xl font-bold shadow-lg">
            M
          </div>
          <h1 className="text-xl font-bold tracking-wide">Mắm Khía Admin</h1>
        </div>
        
        <nav className="mt-6 flex-1 flex flex-col px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-all group">
            <i className="fas fa-chart-pie text-gray-400 group-hover:text-orange-500 transition-colors"></i>
            <span className="font-medium">Tổng quan</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-all group">
            <i className="fas fa-box-open text-gray-400 group-hover:text-orange-500 transition-colors"></i>
            <span className="font-medium">Quản lý Sản phẩm</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-all group">
            <i className="fas fa-shopping-cart text-gray-400 group-hover:text-orange-500 transition-colors"></i>
            <span className="font-medium">Đơn hàng</span>
          </Link>
        </nav>

        <div className="p-6 border-t border-gray-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
            <i className="fas fa-sign-out-alt"></i>
            <span className="font-medium">Về trang web</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white h-20 border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-gray-500 font-medium hidden md:block">Bảng điều khiển quản trị viên</h2>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
              <i className="fas fa-bell"></i>
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-md overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
