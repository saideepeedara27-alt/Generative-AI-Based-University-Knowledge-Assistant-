import mongoose from 'mongoose';
import { Conversation } from '../models/Conversation.js';
import { createAssistantReply } from '../services/assistant.js';

export async function createChatReply(request, response, next) {
  try {
    const message = typeof request.body.message === 'string' ? request.body.message.trim() : '';
    const mode = ['Focused', 'Detailed', 'Quick'].includes(request.body.mode) ? request.body.mode : 'Focused';
    const sessionId = typeof request.body.sessionId === 'string' ? request.body.sessionId.trim() : '';

    if (!message || message.length > 500) return response.status(400).json({ error: 'Please enter a question of up to 500 characters.' });
    if (!sessionId || sessionId.length > 100) return response.status(400).json({ error: 'Your chat session is invalid. Refresh the page and try again.' });

    const { reply, source } = await createAssistantReply(message, mode);

    if (mongoose.connection.readyState === 1) {
      await Conversation.findOneAndUpdate(
        { sessionId },
        { $push: { messages: { $each: [{ role: 'user', content: message }, { role: 'assistant', content: reply }], $slice: -40 } } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    response.json({ reply, source });
  } catch (error) {
    next(error);
  }
}
