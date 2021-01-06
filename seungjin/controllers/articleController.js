const { articleService } = require("../services");

const findArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const foundArticle = await articleService.findArticle(id);

    if (!foundArticle) {
      const error = new Error("article not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(201).json({ foundArticle });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const createArticle = async (req, res) => {
  try {
    const { title, body, status } = req.body;
    if (!title || !body) {
      const error = new Error("invalid input");
      error.statusCode = 400;
      throw error;
    }

    const article = await articleService.createArticle(req.body, req.foundUser);

    res.status(201).json({ createdArticle });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, status } = req.body;

    if (!id || !title || !body || !status) throw new Error("invalid input");

    let article = prisma.articles.findUnique({ where: { id: Number(id) } });
    if (!article) {
      const error = new Error("article not found");
      error.statusCode = 404;
      throw error;
    }

    const articles = await articleService.updateArticle(id, req.body);

    res.status(201).json({ articles });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      const error = new Error("invalid input");
      error.statusCode = 404;
      throw error;
    }

    await articleService.deleteArticle();
    res.status(204).json({ message: "SUCCESS" });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
  findArticle,
  createArticle,
  updateArticle,
  deleteArticle,
};
