const prisma = require('../prisma');

const getComments = (article_id) => {
  return prisma.comments.findMany({
    where: {
      article_id : Number(article_id),
      deleted_at: null
    }
  })
}

//comment id로 comment 조회
const getComment = (commentId) => {
  return prisma.comments.findUnique({
    where: {
      id : Number(commentId)
    }
  })
}

const createComment = ({articleId, userId, body}) => {
  return prisma.comments.create({
    data: {
      body,
      users: {
        connect: {id : Number(userId)}
      },
      articles: {
        connect: {id: Number(articleId)}
      }
    }
  })
}

const updateComment = ({commentId, body}) => {
  return prisma.comments.update({
    where: {id : Number(commentId)},
    data : {
      body,
      updated_at: new Date()
    }
  })
}

const deleteComment = (id) => {
  return prisma.comments.update({
    where: {id : Number(id)},
    data: {
      deleted_at: new Date()
    }
  })
}


module.exports = {
  getComments, getComment, createComment, updateComment, deleteComment
}