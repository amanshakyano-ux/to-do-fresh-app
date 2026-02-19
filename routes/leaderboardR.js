const express = require("express")
const router = express.Router()
const {authenticate} = require("../middleware/auth")
const {getAllUsers} = require("../controller/premiumFeatures")
 

router.get("/",authenticate,getAllUsers)

module.exports = router;