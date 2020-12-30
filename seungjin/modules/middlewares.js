const jwt = require('jsonwebtoken')
const { PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


const tokenDecorator = async (req, res, next) => {
    try {
        let error
        const token = req.headers["authorization"] || req.headers["x-access-token"] || req.query.token
        if (!token) {
            error = new Error('invalid_request')
            error.statusCode = 400
            throw error        
        }
        
        let decodedToken;
    
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        } catch {
            error = new Error('invalid_token')
            error.statusCode = 400
            throw error
        }        
    
        const user = await prisma.users.findUnique({where:{id:decodedToken.id}})
        if(!user) {
            error = new Error('user_not_exists')
            error.statusCode = 404
            throw error
        }

        req.decodedToken = decodedToken
        next()
    } catch(err){
        res.status(err.statusCode || 500).json({message:err.message})
    }    
}

module.exports = {prisma, tokenDecorator}