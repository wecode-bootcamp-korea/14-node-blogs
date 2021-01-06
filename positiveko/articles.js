const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createArticle = async (req, res) => {
  try {
    const { user_id, title, body } = req.body;
    if (!user_id || !title || !body) {
      const error = new Error('invalid input');
      error.status = 400;
      throw error;
    }

    const foundUser = await prisma.users.findUnique({ where: { id: user_id } });
    if (!foundUser) {
      const error = new Error('user not found');
      error.status = 404;
      throw error;
    }

    const createArticle = await prisma.articles.create({
      data: {
        users: {
          connect: { id: user_id },
        },
        title,
        body,
        status: 'PUBLISHED',
      },
    });

    res.status(201).json({ createArticle });
  } catch (error) {
    res.status(eror.status).json({ message: error.message });
  }
};

const getArticles = async (req, res) => {
  try {
    const articles = await prisma.articles.findMany({
      where: {
        OR: [{ status: 'DRAFT' }, { status: 'PUBLISHED' }],
      },
    });
    res.staus(200).json({ articles });
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

const getArticle = async(req, res) => {
  try {
    const {id} = req.params;
    const foundArticle = await prisma.articles.findUnique({
      where: {
        id : Number(id)
      }
    });
    if(!foundArticle || foundArticle.status === 'DELETED'){
      const error = new Error('invalid id');
      error.status = 400;
      throw error;
    }
    console.log(foundArticle);
    res.status(200).json({foundArticle});
  } catch (error) {
    res.status(error.status).json({message : error.message});
  }
}

const updateArticle = async(req, res) => {
  try {
    const {id} = req.params;
    const {title, body} = req.body;
    if(!title || !body){
      const error = new Error('invalid input');
      error.status(400);
      throw error;
    }

    const foundArticle = await prisma.articles.findUnique({
      where: {
        id : Number(id)
      }
    });

    if(!foundArticle || foundArticle.status === 'DELETED'){
      const error = new Error('invalid id');
      error.status = 400;
      throw error;
    }

    const updatedArticle = await prisma.articles.update({
      where: {
        id : Number(id)
      },
      data: {
        title, body
      }
    });

    res.status(200).json({updatedArticle});
  } catch (error) {
    res.status(error.status).json({message : error.message});
  }
}

const deleteArticle = async (req, res) => {
  try {
    const {id} = req.params;

    const foundArticle = await prisma.articles.findUnique({
      where: {
        id : Number(id)
      }
    });

    if(!foundArticle){
      const error = new Error('invalid id');
      error.status = 400;
      throw error;
    }

    const deletedArticle = await prisma.articles.update({
      where: {
        id: Number(id)
      },
      data: {
        status: 'DELETED'
      }
    });
    res.status(200).json({deletedArticle});
  } catch (error) {
    res.status(error.status).json({message : error.message});
  }
}


module.exports = {createArticle, getArticles, getArticle, updateArticle, deleteArticle}; 
