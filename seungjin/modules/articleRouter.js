const express = require('express')
const {prisma} = require('./middlewares')
const router = express.Router()

const Get = async (req, res) => {
    try {
        const {id} = req.params          
                
        const foundArticle = await prisma.articles.findUnique({where:{id: Number(id)}})
        if (!foundArticle) {
            const error = new Error('article_not_exist')
            error.statusCode=404
            throw error
        }

        res.status(201).json({foundArticle})
    } catch(err){
        res.status(err.statusCode || 500).json({message:err.message})
    }
}

const Create = async (req, res) => {
    try {
        const {title, body, status} = req.body        
        
        if (!title || !body) {
            const error = new Error('invalid input')
            error.statusCode = 400
            throw error
        }
                
        const createdArticle = await prisma.articles.create({
            data:{                
                title, 
                body,
                users:{
                    connect : {id: req.decodedToken.id}
                },                
            }
        })

        res.status(201).json({createdArticle})
    } catch(err){
        res.status(err.statusCode || 500).json({message:err.message})
    }
}

const Update = async (req, res) => {
    try {      
        const {id} = req.params  
        const {title, body, status} = req.body        
        
        if (!id || !title || !body || !status) throw new Error('invalid input')
        
        let article = prisma.articles.findUnique({where:{id: Number(id)}})
        if (!article) {
            const error = new Error('article_not_exist')
            error.statusCode = 404
            throw error
        }

        article = await prisma.articles.update(
                        {
                            where:{id: Number(id)},
                            data:{
                                title, 
                                body,
                                status
                            }
                        })        
        
        res.status(201).json({article})
    } catch(err){
        res.status(err.statusCode || 500).json({message:err.message})
    }
}

const Delete = async (req, res) => {
    try{
        const {id} = req.params 

        if (!id) {
            const error = new Error('invalid input')
            error.statusCode = 404
            throw error
        }

        await prisma.articles.delete(
            {
                where:{id: Number(id)}
            })
        res.status(204).json({message:"SUCCESS"})
    } catch(err){
        res.status(err.statusCode || 500).json({message:err.message})
    }
}

router.post('/', Create)
router.get('/:id', Get)
router.put('/:id', Update)
router.delete('/:id', Delete)

module.exports = {router}