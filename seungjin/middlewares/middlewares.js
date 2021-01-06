const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

const validateToken = async (req, res, next) => {
  try {
    let error;
    const token = req.headers.authorization;

    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }

    req.foundUser = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = validateToken;
