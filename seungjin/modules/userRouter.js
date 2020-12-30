const bcrypts = require('bcryptjs')
const jwt = require('jsonwebtoken')
const express = require('express')
const {prisma} = require('./middlewares')
const router = express.Router()

const SignUp = async (req, res) => {
    try {
        const {email, password} = req.body        
        if (!email || !password) throw new Error('invalid request')

        const hashedPassword = await bcrypts.hash(password, 10)
        const createdUser = await prisma.users.create({
            data:{
                email,
                password: hashedPassword,
            }
        })

        res.status(201).json({createdUserEmail: createdUser.email})
    } catch(err){
        res.status(err.statusCode || 500).json({message:err.message})
    }
}

const LogIn = async (req, res) => {
    try {
        const {email, password: inputPassword} = req.body
        const foundUser = await prisma.users.findUnique({where :{email}})
        if (!foundUser) {
            const error = new Error('user_not_exist')
            error.statusCode = 400
            throw error
        }
        
        const {id, password: hashedPassword} = foundUser
        const isValidPassword = await bcrypts.compare(inputPassword, hashedPassword)        
        
        if (!isValidPassword) {
            const error = new Error('invalid input')
            error.statusCode = 400
            throw error
        }

        const token = jwt.sign({id}, process.env.JWT_SECRET_KEY) //, {expiresIn : '1h'})
        res.status(200).json({token})
    } catch(err){
        res.status(err.statusCode || 500).json({message:err.message})
    }
}

router.post('/signup', SignUp)
router.post('/login', LogIn)


module.exports = {router}