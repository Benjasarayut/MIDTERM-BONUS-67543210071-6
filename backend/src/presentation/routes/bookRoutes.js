const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/', bookController.getAllBooks);
router.post('/', bookController.createBook);

// ✅ ต้องเป็นชื่อ updateBook ให้ตรงกับ Controller
router.put('/:id', bookController.updateBook); 

// ✅ เช็ค 2 บรรทัดนี้ให้ดี (บรรทัดที่ 13 ที่มึงพังอยู่)
router.patch('/:id/borrow', bookController.borrowBook);
router.patch('/:id/return', bookController.returnBook);

router.delete('/:id', bookController.deleteBook);

module.exports = router;