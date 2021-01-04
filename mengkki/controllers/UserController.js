const {AUTH_TOKEN_SALT} = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserService} = require('../services');
const {errorWrapper, errorGenerator} = require('../errors');

const signUp = errorWrapper(async (req,res) => {
  const {email, password} = req.body;

  const hashedPassword = await bcrypt.hash(password, 10); // 몇번 암호화를 할지 결정. 보통 8~10

  const foundUser = await UserService.findUser({email});
  
  if(foundUser) errorGenerator({statusCode: 409, message: 'duplicated'});

  const createdUser = await UserService.createUser({email, password: hashedPassword});
  
  res.status(201).json({
    message : 'user created',
    email : createdUser.email
  });
});

const logIn = errorWrapper(async (req, res) => {
    const {email, password : inputPassword} = req.body;

    const foundUser = await UserService.findUser({email});
    if(!foundUser) errorGenerator({statusCode: 409, message: 'duplicated'});

    const {id, password : hashedPassword} = foundUser; // 토큰에 id를 담아서 보낼거기때문에 id를 꺼냄
    const isValidPassword = await bcrypt.compare(inputPassword, hashedPassword); // true or false
    
    if(!isValidPassword) errorGenerator({statusCode: 400, message: 'invalid input'});
    
  
    const token = jwt.sign({id}, AUTH_TOKEN_SALT); //두번째 인자로 salt값이 들어감
    res.status(200).json({ message: 'login success', token});
});

module.exports = {
  logIn, signUp
}