const {errorWrapper, errorGenerator} = require('../errors');
const {ArticleService} = require('../services');

const getArticles = errorWrapper( async (req, res) => {
  const articles = await ArticleService.findArticles(req.query);
  res.status(200).json({articles});
});

const getOneArticle = errorWrapper(async (req, res) => {
  const {articleId} = req.params;
  const article = await ArticleService.findArticle({id : articleId});
  
  if(!article || article.status === 'DELETED') errorGenerator({statusCode: 400, message: 'deleted'});

  res.status(200).json({article});
});

const postOneArticle = errorWrapper(async (req, res) => {
  const {id : userId} = req.foundUser;
  const {title, body} = req.body;

  if(!title || !body) errorGenerator({statusCode: 400, message: 'invalid input'});

  const createdArticle = await ArticleService.createArticle({userId, title, body});

  res.status(201).json({createdArticle});

});

const updateOneArticle = errorWrapper(async (req, res) => {
  const {articleId} = req.params;
  const {title, body} = req.body;

  const foundArticle = await ArticleService.findArticle({id: articleId});
  
  if(!foundArticle || foundArticle.status === 'DELETED') errorGenerator({statusCode: 400, message: 'deleted'});

  const updatedArticle = await ArticleService.updateArticle({articleId, title, body});
  res.status(200).json({updatedArticle});
});

const deleteOneArticle = errorWrapper(async (req, res) => {
  const {articleId} = req.params;
  
  const foundArticle = await ArticleService.findArticle({id: articleId});
  
  if(!foundArticle || foundArticle.status === 'DELETED') errorGenerator({statusCode: 400, message: "already deleted"});

  const deletedArticle = await ArticleService.deleteArticle(articleId);
  res.status(200).json({deletedArticle});
});

module.exports = {
  getArticles, getOneArticle, postOneArticle, updateOneArticle, deleteOneArticle
}