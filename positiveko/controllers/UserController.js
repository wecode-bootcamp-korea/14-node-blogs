// const { publicDecrypt } = require('crypto');
// const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
// const prisma = new PrismaClient();

const { errorGenerator, errorWrapper } = require('../errors');
const { UserService } = require('../services');

const signUp = errorWrapper(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    errorGenerator({ message: 'invalid input', statusCode: 400 });

  // 암호화
  const hashedPassword = await bcrypt.hash(password, 10); // 몇번 암호화 할지

  const createdUser = await UserService.createUser({
    email,
    password: hashedPassword,
  });

  res.status(201).json({ createdUserEmail: createdUser.email });
});

// const signUp = async (req, res) => {
//   try {
//     // 비동기 로직: 데이터베이스오 소통하는 코드
//     // api 설계했을 때 error 핸들링이 안 된 api는 절대로 안 됨
//     // try catch 문 안에서 if로 분기를 하고
//     // 새로운 에러를 만들어서 던진다
//     const { email, password } = req.body;
//     if (!email || !password)
//       errorGenerator({ message: 'invalid input', statusCode: 400 });

//     // 암호화
//     const hashedPassword = await bcrypt.hash(password, 10); // 몇번 암호화 할지

//     const createdUser = await UserServices.createUser({
//       email,
//       password: hasedPassword,
//     });
//     // 서비스 로직에다가 일을 위임
//     // 컨트롤러 로직은 서비스 로직에만 의존

//     //(기존 코드)
//     // const createdUser = await prisma.users.create({
//     //   data: {
//     //     email,
//     //     password: hashedPassword,
//     //   },
//     // });

//     res.status(201).json({ createdUserEmail: createdUser.email });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const logIn = errorWrapper(async (req, res) => {
  const { email, password: inputPassword } = req.body;
  // email로 조회하겠다

  // const foundUser = await prisma.users.findUnique({ where: { email } });
  const foundUser = await UserService.findUser({ email });

  if (!foundUser) {
    // Error를 객체로 정의
    const error = new Error('not found');
    error.statusCode = 404;
    throw error;
  }

  const { id, password: hashedPassword } = foundUser;

  const isValidPassword = await bcrypt.compare(inputPassword, hashedPassword);

  // secret_key = salt
  // 암호화를 할 때 시크릿 키가 필요함
  if (!isValidPassword)
    errorGenerator({ statusCode: 400, message: 'invalid input' });

  const token = jwt.sign({ id }, process.env.AUTH_TOKEN_SALT, {
    expiresIn: '1h',
  });
  res.status(200).json({ message: 'login success', token });
});

// const logIn = async (req, res) => {
//   try {
//     // 변수 충돌이 일어나기 때문에 변수를 바꿔주는 것이 좋음
//     const { email, password: inputPassword } = req.body;
//     // email로 조회하겠다

//     // const foundUser = await prisma.users.findUnique({ where: { email } });
//     const foundUser = await UserService.findUser({ email });

//     if (!foundUser) {
//       // Error를 객체로 정의
//       const error = new Error('not found');
//       error.statusCode = 404;
//       throw error;
//     }

//     const { id, password: hashedPassword } = foundUser;

//     const isValidPassword = await bcrypt.compare(inputPassword, hashedPassword);

//     // secret_key = salt
//     // 암호화를 할 때 시크릿 키가 필요함
//     const token = jwt.sign({ id }, process.env.JWT_SECRETE_KEY, {
//       expiresIn: '1h',
//     });
//     res.status(200).json({ message: 'login success', token });
//   } catch (err) {
//     // error를 객체로 넘겨서 키값을 받아옴
//     res.status(err.statusCode).json({ message: err.message });
//   }

// };

module.exports = { signUp, logIn };
