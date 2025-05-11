import { generateQuiz, submitQuiz } from '../../controllers/quizController.js';

export const config = {
  runtime: 'nodejs16.x',
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return generateQuiz(req, res);
  } else if (req.method === 'POST') {
    return submitQuiz(req, res);
  }
}
