// ===== CMS CONFIGURATION =====
// Paste your Google Apps Script URL here
const CMS_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0J4t6aLygpZNEp_Rx0HPOF1AWuRQFAUY1e7ll48Q5dzeq24uRBOg3Pe7NGAZlcFgE1g/exec';

document.addEventListener('DOMContentLoaded', () => {
    if (!CMS_APPS_SCRIPT_URL) return;

    // Show loading skeleton if elements exist
    document.body.classList.add('cms-loading');

    // Fetch config from Google Sheets
    fetch(CMS_APPS_SCRIPT_URL + "?action=getConfig")
        .then(response => response.json())
        .then(data => {
            // Save global config
            window.CMS_CONFIG = data;

            // --- Update Homepage ---
            if (document.getElementById('cms-home-name') && data.TenSanPham) {
                document.getElementById('cms-home-name').innerHTML = data.TenSanPham;
            }
            if (document.getElementById('cms-home-price') && data.GiaKhuyenMai) {
                document.getElementById('cms-home-price').innerText = formatCurrency(data.GiaKhuyenMai) + '₫';
            }
            if (document.getElementById('cms-home-oldprice') && data.GiaGoc) {
                document.getElementById('cms-home-oldprice').innerText = formatCurrency(data.GiaGoc) + '₫';
            }
            if (document.getElementById('cms-home-img') && data.HinhAnhSanPham) {
                document.getElementById('cms-home-img').src = data.HinhAnhSanPham;
            }

            // --- Update Product Page ---
            if (document.getElementById('cms-product-name') && data.TenSanPham) {
                document.getElementById('cms-product-name').innerHTML = '<span class="mall-badge">Mall</span> ' + data.TenSanPham;
            }
            if (document.getElementById('cms-product-price') && data.GiaKhuyenMai) {
                document.getElementById('cms-product-price').innerText = formatCurrency(data.GiaKhuyenMai);
                document.getElementById('modalPrice').innerText = formatCurrency(data.GiaKhuyenMai);
            }
            if (document.getElementById('cms-product-oldprice') && data.GiaGoc) {
                document.getElementById('cms-product-oldprice').innerText = '₫' + formatCurrency(data.GiaGoc);
            }
            if (document.getElementById('cms-product-img') && data.HinhAnhSanPham) {
                document.getElementById('cms-product-img').src = data.HinhAnhSanPham;
            }
            if (document.getElementById('cms-product-desc-img') && data.HinhAnhSanPham) {
                document.getElementById('cms-product-desc-img').src = data.HinhAnhSanPham;
            }
            if (document.getElementById('cms-modal-thumb') && data.HinhAnhSanPham) {
                document.getElementById('cms-modal-thumb').src = data.HinhAnhSanPham;
            }

            // Notify script.js that CMS is loaded
            const event = new CustomEvent('cmsLoaded', { detail: data });
            document.dispatchEvent(event);
            
            document.body.classList.remove('cms-loading');
        })
        .catch(err => {
            console.error("Lỗi khi tải dữ liệu từ CMS:", err);
            document.body.classList.remove('cms-loading');
        });
});

function formatCurrency(number) {
    if(!number) return '0';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
