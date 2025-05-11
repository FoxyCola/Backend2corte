// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import chatRoutes from './routes/quizRoutes.js'; // Asegúrate que este archivo existe y está bien exportado
import quizRoutes from './routes/quizRoutes.js'; // Si son distintos, cámbialos; si es el mismo, uno sobra

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://frontend2corte.vercel.app',
  credentials: true
}));
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error en MongoDB:', err));

// Rutas
app.use('/api/chat', chatRoutes);
app.use('/api/quiz', quizRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
