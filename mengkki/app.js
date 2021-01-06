const express = require('express');
const routes = require('./routes');
const logger = require('morgan')('dev');


const app = express();

app.use(express.json()) //body를 json으로 만들어줌 
app.use(logger);
app.use(routes); //우리가 작성한 routes라는 라우터 모듈을 가져다가 끼워줌

//인자가 4개일 때는 첫번째 인자는 error임
//general error handler
app.use((err,req,res,next) => { // 실행중에 에러가 발생하면 무조건 이함수로 에러가 들어옴. errorwrapper로 감싸줬기때문에
  const {statusCode, message} = err;
  console.error(err);
  res.status(statusCode).json({message});
})

module.exports = app;