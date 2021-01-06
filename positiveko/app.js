const express = require('express');
const routes = require('./routes');
const logger = require('morgan')('dev');

const app = express();

// 우리가 작성한 로직을 연결시켜주는 함수
app.use(express.json());
// json으로 변환시켜주는 함수
app.use(logger);
app.use(routes);

// 인자가 네 개일 때 첫 번째 함수는 무조건 에러
// 이 미들웨어 가 하는 일은 에러 객체를 받고 
// 모든 에러를 받아서 보내주는 역할
// general error handler
app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  console.log(err);
  res.status(statusCode).json({ message });
});

module.exports = app;
