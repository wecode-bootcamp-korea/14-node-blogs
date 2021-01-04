require('dotenv').config();
const http = require('http');
const app = require('./app');
const prisma = require('./prisma');
const {PORT} = process.env;

const server = http.createServer(app);
const start = async () => {
  try {
    server.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
  }
}

start();