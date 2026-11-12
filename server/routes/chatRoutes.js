import { Router } from 'express';
import { createChatReply } from '../controllers/chatController.js';

export const chatRouter = Router();
chatRouter.post('/chat', createChatReply);
