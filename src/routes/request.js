const express = require("express");
const router = express.Router();
const { SendRequest, ReviewRequest } = require("../controller/request");

router.post("/send-request/:status/:id", SendRequest);
router.patch('/review-request/:status/:requestId', ReviewRequest)

module.exports = router