document.addEventListener('DOMContentLoaded', () => {
    // ---- State ----
    let basePrice = 125000;
    let selectedDiscount = 0;
    let quantity = 1;
    let selectedWeightText = 'Hũ 500g';
    let selectedSpiceText = 'Không cay';
    
    // Vouchers state
    let savedVouchers = []; // Array of { id, discount, min, text }
    let appliedVoucherId = null;

    // Address data
    let provincesData = [];
    let districtsData = [];
    let wardsData = [];

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
    const saveVoucherBtns = document.querySelectorAll('.save-voucher-btn');
    const checkoutSavedVouchers = document.getElementById('checkoutSavedVouchers');
    const checkoutAppliedVoucherText = document.getElementById('checkoutAppliedVoucherText');
    
    // Cart
    const btnAddCart = document.getElementById('btnAddCart');
    const cartBadge = document.getElementById('cartBadge');
    const btnHeaderCart = document.getElementById('btnHeaderCart');
    let cartCount = 0;

    // Modal
    const orderModal = document.getElementById('orderModal');
    const btnBuyNow = document.getElementById('btnBuyNow');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const modalFormStep = document.getElementById('modalFormStep');
    const modalConfirmStep = document.getElementById('modalConfirmStep');
    
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
    const confQty = document.getElementById('confQty');
    const confName = document.getElementById('confName');
    const confPhone = document.getElementById('confPhone');
    const confAddress = document.getElementById('confAddress');
    const confNote = document.getElementById('confNote');
    const confSubTotal = document.getElementById('confSubTotal');
    const confDiscountRow = document.getElementById('confDiscountRow');
    const confDiscount = document.getElementById('confDiscount');

    // Custom Alert Elements
    const customAlert = document.getElementById('customAlert');
    const customAlertMsg = document.getElementById('customAlertMsg');
    const customAlertBtn = document.getElementById('customAlertBtn');

    // ---- Helpers ----
    const formatCurrency = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const showCustomAlert = (msg) => {
        customAlertMsg.textContent = msg;
        customAlert.classList.add('active');
    };

    customAlertBtn.addEventListener('click', () => {
        customAlert.classList.remove('active');
    });

    const showToast = (msg) => {
        const toast = document.getElementById('successToast');
        document.getElementById('toastMsg').textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    };

    const updatePriceDisplay = () => {
        const subTotal = basePrice * quantity;
        
        // Check if applied voucher is still valid
        if (appliedVoucherId) {
            const v = savedVouchers.find(v => v.id === appliedVoucherId);
            if (v && subTotal < v.min) {
                // No longer valid due to quantity decrease
                appliedVoucherId = null;
                selectedDiscount = 0;
                checkoutAppliedVoucherText.textContent = "Chưa chọn";
                showToast("Voucher đã bị gỡ vì chưa đủ điều kiện!");
                renderCheckoutVouchers();
            }
        }

        const total = Math.max(0, subTotal - selectedDiscount);
        
        displayPriceEl.textContent = formatCurrency(basePrice);
        modalPriceEl.textContent = formatCurrency(basePrice);
        totalPriceEl.textContent = formatCurrency(total);
        selectedVariantDisplay.textContent = `${selectedWeightText}, ${selectedSpiceText}`;
    };

    // ---- Address API ----
    fetch('https://provinces.open-api.vn/api/?depth=3')
        .then(response => response.json())
        .then(data => {
            provincesData = data;
            provincesData.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.code;
                opt.textContent = p.name;
                cusProvince.appendChild(opt);
            });
        })
        .catch(err => console.error("Error fetching address API", err));

    cusProvince.addEventListener('change', (e) => {
        const pCode = e.target.value;
        cusDistrict.innerHTML = '<option value="">Chọn Quận/Huyện</option>';
        cusWard.innerHTML = '<option value="">Chọn Phường/Xã</option>';
        cusWard.disabled = true;

        if (pCode) {
            const province = provincesData.find(p => p.code == pCode);
            districtsData = province.districts || [];
            districtsData.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.code;
                opt.textContent = d.name;
                cusDistrict.appendChild(opt);
            });
            cusDistrict.disabled = false;
        } else {
            cusDistrict.disabled = true;
        }
    });

    cusDistrict.addEventListener('change', (e) => {
        const dCode = e.target.value;
        cusWard.innerHTML = '<option value="">Chọn Phường/Xã</option>';
        
        if (dCode) {
            const district = districtsData.find(d => d.code == dCode);
            wardsData = district.wards || [];
            wardsData.forEach(w => {
                const opt = document.createElement('option');
                opt.value = w.code;
                opt.textContent = w.name;
                cusWard.appendChild(opt);
            });
            cusWard.disabled = false;
        } else {
            cusWard.disabled = true;
        }
    });

    // ---- Event Listeners ----

    // Cart logic
    btnAddCart.addEventListener('click', () => {
        cartCount++;
        cartBadge.textContent = cartCount;
        cartBadge.classList.add('show');
        
        // Small bump animation
        cartBadge.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartBadge.style.transform = 'scale(1)';
        }, 200);

        showToast('Đã thêm vào giỏ hàng!');
    });

    btnHeaderCart.addEventListener('click', () => {
        if (cartCount === 0) {
            showCustomAlert('Giỏ hàng của bạn đang trống.');
        } else {
            // Open modal to checkout
            resetFormState();
            orderModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    // Voucher logic
    const renderCheckoutVouchers = () => {
        if (savedVouchers.length === 0) {
            checkoutSavedVouchers.innerHTML = '<p class="empty-voucher-text">Bạn chưa lưu voucher nào.</p>';
            return;
        }

        checkoutSavedVouchers.innerHTML = '';
        const currentSubtotal = basePrice * quantity;

        savedVouchers.forEach(v => {
            const isEligible = currentSubtotal >= v.min;
            const isApplied = appliedVoucherId === v.id;
            
            const vEl = document.createElement('div');
            vEl.className = `checkout-voucher-item ${!isEligible ? 'disabled' : ''}`;
            vEl.innerHTML = `
                <div class="cv-info">
                    <strong>${v.text}</strong>
                    <div class="cv-min">Đơn tối thiểu ${formatCurrency(v.min)}đ</div>
                </div>
                <button class="cv-btn ${isApplied ? 'applied' : ''}" ${!isEligible ? 'disabled' : ''}>
                    ${isApplied ? 'Đã áp dụng' : 'Áp dụng'}
                </button>
            `;

            if (isEligible) {
                const btn = vEl.querySelector('.cv-btn');
                btn.addEventListener('click', () => {
                    if (isApplied) {
                        // Unapply
                        appliedVoucherId = null;
                        selectedDiscount = 0;
                        checkoutAppliedVoucherText.textContent = "Chưa chọn";
                    } else {
                        // Apply
                        appliedVoucherId = v.id;
                        selectedDiscount = v.discount;
                        checkoutAppliedVoucherText.textContent = v.text;
                        showToast(`Đã áp dụng ${v.text}`);
                    }
                    renderCheckoutVouchers();
                    updatePriceDisplay();
                });
            }

            checkoutSavedVouchers.appendChild(vEl);
        });
    };

    saveVoucherBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const discount = parseInt(this.getAttribute('data-discount'));
            const min = parseInt(this.getAttribute('data-min'));
            const text = this.getAttribute('data-text');

            // Check if already saved
            if (!savedVouchers.find(v => v.id === id)) {
                savedVouchers.push({ id, discount, min, text });
                this.textContent = 'Đã Lưu';
                this.classList.add('saved');
                showToast('Đã lưu voucher vào ví!');
                renderCheckoutVouchers();
            }
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
            renderCheckoutVouchers(); // re-render to update eligibility
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
    btnMinus.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            qtyInput.value = quantity;
            updatePriceDisplay();
            renderCheckoutVouchers();
        }
    });
    btnPlus.addEventListener('click', () => {
        if (quantity < 99) {
            quantity++;
            qtyInput.value = quantity;
            updatePriceDisplay();
            renderCheckoutVouchers();
        }
    });
    qtyInput.addEventListener('change', function() {
        let val = parseInt(this.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 99) val = 99;
        this.value = val;
        quantity = val;
        updatePriceDisplay();
        renderCheckoutVouchers();
    });

    // Modal Triggers
    const resetFormState = () => {
        modalFormStep.style.display = 'block';
        modalConfirmStep.style.display = 'none';
        btnNextStep.style.display = 'block';
        btnSubmitOrder.style.display = 'none';
        cusPhone.classList.remove('error');
        phoneError.classList.remove('show');
        renderCheckoutVouchers(); // Ensure vouchers are fresh
    };

    btnBuyNow.addEventListener('click', () => {
        resetFormState();
        orderModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    const closeModal = () => {
        orderModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    btnCloseModal.addEventListener('click', closeModal);
    orderModal.addEventListener('click', (e) => {
        if (e.target === orderModal) closeModal();
    });

    // Phone Validation Helper
    const isValidPhone = (phone) => {
        const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
        return phoneRegex.test(phone);
    };

    cusPhone.addEventListener('input', function() {
        if (this.value.trim() && !isValidPhone(this.value.trim())) {
            this.classList.add('error');
            phoneError.classList.add('show');
        } else {
            this.classList.remove('error');
            phoneError.classList.remove('show');
        }
    });

    // Next Step Validation
    btnNextStep.addEventListener('click', () => {
        const name = cusName.value.trim();
        const phone = cusPhone.value.trim();
        const pCode = cusProvince.value;
        const dCode = cusDistrict.value;
        const wCode = cusWard.value;
        const detail = cusAddressDetail.value.trim();

        if (!name) return showCustomAlert('Vui lòng nhập họ và tên người nhận!');
        if (!phone || !isValidPhone(phone)) {
            cusPhone.classList.add('error');
            phoneError.classList.add('show');
            return showCustomAlert('Số điện thoại không hợp lệ! Vui lòng kiểm tra lại.');
        }
        if (!pCode || !dCode || !wCode || !detail) {
            return showCustomAlert('Vui lòng chọn đầy đủ địa chỉ giao hàng!');
        }

        // Get Address text
        const pName = cusProvince.options[cusProvince.selectedIndex].text;
        const dName = cusDistrict.options[cusDistrict.selectedIndex].text;
        const wName = cusWard.options[cusWard.selectedIndex].text;
        const fullAddress = `${detail}, ${wName}, ${dName}, ${pName}`;

        // Populate Confirm Step
        confProduct.textContent = `${selectedWeightText}, ${selectedSpiceText}`;
        confQty.textContent = quantity;
        confName.textContent = name;
        confPhone.textContent = phone;
        confAddress.textContent = fullAddress;
        confNote.textContent = cusNote.value.trim() || 'Không';
        
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

    // Final Submit
    btnSubmitOrder.addEventListener('click', () => {
        btnSubmitOrder.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        btnSubmitOrder.disabled = true;

        setTimeout(() => {
            closeModal();
            showToast('Đặt hàng thành công! Cảm ơn bạn.');
            
            setTimeout(() => {
                // Hard reset page or form if needed
                btnSubmitOrder.innerHTML = 'Xác nhận Đặt Hàng';
                btnSubmitOrder.disabled = false;
                cartCount = 0;
                cartBadge.classList.remove('show');
            }, 3000);
        }, 1500);
    });
});
