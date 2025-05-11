// ... imports
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
import dotenv from 'dotenv';
dotenv.config();


// Middleware
app.use(cors({
  origin: 'https://frontend2corte.vercel.app',
  credentials: true
}));
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error en MongoDB:', err));

// Rutas
app.use('/api/chat', chatRoutes);
app.use('/api/quiz', quizRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
