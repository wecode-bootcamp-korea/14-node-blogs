const {errorWrapper, errorGenerator} = require('../errors');

const validateUserInputs = errorWrapper(async (req, res, next) => {
  const {email, password} = req.body;
  if(!email || !password) errorGenerator({statusCode: 400, message: 'invalid input'});
  const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}/;
  if(emailRegex.test(email) && passwordRegex.test(password)) next();
  errorGenerator({statusCode: 400, message: 'invalid input'});
});

module.exports = validateUserInputs;