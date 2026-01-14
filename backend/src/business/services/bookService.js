const repository = require('../../data/repositories/bookRepository');

class BookService {
    async getAllBooks(status) {
        const books = await repository.getAll(status);
        const statistics = await repository.getStatistics();
        return { books, statistics };
    }

    async createBook(data) {
        return await repository.create(data);
    }

    // 🌟 🌟 🌟 เพิ่มบรรทัดนี้ลงไป (สะพานที่ขาดอยู่) 🌟 🌟 🌟
    async updateBook(id, data) {
        if (!id) throw new Error('ID is required');
        return await repository.update(id, data);
    }

    async borrowBook(id) { return await repository.updateStatus(id, 'borrowed'); }
    async returnBook(id) { return await repository.updateStatus(id, 'available'); }
    async deleteBook(id) { return await repository.delete(id); }
}

module.exports = new BookService();