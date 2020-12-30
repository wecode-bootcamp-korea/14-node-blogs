// POINT : story.... 잘 짜여진 코드는 글과 같다.... 
// user api
// 회원 가입 기능 구현한다고 치자. 그러면 어떤 재료가 필요하니?
// id, password... 
// database body에서 받은 데이터를 저장시킨다. 그 전에 암호를 암호화를 해야겟죠?
// 암호화를 하는 로직이 필요하다. 

const http = require('http');
const express = require('express');
const bcrypts = require('bcryptjs');
const { PrismaClient} = require('@prisma/client');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const {signUp, login} = require('./apis/user');
const {createArticle, getArticles, getArticle, updateArticle, deleteArticle} = require('./apis/articles');

dotenv.config(); // server.js 가장 최상위 엔트리 코드가 될거고 이 안에서 불리는 모든 모듈에서 환경변수에 접근할 수 있게 됩니다.


const prisma = new PrismaClient();
const app = express();



//app. use === middleware를 사용할 수 있도록 연결시켜주는 함수. 
app.use(express.json()) //우리가 받는 데이터형태를 json으로 변환시켜주는 함수를 연결시켜준거임.


//user--------------
//signup
app.post('/users/signup', signUp);
//login
//비밀번호가 맞는지..? => 유저 정보가 틀렷습니다 not authenticated
//해당 유저가 존재하는지..? => 가입된 유저가 아닙니다 not found
//token 발행
app.post('/users/login', login);
// app.post('/users/signup', async(req, res) => { // 이 뼈대가 계속 쓰이게 될 것임. 비동기 로직이 쓰이게 될 것이기 때문에... 예를들면 꿍디디비


//post---------------
app.post('/articles', createArticle);
app.get('/articles', getArticles);
app.get('/articles/:id', getArticle);
app.put('/articles/:id', updateArticle);
app.delete('/articles/:id', deleteArticle);


const server = http.createServer(app);

const start = async () => {
  try {
    server.listen(8000, () => console.log('Server is listening on 8000'));
  } catch (error) {
    console.log(error);
  } finally{
    await prisma.$disconnect();
  }
}

start();