const service = require('../../business/services/bookService');

class BookController {
    // 1. ดึงข้อมูลหนังสือทั้งหมด พร้อมสถิติ (Read)
    async getAllBooks(req, res, next) {
        try { 
            const result = await service.getAllBooks(req.query.status); 
            res.json({ 
                success: true, 
                data: result.books,           
                statistics: result.statistics, 
                timestamp: new Date().toISOString() 
            }); 
        } catch (e) { next(e); }
    }

    // 2. เพิ่มหนังสือใหม่ (Create)
    async createBook(req, res, next) {
        try { 
            const r = await service.createBook(req.body); 
            res.status(201).json({ 
                success: true, 
                data: r,
                timestamp: new Date().toISOString() 
            }); 
        } catch (e) { next(e); }
    }

    // 🌟 3. แก้ไขข้อมูลหนังสือ (หัวใจสำคัญ!)
    async updateBook(req, res, next) {
        try {
            // Defensive check and helpful logging when service method is missing
            if (!service || typeof service.updateBook !== 'function') {
                const msg = 'Service method updateBook is not implemented';
                console.error(msg, { serviceKeys: service ? Object.keys(service) : 'no-service' });
                throw new Error(msg);
            }

            console.log(`Controller: invoking service.updateBook id=${req.params.id}`);
            const r = await service.updateBook(req.params.id, req.body);
            res.json({ 
                success: true, 
                data: r,
                timestamp: new Date().toISOString() 
            });
        } catch (e) { console.error('Controller.updateBook error:', e); next(e); }
    }

    // 4. ยืมหนังสือ
    async borrowBook(req, res, next) {
        try { 
            const r = await service.borrowBook(req.params.id); 
            res.json({ success: true, data: r, timestamp: new Date().toISOString() }); 
        } catch (e) { next(e); }
    }

    // 5. คืนหนังสือ
    async returnBook(req, res, next) {
        try { 
            const r = await service.returnBook(req.params.id); 
            res.json({ success: true, data: r, timestamp: new Date().toISOString() }); 
        } catch (e) { next(e); }
    }

    // 6. ลบหนังสือ
    async deleteBook(req, res, next) {
        try { 
            await service.deleteBook(req.params.id); 
            res.json({ success: true, message: "Deleted Successfully", timestamp: new Date().toISOString() }); 
        } catch (e) { next(e); }
    }
}

module.exports = new BookController();