const { publicDecrypt } = require('crypto');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypts = require('bcryptjs');
const dotenv = require('dotenv');
const prisma = new PrismaClient();
dotenv.config();

//sign up
// 미들웨어를 사용할 수 있도록 연결 시켜주는 함수
// express.json()를 통해서 우리가 받는 데이터를 json으로 변환시킴
// 엔드포인트 만들어주고 비동기 로직 만드는 뼈대
const signup = async (req, res) => {
  try {
    // 비동기 로직: 데이터베이스오 소통하는 코드
    // api 설계했을 때 error 핸들링이 안 된 api는 절대로 안 됨
    // try catch 문 안에서 if로 분기를 하고
    // 새로운 에러를 만들어서 던진다
    const { email, password } = req.body;
    if (!email || !password) throw new Error('invalid input');

    // 암호화
    const hashedPassword = await bcrypt.hash(password, 10); // 몇번 암호화 할지

    const createdUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ createdUserEmail: createdUser.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// login
// email, password 재료로 받는다.
// 해당 유저가 존재하는지, => 가입된 유저가 아닙니다. not found
// 비밀번호가 맞는지 => 유저의 정보가 틀렸습니다. not authenticated
// token 발행
const login = async (req, res) => {
  try {
    // 변수 충돌이 일어나기 때문에 변수를 바꿔주는 것이 좋음
    const { email, password: inputPassword } = req.body;
    // email로 조회하겠다
    const foundUser = await prisma.users.findUnique({ where: { email } });

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
    const token = jwt.sign({ id }, process.env.JWT_SECRETE_KEY, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'login success', token });
  } catch (err) {
    // error를 객체로 넘겨서 키값을 받아옴
    res.status(err.statusCode).json({ message: err.message });
  }

  const prisma = new PrismaClient();
  const app = express();

  const server = http.createServer(app);

  const start = async () => {
    try {
      server.listen(8000, () => console.log('Server is listening'));
    } catch (err) {
      console.log(err);
    } finally {
      await prisma.$disconnect();
    }
  };
}

module.exports = { signup, login };
