const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { loginValidation, registerValidation } = require('./validation');
const { validate } = require('../middleware/validation');

router.post('/login', loginValidation, validate, login);
router.post('/register', registerValidation, validate, register);

module.exports = router;
