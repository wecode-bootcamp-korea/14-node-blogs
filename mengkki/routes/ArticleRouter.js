const express = require('express');
const router = express.Router();
const {validateToken} = require('../middlewares');
const {ArticleController, CommentController} = require('../controllers');

//articles
router.get('/', ArticleController.getArticles);
router.get('/:articleId', ArticleController.getOneArticle);
router.post('/', validateToken, ArticleController.postOneArticle);
router.put('/:articleId', validateToken, ArticleController.updateOneArticle);
router.delete('/:articleId', validateToken, ArticleController.deleteOneArticle);

//comments
router.get('/:articleId/comments', CommentController.getComments);
router.post('/:articleId/comments', validateToken, CommentController.addComment);
router.put('/:articleId/comments/:commentId', validateToken, CommentController.updateComment);
router.delete('/:articleId/comments/:commentId', validateToken, CommentController.deleteComment);

module.exports = router;