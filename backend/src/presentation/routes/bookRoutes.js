const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookController');

// --- 📖 ส่วนของการอ่านข้อมูล (Read) ---
router.get('/', ctrl.getAllBooks);

// --- ➕ ส่วนของการเพิ่มข้อมูล (Create) ---
router.post('/', ctrl.createBook);

// --- 📝 ส่วนของการแก้ไขข้อมูล (Update Metadata) ---
// ✅ เพิ่มบรรทัดนี้ลงไปและใช้ 'ctrl' ให้ถูกต้อง
router.patch('/:id/metadata', ctrl.updateBookMetadata); 

// --- 🔄 ส่วนของการเปลี่ยนสถานะหนังสือ (Update Status) ---
router.patch('/:id/borrow', ctrl.borrowBook);
router.patch('/:id/return', ctrl.returnBook);

// --- ❌ ส่วนของการลบข้อมูล (Delete) ---
router.delete('/:id', ctrl.deleteBook);

module.exports = router;