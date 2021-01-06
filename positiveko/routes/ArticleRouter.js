const express = require('express');
const router = express.Router();

const { ArticleController } = require('../controllers');

router.get('/', ArticleController.getArticles);
router.get('/:articleId', ArticleController.getOneArticle);
router.post('/', ArticleController.postOneArticle);
router.put('/:articleId', ArticleController.updateOneArticle);
router.put('/publish/:articleId', ArticleController.publishOneArticle);
router.delete('/:articleId', ArticleController.deleteOneArticle);

module.exports = router;
