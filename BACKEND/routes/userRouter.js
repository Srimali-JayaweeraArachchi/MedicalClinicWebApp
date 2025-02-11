const express = require('express');
const { login, signup } = require('../controllers/userController');

const router = express.Router();

// Routes
router.post('/login', login);
router.post('/signup/doctors', signup);
router.post('/signup/clinical-staff', signup);
router.post('/signup/admin', signup);

module.exports = router;
