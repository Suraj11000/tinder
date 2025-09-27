const express = require("express")
const router = express.Router()
const {loginUser, logOutUser, CreateUser} = require("../controller/auth")

router.post("/create-user", CreateUser)
router.post('/login-user', loginUser)
router.post('/logout-user', logOutUser)

module.exports = router