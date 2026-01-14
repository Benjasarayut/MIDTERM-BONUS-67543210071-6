const API_BASE_URL = 'http://localhost:3000/api'; 
class LibraryAPI {
    async getAllBooks(status) {
        let url = `${API_BASE_URL}/books${status && status !== 'all' ? '?status='+status : ''}`;
        const response = await fetch(url);
        const json = await response.json();
        return json.data; // { books: [], statistics: {} }
    }
    async createBook(data) {
        await fetch(`${API_BASE_URL}/books`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
    }
    async borrowBook(id) { await fetch(`${API_BASE_URL}/books/${id}/borrow`, { method: 'PATCH' }); }
    async returnBook(id) { await fetch(`${API_BASE_URL}/books/${id}/return`, { method: 'PATCH' }); }
    async deleteBook(id) { await fetch(`${API_BASE_URL}/books/${id}`, { method: 'DELETE' }); }
}
const api = new LibraryAPI();
