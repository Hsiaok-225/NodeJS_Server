const express = require("express");
const router = express.Router();
const verifyRefreshToken = require("../controllers/verifyRefreshToken");

router.get("/", verifyRefreshToken);

module.exports = router;
