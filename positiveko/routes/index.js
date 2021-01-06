const express = require('express');
const router = express.Router();
const UserRouter = require('./UserRouter');
const AricleRouter = require('./ArticleRouter');

// 처 번째 인자는 길, 두 번째는 함수
router.use('/users', UserRouter);

// // articles
router.use('/articles', AricleRouter);

module.exports = router;
// 라우터를 만들어서 user와 관련된 라우터를 연결시켜 주고 최상위 라우터와 연결
