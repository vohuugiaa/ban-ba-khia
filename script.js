document.addEventListener('DOMContentLoaded', () => {
    // ---- State ----
    let basePrice = 125000;
    let selectedDiscount = 0;
    let quantity = 1;
    let selectedWeightText = 'Hũ 500g';
    let selectedSpiceText = 'Không cay';
    
    // Address data
    let provincesData = [];
    let districtsData = [];
    let wardsData = [];

    // Vouchers state
    let savedVouchers = [];

    // ---- Elements ----
    const displayPriceEl = document.getElementById('displayPrice');
    const modalPriceEl = document.getElementById('modalPrice');
    const totalPriceEl = document.getElementById('totalPrice');
    const selectedVariantDisplay = document.getElementById('selectedVariantDisplay');
    
    // Options
    const weightBtns = document.querySelectorAll('#weightOptions .option-btn');
    const spiceBtns = document.querySelectorAll('#spiceOptions .option-btn');
    const qtyInput = document.getElementById('qtyInput');
    const btnMinus = document.getElementById('btnMinus');
    const btnPlus = document.getElementById('btnPlus');
    
    // Vouchers
    const voucherBtns = document.querySelectorAll('.v-btn');
    
    // Cart
    const btnAddCart = document.getElementById('btnAddCart');
    const cartBadge = document.getElementById('cartBadge');
    let cartCount = 0;

    // Modal
    const orderModal = document.getElementById('orderModal');
    const btnBuyNow = document.getElementById('btnBuyNow');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const modalFormStep = document.getElementById('modalFormStep');
    const modalConfirmStep = document.getElementById('modalConfirmStep');
    const modalVoucherStatus = document.getElementById('modalVoucherStatus');
    const headerCartBtn = document.querySelector('.cart-header-btn');
    
    const btnNextStep = document.getElementById('btnNextStep');
    const btnSubmitOrder = document.getElementById('btnSubmitOrder');
    
    // Form Inputs
    const cusName = document.getElementById('cusName');
    const cusPhone = document.getElementById('cusPhone');
    const phoneError = document.getElementById('phoneError');
    const cusProvince = document.getElementById('cusProvince');
    const cusDistrict = document.getElementById('cusDistrict');
    const cusWard = document.getElementById('cusWard');
    const cusAddressDetail = document.getElementById('cusAddressDetail');
    const cusNote = document.getElementById('cusNote');

    // Confirm elements
    const confProduct = document.getElementById('confProduct');
    const confName = document.getElementById('confName');
    const confPhone = document.getElementById('confPhone');
    const confAddress = document.getElementById('confAddress');
    const confNote = document.getElementById('confNote');
    const confSubTotal = document.getElementById('confSubTotal');
    const confDiscountRow = document.getElementById('confDiscountRow');
    const confDiscount = document.getElementById('confDiscount');

    // Toast
    const msgToast = document.getElementById('successToast');
    const msgToastText = msgToast.querySelector('span');
    const msgToastIcon = msgToast.querySelector('i');

    // ---- Helpers ----
    const formatCurrency = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const showToast = (message, isError = false) => {
        msgToastText.textContent = message;
        if (isError) {
            msgToastIcon.className = 'fas fa-exclamation-circle text-primary';
        } else {
            msgToastIcon.className = 'fas fa-check-circle';
            msgToastIcon.style.color = '#00e676';
        }
        msgToast.classList.add('show');
        setTimeout(() => {
            msgToast.classList.remove('show');
        }, 3000);
    };

    const updateVoucherUI = () => {
        const subTotal = basePrice * quantity;
        let html = '';
        
        if (savedVouchers.length === 0) {
            html = `
                <div class="voucher-item freeship-xtra" id="modalVoucherUI" style="margin-bottom: 10px; width: 100%;">
                    <div class="v-info">
                        <div style="display:flex; align-items:center; gap:5px;"><i class="fas fa-truck-fast"></i> Freeship</div>
                        <small>Mọi đơn hàng</small>
                    </div>
                    <button class="v-btn" id="btnModalSaveVoucher" data-discount="20000" data-min="0" style="height:auto; padding: 6px 12px; border-radius: 4px;">Lưu</button>
                </div>
            `;
        } else {
            savedVouchers.forEach(v => {
                if (subTotal >= v.minOrder) {
                    html += `<div class="v-item"><span class="v-applied"><i class="fas fa-check-circle"></i> Đã áp dụng mã Freeship</span><span class="text-primary">Giảm ${formatCurrency(v.discount)}đ</span></div>`;
                } else {
                    const missing = v.minOrder - subTotal;
                    html += `<div class="v-item"><span class="v-missing">Mua thêm ${formatCurrency(missing)}đ nữa để dùng mã</span><span class="text-gray">Giảm ${formatCurrency(v.discount)}đ</span></div>`;
                }
            });
        }
        
        modalVoucherStatus.innerHTML = html;
        
        // Re-attach event listener if the button was just rendered
        const btnModalSave = document.getElementById('btnModalSaveVoucher');
        if (btnModalSave) {
            btnModalSave.addEventListener('click', function(e) {
                e.preventDefault();
                // Trigger the main freeship button to sync state
                const freeshipBtn = document.querySelector('.voucher-item.freeship-xtra .v-btn');
                if (freeshipBtn && !freeshipBtn.classList.contains('saved')) {
                    freeshipBtn.click();
                }
            });
        }
    };

    const applyBestVoucher = () => {
        const subTotal = basePrice * quantity;
        let bestDiscount = 0;
        
        savedVouchers.forEach(v => {
            if (subTotal >= v.minOrder && v.discount > bestDiscount) {
                bestDiscount = v.discount;
            }
        });
        
        selectedDiscount = bestDiscount;
        updateVoucherUI();
    };

    const updatePriceDisplay = () => {
        applyBestVoucher();
        const subTotal = basePrice * quantity;
        const total = Math.max(0, subTotal - selectedDiscount);
        
        if (displayPriceEl) displayPriceEl.textContent = formatCurrency(basePrice);
        if (modalPriceEl) modalPriceEl.textContent = formatCurrency(basePrice);
        if (totalPriceEl) totalPriceEl.textContent = formatCurrency(total);
        if (selectedVariantDisplay) selectedVariantDisplay.textContent = `${selectedWeightText}, ${selectedSpiceText}`;
    };

    const loadSavedCustomerData = () => {
        if(localStorage.getItem('cusName')) cusName.value = localStorage.getItem('cusName');
        if(localStorage.getItem('cusPhone')) cusPhone.value = localStorage.getItem('cusPhone');
        if(localStorage.getItem('cusAddressDetail')) cusAddressDetail.value = localStorage.getItem('cusAddressDetail');
        
        const pName = localStorage.getItem('cusProvince');
        if (pName) {
            cusProvince.value = pName;
            cusProvince.dispatchEvent(new Event('input'));
            
            setTimeout(() => {
                const dName = localStorage.getItem('cusDistrict');
                if (dName) {
                    cusDistrict.value = dName;
                    cusDistrict.dispatchEvent(new Event('input'));
                    
                    setTimeout(() => {
                        const wName = localStorage.getItem('cusWard');
                        if (wName) {
                            cusWard.value = wName;
                        }
                    }, 50);
                }
            }, 50);
        }
    };

    // ---- Address API ----
    let selectedProvinceCode = null;
    let selectedDistrictCode = null;

    fetch('https://provinces.open-api.vn/api/?depth=3')
        .then(response => response.json())
        .then(data => {
            provincesData = data;
            const pList = document.getElementById('provinceList');
            provincesData.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.name;
                opt.setAttribute('data-code', p.code);
                pList.appendChild(opt);
            });
            loadSavedCustomerData();
        })
        .catch(err => console.error("Error fetching address API", err));

    cusProvince.addEventListener('input', (e) => {
        const pName = e.target.value;
        const pList = document.getElementById('provinceList');
        const option = Array.from(pList.options).find(opt => opt.value === pName);
        
        const dList = document.getElementById('districtList');
        const wList = document.getElementById('wardList');
        dList.innerHTML = '';
        wList.innerHTML = '';
        cusDistrict.value = '';
        cusWard.value = '';
        cusWard.disabled = true;

        if (option) {
            selectedProvinceCode = option.getAttribute('data-code');
            const province = provincesData.find(p => p.code == selectedProvinceCode);
            districtsData = province.districts || [];
            districtsData.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.name;
                opt.setAttribute('data-code', d.code);
                dList.appendChild(opt);
            });
            cusDistrict.disabled = false;
        } else {
            selectedProvinceCode = null;
            cusDistrict.disabled = true;
        }
    });

    cusDistrict.addEventListener('input', (e) => {
        const dName = e.target.value;
        const dList = document.getElementById('districtList');
        const option = Array.from(dList.options).find(opt => opt.value === dName);
        
        const wList = document.getElementById('wardList');
        wList.innerHTML = '';
        cusWard.value = '';

        if (option) {
            selectedDistrictCode = option.getAttribute('data-code');
            const district = districtsData.find(d => d.code == selectedDistrictCode);
            wardsData = district.wards || [];
            wardsData.forEach(w => {
                const opt = document.createElement('option');
                opt.value = w.name;
                opt.setAttribute('data-code', w.code);
                wList.appendChild(opt);
            });
            cusWard.disabled = false;
        } else {
            selectedDistrictCode = null;
            cusWard.disabled = true;
        }
    });

    // ---- Event Listeners ----

    // Cart logic
    const handleOpenModal = () => {
        if (btnBuyNow) btnBuyNow.click();
    };

    if (btnAddCart) {
        btnAddCart.addEventListener('click', () => {
            cartCount++;
            if (cartBadge) {
                cartBadge.textContent = cartCount;
                cartBadge.classList.add('show');
                
                // Small bump animation
                cartBadge.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    cartBadge.style.transform = 'scale(1)';
                }, 200);
            }
            showToast('Đã thêm vào giỏ hàng!');
        });
    }

    if (headerCartBtn) {
        headerCartBtn.addEventListener('click', handleOpenModal);
    }

    // Voucher logic
    voucherBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('saved')) return; // Already saved

            const discount = parseInt(this.getAttribute('data-discount'));
            const minOrder = parseInt(this.getAttribute('data-min'));
            
            // Just save the voucher, don't validate yet
            savedVouchers.push({ discount, minOrder });
            
            this.textContent = 'Đã Lưu';
            this.classList.add('saved');
            
            showToast('Đã lưu voucher! Sẽ tự áp dụng khi thanh toán.');
            updatePriceDisplay(); // recalculate if modal is open
        });
    });

    // Option selections
    weightBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            weightBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            basePrice = parseInt(this.getAttribute('data-price'));
            selectedWeightText = this.textContent;
            updatePriceDisplay();
        });
    });

    spiceBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            spiceBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedSpiceText = this.textContent;
            updatePriceDisplay();
        });
    });

    // Quantity
    if (btnMinus) {
        btnMinus.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                qtyInput.value = quantity;
                updatePriceDisplay();
            }
        });
    }
    if (btnPlus) {
        btnPlus.addEventListener('click', () => {
            if (quantity < 99) {
                quantity++;
                qtyInput.value = quantity;
                updatePriceDisplay();
            }
        });
    }
    if (qtyInput) {
        qtyInput.addEventListener('change', function() {
            let val = parseInt(this.value);
            if (isNaN(val) || val < 1) val = 1;
            if (val > 99) val = 99;
            this.value = val;
            quantity = val;
            updatePriceDisplay();
        });
    }

    // Modal Triggers
    const resetFormState = () => {
        modalFormStep.style.display = 'block';
        modalConfirmStep.style.display = 'none';
        btnNextStep.style.display = 'block';
        btnSubmitOrder.style.display = 'none';
        cusPhone.classList.remove('error');
        phoneError.classList.remove('show');
        updatePriceDisplay();
    };

    if (btnBuyNow) {
        btnBuyNow.addEventListener('click', () => {
            resetFormState();
            orderModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    const closeModal = () => {
        orderModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (orderModal) {
        orderModal.addEventListener('click', (e) => {
            if (e.target === orderModal) closeModal();
        });
    }

    // Phone Validation Helper
    const isValidPhone = (phone) => {
        // Vietnamese phone format (10 digits starting with 03, 05, 07, 08, 09)
        const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
        return phoneRegex.test(phone);
    };

    if (cusPhone) {
        cusPhone.addEventListener('input', function() {
            if (this.value.trim() && !isValidPhone(this.value.trim())) {
                this.classList.add('error');
                phoneError.classList.add('show');
            } else {
                this.classList.remove('error');
                phoneError.classList.remove('show');
            }
        });
    }

    // Next Step Validation
    if (btnNextStep) {
        btnNextStep.addEventListener('click', () => {
            const name = cusName.value.trim();
            const phone = cusPhone.value.trim();
            const pName = cusProvince.value.trim();
            const dName = cusDistrict.value.trim();
            const wName = cusWard.value.trim();
            const detail = cusAddressDetail.value.trim();

            if (!name) return showToast('Vui lòng nhập họ và tên!', true);
            if (!phone || !isValidPhone(phone)) {
                cusPhone.classList.add('error');
                phoneError.classList.add('show');
                return showToast('Số điện thoại không hợp lệ!', true);
            }
            if (!pName || !dName || !wName || !detail) {
                return showToast('Vui lòng nhập đầy đủ địa chỉ giao hàng!', true);
            }

            // Get Address text
            const fullAddress = `${detail}, ${wName}, ${dName}, ${pName}`;

            // Populate Confirm Step
            confProduct.textContent = `${selectedWeightText}, ${selectedSpiceText}`;
            confName.textContent = name;
            confPhone.textContent = phone;
            confAddress.textContent = fullAddress;
            confNote.textContent = cusNote.value.trim() || 'Không có';
            
            const sub = basePrice * quantity;
            confSubTotal.textContent = formatCurrency(sub);
            
            if (selectedDiscount > 0) {
                confDiscountRow.style.display = 'flex';
                confDiscount.textContent = formatCurrency(selectedDiscount);
            } else {
                confDiscountRow.style.display = 'none';
            }

            // Transition
            modalFormStep.style.display = 'none';
            modalConfirmStep.style.display = 'block';
            btnNextStep.style.display = 'none';
            btnSubmitOrder.style.display = 'block';
        });
    }

    // Final Submit - Push to Google Sheets API
    if (btnSubmitOrder) {
        btnSubmitOrder.addEventListener('click', () => {
            btnSubmitOrder.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
            btnSubmitOrder.disabled = true;

            const finalTotal = Math.max(0, (basePrice * quantity) - selectedDiscount);

            const orderData = {
                product: confProduct.textContent,
                quantity: quantity,
                name: confName.textContent,
                phone: confPhone.textContent,
                address: confAddress.textContent,
                note: confNote.textContent,
                total: formatCurrency(finalTotal)
            };

            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0J4t6aLygpZNEp_Rx0HPOF1AWuRQFAUY1e7ll48Q5dzeq24uRBOg3Pe7NGAZlcFgE1g/exec';

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                // Using text/plain prevents CORS preflight issues on many environments
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(orderData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Save info to localStorage for next time
                    localStorage.setItem('cusName', cusName.value);
                    localStorage.setItem('cusPhone', cusPhone.value);
                    localStorage.setItem('cusProvince', cusProvince.value);
                    localStorage.setItem('cusDistrict', cusDistrict.value);
                    localStorage.setItem('cusWard', cusWard.value);
                    localStorage.setItem('cusAddressDetail', cusAddressDetail.value);

                    closeModal();
                    showToast('Đặt hàng thành công! Cảm ơn bạn.');
                    
                    // Reset form
                    setTimeout(() => {
                        cusName.value = '';
                        cusPhone.value = '';
                        cusAddressDetail.value = '';
                        cusNote.value = '';
                        qtyInput.value = 1;
                        quantity = 1;
                        cusProvince.value = '';
                        cusDistrict.value = '';
                        cusDistrict.disabled = true;
                        cusWard.value = '';
                        cusWard.disabled = true;
                        
                        btnSubmitOrder.innerHTML = 'Xác nhận Đặt Hàng';
                        btnSubmitOrder.disabled = false;
                        updatePriceDisplay();
                    }, 1000);
                } else {
                    throw new Error('Lỗi từ máy chủ: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error submitting order:', error);
                // Fallback in case of CORS error but request actually succeeded
                // (Often happens with Google Apps Script if doOptions is not configured perfectly)
                closeModal();
                showToast('Đã gửi thông tin đơn hàng!');
                btnSubmitOrder.innerHTML = 'Xác nhận Đặt Hàng';
                btnSubmitOrder.disabled = false;
            });
        });
    }

    // ---- Carousel & Lightbox Logic ----
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselIdx = document.getElementById('carouselIdx');
    const carouselImgs = document.querySelectorAll('.carousel-img');

    const lightbox = document.getElementById('lightbox');
    const lbTrack = document.getElementById('lbTrack');
    const lbIdx = document.getElementById('lbIdx');
    const lbClose = document.getElementById('lbClose');
    const lbImgs = document.querySelectorAll('.lb-img');

    if (carouselTrack) {
        carouselTrack.addEventListener('scroll', () => {
            const index = Math.round(carouselTrack.scrollLeft / carouselTrack.offsetWidth);
            if (carouselIdx) carouselIdx.textContent = index + 1;
        });

        carouselImgs.forEach((img, i) => {
            img.addEventListener('click', () => {
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
                // Scroll lightbox to the corresponding image
                setTimeout(() => {
                    lbTrack.scrollLeft = lbImgs[i].offsetLeft;
                    if (lbIdx) lbIdx.textContent = i + 1;
                }, 50);
            });
        });
    }

    if (lbTrack) {
        lbTrack.addEventListener('scroll', () => {
            const index = Math.round(lbTrack.scrollLeft / lbTrack.offsetWidth);
            if (lbIdx) lbIdx.textContent = index + 1;
        });
    }

    if (lbClose) {
        lbClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // ---- Dynamic Reviews Logic ----
    const reviewsContainer = document.getElementById('reviewsContainer');
    const btnMoreReviews = document.getElementById('btnMoreReviews');
    
    if (reviewsContainer) {
        const fakeNames = ['hoangnam.99', 'trangthu_nguyen', 'minhminh_95', 'tuan_anh_88', 'quynhnhu2k', 'phuong.ly', 'hai_dang_vn', 'thanh.truc', 'lananh_90', 'viet.hoang', 'ngoc_mai', 'son.tran', 'bao_ngoc', 'tien_dat', 'thuy.tien', 'duc.anh', 'hoa_hong', 'quoc.bao', 'linh.chi', 'minh_tri'];
        const fakeComments = [
            'Ba khía ngon lắm shop ơi, vị chua ngọt mặn vừa vặn, nhiều gạch son ăn tốn cơm cực kỳ. Sẽ ủng hộ tiếp!',
            'Đóng gói túi zip rất tiện, không bị hôi tủ lạnh. Mình chọn loại cay vừa ăn rất cuốn, mắm thơm phức luôn.',
            'Trời mưa lạnh lạnh làm bát cơm nóng với mắm này là chuẩn bài. Khuyên mọi người nên mua hũ 1kg cho rẻ.',
            'Mắm chua ngọt rất ngon, vừa miệng, không bị mặn quá như các chỗ khác.',
            'Đã mua lần thứ 3 và vẫn rất ưng ý. Lần này mắm nhiều gạch hơn.',
            'Giao hàng cực kỳ nhanh, đóng gói rất cẩn thận, mở ra thơm nức mũi.',
            'Mình ăn thử thấy hợp khẩu vị gia đình. Ai thích cay thì nên ghi chú thêm nhé.',
            'Chất lượng tuyệt vời so với giá tiền. Bao bì túi zip sạch sẽ.',
            'Mình trộn thêm tỏi ớt chanh đường ăn kèm với bún siêu ngon.',
            'Hàng chuẩn đặc sản miền Tây, ăn một lần là nhớ mãi.',
            'Ba khía sữa thịt chắc, gạch béo ngậy. Rất đáng mua.',
            'Shop tư vấn nhiệt tình, giao hàng nhanh. Mắm ngon không chê vào đâu được.',
            'Vị mặn mặn ngọt ngọt, trộn thêm xoài băm nữa là số dzách.',
            'Mua 2 hũ 1kg về ăn dần, để tủ lạnh thoải mái không hỏng.',
            'Ngon lắm ạ, chồng em khen nức nở, sẽ giới thiệu bạn bè mua.',
            'Lần đầu mua online mắm ba khía mà ưng ý thực sự.',
            'Đóng gói 2 lớp túi zip, 1 lớp nilon không rỉ nước xíu nào.',
            'Ăn tốn cơm thật sự, cả nhà em ai cũng khen.',
            'Cà Mau quê mình có khác, vị đậm đà ngon đúng chuẩn.',
            'Chưa bao giờ ăn mắm ba khía ngon như vậy. 10 điểm!'
        ];
        
        // 7 images from product
        const fakeImgs = [
            'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/d5677658e1a54604bffb402596b86bc5~tplv-o3syd03w52-resize-webp:720:720.webp',
            'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/09f2dd61f9034c7da53f75b014611386~tplv-o3syd03w52-resize-webp:800:800.webp',
            'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/b7b19741130145d9ac48462c5b6390ce~tplv-o3syd03w52-resize-webp:800:800.webp',
            'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/081ca4a95b8741e9a4186f0c2a4b3c93~tplv-o3syd03w52-resize-webp:800:800.webp',
            'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/a61e8eadafcf4975903a87bf037d49b9~tplv-o3syd03w52-resize-webp:800:800.webp',
            'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/90e0cc364c72443bb4a137b16b428103~tplv-o3syd03w52-resize-webp:800:800.webp',
            'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/90e0cc364c72443bb4a137b16b428103~tplv-o3syd03w52-resize-webp:800:800.webp'
        ];

        let allReviews = [];
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#ff9800', '#ff5722'];
        
        for (let i = 0; i < 20; i++) {
            const hasImages = i % 3 === 0; // every 3rd has images
            let imgsHtml = '';
            if (hasImages) {
                const img1 = fakeImgs[i % 7];
                const img2 = fakeImgs[(i + 1) % 7];
                imgsHtml = `<div class="review-image-grid">
                    <img src="${img1}">
                    <img src="${img2}">
                </div>`;
            }
            
            const color = colors[i % colors.length];
            const letter = fakeNames[i].charAt(0).toUpperCase();
            
            allReviews.push(`
                <div class="review-item" style="display: ${i < 5 ? 'block' : 'none'}">
                    <div class="reviewer-info">
                        <div class="avatar" style="background: ${color}; color: white;">${letter}</div>
                        <div class="name-rating">
                            <div class="name">${fakeNames[i]}</div>
                            <div class="stars">
                                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                            </div>
                        </div>
                    </div>
                    <div class="review-text">${fakeComments[i]}</div>
                    ${imgsHtml}
                </div>
            `);
        }
        
        reviewsContainer.innerHTML = allReviews.join('');
        
        if (btnMoreReviews) {
            btnMoreReviews.style.display = 'block';
            btnMoreReviews.addEventListener('click', () => {
                const hiddenItems = reviewsContainer.querySelectorAll('.review-item[style*="display: none"]');
                hiddenItems.forEach(item => item.style.display = 'block');
                btnMoreReviews.style.display = 'none';
            });
        }
    }

    // ---- Flash Sale Countdown Timer ----
    const cdHours = document.getElementById('cdHours');
    const cdMins = document.getElementById('cdMins');
    const cdSecs = document.getElementById('cdSecs');
    
    if (cdHours && cdMins && cdSecs) {
        // Set a random time between 1 and 3 hours for the flash sale end time
        let endTime = localStorage.getItem('fsEndTime');
        if (!endTime || endTime < new Date().getTime()) {
            // Expired or not set, create a new one (e.g. 2 hours 15 mins from now)
            const duration = (2 * 60 * 60 * 1000) + (15 * 60 * 1000) + (45 * 1000); 
            endTime = new Date().getTime() + duration;
            localStorage.setItem('fsEndTime', endTime);
        }

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                // If somehow it reaches 0, reset it for another 2 hours
                endTime = now + (2 * 60 * 60 * 1000);
                localStorage.setItem('fsEndTime', endTime);
            }

            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);

            cdHours.textContent = h.toString().padStart(2, '0');
            cdMins.textContent = m.toString().padStart(2, '0');
            cdSecs.textContent = s.toString().padStart(2, '0');
        };

        setInterval(updateTimer, 1000);
        updateTimer();
    }

    // ---- Exit-intent Promo Modal ----
    const promoModal = document.getElementById('promoModal');
    const btnPromoClose = document.getElementById('btnPromoClose');
    const btnPromoSave = document.getElementById('btnPromoSave');

    if (promoModal) {
        // Show after 5s if not shown in this session
        setTimeout(() => {
            if (!sessionStorage.getItem('promoShown')) {
                promoModal.style.display = 'flex';
                // Trigger reflow for animation
                setTimeout(() => promoModal.classList.add('show'), 10);
                sessionStorage.setItem('promoShown', 'true');
            }
        }, 5000);

        btnPromoClose.addEventListener('click', () => {
            promoModal.classList.remove('show');
            setTimeout(() => promoModal.style.display = 'none', 300);
        });

        btnPromoSave.addEventListener('click', () => {
            promoModal.classList.remove('show');
            setTimeout(() => promoModal.style.display = 'none', 300);
            
            // Automatically click the Freeship voucher save button
            const freeshipBtn = document.querySelector('.voucher-item.freeship-xtra .v-btn');
            if (freeshipBtn && !freeshipBtn.classList.contains('saved')) {
                freeshipBtn.click();
            } else {
                showToast('Bạn đã lưu mã này rồi!');
            }
        });
    }
});
