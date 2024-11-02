"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const userRoutes_1 = require("./routes/userRoutes");
const questionRoutes_1 = require("./routes/questionRoutes");
const leaderboardRoutes_1 = require("./routes/leaderboardRoutes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://tu-frontend-url.onrender.com'] // Esto lo cambiaremos cuando tengamos la URL de Render
        : ['http://localhost:5173'],
    credentials: true
}));
app.use('/api/user', userRoutes_1.userRouter);
app.use('/api/questions', questionRoutes_1.questionRouter);
app.use('/api/leaderboard', leaderboardRoutes_1.leaderboardRouter);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
const startServer = async () => {
    try {
        // Inicializar la base de datos
        await (0, database_1.initializeDatabase)();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
const { PORT } = process.env;
