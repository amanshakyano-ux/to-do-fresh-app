const express = require("express")
const router = express.Router()

const {addExpense,getAllExpense,deleteExp} = require("../controller/expenseC")


const {categoryGen} = require("../controller/aiGenC")

<<<<<<< HEAD
const {isPremium} = require("../controller/premiumFeatures")
const {authenticate} = require("../middleware/auth")

router.post("/predictCategory",authenticate, categoryGen)
=======
const {isPremium,downloadAllExp,getDownloadedFiles} = require("../controller/premiumFeatures")
const {authenticate} = require("../middleware/auth")

router.get("/downlod-expenses",authenticate,downloadAllExp)
router.get("/files",authenticate,getDownloadedFiles)
// router.post("/predictCategory",authenticate, categoryGen)
>>>>>>> 9c55c1579cba2be873530755941cb95dcc1018c3
router.post("/addExpense", authenticate,  addExpense)
router.get("/getExpenses",authenticate, getAllExpense)
router.delete("/deleteExpense/:id",authenticate, deleteExp)
router.get("/isPremium",authenticate, isPremium)
<<<<<<< HEAD
=======

>>>>>>> 9c55c1579cba2be873530755941cb95dcc1018c3
module.exports = router;