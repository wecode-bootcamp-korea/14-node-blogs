const errorGenerator = ({message, statusCode = 500}) => {
  const error = new Error(message);
  error.status = statusCode;
  throw error;
}

module.exports = errorGenerator;