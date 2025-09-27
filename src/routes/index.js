const express = require("express")
const router = express.Router()
const user = require("./user")
const auth = require("./auth")
const request = require('./request')
const AuthValidation = require('../middleware/auth')

router.use('/user', AuthValidation, user)
router.use('/auth', auth)
router.use('/request', AuthValidation, request)

module.exports = router