const db = require('../database/connection');

class BookRepository {
    getAll(status) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM books';
            let params = [];
            if (status && status !== 'all') {
                query += ' WHERE status = ?';
                params.push(status);
            }
            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    getStatistics() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
                    SUM(CASE WHEN status = 'borrowed' THEN 1 ELSE 0 END) as borrowed
                FROM books
            `;
            db.get(query, [], (err, row) => {
                if (err) reject(err);
                else resolve(row || { total: 0, available: 0, borrowed: 0 });
            });
        });
    }

    create(book) {
        return new Promise((resolve, reject) => {
            const { title, author, isbn } = book;
            db.run('INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)', 
                [title, author, isbn], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, ...book, status: 'available' });
            });
        });
    }

    update(id, data) {
        return new Promise((resolve, reject) => {
            const { title, author, isbn } = data;
            db.run(
                'UPDATE books SET title = ?, author = ?, isbn = ? WHERE id = ?',
                [title, author, isbn, id],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id, ...data });
                }
            );
        });
    }

    updateStatus(id, status) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE books SET status = ? WHERE id = ?',
                [status, id],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id, status });
                }
            );
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM books WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }
}

module.exports = new BookRepository();