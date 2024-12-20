"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionController = void 0;
const database_1 = require("../config/database");
const categories_1 = require("../src/categories");
exports.questionController = {
    getQuestion: async (req, res) => {
        const fetchQuestionForCategory = async (requestedCategory, difficulty) => {
            try {
                // Validar que la categoría sea válida
                if (!categories_1.VALID_CATEGORIES.includes(requestedCategory)) {
                    return res.status(400).json({
                        error: 'Invalid category',
                        validCategories: categories_1.VALID_CATEGORIES,
                        message: `Category must be one of: ${categories_1.VALID_CATEGORIES.join(', ')}`
                    });
                }
                const category = requestedCategory;
                console.log('Fetching question for category:', category);
                // Intentar obtener pregunta de la base de datos
                // const existingQuestion = await db('questions')
                // .where('category', category)
                // .orderByRaw('RANDOM()')
                // .first();
                // if (existingQuestion) {
                //     console.log('Found existing question in database');
                //     return res.json({
                //     id: existingQuestion.id,
                //     question: existingQuestion.question_text,
                //     options: existingQuestion.options,
                //     correctAnswer: existingQuestion.correct_answer,
                //     category: existingQuestion.category
                //     });
                // }
                // Si no hay pregunta en DB, obtener de la API
                console.log('No question in database, fetching from API');
                const categoryId = categories_1.categoryIds[category];
                if (!categories_1.DIFFICULTIES.includes(difficulty)) {
                    difficulty = 'medium';
                }
                const apiUrl = `https://opentdb.com/api.php?amount=1&category=${categoryId}&difficulty=${difficulty}&type=multiple`;
                console.log('Making API request to:', apiUrl);
                const response = await fetch(apiUrl);
                const data = await response.json();
                console.log('API Response:', data);
                if (data.response_code === 0 && data.results && data.results.length > 0) {
                    const questionData = data.results[0];
                    const options = [
                        questionData.correct_answer,
                        ...questionData.incorrect_answers
                    ].sort(() => Math.random() - 0.5);
                    try {
                        // Guardar en la base de datos
                        const [newQuestion] = await (0, database_1.db)('questions')
                            .insert({
                            question_text: questionData.question,
                            correct_answer: questionData.correct_answer,
                            options: options,
                            category: category, // Usar la categoría validada
                            // difficulty: difficulty
                        })
                            .returning('*');
                        console.log('Question saved to database');
                        return res.json({
                            id: newQuestion.id,
                            question: questionData.question,
                            options: options,
                            correctAnswer: questionData.correct_answer,
                            category: category,
                            difficulty: difficulty
                        });
                    }
                    catch (dbError) {
                        console.error('Error saving to database:', dbError);
                        // Si falla el guardado, al menos devolver la pregunta
                        return res.json({
                            question: questionData.question,
                            options: options,
                            correctAnswer: questionData.correct_answer,
                            category: category,
                            difficulty: difficulty
                        });
                    }
                }
                // Si no se puede obtener pregunta de la categoría específica, intentar con general
                if (category !== 'General') {
                    console.log('No questions available for category, trying general category');
                    return fetchQuestionForCategory('general', difficulty);
                }
                return res.status(503).json({
                    error: 'Service unavailable',
                    details: 'No questions available at the moment',
                    category: category
                });
            }
            catch (error) {
                console.error('Error in getQuestion:', error);
                return res.status(500).json({
                    error: 'Error generating question',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        };
        const category = req.query.category || 'general';
        const difficulty = req.query.difficulty || 'medium';
        return fetchQuestionForCategory(category, difficulty);
    },
};
