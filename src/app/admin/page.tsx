import prisma from '@/lib/prisma';

export default async function AdminDashboard() {
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Tổng quan (Dashboard)</h2>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
          <i className="far fa-calendar-alt mr-2"></i>
          Hôm nay
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Products Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">Tổng Sản phẩm</h3>
              <p className="text-4xl font-bold text-gray-800">{productCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
              <i className="fas fa-box"></i>
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600 flex items-center gap-1">
            <i className="fas fa-arrow-up"></i>
            <span>Đã cập nhật</span>
          </div>
        </div>
        
        {/* Total Orders Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-50 to-orange-100 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">Tổng Đơn hàng</h3>
              <p className="text-4xl font-bold text-gray-800">{orderCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
              <i className="fas fa-shopping-bag"></i>
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600 flex items-center gap-1">
            <i className="fas fa-arrow-up"></i>
            <span>Đã cập nhật</span>
          </div>
        </div>
        
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">Doanh thu</h3>
              <p className="text-4xl font-bold text-gray-800">₫0</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl">
              <i className="fas fa-wallet"></i>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400 flex items-center gap-1">
            <i className="fas fa-minus"></i>
            <span>Chưa có dữ liệu</span>
          </div>
        </div>
      </div>
    </div>
  );
}
