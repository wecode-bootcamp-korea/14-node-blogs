// 필요한 재료를 받아서, db에 유저를 생성한다.

const prisma = require('../prisma');

// fields: {}
const createUser = (fields) => {
  return prisma.users.create({
    data: fields,
    // fields가 객체로 들어올 것
    // async await를 안 하는 이유는 controller함수에서 이미 해주기 때문에
    // 다시 해줄 필요가 없음
    // 이 놈 자체가 이미 프로미스를 리턴하기 때문에
    // 비동기더라도 기다린다
  });
};

// id 혹은 email
// field: {}
// 모든 조건을 검사하는 범용성 있는 함수
/**
 *
 * @parma {*} field
 *
 * field {
 * email: 'edie"
 * }
 *
 * field {
 * id: 3
 * }
 */
// 아이디는 숫자, 이메일은 스트링
// 핸들링 해줘야 함
const findUser = (field) => {
  const [uniqueKey] = Object.keys(field);
  // const value = field[uniqleKey]; 이렇게 끝날 것이 아니라
  // 다음과 같이 에러 핸들링이 필요

  const isKeyId = uniqueKey === 'id';
  const value = isKeyId ? Number(field[uniqueKey]) : field[uniqueKey];

  return prisma.users.findUnique({
    where: { [uniqueKey]: value },
  });
};

module.exports = {
  createUser,
  findUser,
};
