const express = require("express");
const router = express.Router();

const { machinHistory } = require("../handlers/history");
const { authenticateToken } = require("../handlers/auth");

router.get("/", authenticateToken, machinHistory);

module.exports = router;
