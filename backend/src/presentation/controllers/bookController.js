const service = require('../../business/services/bookService');

class BookController {
    // 1. ดึงข้อมูลหนังสือทั้งหมด (Read)
    async getAllBooks(req, res, next) {
        try { 
            const r = await service.getAllBooks(req.query.status); 
            res.json({ success: true, data: r }); 
        } catch (e) { next(e); }
    }

    // 2. เพิ่มหนังสือใหม่ (Create)
    async createBook(req, res, next) {
        try { 
            const r = await service.createBook(req.body); 
            res.status(201).json({ success: true, data: r }); 
        } catch (e) { next(e); }
    }

    // 🌟 3. แก้ไขข้อมูลหนังสือ (Update Metadata - Title, Author, ISBN) [เพิ่มใหม่]
    async updateBook(req, res, next) {
        try {
            // รับ ID จาก URL และข้อมูลใหม่จาก Body
            const r = await service.updateBook(req.params.id, req.body);
            res.json({ success: true, data: r });
        } catch (e) { next(e); }
    }

    // 4. ยืมหนังสือ (Update Status -> borrowed)
    async borrowBook(req, res, next) {
        try { 
            const r = await service.borrowBook(req.params.id); 
            res.json({ success: true, data: r }); 
        } catch (e) { next(e); }
    }

    // 5. คืนหนังสือ (Update Status -> available)
    async returnBook(req, res, next) {
        try { 
            const r = await service.returnBook(req.params.id); 
            res.json({ success: true, data: r }); 
        } catch (e) { next(e); }
    }

    // 6. ลบหนังสือ (Delete)
    async deleteBook(req, res, next) {
        try { 
            await service.deleteBook(req.params.id); 
            res.json({ success: true, message: "Deleted Successfully" }); 
        } catch (e) { next(e); }
    }
}

module.exports = new BookController();