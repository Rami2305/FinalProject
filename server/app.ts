import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'; 
import { initializeDatabase } from './config/database';
import {userRouter} from './routes/userRoutes';
import { questionRouter } from './routes/questionRoutes'
import  { leaderboardRouter }   from './routes/leaderboardRoutes';


dotenv.config();    
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
    ? ['https://triviagg.onrender.com']  // Esto lo cambiaremos cuando tengamos la URL de Render
    : ['http://localhost:5173'],
credentials: true
}))

app.use('/api/user', userRouter)
app.use('/api/questions', questionRouter)
app.use('/api/leaderboard', leaderboardRouter);


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

const startServer = async () => {
    try {
        // Inicializar la base de datos
        await initializeDatabase();
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
const { PORT } = process.env;


