const express = require("express")
const router = express.Router()
const {resetPass} = require("../controller/resetPassC")
router.post("/password/forgotpassword",resetPass)


module.exports = router;