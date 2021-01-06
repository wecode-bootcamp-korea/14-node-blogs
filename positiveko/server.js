const dotenv = require('dotenv');
dotenv.config();
const { PORT } = process.env;
const app = require('./app');
const prisma = require('./prisma');
const http = require('http');

const server = http.createServer(app);
const start = async () => {
  try {
    server.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}`)
    );
  } catch (err) {
    console.log(err);
  } finally {
    // await prisma.
  }
};

start();
// // POINT 스토리..
// // 잘 짜여진 코드는 글과 같다
// // 서론 본론 결론. 이야기의 흐름이 끊이지 않고 자연스럽게 설계 해야 한다

// // user api
// // 회원가입, signUp
// // id, password
// // password 암호화 하는 로직이 필요
// // database body에서 받은 데이터를 저장 시킨다

// // 코드도 이 스토리에 맞춰 구현해보자

// const http = require('http');
// const express = require('express');

// const { signup, login } = require('./user');

// //환경변수
// // server.js 가장 최상위 엔트리 코드가 될 거고 이 안에서 불리는 모듈에서 환경변수 접근 가능
// const dotenv = require('dotenv');
// dotenv.config();

// app.use(express.json());
// app.post('/users/signup', signup);
// app.post('users/login', login);

// start();

// // 항상 코드를 짜기 전에 스토리라인을 설정하고 코딩에 들어가자
