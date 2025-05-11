import { generateChatResponse, getConversationHistory } from '../../controllers/chatController.js';

export const config = {
  runtime: 'nodejs16.x', // Especificar la versión de Node.js
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return generateChatResponse(req, res);
  } else if (req.method === 'GET') {
    return getConversationHistory(req, res);
  }
}
