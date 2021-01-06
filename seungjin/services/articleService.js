const prisma = require("../prisma");

const createArticle = (article, user) => {
  return prisma.articles.create({
    data: {
      title: article.title,
      body: article.body,
      users: {
        connect: { id: user.id },
      },
    },
  });
};

const findArticle = (id) => {
  return prisma.articles.findUnique({
    where: { id: Number(id) },
    include: { comments: true },
  });
};

const updateArticle = (id, article) => {
  return prisma.articles.update({
    where: { id: Number(id) },
    data: {
      title: article.title,
      body: article.body,
      status: article.status,
    },
  });
};

const deleteArticle = (id) => {
  prisma.articles.delete({ where: { id: Number(id) } });
};

module.exports = {
  createArticle,
  findArticle,
  updateArticle,
  deleteArticle,
};
