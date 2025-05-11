import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

import { generateQuiz, submitQuiz } from '../controllers/quizController.js';


// Ruta para generar el quiz
router.get('/:topic', generateQuiz);

// Ruta para enviar el resultado y guardarlo
router.post('/save', submitQuiz);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// RUTA EXISTENTE: Genera preguntas según el tema
router.get('/:topic', async (req, res) => {
  const { topic } = req.params;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Eres un generador de cuestionarios para temas de trivia. Responde siempre en formato JSON.',
        },
        {
          role: 'user',
          content: `Genera un array JSON de 5 preguntas con 4 opciones y una respuesta correcta sobre el tema "${topic}". El formato debe ser así:

[
  {
    "question": "¿Cuál es la capital de Francia?",
    "options": ["Madrid", "Berlín", "París", "Roma"],
    "answer": "París"
  }
]`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    const quiz = JSON.parse(content);
    res.json(quiz);

  } catch (error) {
    console.error('❌ Error al generar preguntas desde OpenAI:', error.message);
    res.status(500).json({ error: 'Hubo un error al generar las preguntas' });
  }
});

import QuizAttempt from '../models/QuizAttempt.js'; // Asegúrate de tener este import

router.post('/save', async (req, res) => {
  const { topic, questions } = req.body;

  try {
    const correctCount = questions.filter(q => q.userAnswer === q.correctAnswer).length;

    const attempt = new QuizAttempt({
      topic,
      questions,
      score: correctCount
    });

    await attempt.save();

    res.json({ message: 'Respuestas guardadas correctamente en MongoDB', score: correctCount });
  } catch (error) {
    console.error('❌ Error al guardar en MongoDB:', error.message);
    res.status(500).json({ error: 'Error al guardar en la base de datos' });
  }
});



export default router;

