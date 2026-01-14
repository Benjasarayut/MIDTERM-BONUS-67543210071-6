const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ไฟล์ฐานข้อมูลจะถูกสร้างไว้ที่ root ของโปรเจกต์ (นอก src)
const dbPath = path.resolve(__dirname, '../../../../library.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database connection error:', err);
    else console.log('✅ Database connected at:', dbPath);
});

db.serialize(() => {
    // ห้ามใช้ DROP TABLE เด็ดขาด! ใช้แค่ IF NOT EXISTS
    db.run(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            isbn TEXT NOT NULL,
            status TEXT DEFAULT 'available'
        )
    `);
});

module.exports = db;