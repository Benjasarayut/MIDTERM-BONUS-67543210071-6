let books = [{ id: 1, title: "Clean Code", author: "Robert C. Martin", isbn: "9780132350884", status: "available" }];
class BookRepository {
    async getAll(s) { return s ? books.filter(b => b.status === s) : books; }
    async create(d) { const n = { id: Date.now(), ...d, status: 'available' }; books.push(n); return n; }
    async update(id, d) {
        const i = books.findIndex(b => b.id == id);
        if (i !== -1) books[i] = { ...books[i], ...d };
        return books[i];
    }
    async delete(id) { books = books.filter(b => b.id != id); return true; }
}
module.exports = new BookRepository();
