export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  originalPrice: number;
  imageUrl: string;
  usp: string[]; // Unique Selling Propositions
  variants: {
    name: string;
    price: number;
  }[];
}

export const products: Product[] = [
  {
    id: 'mam-khia-ca-mau-79',
    slug: 'mam-khia-ca-mau-79',
    name: 'Mắm Khía Cà Mau 79',
    description: 'Mắm khía chua ngọt đậm đà, được muối từ những con khía tươi ngon nhất đánh bắt tại vùng biển Cà Mau. Gia vị tỏi ớt hòa quyện cùng công thức gia truyền mang đến hương vị bùng nổ, đưa cơm nức nở.',
    basePrice: 120000,
    originalPrice: 150000,
    imageUrl: '/images/mam-khia-1.jpg',
    usp: [
      '💯 Nguyên liệu 100% tự nhiên từ Cà Mau',
      '🌶 Vị chua ngọt, tỏi ớt đậm đà đưa cơm',
      '✨ Không sử dụng chất bảo quản',
      '📦 Đóng hũ hợp vệ sinh, dễ bảo quản'
    ],
    variants: [
      { name: 'Hũ 500g', price: 120000 },
      { name: 'Hũ 1kg (Tiết kiệm)', price: 230000 },
    ]
  }
];

export const getProductBySlug = (slug: string) => {
  return products.find(p => p.slug === slug);
};
