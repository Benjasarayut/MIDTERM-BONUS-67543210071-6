// ✅ แก้ไข: มั่นใจว่า IP นี้คือ IP ของ VM (เช็คด้วย ip a บน Ubuntu)
const API_BASE_URL = 'http://192.168.56.101:3000/api'; 

class LibraryAPI {
    /**
     * 1. ดึงข้อมูลหนังสือทั้งหมด และ สถิติ (Dashboard)
     * Backend ต้องส่งกลับมาในรูปแบบ: { success: true, data: [...], statistics: {...} }
     */
    async getAllBooks(status) {
        try {
            let url = `${API_BASE_URL}/books${status && status !== 'all' ? '?status=' + status : ''}`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลจาก Server ได้');
            
            const json = await response.json();
            
            // ส่งคืนทั้งรายชื่อหนังสือและสถิติไปให้ app.js ใช้งาน
            return {
                books: json.data || [],
                statistics: json.statistics || { available: 0, borrowed: 0, total: 0 }
            }; 
        } catch (error) {
            console.error("❌ API Error (getAllBooks):", error);
            throw error;
        }
    }

    /**
     * 2. เพิ่มหนังสือใหม่ (CREATE)
     */
    async createBook(data) {
        try {
            const response = await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'เพิ่มหนังสือไม่สำเร็จ');
            }
            return await response.json(); 
        } catch (error) {
            console.error("❌ API Error (createBook):", error);
            throw error;
        }
    }

    /**
     * 🌟 3. แก้ไขข้อมูลหนังสือ (UPDATE)
     * ✅ แก้ไข: ใช้ชื่อฟังก์ชัน 'updateBook' ให้ตรงกับที่ app.js เรียกใช้
     * ✅ แก้ไข: ใช้ Method 'PUT' และส่ง ID ไปที่ URL ให้ถูกต้อง
     */
    async updateBook(id, data) {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`, {
                method: 'PUT', // ต้องตรงกับ router.put('/:id', ...) ใน Backend
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'แก้ไขข้อมูลไม่สำเร็จ');
            }
            return await response.json();
        } catch (error) {
            console.error("❌ API Error (updateBook):", error);
            throw error;
        }
    }

    /**
     * 4. ยืมหนังสือ (PATCH)
     */
    async borrowBook(id) { 
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}/borrow`, { method: 'PATCH' }); 
            if (!response.ok) throw new Error('ยืมหนังสือไม่สำเร็จ');
            return await response.json();
        } catch (error) {
            console.error("❌ API Error (borrowBook):", error);
            throw error;
        }
    }

    /**
     * 5. คืนหนังสือ (PATCH)
     */
    async returnBook(id) { 
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}/return`, { method: 'PATCH' }); 
            if (!response.ok) throw new Error('คืนหนังสือไม่สำเร็จ');
            return await response.json();
        } catch (error) {
            console.error("❌ API Error (returnBook):", error);
            throw error;
        }
    }

    /**
     * 6. ลบหนังสือ (DELETE)
     */
    async deleteBook(id) { 
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`, { method: 'DELETE' }); 
            if (!response.ok) throw new Error('ลบหนังสือไม่สำเร็จ');
            return await response.json();
        } catch (error) {
            console.error("❌ API Error (deleteBook):", error);
            throw error;
        }
    }
}

// สร้าง Instance เพื่อให้ไฟล์อื่นเรียกใช้งานได้ทันที
const api = new LibraryAPI();