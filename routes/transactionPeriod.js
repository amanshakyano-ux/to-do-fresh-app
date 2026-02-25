const express = require("express")
const router = express.Router();
const {expenseReport} = require("../controller/premiumFeatures")
const {authenticate} = require("../middleware/auth")

router.get("/transactions",authenticate,expenseReport)


module.exports = router;
