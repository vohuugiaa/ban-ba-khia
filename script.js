document.addEventListener('DOMContentLoaded', () => {
    // ---- DOM Elements ----
    
    // Product Options
    const weightBtns = document.querySelectorAll('#weightOptions .option-btn');
    const spiceBtns = document.querySelectorAll('#spiceOptions .option-btn');
    const displayPriceEl = document.getElementById('displayPrice');
    const totalPriceEl = document.getElementById('totalPrice');
    const summarySubTotal = document.getElementById('summarySubTotal');

    // Quantity
    const btnMinus = document.getElementById('btnMinus');
    const btnPlus = document.getElementById('btnPlus');
    const qtyInput = document.getElementById('qtyInput');

    // Form Fields
    const cusName = document.getElementById('cusName');
    const cusPhone = document.getElementById('cusPhone');
    const phoneError = document.getElementById('phoneError');
    const cusAddressDetail = document.getElementById('cusAddressDetail');
    const cusNote = document.getElementById('cusNote');
    
    const cusProvince = document.getElementById('cusProvince');
    const cusDistrict = document.getElementById('cusDistrict');
    const cusWard = document.getElementById('cusWard');
    
    const btnSubmitOrder = document.getElementById('btnSubmitOrder');
    const btnScrollToOrder = document.getElementById('btnScrollToOrder');
    const btnStickyOrder = document.getElementById('btnStickyOrder');
    const orderSection = document.getElementById('orderSection');
    const stickyOrderBar = document.getElementById('stickyOrderBar');
    
    const successToast = document.getElementById('successToast');

    // ---- State ----
    let basePrice = 125000;
    let quantity = 1;
    let selectedWeightText = 'Hũ 500g';
    let selectedSpiceText = 'Không cay';
    
    // Address data
    let provincesData = [];
    let districtsData = [];
    let wardsData = [];
    
    // ---- Utils ----
    const formatCurrency = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const showToast = (message, isError = false) => {
        successToast.innerHTML = isError ? `<i class="fas fa-exclamation-circle"></i> <span>${message}</span>` : `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
        successToast.style.background = isError ? '#ff4d4f' : 'var(--highlight-color)';
        successToast.classList.add('show');
        setTimeout(() => successToast.classList.remove('show'), 3000);
    };

    // ---- Price Logic ----
    const updatePriceDisplay = () => {
        const subTotal = basePrice * quantity;
        
        // In Mekong Delta theme, freeship is automatically applied. 
        // We just display the subtotal as the total.
        const total = subTotal;
        
        if (displayPriceEl) displayPriceEl.textContent = formatCurrency(basePrice);
        if (summarySubTotal) summarySubTotal.textContent = formatCurrency(subTotal);
        if (totalPriceEl) totalPriceEl.textContent = formatCurrency(total);
    };

    // ---- Event Listeners ----

    // Smooth Scroll to Order Form
    const scrollToOrder = () => {
        orderSection.scrollIntoView({ behavior: 'smooth' });
    };

    if (btnScrollToOrder) btnScrollToOrder.addEventListener('click', scrollToOrder);
    if (btnStickyOrder) btnStickyOrder.addEventListener('click', scrollToOrder);

    // Sticky Order Bar is now purely CSS driven (always visible)

    // Options
    weightBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            weightBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            basePrice = parseInt(this.getAttribute('data-price'));
            selectedWeightText = this.textContent;
            updatePriceDisplay();
        });
    });

    spiceBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            spiceBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedSpiceText = this.textContent;
        });
    });

    // Quantity
    if (btnMinus) {
        btnMinus.addEventListener('click', (e) => {
            e.preventDefault();
            if (quantity > 1) {
                quantity--;
                qtyInput.value = quantity;
                updatePriceDisplay();
            }
        });
    }
    if (btnPlus) {
        btnPlus.addEventListener('click', (e) => {
            e.preventDefault();
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

    // Phone Validation
    const isValidPhone = (phone) => {
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

    // ---- Address API ----
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

    let selectedProvinceCode = null;
    let selectedDistrictCode = null;

    fetch('https://provinces.open-api.vn/api/?depth=3')
        .then(response => response.json())
        .then(data => {
            provincesData = data;
            const pList = document.getElementById('provinceList');
            if(pList) {
                provincesData.forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p.name;
                    opt.setAttribute('data-code', p.code);
                    pList.appendChild(opt);
                });
            }
            loadSavedCustomerData();
        })
        .catch(err => console.error("Error fetching address API", err));

    if (cusProvince) {
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
    }

    if (cusDistrict) {
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
    }

    // ---- Submit Order ----
    if (btnSubmitOrder) {
        btnSubmitOrder.addEventListener('click', () => {
            const name = cusName.value.trim();
            const phone = cusPhone.value.trim();
            const pName = cusProvince.value.trim();
            const dName = cusDistrict.value.trim();
            const wName = cusWard.value.trim();
            const detail = cusAddressDetail.value.trim();
            const note = cusNote.value.trim() || 'Không có';

            if (!name) return showToast('Bà con vui lòng nhập họ và tên!', true);
            if (!phone || !isValidPhone(phone)) {
                cusPhone.classList.add('error');
                phoneError.classList.add('show');
                return showToast('Số điện thoại không hợp lệ!', true);
            }
            if (!pName || !dName || !wName || !detail) {
                return showToast('Bà con nhập đầy đủ địa chỉ giao hàng nha!', true);
            }

            const fullAddress = `${detail}, ${wName}, ${dName}, ${pName}`;
            const productName = `${selectedWeightText}, ${selectedSpiceText}`;
            const total = basePrice * quantity;

            btnSubmitOrder.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi đơn...';
            btnSubmitOrder.disabled = true;

            const orderData = {
                product: productName,
                quantity: quantity,
                name: name,
                phone: phone,
                address: fullAddress,
                note: note,
                total: formatCurrency(total)
            };

            // Fire Tracking Pixels (FB/TikTok) here if they exist
            if (typeof fbq === 'function') {
                // fbq('track', 'Purchase', {value: total, currency: 'VND'});
            }
            if (typeof ttq === 'function') {
                // ttq.track('CompletePayment', {value: total, currency: 'VND'});
            }

            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0J4t6aLygpZNEp_Rx0HPOF1AWuRQFAUY1e7ll48Q5dzeq24uRBOg3Pe7NGAZlcFgE1g/exec';

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(orderData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Save info to localStorage for next time
                    localStorage.setItem('cusName', name);
                    localStorage.setItem('cusPhone', phone);
                    localStorage.setItem('cusProvince', pName);
                    localStorage.setItem('cusDistrict', dName);
                    localStorage.setItem('cusWard', wName);
                    localStorage.setItem('cusAddressDetail', detail);

                    showToast('Bà con đặt hàng thành công! Shop sẽ gọi lại xác nhận nghen.');
                    
                    // Reset form slightly later
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
                        
                        btnSubmitOrder.innerHTML = 'CHỐT ĐƠN HÀNG';
                        btnSubmitOrder.disabled = false;
                        updatePriceDisplay();
                    }, 1500);
                } else {
                    throw new Error('Lỗi từ máy chủ: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error submitting order:', error);
                showToast('Có lỗi xảy ra, bà con gọi Hotline giúp shop nghen!', true);
                btnSubmitOrder.innerHTML = 'CHỐT ĐƠN HÀNG';
                btnSubmitOrder.disabled = false;
            });
        });
    }

    // ---- Carousel Logic ----
    const track = document.getElementById('carouselTrack');
    const indicator = document.getElementById('carouselIdx');
    if (track && indicator) {
        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });
        track.addEventListener('mouseleave', () => isDown = false);
        track.addEventListener('mouseup', () => isDown = false);
        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2;
            track.scrollLeft = scrollLeft - walk;
        });

        track.addEventListener('scroll', () => {
            const width = track.clientWidth;
            const idx = Math.round(track.scrollLeft / width) + 1;
            indicator.textContent = idx;
        });
    }

    // ---- Lightbox Logic ----
    const productImgs = document.querySelectorAll('.carousel-img, .desc-img');
    const lightbox = document.getElementById('lightbox');
    const lbTrack = document.getElementById('lbTrack');
    const lbIdx = document.getElementById('lbIdx');
    const lbClose = document.getElementById('lbClose');
    
    if (lightbox && lbTrack) {
        productImgs.forEach((img, index) => {
            img.addEventListener('click', () => {
                lightbox.classList.add('active');
                // Scroll to corresponding image
                const targetImg = index >= 7 ? 0 : index;
                const width = window.innerWidth;
                lbTrack.scrollLeft = width * targetImg;
                lbIdx.textContent = targetImg + 1;
            });
        });

        lbClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lbTrack.addEventListener('scroll', () => {
            const width = lbTrack.clientWidth;
            const idx = Math.round(lbTrack.scrollLeft / width) + 1;
            lbIdx.textContent = idx;
        });
    }

    // ---- Countdown Logic ----
    const setCountdown = () => {
        let hours = 2;
        let mins = 15;
        let secs = 45;
        
        const hEl = document.getElementById('cdHours');
        const mEl = document.getElementById('cdMins');
        const sEl = document.getElementById('cdSecs');
        
        if(!hEl) return;

        setInterval(() => {
            if(secs > 0) secs--;
            else {
                secs = 59;
                if(mins > 0) mins--;
                else {
                    mins = 59;
                    if(hours > 0) hours--;
                    else {
                        hours = 2; // reset
                    }
                }
            }
            hEl.textContent = hours.toString().padStart(2, '0');
            mEl.textContent = mins.toString().padStart(2, '0');
            sEl.textContent = secs.toString().padStart(2, '0');
        }, 1000);
    };
    
    setCountdown();
    updatePriceDisplay();

    // ---- FOMO Logic ----
    const fomoPopup = document.getElementById('fomoPopup');
    const fomoName = document.getElementById('fomoName');
    const fomoAction = document.getElementById('fomoAction');
    const fomoTime = document.getElementById('fomoTime');
    
    const fomoData = [
        { name: 'Chị Lan (TP.HCM)', action: 'Vừa đặt mua 2 hũ 500g' },
        { name: 'Anh Tuấn (Hà Nội)', action: 'Vừa mua 1 hũ 1Kg (Cay vừa)' },
        { name: 'Cô Oanh (Cà Mau)', action: 'Vừa chốt đơn 3 hũ 500g' },
        { name: 'Chị Mai (Bình Dương)', action: 'Vừa đặt mua 1 hũ 500g (Siêu cay)' },
        { name: 'Chú Hùng (Đồng Nai)', action: 'Vừa chốt 2 hũ 1Kg' },
        { name: 'Em Yến (Cần Thơ)', action: 'Vừa đặt mua 1 hũ 500g' },
        { name: 'Khách hàng (Vũng Tàu)', action: 'Vừa đặt mua 2 hũ 500g' }
    ];

    const showRandomFomo = () => {
        if (!fomoPopup) return;
        
        const randomItem = fomoData[Math.floor(Math.random() * fomoData.length)];
        const randomMins = Math.floor(Math.random() * 15) + 1; // 1-15 mins ago
        
        fomoName.textContent = randomItem.name;
        fomoAction.textContent = randomItem.action;
        fomoTime.textContent = `${randomMins} phút trước`;
        
        fomoPopup.classList.add('show');
        
        // Hide after 4 seconds
        setTimeout(() => {
            fomoPopup.classList.remove('show');
        }, 4000);
    };

    // Initial delay then trigger every 15 seconds
    setTimeout(() => {
        showRandomFomo();
        setInterval(showRandomFomo, 15000);
    }, 5000);

});
