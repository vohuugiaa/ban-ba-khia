import prisma from '@/lib/prisma';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { product: true }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Quản lý Đơn hàng</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">Khách hàng</th>
              <th className="p-4 font-semibold text-gray-600">Sản phẩm</th>
              <th className="p-4 font-semibold text-gray-600">Tổng tiền</th>
              <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Chưa có đơn hàng nào.
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerPhone}</div>
                    <div className="text-xs text-gray-400 mt-1 max-w-[200px] truncate">{order.address}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-800 truncate max-w-[150px]">{order.product.name}</div>
                    <div className="text-sm text-gray-500">SL: {order.quantity} | {order.variants}</div>
                  </td>
                  <td className="p-4 text-green-600 font-semibold">
                    {order.totalPrice.toLocaleString('vi-VN')}₫
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
