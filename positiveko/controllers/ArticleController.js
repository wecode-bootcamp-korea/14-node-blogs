const { ArticleService } = require('../services')
const { errorWrapper, errorGenerator } = require('../errors')


const getArticles = errorWrapper(async (req, res) => {
  const articles = await ArticleService.findArticles(req.query)
  res.status(200).json({ articles })
})

const getOneArticle = errorWrapper(async (req, res) => {
  const { articleId } = req.params
  const article = await ArticleService.findArticle({ id: articleId })

  if (article.deleted_at) return res.status(200).json({ message: 'deleted ' })

  res.status(200).json({ article })
})