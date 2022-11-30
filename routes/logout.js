const express = require("express");
const router = express.Router();
const logoutController = require("../controllers/logout");

router.get("/", logoutController);

module.exports = router;
