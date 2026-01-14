const API_BASE_URL = 'http://localhost:3000/api'; 

class LibraryAPI {
    // 1. ดึงข้อมูลหนังสือทั้งหมด
    async getAllBooks(status) {
        try {
            let url = `${API_BASE_URL}/books${status && status !== 'all' ? '?status='+status : ''}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch books');
            const json = await response.json();
            return json.data; // คืนค่า { books: [], statistics: {} }
        } catch (error) {
            console.error("API Error (getAllBooks):", error);
            throw error;
        }
    }

    // 2. เพิ่มหนังสือใหม่ (CREATE)
    async createBook(data) {
        try {
            const response = await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            return await response.json(); // ✅ คืนค่ากลับเพื่อให้ app.js รู้ว่าทำเสร็จแล้ว
        } catch (error) {
            console.error("API Error (createBook):", error);
        }
    }

    // 🌟 3. แก้ไขข้อมูลหนังสือ (UPDATE METADATA) [เพิ่มใหม่]
    async updateBookMetadata(id, data) {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}/metadata`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error("API Error (updateBookMetadata):", error);
        }
    }

    // 4. ยืมหนังสือ (PATCH STATUS)
    async borrowBook(id) { 
        return await fetch(`${API_BASE_URL}/books/${id}/borrow`, { method: 'PATCH' }); 
    }

    // 5. คืนหนังสือ (PATCH STATUS)
    async returnBook(id) { 
        return await fetch(`${API_BASE_URL}/books/${id}/return`, { method: 'PATCH' }); 
    }

    // 6. ลบหนังสือ (DELETE)
    async deleteBook(id) { 
        return await fetch(`${API_BASE_URL}/books/${id}`, { method: 'DELETE' }); 
    }
}

const api = new LibraryAPI();