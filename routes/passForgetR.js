const express = require("express")
const router = express.Router()
const {forgotpassword,resetPassword,updatePassword} = require("../controller/resetPassC")

router.post("/forgotpassword",forgotpassword)
router.get("/resetpassword/:id",resetPassword)
router.post("/updatepassword/:id",updatePassword)


module.exports = router;