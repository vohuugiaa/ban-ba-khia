import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Quản lý Sản phẩm</h2>
          <p className="text-gray-500 mt-1">Danh sách tất cả sản phẩm đang bán</p>
        </div>
        <Link href="/admin/products/new" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all font-medium flex items-center gap-2">
          <i className="fas fa-plus"></i>
          Thêm Sản phẩm
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-sm uppercase tracking-wider text-gray-500">
                <th className="p-5 font-semibold">Sản phẩm</th>
                <th className="p-5 font-semibold">Giá Bán</th>
                <th className="p-5 font-semibold">Ngày tạo</th>
                <th className="p-5 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-16 text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-box-open text-4xl text-gray-300"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có sản phẩm nào</h3>
                    <p className="text-gray-500 mb-6">Hãy thêm sản phẩm đầu tiên để bắt đầu bán hàng!</p>
                    <Link href="/admin/products/new" className="text-blue-600 font-medium hover:underline">
                      + Thêm Sản phẩm ngay
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <i className="fas fa-image text-gray-400"></i>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{product.name}</div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">#{product.id.slice(0,8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 font-semibold text-sm border border-green-100">
                        {product.basePrice.toLocaleString('vi-VN')}₫
                      </span>
                    </td>
                    <td className="p-5 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <i className="far fa-calendar text-gray-400"></i>
                        {product.createdAt.toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="p-5 text-right space-x-3">
                      <Link href={`/admin/products/${product.id}/edit`} className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                        <i className="fas fa-pen text-sm"></i>
                      </Link>
                      <button className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
