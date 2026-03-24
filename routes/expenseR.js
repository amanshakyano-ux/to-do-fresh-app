const express = require("express")
const router = express.Router()

const {addExpense,getAllExpense,deleteExp} = require("../controller/expenseC")


const {categoryGen} = require("../controller/aiGenC")

const {isPremium,downloadAllExp,getDownloadedFiles} = require("../controller/premiumFeatures")
const {authenticate} = require("../middleware/auth")

router.get("/downlod-expenses",authenticate,downloadAllExp)
router.get("/files",authenticate,getDownloadedFiles)
// router.post("/predictCategory",authenticate, categoryGen)
router.post("/addExpense", authenticate,  addExpense)
router.get("/getExpenses",authenticate, getAllExpense)
router.delete("/deleteExpense/:id",authenticate, deleteExp)
router.get("/isPremium",authenticate, isPremium)

module.exports = router;