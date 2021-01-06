const errorGenerator = (message, statusCode = 500) => {
  // 500 default로 설정
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

module.exports = errorGenerator;
