const prisma = require("../prisma");

const createComment = (comment, user) => {
  return prisma.comments.create({
    data: {
      body: comment.body,
      users: {
        connect: { id: user.id },
      },
      articles: {
        connect: { id: comment.id },
      },
    },
  });
};

const findComment = (id) => {
  return prisma.comments.findUnique({
    where: { id: Number(id) },
  });
};

const updateComment = (id, article) => {
  return prisma.comments.update({
    where: { id: Number(id) },
    data: {
      body: article.body,
      updated_at: new Date().toLocaleString("ko-KR", { timezone: "UTC" }),
    },
  });
};

const deleteComment = (id) => {
  prisma.comments.update({
    where: { id: Number(id) },
    data: {
      deleted_at: new Date().toLocaleString("ko-KR", { timezone: "UTC" }),
    },
  });
};

module.exports = {
  createComment,
  findComment,
  updateComment,
  deleteComment,
};
