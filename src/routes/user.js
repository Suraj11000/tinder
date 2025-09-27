const express = require('express')
const {GetUserData, getUserByEmail, updateUser, deleteUser, getProfile, forgetPassword, getConnections, getRequests, getFeed} = require("../controller/user")
const AuthValidation = require('../middleware/auth')
const router = express.Router()

router.get("/get-user", GetUserData)
router.get("/get-user-email", getUserByEmail)
router.patch('/update-data', updateUser)
router.delete("/delete-user", deleteUser)
router.get("/get-profile", getProfile)
router.patch('/forget-password', forgetPassword)
router.get('/get-connections', getConnections)
router.get('/get-requests', getRequests)
router.get('/get-feed/:page/:limit', getFeed)

module.exports = router