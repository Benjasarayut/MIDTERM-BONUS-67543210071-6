const repo = require('../../data/repositories/bookRepository');
class BookService {
    async getAllBooks(status) {
        const b = await repo.getAll(status);
        return { books: b, statistics: { total: b.length, available: b.filter(x => x.status==='available').length, borrowed: b.filter(x => x.status==='borrowed').length } };
    }
    async createBook(d) { return await repo.create(d); }
    async borrowBook(id) { return await repo.update(id, { status: 'borrowed' }); }
    async returnBook(id) { return await repo.update(id, { status: 'available' }); }
    async deleteBook(id) { return await repo.delete(id); }
}
module.exports = new BookService();
