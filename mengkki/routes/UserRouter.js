const express = require('express');
const router = express.Router();
const {validateUserInputs} = require('../middlewares');

const {UserController} = require('../controllers');

router.post('/login', validateUserInputs, UserController.logIn);
router.post('/signup', validateUserInputs, UserController.signUp);

module.exports = router;