// ✅ เก็บข้อมูลและสถานะการแก้ไข
let allBooks = []; 
let editingId = null; 

// --- 🎨 ส่วนจัดการ Theme ---
const THEMES = ['light', 'dark', 'green'];
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ui-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.innerText = theme === 'dark' ? '🌙' : theme === 'green' ? '🟢' : '🌓';
}
function cycleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const idx = THEMES.indexOf(cur);
    applyTheme(THEMES[(idx + 1) % THEMES.length]);
}
function initTheme() {
    const saved = localStorage.getItem('ui-theme');
    if (saved) { applyTheme(saved); return; }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
}

// --- 🔔 ส่วนจัดการ Toast (การแจ้งเตือน) ---
function showToast(message, type = 'info', ms = 2400) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const t = document.createElement('div');
    t.className = `toast toast--${type}`;
    t.innerHTML = `<span class="icon">${type === 'success' ? '✅' : type === 'danger' ? '⚠️' : 'ℹ️'}</span><div class="toast-text">${message}</div><button class="close">✕</button>`;
    container.appendChild(t);
    requestAnimationFrame(() => t.classList.add('toast--visible'));
    const remove = () => { t.classList.remove('toast--visible'); setTimeout(() => t.remove(), 400); };
    t.querySelector('.close').onclick = remove;
    setTimeout(remove, ms);
}

// --- 🚀 เริ่มต้นทำงานเมื่อโหลดหน้าเว็บ ---
document.addEventListener('DOMContentLoaded', () => {
    initUI();
    initTheme();
    loadBooks();
});

function initUI() {
    const modal = document.getElementById('book-modal');
    const bookForm = document.getElementById('book-form');
    const addBtn = document.getElementById('add-book-btn');
    const closeBtn = document.getElementById('close-modal');
    const modalTitle = document.querySelector('#book-modal h2');

    // 1. เปิด Modal สำหรับเพิ่มใหม่
    if (addBtn) {
        addBtn.onclick = () => {
            editingId = null; // รีเซ็ตเป็นสถานะ "เพิ่มใหม่"
            if (modalTitle) modalTitle.innerText = "🌈 Add New Book";
            bookForm.reset();
            openModal();
        };
    }

    // 2. ปิด Modal
    if (closeBtn) closeBtn.onclick = closeModal;
    window.onclick = (e) => { if (e.target === modal) closeModal(); };

    function openModal() {
        modal.style.display = 'flex';
        requestAnimationFrame(() => modal.classList.add('show'));
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
        document.body.style.overflow = '';
    }

    // 3. จัดการ Form Submit (ทั้ง Add และ Edit)
    bookForm.onsubmit = async (e) => {
        e.preventDefault();
        const data = {
            title: document.getElementById('title').value.trim(),
            author: document.getElementById('author').value.trim(),
            isbn: document.getElementById('isbn').value.trim()
        };

        const saveBtn = document.getElementById('save-btn');
        try {
            saveBtn.disabled = true;
            if (editingId) {
                // 📝 กรณีแก้ไข: เรียก updateBook
                await api.updateBook(editingId, data);
                showToast(`Updated "${data.title}"`, 'success');
            } else {
                // ➕ กรณีเพิ่มใหม่: เรียก createBook
                await api.createBook(data);
                showToast(`Added "${data.title}"`, 'success');
            }
            closeModal();
            await loadBooks(); // โหลดใหม่ทันทีเพื่อให้เห็นการเปลี่ยนแปลง
        } catch (err) {
            showToast(err.message, 'danger');
        } finally {
            saveBtn.disabled = false;
        }
    };

    // 4. ปุ่ม Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.onclick = cycleTheme;

    // 5. ตัวกรองหนังสือ (Tabs)
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            loadBooks(e.target.dataset.status);
        };
    });

    // 6. Event Delegation สำหรับปุ่มในการ์ดหนังสือ
    document.getElementById('book-list').onclick = async (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        // ปุ่ม Edit 📝
        if (e.target.classList.contains('btn-edit')) {
            const book = allBooks.find(b => b.id == id);
            if (book) {
                editingId = id; // ตั้งค่า ID ที่กำลังแก้ไข
                if (modalTitle) modalTitle.innerText = "📝 Edit Book Details";
                document.getElementById('title').value = book.title;
                document.getElementById('author').value = book.author;
                document.getElementById('isbn').value = book.isbn;
                openModal();
            }
        }
        // ปุ่ม Borrow/Return 📚
        else if (e.target.classList.contains('btn-action')) {
            const act = e.target.dataset.action;
            try {
                if (act === 'borrow') await api.borrowBook(id);
                else await api.returnBook(id);
                showToast(`${act === 'borrow' ? 'Borrowed' : 'Returned'} successfully`, 'success');
                await loadBooks();
            } catch (err) { showToast(err.message, 'danger'); }
        }
        // ปุ่ม Delete 🗑️
        else if (e.target.classList.contains('btn-del')) {
            if (confirm('Are you sure you want to delete this book?')) {
                try {
                    await api.deleteBook(id);
                    showToast('Deleted successfully', 'info');
                    await loadBooks();
                } catch (err) { showToast(err.message, 'danger'); }
            }
        }
    };
}

// --- 📥 ส่วนโหลดข้อมูลจาก API ---
async function loadBooks(status = 'all') {
    const list = document.getElementById('book-list');
    list.innerHTML = `<div class="loading">Loading library...</div>`;

    try {
        const result = await api.getAllBooks(status);
        allBooks = result.books; // เก็บใส่ตัวแปร global เพื่อใช้ตอน Edit

        // อัปเดตตัวเลข Dashboard (สถิติ)
        document.getElementById('stat-available').innerText = result.statistics.available || 0;
        document.getElementById('stat-borrowed').innerText = result.statistics.borrowed || 0;
        document.getElementById('stat-total').innerText = result.statistics.total || 0;

        renderBooks(allBooks);
    } catch (e) {
        list.innerHTML = `<div class="empty-state error">❌ Unable to connect to Server</div>`;
    }
}

// --- 🖼️ ส่วนแสดงผล Card ลงหน้าเว็บ ---
function renderBooks(books) {
    const list = document.getElementById('book-list');
    if (books.length === 0) {
        list.innerHTML = `<div class="empty-state">No books found ✨</div>`;
        return;
    }

    list.innerHTML = books.map((b, idx) => `
        <div class="book-card ${b.status}">
            <div class="book-cover"><span class="cover-num">${idx + 1}</span></div>
            <div class="book-content">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 class="book-title">${b.title}</h3>
                    <span class="status-badge ${b.status}">${b.status.toUpperCase()}</span>
                </div>
                <p class="book-info">👤 ${b.author}</p>
                <div class="card-actions">
                    <button class="btn-edit" data-id="${b.id}">Edit 📝</button>
                    <button class="btn-action" data-id="${b.id}" data-action="${b.status === 'available' ? 'borrow' : 'return'}">
                        ${b.status === 'available' ? 'Borrow 📚' : 'Return ↩️'}
                    </button>
                    <button class="btn-del" data-id="${b.id}">Delete 🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
}