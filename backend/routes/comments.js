const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Article = require('../models/Article');
const { verifyToken } = require('../middleware/auth');
const socket = require('../socket');
const router = express.Router();

// Create comment
router.post('/', verifyToken, [
  body('content').trim().notEmpty(),
  body('article').isMongoId()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const comment = new Comment({ ...req.body, author: req.user.id });
  await comment.save();

  // Real-time emit
  socket.getIO().emit('newComment', comment);

  // Notify article author
  const article = await Article.findById(req.body.article).populate('author');
  if (article.author._id.toString() !== req.user.id) {
    socket.getIO().to(article.author._id.toString()).emit('notification', { message: 'New comment on your article' });
  }

  res.status(201).json(comment);
});

// Get comments for article
router.get('/:articleId', async (req, res) => {
  const comments = await Comment.find({ article: req.params.articleId }).populate('author', 'username');
  res.json(comments);
});

module.exports = router;