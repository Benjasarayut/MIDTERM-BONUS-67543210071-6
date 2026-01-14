// ✅ เพิ่มตัวแปร global เพื่อเก็บข้อมูลหนังสือทั้งหมดและ ID ที่กำลังแก้ไข
let allBooks = []; 
let editingId = null; 

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    loadBooks();
});

function initUI() {
    const modal = document.getElementById('book-modal');
    const modalTitle = modal.querySelector('h2'); // สมมติว่าใน Modal มี h2
    const bookForm = document.getElementById('book-form');
    
    // ✅ เปิด Modal สำหรับเพิ่มหนังสือใหม่ (ปรับปรุง: focus + keyboard accessibility)
    const addBtn = document.getElementById('add-book-btn');
    const closeBtn = document.getElementById('close-modal');

    function modalKeyHandler(e) {
        if (e.key === 'Escape') return closeModal();
        if (e.key === 'Tab') {
            const focusables = Array.from(modal.querySelectorAll('a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'))
                .filter(el => el.offsetParent !== null);
            if (focusables.length === 0) return;
            const idx = focusables.indexOf(document.activeElement);
            if (e.shiftKey) {
                if (idx === 0) { e.preventDefault(); focusables[focusables.length - 1].focus(); }
            } else {
                if (idx === focusables.length - 1) { e.preventDefault(); focusables[0].focus(); }
            }
        }
    }

    function openModal() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', modalKeyHandler);
        const first = modal.querySelector('input, button, [tabindex]');
        first && first.focus();
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        document.removeEventListener('keydown', modalKeyHandler);
        addBtn.focus();
    }

    addBtn.onclick = () => {
        editingId = null; // รีเซ็ตสถานะเป็น "เพิ่มใหม่"
        if(modalTitle) modalTitle.innerText = "🌈 Add New Book";
        bookForm.reset();
        openModal();
    };

    closeBtn.onclick = closeModal;

    // ปิดเมื่อคลิกพื้นที่นอก modal-content
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // ✅ Filter Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            loadBooks(e.target.dataset.status);
        };
    });

    // ✅ Event Delegation สำหรับปุ่มในการ์ด (เพิ่มส่วนของ Edit)
    document.getElementById('book-list').onclick = async (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        // 1. ปุ่มยืม/คืน
        if (e.target.classList.contains('btn-action')) {
            const act = e.target.dataset.action;
            if (act === 'borrow') await api.borrowBook(id);
            else await api.returnBook(id);
            loadBooks();
        } 
        // 2. ปุ่มลบ
        else if (e.target.classList.contains('btn-del')) {
            if(confirm('Are you sure you want to delete this book?')) { 
                await api.deleteBook(id); 
                loadBooks(); 
            }
        }
        // 🌟 3. ปุ่มแก้ไข (Edit) - เพิ่มใหม่
        else if (e.target.classList.contains('btn-edit')) {
            const book = allBooks.find(b => b.id == id);
            if (book) {
                editingId = id; // ตั้งค่า ID ที่กำลังแก้ไข
                if(modalTitle) modalTitle.innerText = "📝 Edit Book Details";
                document.getElementById('title').value = book.title;
                document.getElementById('author').value = book.author;
                document.getElementById('isbn').value = book.isbn;
                openModal();
            }
        }
    };

    // ✅ Form Submit (รองรับทั้ง Create และ Update)
    bookForm.onsubmit = async (e) => {
        e.preventDefault();
        const data = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            isbn: document.getElementById('isbn').value
        };

        if (editingId) {
            // 📝 กรณีแก้ไขเล่มเดิม
            await api.updateBookMetadata(editingId, data); 
        } else {
            // ➕ กรณีเพิ่มเล่มใหม่
            await api.createBook(data);
        }

        closeModal();
        e.target.reset();
        loadBooks();
    };
}

async function loadBooks(status = 'all') {
    try {
        const data = await api.getAllBooks(status);
        allBooks = data.books; // ✅ เก็บข้อมูลลงตัวแปร global ไว้ใช้ตอนกด Edit

        // อัปเดตสถิติ
        document.getElementById('stat-available').innerText = data.statistics.available;
        document.getElementById('stat-borrowed').innerText = data.statistics.borrowed;
        document.getElementById('stat-total').innerText = data.statistics.total;

        const list = document.getElementById('book-list');
        list.innerHTML = data.books.map(b => {
            const initials = (b.title || '').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase() || 'BK';
            return `
            <div class="book-card ${b.status}">
                <div class="book-cover">${b.cover ? `<img src="${b.cover}" alt="cover" />` : `<span>${initials}</span>`}</div>
                <div class="book-content">
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                        <h3 class="book-title">${b.title}</h3>
                        <span class="status-badge ${b.status}">${b.status.toUpperCase()}</span>
                    </div>
                    <p class="book-info">👤 ${b.author}</p>
                    <div class="card-actions">
                        <button class="btn-edit" data-id="${b.id}">Edit 📝</button>
                        <button class="btn-action" data-id="${b.id}" data-action="${b.status==='available'?'borrow':'return'}">
                            ${b.status==='available'?'Borrow 📚':'Return ↩️'}
                        </button>
                        <button class="btn-del" data-id="${b.id}" aria-label="Delete ${b.title}">Delete 🗑️</button>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    } catch (e) { console.error("API Error", e); }
}