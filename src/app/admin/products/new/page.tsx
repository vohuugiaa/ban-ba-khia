"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    originalPrice: '',
    imageUrl: '',
    usp: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          basePrice: parseInt(formData.basePrice) || 0,
          originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : null,
        }),
      });
      
      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        alert('Có lỗi xảy ra khi lưu!');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Thêm Sản phẩm mới</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên Sản phẩm</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="VD: Mắm Ba Khía Cà Mau" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link Ảnh (URL)</label>
          <input required type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" placeholder="https://..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label>
            <input required type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" placeholder="125000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc (Tùy chọn)</label>
            <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" placeholder="150000" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Đặc điểm nổi bật (USP - Phân cách bằng dấu phẩy)</label>
          <input required type="text" name="usp" value={formData.usp} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" placeholder="Chuẩn vị gia truyền, Túi Zip an toàn, Ăn liền tiện lợi" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full border border-gray-300 p-2 rounded-md" placeholder="Mắm ba khía đặc sản..." />
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Đang lưu...' : 'Lưu Sản Phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
}
