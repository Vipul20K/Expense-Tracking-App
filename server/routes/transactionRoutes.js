const express=require('express');
const { addTransaction, getAllTransaction,editTransaction,delTransaction } = require('../controllers/transactionCtrl');
const  authenticateJWT  = require('../middlewares/authMiddleware');

const router=express.Router();


router.post('/get-transaction',authenticateJWT,getAllTransaction);
router.post('/add-transaction',authenticateJWT,addTransaction);
router.post('/edit-transaction',authenticateJWT,editTransaction);

router.post('/del-transaction',authenticateJWT,delTransaction);

module.exports=router;