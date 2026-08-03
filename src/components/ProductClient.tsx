"use client";

import { useState, useEffect } from 'react';

// Giữ lại y nguyên cấu trúc HTML và đổi sang JSX
export default function ProductClient({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [basePrice, setBasePrice] = useState(product.basePrice);
  const [selectedWeight, setSelectedWeight] = useState('Hũ 500g');
  const [selectedSpice, setSelectedSpice] = useState('Không cay');
  
  const [cartCount, setCartCount] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  
  const [orderModalActive, setOrderModalActive] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Confirm
  
  const [savedVouchers, setSavedVouchers] = useState<any[]>([]);
  const [appliedVoucherId, setAppliedVoucherId] = useState<string | null>(null);
  
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '', phone: '', provinceCode: '', districtCode: '', wardCode: '',
    provinceName: '', districtName: '', wardName: '', detail: '', note: ''
  });
  
  const [phoneError, setPhoneError] = useState(false);
  const [customAlert, setCustomAlert] = useState({ show: false, msg: '' });
  const [toast, setToast] = useState({ show: false, msg: '' });
  
  const [submitting, setSubmitting] = useState(false);

  // Vouchers demo
  const vouchers = [
    { id: 'v1', text: 'Giảm 15k', discount: 15000, min: 150000, subtitle: 'Đơn từ 150k' },
    { id: 'v2', text: 'Giảm 30k', discount: 30000, min: 300000, subtitle: 'Đơn từ 300k' },
    { id: 'v3', text: 'Freeship 20k', discount: 20000, min: 0, subtitle: 'Mọi đơn', isFreeship: true }
  ];

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=3')
      .then(res => res.json())
      .then(data => setProvinces(data));
  }, []);

  const formatCurrency = (val: number) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const subTotal = basePrice * quantity;
  const appliedVoucher = savedVouchers.find(v => v.id === appliedVoucherId);
  const discountAmount = (appliedVoucher && subTotal >= appliedVoucher.min) ? appliedVoucher.discount : 0;
  const total = Math.max(0, subTotal - discountAmount);

  // Auto remove invalid voucher
  useEffect(() => {
    if (appliedVoucher && subTotal < appliedVoucher.min) {
      setAppliedVoucherId(null);
      showToast('Voucher đã bị gỡ vì chưa đủ điều kiện!');
    }
  }, [subTotal, appliedVoucher]);

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 2000);
  };

  const handleSaveVoucher = (v: any) => {
    if (!savedVouchers.find(sv => sv.id === v.id)) {
      setSavedVouchers([...savedVouchers, v]);
      showToast('Đã lưu voucher vào ví!');
    }
  };

  const handleAddCart = () => {
    setCartCount(c => c + 1);
    setShowBadge(true);
    showToast('Đã thêm vào giỏ hàng!');
  };

  const openModal = () => {
    setStep(1);
    setOrderModalActive(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setOrderModalActive(false);
    document.body.style.overflow = '';
  };

  const handleNextStep = () => {
    if (!formData.name.trim()) return setCustomAlert({ show: true, msg: 'Vui lòng nhập họ và tên!' });
    if (!/^(03|05|07|08|09)[0-9]{8}$/.test(formData.phone.trim())) {
      setPhoneError(true);
      return setCustomAlert({ show: true, msg: 'Số điện thoại không hợp lệ!' });
    }
    if (!formData.provinceCode || !formData.districtCode || !formData.wardCode || !formData.detail.trim()) {
      return setCustomAlert({ show: true, msg: 'Vui lòng chọn đầy đủ địa chỉ giao hàng!' });
    }
    setStep(2);
  };

  const submitOrder = async () => {
    setSubmitting(true);
    
    // Giả lập gửi order lên API Next.js
    const payload = {
      productId: product.id,
      customerName: formData.name,
      customerPhone: formData.phone,
      address: `${formData.detail}, ${formData.wardName}, ${formData.districtName}, ${formData.provinceName}`,
      note: formData.note,
      quantity,
      totalPrice: total,
      variants: JSON.stringify([selectedWeight, selectedSpice])
    };

    try {
      await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      closeModal();
      showToast('Đặt hàng thành công! Cảm ơn bạn.');
      setTimeout(() => {
        setCartCount(0);
        setShowBadge(false);
      }, 2000);
    } catch (err) {
      setCustomAlert({ show: true, msg: 'Có lỗi xảy ra khi đặt hàng!' });
    }
    setSubmitting(false);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
          <button className="icon-btn"><i className="fas fa-chevron-left"></i></button>
          <div className="search-bar">
              <i className="fas fa-search"></i>
              <span>Tìm kiếm sản phẩm...</span>
          </div>
          <button className="icon-btn cart-header-btn" onClick={() => cartCount === 0 ? setCustomAlert({ show: true, msg: 'Giỏ hàng trống' }) : openModal()}>
              <i className="fas fa-shopping-cart"></i>
              <span className={`cart-badge ${showBadge ? 'show' : ''}`}>{cartCount}</span>
          </button>
          <button className="icon-btn"><i className="fas fa-ellipsis-h"></i></button>
      </header>

      {/* Product Media */}
      <div className="product-media">
          <img src={product.imageUrl} alt={product.name} className="main-image" />
          <div className="image-indicator">1/5</div>
      </div>

      {/* Product Info */}
      <section className="section product-info">
          <div className="price-container">
              <div className="current-price">
                  <span className="currency">₫</span><span className="amount">{formatCurrency(product.basePrice)}</span>
              </div>
              {product.originalPrice && <div className="original-price">₫{formatCurrency(product.originalPrice)}</div>}
              {product.originalPrice && <div className="discount-badge">Sale</div>}
          </div>
          
          <h1 className="product-title">
              <span className="mall-badge">Mall</span> 
              {product.name}
          </h1>
          
          <div className="stats-container">
              <div className="rating">
                  <i className="fas fa-star"></i>
                  <span>4.9 (2.4k đánh giá)</span>
              </div>
              <div className="divider">|</div>
              <div className="sold">Đã bán 8.9k</div>
          </div>
      </section>

      {/* USPs */}
      <section className="section usps">
          <div className="usp-list">
              {(product.usp || '').split(',').map((u: string, idx: number) => (
                <div key={idx} className="usp-item">
                  <i className="fas fa-check-circle text-primary"></i>
                  <span>{u.trim()}</span>
                </div>
              ))}
          </div>
      </section>

      {/* Vouchers */}
      <section className="section vouchers">
          <div className="section-header">
              <span className="label">Voucher của Shop</span>
          </div>
          <div className="voucher-list">
              {vouchers.map(v => {
                const isSaved = savedVouchers.find(sv => sv.id === v.id);
                return (
                  <div key={v.id} className={`voucher-item ${v.isFreeship ? 'freeship' : ''}`}>
                      <div className="v-info">{v.text}<br/><small>{v.subtitle}</small></div>
                      <button onClick={() => handleSaveVoucher(v)} className={`v-btn ${isSaved ? 'saved' : ''}`}>
                        {isSaved ? 'Đã Lưu' : 'Lưu'}
                      </button>
                  </div>
                );
              })}
          </div>
      </section>

      {/* Video Placeholder */}
      <section className="section product-video">
            <div className="video-container">
                <div className="video-overlay">
                    <i className="fas fa-play-circle play-icon"></i>
                    <p>Xem độ ngon khó cưỡng!</p>
                </div>
                <img src={product.imageUrl} alt="Video thumbnail" className="video-thumb" />
            </div>
      </section>

      {/* Description */}
      <section className="section product-details">
          <h2 className="section-title">Chi tiết sản phẩm</h2>
          <div className="detail-grid">
              <div className="detail-row">
                  <span className="detail-label">Thương hiệu</span>
                  <span className="detail-value">Đặc Sản Cà Mau 79</span>
              </div>
          </div>
          <div className="description whitespace-pre-line">
              {product.description}
          </div>
          <div className="desc-images mt-4">
                <img src={product.imageUrl} alt="Chi tiết sản phẩm" className="desc-img" />
          </div>
      </section>

      <div style={{ height: '80px' }}></div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
          <div className="action-icons">
              <div className="action-icon">
                  <i className="fas fa-store"></i>
                  <span>Cửa hàng</span>
              </div>
              <div className="action-icon">
                  <i className="fas fa-comment-dots"></i>
                  <span>Chat</span>
              </div>
          </div>
          <div className="action-buttons">
              <button className="btn-cart" onClick={handleAddCart}>Thêm vào giỏ</button>
              <button className="btn-buy" onClick={openModal}>Mua ngay</button>
          </div>
      </div>

      {/* Order Modal */}
      <div className={`modal-overlay ${orderModalActive ? 'active' : ''}`} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
              <div className="modal-header">
                  <img src={product.imageUrl} alt="Thumbnail" className="modal-thumb" />
                  <div className="modal-price-info">
                      <div className="modal-price text-primary">₫<span>{formatCurrency(basePrice)}</span></div>
                      <div className="modal-stock">Kho: 985</div>
                      <div className="modal-selected-variant">{selectedWeight}, {selectedSpice}</div>
                  </div>
                  <button className="close-btn" onClick={closeModal}><i className="fas fa-times"></i></button>
              </div>
              
              <div className="modal-body" style={{ display: step === 1 ? 'block' : 'none' }}>
                  <div className="form-group">
                      <label>Khối lượng</label>
                      <div className="option-group">
                          <button onClick={() => { setSelectedWeight('Hũ 500g'); setBasePrice(product.basePrice); }} className={`option-btn ${selectedWeight === 'Hũ 500g' ? 'active' : ''}`}>Hũ 500g</button>
                          <button onClick={() => { setSelectedWeight('Hũ 1Kg'); setBasePrice(product.basePrice + 115000); }} className={`option-btn ${selectedWeight === 'Hũ 1Kg' ? 'active' : ''}`}>Hũ 1Kg</button>
                      </div>
                  </div>
                  
                  <div className="form-group">
                      <label>Độ cay</label>
                      <div className="option-group">
                          {['Không cay', 'Cay vừa', 'Siêu cay'].map(s => (
                             <button key={s} onClick={() => setSelectedSpice(s)} className={`option-btn ${selectedSpice === s ? 'active' : ''}`}>{s}</button>
                          ))}
                      </div>
                  </div>

                  <div className="form-group">
                      <label>Số lượng</label>
                      <div className="quantity-selector">
                          <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}><i className="fas fa-minus"></i></button>
                          <input type="number" id="qtyInput" value={quantity} onChange={e => setQuantity(parseInt(e.target.value)||1)} />
                          <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}><i className="fas fa-plus"></i></button>
                      </div>
                  </div>

                  {/* Checkout Vouchers */}
                  <div className="form-group voucher-checkout-box">
                      <div className="voucher-checkout-header">
                          <label><i className="fas fa-ticket-alt" style={{color: 'var(--primary-color)'}}></i> Voucher của Shop</label>
                          <span>{appliedVoucher ? appliedVoucher.text : 'Chưa chọn'}</span>
                      </div>
                      <div className="checkout-saved-vouchers">
                          {savedVouchers.length === 0 ? (
                            <p className="empty-voucher-text">Bạn chưa lưu voucher nào.</p>
                          ) : (
                            savedVouchers.map(v => {
                              const isEligible = subTotal >= v.min;
                              const isApplied = appliedVoucherId === v.id;
                              return (
                                <div key={v.id} className={`checkout-voucher-item ${!isEligible ? 'disabled' : ''}`}>
                                  <div className="cv-info">
                                      <strong>{v.text}</strong>
                                      <div className="cv-min">Đơn tối thiểu {formatCurrency(v.min)}đ</div>
                                  </div>
                                  <button disabled={!isEligible} onClick={() => setAppliedVoucherId(isApplied ? null : v.id)} className={`cv-btn ${isApplied ? 'applied' : ''}`}>
                                      {isApplied ? 'Đã áp dụng' : 'Áp dụng'}
                                  </button>
                                </div>
                              )
                            })
                          )}
                      </div>
                  </div>

                  <h3 className="form-title">Thông tin giao hàng</h3>
                  <div className="form-group">
                      <input type="text" className="form-input" placeholder="Họ và tên người nhận" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                      <input type="tel" className={`form-input ${phoneError ? 'error' : ''}`} placeholder="Số điện thoại" value={formData.phone} onChange={e => { setFormData({...formData, phone: e.target.value}); setPhoneError(false); }} />
                      {phoneError && <div className="error-msg show">Số điện thoại không hợp lệ!</div>}
                  </div>
                  
                  <div className="form-group address-group">
                      <select className="form-input" value={formData.provinceCode} onChange={e => {
                        const p = provinces.find(x => x.code == e.target.value);
                        setFormData({...formData, provinceCode: e.target.value, provinceName: p?.name || '', districtCode: '', wardCode: ''});
                        setDistricts(p?.districts || []);
                        setWards([]);
                      }}>
                          <option value="">Chọn Tỉnh/Thành phố</option>
                          {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                      </select>
                      
                      <select className="form-input" disabled={!formData.provinceCode} value={formData.districtCode} onChange={e => {
                        const d = districts.find(x => x.code == e.target.value);
                        setFormData({...formData, districtCode: e.target.value, districtName: d?.name || '', wardCode: ''});
                        setWards(d?.wards || []);
                      }}>
                          <option value="">Chọn Quận/Huyện</option>
                          {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                      </select>
                      
                      <select className="form-input" disabled={!formData.districtCode} value={formData.wardCode} onChange={e => {
                        const w = wards.find(x => x.code == e.target.value);
                        setFormData({...formData, wardCode: e.target.value, wardName: w?.name || ''});
                      }}>
                          <option value="">Chọn Phường/Xã</option>
                          {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                      </select>
                  </div>

                  <div className="form-group">
                      <input type="text" className="form-input" placeholder="Số nhà, tên đường chi tiết..." value={formData.detail} onChange={e => setFormData({...formData, detail: e.target.value})} />
                  </div>
                  <div className="form-group">
                      <input type="text" className="form-input" placeholder="Ghi chú cho shop (không bắt buộc)" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
                  </div>
              </div>

              {/* Step 2 Confirm */}
              <div className="modal-body" style={{ display: step === 2 ? 'block' : 'none' }}>
                  <div className="confirm-alert">
                      <i className="fas fa-info-circle"></i> Vui lòng kiểm tra kỹ thông tin trước khi đặt hàng.
                  </div>
                  <h3 className="form-title" style={{marginTop:0}}>Xác nhận đơn hàng</h3>
                  <div className="confirm-summary">
                      <p><strong>Sản phẩm:</strong> {selectedWeight}, {selectedSpice} x{quantity}</p>
                      <p><strong>Người nhận:</strong> {formData.name} - {formData.phone}</p>
                      <p><strong>Địa chỉ:</strong> {formData.detail}, {formData.wardName}, {formData.districtName}, {formData.provinceName}</p>
                      <p><strong>Ghi chú:</strong> {formData.note || 'Không'}</p>
                      
                      <div className="price-breakdown">
                          <div className="breakdown-row">
                              <span>Tạm tính:</span>
                              <span>₫{formatCurrency(subTotal)}</span>
                          </div>
                          {discountAmount > 0 && (
                            <div className="breakdown-row text-primary">
                                <span>Voucher giảm giá:</span>
                                <span>- ₫{formatCurrency(discountAmount)}</span>
                            </div>
                          )}
                      </div>
                  </div>
              </div>
              
              <div className="modal-footer">
                  <div className="total-section">
                      <span>Tổng thanh toán:</span>
                      <span className="total-price">₫{formatCurrency(total)}</span>
                  </div>
                  {step === 1 ? (
                    <button className="btn-submit" onClick={handleNextStep}>Tiếp tục</button>
                  ) : (
                    <button className="btn-submit" onClick={submitOrder} disabled={submitting}>
                      {submitting ? 'Đang xử lý...' : 'Xác nhận Đặt Hàng'}
                    </button>
                  )}
              </div>
          </div>
      </div>

      <div className={`custom-alert-overlay ${customAlert.show ? 'active' : ''}`}>
          <div className="custom-alert-box">
              <div className="custom-alert-icon"><i className="fas fa-exclamation-circle"></i></div>
              <div className="custom-alert-msg">{customAlert.msg}</div>
              <button className="custom-alert-btn" onClick={() => setCustomAlert({ show: false, msg: '' })}>Đóng</button>
          </div>
      </div>

      <div className={`toast ${toast.show ? 'show' : ''}`}>
          <i className="fas fa-check-circle"></i> <span>{toast.msg}</span>
      </div>
    </div>
  );
}
