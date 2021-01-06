const errorWrapper = (controller) => async (req, res, next) => {
  // 함수를 인자로 받아서 미들웨어를 리턴하는데
  // 익스프레스 미들웨어는 항상 저 세개 인자를 받음
  //
  try {
    await controller(req, res);
  } catch (err) {
    next(err);
  }
};

module.exports = errorWrapper;
