const http = require("http");
const dotenv = require("dotenv");
dotenv.config(); // server.js 가장 최상위 엔트리 코드가 될 거고,
const prisma = require("./prisma");
const app = require("./app");

const server = http.createServer(app);
const start = async () => {
  try {
    const { PORT } = process.env;
    server.listen(PORT, () => console.log("Server is listening"));
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
};

start();
