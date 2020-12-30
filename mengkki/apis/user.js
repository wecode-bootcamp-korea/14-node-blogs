const bcrypts = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const dotenv = require('dotenv');

dotenv.config(); // server.js 가장 최상위 엔트리 코드가 될거고 이 안에서 불리는 모든 모듈에서 환경변수에 접근할 수 있게 됩니다.



const validateInputs = ({email, password}) => {
  const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}/;
  return emailRegex.test(email) && passwordRegex.test(password);
}

const signUp = async (req, res) => {
  try {
    const {email, password} = req.body;
    if(!email || !password) {
      const error = new Error('invalid input');
      error.status = 400;
      throw error;
    } // 에러핸들링을 잘 해야한다. api 설계할때는 에러핸들링이 중요. 그게 이프문으로 분기를 만들고 throw로 에러 객체를 떤져주는거임.
    if(!validateInputs({email, password})) {
      const error = new Error('invalid input');
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypts.hash(password, 10); // 몇번 암호화를 할지 결정. 보통 8~10

    const existuser = await prisma.users.findUnique({
      where: {
        email
      }
    });
    
    if(existuser) {
      const error = new Error('already exist');
      error.status = 400;
      throw error;
    }

    const createdUser = await prisma.users.create({
      data : {
        email, 
        password : hashedPassword
      }
    })
    
    res.status(201).json({createdUsersEmail : createdUser.email});

  } catch (error) {
    res.status(error.status).json({message : error.message});
  }
}

const login = async (req, res) => {
  try {
    const {email, password : inputPassword} = req.body; // 이렇게하면 password를 InputPassword라는 변수명으로 받아옴.
    
    if(!email || !inputPassword) {
      const error = new Error('invalid input');
      error.status = 400;
      throw error;
    }
  
    if(!validateInputs({email, password : inputPassword})) {
      const error = new Error('invalid input');
      error.status = 400;
      throw error;
    }

    const foundUser = await prisma.users.findUnique({where : {email}});
    if(!foundUser) {
      const error = new Error('not found');
      error.status = 404;
      throw error;
    }

    const {id, password : hashedPassword} = foundUser; // 토큰에 id를 담아서 보낼거기때문에 id를 꺼냄
  
    const isValidPassword = await bcrypts.compare(inputPassword, hashedPassword); // true or false
    
    if(!isValidPassword){
      const error = new Error('invalid input');
      error.status = 400;
      throw error;
    }
  
    const token = jwt.sign({id}, process.env.JWT_SECRET_KEY); //두번째 인자로 salt값이 들어감
    res.status(200).json({token});

  } catch (error) {
    res.status(500).json({message : error.message});
  }
}



module.exports = {signUp, login};