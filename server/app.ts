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
    credentials: true,
    origin:['http://localhost:5173']
}))

app.use('/api/user', userRouter)
app.use('/api/questions', questionRouter)
app.use('/api/leaderboard', leaderboardRouter);

const startServer = async () => {
    try {
        // Inicializar la base de datos
        await initializeDatabase();
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
const { PORT } = process.env;


