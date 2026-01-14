document.addEventListener('DOMContentLoaded', () => {
    initUI();
    loadBooks();
});

function initUI() {
    const modal = document.getElementById('book-modal');
    
    // ✅ แก้ไข Add Book กดไม่ได้
    document.getElementById('add-book-btn').onclick = () => modal.style.display = 'flex';
    document.getElementById('close-modal').onclick = () => modal.style.display = 'none';

    // ✅ Filter Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            loadBooks(e.target.dataset.status);
        };
    });

    // Event Delegation สำหรับปุ่มในการ์ด
    document.getElementById('book-list').onclick = async (e) => {
        const id = e.target.dataset.id;
        if (!id) return;
        if (e.target.classList.contains('btn-action')) {
            const act = e.target.dataset.action;
            if (act === 'borrow') await api.borrowBook(id);
            else await api.returnBook(id);
            loadBooks();
        } else if (e.target.classList.contains('btn-del')) {
            if(confirm('Sure?')) { await api.deleteBook(id); loadBooks(); }
        }
    };

    // Form Submit
    document.getElementById('book-form').onsubmit = async (e) => {
        e.preventDefault();
        const data = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            isbn: document.getElementById('isbn').value
        };
        await api.createBook(data);
        modal.style.display = 'none';
        e.target.reset();
        loadBooks();
    };
}

async function loadBooks(status = 'all') {
    try {
        const data = await api.getAllBooks(status);
        document.getElementById('stat-available').innerText = data.statistics.available;
        document.getElementById('stat-borrowed').innerText = data.statistics.borrowed;
        document.getElementById('stat-total').innerText = data.statistics.total;

        const list = document.getElementById('book-list');
        list.innerHTML = data.books.map(b => `
            <div class="book-card" style="border-left: 6px solid ${b.status==='available'?'#6366f1':'#10b981'}">
                <span class="status-badge ${b.status}">${b.status.toUpperCase()}</span>
                <h3>${b.title}</h3>
                <p>👤 ${b.author}</p>
                <div class="card-actions">
                    <button class="btn-action" data-id="${b.id}" data-action="${b.status==='available'?'borrow':'return'}">
                        ${b.status==='available'?'Borrow':'Return'}
                    </button>
                    <button class="btn-del" data-id="${b.id}">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (e) { console.error("API Error", e); }
}
