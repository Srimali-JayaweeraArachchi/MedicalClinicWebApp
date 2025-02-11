const express = require("express");
const { saveBillDetails } = require("../controllers/billController");
const router = express.Router();

// Route to save bill details
router.post("/save-bill", saveBillDetails);


module.exports = router;
