"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionController = void 0;
const database_1 = require("../config/database");
exports.questionController = {
    getQuestion: async (req, res) => {
        try {
            const { category = 'general' } = req.query;
            console.log(`Fetching question for category: ${category}`);
            // Primero intentamos obtener una pregunta de la base de datos
            const existingQuestion = await (0, database_1.db)('questions')
                .where('category', category)
                .orderByRaw('RANDOM()')
                .first();
            if (existingQuestion) {
                const options = [
                    existingQuestion.correct_answer,
                    ...existingQuestion.incorrect_answers
                ].sort(() => Math.random() - 0.5);
                return res.json({
                    id: existingQuestion.id,
                    question: existingQuestion.question,
                    category: existingQuestion.category,
                    options,
                    correctAnswer: existingQuestion.correct_answer,
                    difficulty: existingQuestion.difficulty
                });
            }
            // Si no hay preguntas, obtener de la API...
            const response = await fetch(`https://opentdb.com/api.php?amount=1&category=${category}&type=multiple`);
            const data = await response.json();
            console.log('API response:', data);
            if (data.results && data.results.length > 0) {
                const questionData = data.results[0];
                const [newQuestion] = await (0, database_1.db)('questions')
                    .insert({
                    question: questionData.question,
                    category: questionData.category,
                    correct_answer: questionData.correct_answer,
                    incorrect_answers: questionData.incorrect_answers,
                    difficulty: questionData.difficulty
                })
                    .returning('*');
                const options = [
                    questionData.correct_answer,
                    ...questionData.incorrect_answers
                ].sort(() => Math.random() - 0.5);
                res.json({
                    id: newQuestion.id,
                    question: questionData.question,
                    category: questionData.category,
                    options,
                    correctAnswer: questionData.correct_answer,
                    difficulty: questionData.difficulty
                });
            }
            else {
                throw new Error('No questions available');
            }
        }
        catch (error) {
            console.error('Error:', error);
            if (error instanceof Error) {
                res.status(500).json({
                    error: 'Error generating question',
                    details: error.message
                });
            }
            else {
                res.status(500).json({
                    error: 'Error generating question',
                    details: 'An unknown error occurred'
                });
            }
        }
    }
};
