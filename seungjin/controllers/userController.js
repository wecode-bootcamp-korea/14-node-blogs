const bcrypts = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userService } = require("../services");

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("invalid request");

    const hashedPassword = await bcrypts.hash(password, 10);
    const createdUser = await userService.createUser({
      email,
      password: hashedPassword,
    });

    res.status(201).json({ createdUserEmail: createdUser.email });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await userService.findUser({
      email,
    });

    if (!foundUser) {
      const error = new Error("user_not_exist");
      error.statusCode = 400;
      throw error;
    }

    const isValidPassword = await bcrypts.compare(password, foundUser.password);

    if (!isValidPassword) {
      const error = new Error("invalid input");
      error.statusCode = 400;
      throw error;
    }

    const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY); //, {expiresIn : '1h'})
    res.status(200).json({ token });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
  signUp,
  logIn,
};
