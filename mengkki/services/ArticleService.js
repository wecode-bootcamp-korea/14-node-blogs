const prisma = require('../prisma');

const DEFAULT_SKIP = 0;
const DEFAULT_TAKE = 7;

const findArticles = (query) => {
  const {skip, take, title} = query;
  return prisma.articles.findMany({
    skip : Number(skip) || DEFAULT_SKIP,
    take : Number(take) || DEFAULT_TAKE,
    where : {
      title: {
        contains: title
      },
      OR: [ {status : 'DRAFT'}, {status : 'PUBLISHED'} ]
    }
  });
}

const findArticle = (field) => {
  const [uniqueKey] = Object.keys(field);

  const isKeyId = uniqueKey === 'id';
  const value = isKeyId ? Number(field[uniqueKey]) : field[uniqueKey];

  return prisma.articles.findUnique({
    where: {[uniqueKey] : value},

  })
}

const createArticle = (fields) => {
  const {userId : user_id, ...dataFields} = fields;
  return prisma.articles.create({
    data: {
      ...dataFields,
      status : 'PUBLISHED',
      users: {
        connect : {id : user_id}
      },
    }
  })
}

const updateArticle = (fields) => {
  const {articleId, ...requestedFields} = fields;
  return prisma.articles.update({
    where:{
      id: Number(articleId),
    },
    data : {
      ...requestedFields,
      updated_at: new Date()
    }
  })
}

const deleteArticle = (articleId) => {
  return prisma.articles.update({
    where: {
      id: Number(articleId)
    },
    data : {
      status: 'DELETED',
      deleted_at: new Date()
    }
  })
}

module.exports = {
  findArticle, findArticles, createArticle, updateArticle, deleteArticle
}