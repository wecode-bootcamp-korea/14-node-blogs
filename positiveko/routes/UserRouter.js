const express = require('express');
const router = express.Router();

//controller 함수 만들기
// 구조분해할당한 이유: article과 관련된 컨트롤러도 같이 만들기 위해
const { UserController } = require('../controllers');
// /users/signup
router.post('/signup', UserController.signUp);
// /users/login
router.post('/login', UserController.logIn);

module.exports = router;