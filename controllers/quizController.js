import { OpenAI } from 'openai';
import QuizAttempt from '../models/QuizAttempt.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateQuiz = async (req, res) => {
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
    "correctAnswer": "París"
  }
]`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const questions = JSON.parse(response.choices[0].message.content);
    res.json(questions);
  } catch (error) {
    console.error('Error al generar preguntas:', error.message);
    res.status(500).json({ error: 'Hubo un error al generar las preguntas' });
  }
};

export const submitQuiz = async (req, res) => {
  // Agregar este console.log para ver si los datos llegan correctamente
  console.log('Recibiendo datos desde el frontend:', req.body); // Aquí puedes ver lo que recibes

  const { topic, questions } = req.body;

  try {
    // Aquí calculamos las respuestas correctas
    const correctCount = questions.filter(q => q.userAnswer === q.correctAnswer).length;

    // Verificar si las respuestas se están procesando correctamente
    console.log('Respuestas correctas:', correctCount);
    console.log('Total de preguntas:', questions.length);

    const attempt = new QuizAttempt({
      topic,
      questions,
      score: correctCount
    });

    await attempt.save();

    // Enviar la respuesta con la puntuación y el total de preguntas
    res.json({ score: correctCount, total: questions.length });
  } catch (error) {
    console.error('Error al guardar el intento:', error.message);
    res.status(500).json({ error: 'Error al guardar respuestas' });
  }
};
