const { commentService } = require("../services");

const findComment = async (req, res) => {
  try {
    const { id } = req.params;

    const foundComment = await commentService.findComment(id);

    if (!foundComment) {
      const error = new Error("article not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(201).json({ foundComment });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const createComment = async (req, res) => {
  try {
    const { title, body, status } = req.body;
    if (!title || !body) {
      const error = new Error("invalid input");
      error.statusCode = 400;
      throw error;
    }

    const createdComment = await commentService.createComment(
      req.body,
      req.foundUser
    );

    res.status(201).json({ createdComment });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, status } = req.body;

    if (!id || !title || !body || !status) throw new Error("invalid input");

    const foundComment = await commentService.findComment(id);
    if (!foundComment) {
      const error = new Error("comment not found");
      error.statusCode = 404;
      throw error;
    }

    const comments = await commentService.updateComment(id, req.body);

    res.status(201).json({ comments });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      const error = new Error("invalid input");
      error.statusCode = 404;
      throw error;
    }

    await commentService.deleteComment();
    res.status(204).json({ message: "SUCCESS" });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
  findComment,
  createComment,
  updateComment,
  deleteComment,
};
