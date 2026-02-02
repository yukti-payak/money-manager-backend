const express = require('express');
const router = express.Router();
const checkEditLimit = require('../middleware/checkEditLimit.js');
const { addTransaction, getTransactions, updateTransaction, getStats, getCategoryBreakdown,
    transferFunds, deleteTransaction} = require('../controllers/transactionController.js');

router.route('/')
    .get(getTransactions)
    .post(addTransaction);
router.put('/:id', checkEditLimit, updateTransaction);
router.delete('/:id', deleteTransaction);

router.get('/stats', getStats);
router.get('/summary', getCategoryBreakdown);
router.post('/transfer', transferFunds);


module.exports = router;