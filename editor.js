(function() {
    // Chỉ bật Edit Mode nếu URL có ?edit=true
    if (!window.location.search.includes('edit=true')) return;

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
        <span>🛠 <b>CHẾ ĐỘ CHỈNH SỬA</b> (Click đúp để sửa chữ, Click vào ảnh để đổi)</span>
        <button id="editor-btn-save">Tải File HTML Mới</button>
    `;
    document.body.appendChild(panel);

    // ----- 3. Biến chữ thành có thể chỉnh sửa -----
    const textSelectors = 'h1, h2, h3, p, span.price-current, span.price-old, span.current-price, span.old-price, span.amount, .p-name';
    const textElements = document.querySelectorAll(textSelectors);
    textElements.forEach(el => {
        el.setAttribute('contenteditable', 'true');
        // Không cho phép gõ Enter tạo dòng mới trong các thẻ span/heading
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && el.tagName !== 'P') {
                e.preventDefault();
            }
        });
    });

    // ----- 4. Biến hình ảnh thành có thể thay đổi -----
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Đánh dấu ảnh để dễ dọn dẹp event listener nếu cần
        img.dataset.originalSrc = img.src;
        img.addEventListener('click', function(e) {
            e.preventDefault();
            const currentPath = img.getAttribute('src');
            const newPath = prompt("Nhập đường dẫn hình ảnh mới (Ví dụ: assets/images/anh1.jpg)\n\nĐường dẫn hiện tại:", currentPath);
            if (newPath && newPath.trim() !== '') {
                img.src = newPath;
                img.setAttribute('src', newPath); // Đảm bảo outerHTML lấy đúng giá trị
            }
        });
    });

    // ----- 5. Xử lý nút Lưu & Tải Về -----
    document.getElementById('editor-btn-save').addEventListener('click', () => {
        // Hỏi xác nhận
        if(!confirm("Bạn đã chỉnh sửa xong và muốn tải file HTML này về máy?")) return;

        // Dọn dẹp trước khi lưu
        textElements.forEach(el => el.removeAttribute('contenteditable'));
        document.body.classList.remove('editor-mode-active');
        document.head.removeChild(style);
        document.body.removeChild(panel);
        
        // Loại bỏ script editor ra khỏi file tải về (nếu bạn muốn) - 
        // Nhưng để người dùng còn sửa lần sau thì ta GIỮ LẠI <script src="/editor.js">, 
        // chỉ dọn dẹp giao diện editor sinh ra lúc nãy.

        // Lấy toàn bộ mã HTML
        let htmlContent = document.documentElement.outerHTML;
        
        // Tạo file và tải về
        const blob = new Blob(["<!DOCTYPE html>\n<html lang=\"vi\">\n" + htmlContent + "\n</html>"], {type: "text/html;charset=utf-8"});
        const a = document.createElement("a");
        const url = URL.createObjectURL(blob);
        a.href = url;
        
        // Xác định tên file gốc
        const pathname = window.location.pathname;
        let filename = "index.html";
        if (pathname.includes("san-pham/mam-ba-khia-sua")) {
            filename = "product-index.html"; // Tránh nhầm với trang chủ
        }

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            alert("Đã tải xong! Hãy chép đè file vừa tải về vào thư mục chứa mã nguồn.");
            // Bật lại chế độ edit
            window.location.reload();
        }, 100);
    });

})();
