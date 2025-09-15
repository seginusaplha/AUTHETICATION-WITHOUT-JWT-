
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { body } = require('express-validator');
const validation = require("../middleware/validation");

// Chat with RAG-LLM service
router.post("/send", validation.chatMessage, chatController.sendMessage);
// Chain simulation
router.post('/simulate',
  [
    body('query').notEmpty().withMessage('Query is required'),
    body('userId').optional().isString()
  ],
  chatController.simulateChain
);


module.exports = router;

