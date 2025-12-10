const express = require('express');
const { body, validationResult } = require('express-validator');
const Article = require('../models/Article');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// Create article
router.post('/', verifyToken, checkRole(['Writer', 'Editor', 'Admin']), [
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const article = new Article({ ...req.body, author: req.user.id });
  await article.save();
  res.status(201).json(article);
});

// Get all articles
router.get('/', async (req, res) => {
  const articles = await Article.find().populate('author', 'username').sort({ title: 1 });
  res.json(articles);
});

// Get one article
router.get('/:id', async (req, res) => {
  const article = await Article.findById(req.params.id).populate('author', 'username');
  if (!article) return res.status(404).json({ message: 'Article not found' });
  res.json(article);
});

// Update article
router.put('/:id', verifyToken, async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ message: 'Article not found' });

  if (req.user.role === 'Writer' && article.author.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Can only edit own articles' });
  }
  if (!['Editor', 'Admin', 'Writer'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete article
router.delete('/:id', verifyToken, checkRole(['Admin']), async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ message: 'Article deleted' });
});

module.exports = router;