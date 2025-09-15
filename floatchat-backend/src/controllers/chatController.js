const ragLlmService = require("../services/ragLlmService");
const ChatSession = require("../models/ChatSession");
const { validationResult } = require("express-validator");
class ChatController {
  async sendMessage(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { message, sessionId = "default" } = req.body;
      const userId = req.user.userId;

      // Call Python RAG-LLM service
      const ragResponse = await ragLlmService.askQuestion(message, userId);

      // Save chat session to MongoDB
      await ChatSession.findOneAndUpdate(
        { userId, sessionId },
        {
          $push: {
            messages: [
              {
                role: "user",
                content: message,
                timestamp: new Date(),
              },
              {
                role: "assistant",
                content: ragResponse.answer,
                timestamp: new Date(),
                sources: ragResponse.sources,
                data_points: ragResponse.data_points,
              },
            ],
          },
        },
        { upsert: true, new: true }
      );

      res.json({
        success: true,
        answer: ragResponse.answer,
        sources: ragResponse.sources,
        data_points: ragResponse.data_points,
        sessionId,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
  // ✅ Simulate Chain
  async simulateChain(req, res) {
    try {
      const { query } = req.body;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: "Query is required",
        });
      }

      const result = await ragLlmService.simulateChain(query);

      res.json({
        success: true,
        result: result.result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  }
}

module.exports = new ChatController();
