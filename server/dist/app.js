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
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: ['http://localhost:5173']
}));
// export const getCategoryId = (category: string): number => {
//     const categories: { [key: string]: number } = {
//         'general': 9,
//         'books': 10,
//         'film': 11,
//         'music': 12,
//         'computers': 18,
//         'mathematics': 19,
//         'sports': 21,
//         'geography': 22,
//         'history': 23,
//         'art': 25
//     };
//     return categories[category.toLowerCase()] || 9;
// };
app.use('/api/user', userRoutes_1.userRouter);
app.use('/api/questions', questionRoutes_1.questionRouter);
const startServer = async () => {
    try {
        // Inicializar la base de datos
        await (0, database_1.initializeDatabase)();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
const { PORT } = process.env;
// app.listen(PORT || 5000, () => {
//     console.log(`run on ${PORT || 5000}`)
// }) 
