const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookController');
router.get('/', ctrl.getAllBooks);
router.post('/', ctrl.createBook);
router.patch('/:id/borrow', ctrl.borrowBook);
router.patch('/:id/return', ctrl.returnBook);
router.delete('/:id', ctrl.deleteBook);
module.exports = router;
