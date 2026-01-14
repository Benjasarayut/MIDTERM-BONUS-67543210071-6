const service = require('../../business/services/bookService');
class BookController {
    async getAllBooks(req, res, next) {
        try { const r = await service.getAllBooks(req.query.status); res.json({ success: true, data: r }); } catch (e) { next(e); }
    }
    async createBook(req, res, next) {
        try { const r = await service.createBook(req.body); res.status(201).json({ success: true, data: r }); } catch (e) { next(e); }
    }
    async borrowBook(req, res, next) {
        try { const r = await service.borrowBook(req.params.id); res.json({ success: true, data: r }); } catch (e) { next(e); }
    }
    async returnBook(req, res, next) {
        try { const r = await service.returnBook(req.params.id); res.json({ success: true, data: r }); } catch (e) { next(e); }
    }
    async deleteBook(req, res, next) {
        try { await service.deleteBook(req.params.id); res.json({ success: true, message: "Deleted" }); } catch (e) { next(e); }
    }
}
module.exports = new BookController();
