const express = require('express')
const http = require('http')
const dotenv = require('dotenv')
dotenv.config() // server.js 가장 최상위 엔트리 코드가 될 거고, 
const app = express()

const {router: userRouter} = require('./modules/userRouter')
const {router: articleRouter} = require('./modules/articleRouter')
const {prisma, tokenDecorator} = require('./modules/middlewares')

app.use(express.json())
app.use('/users', userRouter)
app.use('/articles', tokenDecorator, articleRouter)

const server = http.createServer(app)
const start = async () => {
    try {
        server.listen(8000, () => console.log('Server is listening'))
    }
    catch(err) {
        console.log(err)
    }
    finally {
        await prisma.$disconnect()
    }
}

start()
