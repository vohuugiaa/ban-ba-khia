(function() {
    // Tự động bật Edit Mode nếu đang mở file trên máy tính (local) HOẶC có tham số edit=true
    const isLocal = window.location.protocol === 'file:';
    const isEditMode = window.location.search.includes('edit=true');
    if (!isLocal && !isEditMode) return;

    // ----- 1. Thêm Style cho Edit Mode -----
    const style = document.createElement('style');
    style.id = 'editor-style';
    style.innerHTML = `
        .editor-mode-active [contenteditable="true"] {
            outline: 2px dashed #ff477e;
            padding: 2px;
            border-radius: 4px;
            transition: all 0.2s;
        }
        .editor-mode-active [contenteditable="true"]:hover {
            background: rgba(255, 71, 126, 0.1);
            cursor: text;
        }
        .editor-mode-active img {
            outline: 2px dashed #00b4d8;
            cursor: pointer;
            transition: all 0.2s;
        }
        .editor-mode-active img:hover {
            opacity: 0.8;
            box-shadow: 0 0 10px #00b4d8;
        }
        #editor-panel {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #111;
            color: #fff;
            padding: 12px 24px;
            border-radius: 30px;
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            font-family: sans-serif;
            font-size: 14px;
        }
        #editor-btn-save {
            background: #fe2c55;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
        }
        #editor-btn-save:hover { background: #e0264b; }
    `;
    document.head.appendChild(style);
    document.body.classList.add('editor-mode-active');

    // ----- 2. Tạo Bảng Điều Khiển (Editor Panel) -----
    const panel = document.createElement('div');
    panel.id = 'editor-panel';
    panel.innerHTML = `
        <span>🛠 <b>CHẾ ĐỘ CHỈNH SỬA</b> (Click đúp sửa chữ, Click ảnh để đổi file)</span>
        <button id="editor-btn-save">Lưu Bản Hoàn Chỉnh</button>
    `;
    document.body.appendChild(panel);

    // ----- 3. Biến chữ thành có thể chỉnh sửa -----
    const textSelectors = 'h1, h2, h3, p, span.price-current, span.price-old, span.current-price, span.old-price, span.amount, .p-name';
    const textElements = document.querySelectorAll(textSelectors);
    textElements.forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && el.tagName !== 'P') {
                e.preventDefault();
            }
        });
    });

    // ----- 4. Xử lý đổi hình ảnh bằng công cụ Upload & Tự nén -----
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg, image/png, image/webp';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    let currentEditingImage = null;

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file || !currentEditingImage) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const imgObj = new Image();
            imgObj.onload = function() {
                // Resize / Compress image
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                let width = imgObj.width;
                let height = imgObj.height;

                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(imgObj, 0, 0, width, height);

                // Nén ảnh sang Base64
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
                
                // Gán ảnh vào giao diện
                currentEditingImage.src = compressedBase64;
                currentEditingImage.setAttribute('src', compressedBase64);
                
                // Reset input
                fileInput.value = '';
            };
            imgObj.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            currentEditingImage = img;
            fileInput.click(); // Mở hộp thoại chọn file
        });
    });

    // ----- 4.5. Truyền tham số edit=true cho các link (nếu không chạy local) -----
    document.querySelectorAll('a').forEach(a => {
        let href = a.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            if (!isLocal && !href.includes('edit=true')) {
                a.setAttribute('href', href.includes('?') ? href + '&edit=true' : href + '?edit=true');
            }
        }
    });

    // ----- 5. Xử lý nút Lưu & Tải Về -----
    document.getElementById('editor-btn-save').addEventListener('click', () => {
        if(!confirm("Bạn đã thiết kế xong và muốn lưu lại file này?")) return;

        // Dọn dẹp
        textElements.forEach(el => el.removeAttribute('contenteditable'));
        document.body.classList.remove('editor-mode-active');
        document.head.removeChild(style);
        document.body.removeChild(panel);
        document.body.removeChild(fileInput);
        
        let htmlContent = document.documentElement.outerHTML;
        const blob = new Blob(["<!DOCTYPE html>\\n<html lang=\\"vi\\">\\n" + htmlContent + "\\n</html>"], {type: "text/html;charset=utf-8"});
        const a = document.createElement("a");
        const url = URL.createObjectURL(blob);
        a.href = url;
        
        const pathname = window.location.pathname;
        let filename = "index.html";
        if (pathname.includes("san-pham/mam-ba-khia-sua")) {
            filename = "index.html"; // Luôn lưu đè vào index.html hiện tại
        }

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            alert("✅ Đã lưu xong!\n\nHãy chép đè file vừa tải về vào thư mục gốc.\nSau đó mở Terminal và gõ: git add . && git commit -m 'update' && git push origin main");
            window.location.reload();
        }, 100);
    });

})();
