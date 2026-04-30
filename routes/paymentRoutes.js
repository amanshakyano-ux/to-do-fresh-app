const express = require("express");
const router = express.Router();
 
const auth = require("../middleware/auth"); // assuming you have auth
const {processPayment, getPaymentStatus} = require('../controller/paymentController')

 
router.post("/create-order", auth.authenticate,  processPayment);

router.get("/payment-status/:orderId",  getPaymentStatus)
 

module.exports = router;