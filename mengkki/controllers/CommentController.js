const {errorWrapper, errorGenerator} = require('../errors');
const {CommentService, ArticleService} = require('../services');

const getComments = errorWrapper(async (req,res) => {
  const {articleId} = req.params;
  const foundArticle = await ArticleService.findArticle({id: articleId});
  if(!foundArticle || foundArticle.status === 'DELETED') errorGenerator({statusCode: 400, message: 'deleted article'});
  
  const comments = await CommentService.getComments(articleId);
  res.status(200).json({comments});
});

const addComment = errorWrapper(async (req, res) => {
  const {id : userId} = req.foundUser;
  const {articleId} = req.params;
  const {body} = req.body;
  if(!body) errorGenerator({statusCode: 400, message: 'invalid input'});

  const createdComment = await CommentService.createComment({articleId, userId, body});
  res.status(201).json({createdComment});
});

const updateComment = errorWrapper(async (req, res) => {
  const {id : userId} = req.foundUser;
  const {commentId} = req.params;
  const {body} = req.body;

  if(!body) errorGenerator({statusCode: 400, message: 'invalid input'});

  const foundComment = await CommentService.getComment(commentId);
  if(foundComment.deleted_at) errorGenerator({statusCode: 404, message: 'comment not found'});
  if(foundComment.user_id !== Number(userId)) errorGenerator({statusCode: 403, message: 'Unathorized'});

  const updatedComment = await CommentService.updateComment({commentId, body});
  res.status(200).json({updatedComment});
});

const deleteComment = errorWrapper(async (req, res) => {
  const {id : userId} = req.foundUser;
  const {commentId} = req.params;

  const foundComment = await CommentService.getComment(commentId);
  if(foundComment.deleted_at) errorGenerator({statusCode: 404, message: 'comment not found'});
  if(foundComment.user_id !== Number(userId)) errorGenerator({statusCode: 403, message: 'Unathorized'});

  const deletedComment = await CommentService.deleteComment(commentId);
  res.status(200).json({deletedComment});
});

module.exports = {
  getComments, addComment, updateComment, deleteComment
}