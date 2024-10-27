import { Request, Response } from 'express';
import { db } from '../config/database';

interface QuestionController {
    getQuestion: (req: Request, res: Response) => Promise<Response | void>;
}

const getCategoryId = (category: string): number => {
    const categories: { [key: string]: number } = {
        'general': 9,
        'books': 10,
        'film': 11,
        'music': 12,
        'science': 17,
        'computers': 18,
        'mathematics': 19,
        'sports': 21,
        'geography': 22,
        'history': 23,
        'art': 25
    };
    return categories[category.toLowerCase()] || 9;
};


export const questionController: QuestionController = {
        
    getQuestion: async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const { category = 'general' } = req.query;
            console.log('Fetching question for category:', category);

            // Intentar obtener pregunta de la base de datos
            const existingQuestion = await db('questions')
                .where('category', category)
                .orderByRaw('RANDOM()')
                .first();

            if (existingQuestion) {
                return res.json({
                    id: existingQuestion.id,
                    question: existingQuestion.question_text,
                    options: existingQuestion.options,
                    correctAnswer: existingQuestion.correct_answer,
                    category: existingQuestion.category
                });
            }

            // Si no hay pregunta en DB, obtener de la API
            const categoryId = getCategoryId(category as string);
            const response = await fetch(
                `https://opentdb.com/api.php?amount=1&category=${categoryId}&type=multiple`
            );
            
            const data = await response.json();

            if (data.response_code === 0 && data.results && data.results.length > 0) {
                const questionData = data.results[0];
                
                // Crear array de opciones y mezclarlas
                const options = [
                    questionData.correct_answer,
                    ...questionData.incorrect_answers
                ].sort(() => Math.random() - 0.5);

                // Guardar en la base de datos
                const [newQuestion] = await db('questions')
                    .insert({
                        question_text: questionData.question,
                        correct_answer: questionData.correct_answer,
                        options: options,
                        category: questionData.category
                    })
                    .returning('*');

                return res.json({
                    id: newQuestion.id,
                    question: newQuestion.question_text,
                    options: options,
                    correctAnswer: newQuestion.correct_answer,
                    category: newQuestion.category
                });
            } else {
                // Pregunta por defecto si la API falla
                return res.json({
                    id: 0,
                    question: "¿Cuál es la capital de Francia?",
                    options: ["París", "Londres", "Madrid", "Roma"],
                    correctAnswer: "París",
                    category: "geography"
                });
            }
        } catch (error) {
            console.error('Error in getQuestion:', error);
            return res.status(500).json({ 
                error: 'Error generating question',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
};
// ESTA ES LA VERSION QUE FUNCIONABA ANTES
// export const questionController: QuestionController = {
//     getQuestion: async (req: Request, res: Response): Promise<Response | void> => {
//         try {
//             const { category = 'general' } = req.query;
//             console.log('Fetching question for category:', category);

//             // Intentar obtener pregunta de la base de datos
//             const existingQuestion = await db('questions')
//                 .where('category', category)
//                 .orderByRaw('RANDOM()')
//                 .first();

//             if (existingQuestion) {
//                 return res.json({
//                     id: existingQuestion.id,
//                     question: existingQuestion.question_text,
//                     options: existingQuestion.options,
//                     correctAnswer: existingQuestion.correct_answer,
//                     category: existingQuestion.category
//                 });
//             }

//             // Si no hay pregunta en DB, obtener de la API
//             const categoryId = getCategoryId(category as string);
//             const response = await fetch(
//                 `https://opentdb.com/api.php?amount=1&category=${categoryId}&type=multiple`
//             );
            
//             const data = await response.json();

//             if (data.response_code === 0 && data.results && data.results.length > 0) {
//                 const questionData = data.results[0];
                
//                 // Crear array de opciones y mezclarlas
//                 const options = [
//                     questionData.correct_answer,
//                     ...questionData.incorrect_answers
//                 ].sort(() => Math.random() - 0.5);

//                 // Guardar en la base de datos
//                 const [newQuestion] = await db('questions')
//                     .insert({
//                         question_text: questionData.question,
//                         correct_answer: questionData.correct_answer,
//                         options: options,
//                         category: questionData.category
//                     })
//                     .returning('*');

//                 return res.json({
//                     id: newQuestion.id,
//                     question: newQuestion.question_text,
//                     options: options,
//                     correctAnswer: newQuestion.correct_answer,
//                     category: newQuestion.category
//                 });
//             } else {
//                 // Pregunta por defecto si la API falla
//                 return res.json({
//                     id: 0,
//                     question: "¿Cuál es la capital de Francia?",
//                     options: ["París", "Londres", "Madrid", "Roma"],
//                     correctAnswer: "París",
//                     category: "geography"
//                 });
//             }
//         } catch (error) {
//             console.error('Error in getQuestion:', error);
//             return res.status(500).json({ 
//                 error: 'Error generating question',
//                 details: error instanceof Error ? error.message : 'Unknown error'
//             });
//         }
//     }
// };




// export const questionController: QuestionController = {
//     getQuestion: async (req: Request, res: Response): Promise<Response | void> => {
//         try {
//             const { category = 'general' } = req.query;
//             console.log('Fetching question for category:', category);

//             // Primero intentamos obtener una pregunta de la base de datos
//             const existingQuestion = await db('questions')
//                 .where('category', category)
//                 .orderByRaw('RANDOM()')
//                 .first();

//             if (existingQuestion) {
//                 console.log('Found existing question in database');
//                 const options = [
//                     existingQuestion.correct_answer,
//                     ...existingQuestion.incorrect_answers
//                 ].sort(() => Math.random() - 0.5);

//                 return res.json({
//                     id: existingQuestion.id,
//                     question: existingQuestion.question,
//                     category: existingQuestion.category,
//                     options,
//                     correctAnswer: existingQuestion.correct_answer,
//                     difficulty: existingQuestion.difficulty
//                 });
//             }

//             // Si no hay en la DB, obtener de la API
//             console.log('No question in database, fetching from API');
//             const categoryId = getCategoryId(category as string);
//             const apiUrl = `https://opentdb.com/api.php?amount=1&category=${categoryId}&type=multiple`;
//             console.log('Fetching from:', apiUrl);

//             const response = await fetch(apiUrl);
//             const data = await response.json();
//             console.log('API response:', data);

//             if (data.response_code === 0 && data.results && data.results.length > 0) {
//                 const questionData = data.results[0];
                
//                 // Guardar en la base de datos
//                 const [newQuestion] = await db('questions')
//                     .insert({
//                         question: questionData.question,
//                         category: questionData.category,
//                         correct_answer: questionData.correct_answer,
//                         incorrect_answers: questionData.incorrect_answers,
//                         difficulty: questionData.difficulty
//                     })
//                     .returning('*');

//                 const options = [
//                     questionData.correct_answer,
//                     ...questionData.incorrect_answers
//                 ].sort(() => Math.random() - 0.5);

//                 return res.json({
//                     id: newQuestion.id,
//                     question: questionData.question,
//                     category: questionData.category,
//                     options,
//                     correctAnswer: questionData.correct_answer,
//                     difficulty: questionData.difficulty
//                 });
//             } else {
//                 // Si no hay preguntas disponibles, devolver una pregunta por defecto
//                 console.log('No questions available from API, returning default question');
//                 return res.json({
//                     id: 0,
//                     question: "¿Cuál es la capital de Francia?",
//                     category: "geography",
//                     options: ["París", "Londres", "Madrid", "Roma"],
//                     correctAnswer: "París",
//                     difficulty: "easy",
//                     note: "Default question - API unavailable"
//                 });
//             }
//         } catch (error) {
//             console.error('Error in getQuestion:', error);
//             if (error instanceof Error) {
//                 return res.status(500).json({ 
//                     error: 'Error generating question',
//                     details: error.message 
//                 });
//             } else {
//                 return res.status(500).json({ 
//                     error: 'Error generating question',
//                     details: 'An unknown error occurred'
//                 });
//             }
//         }
//     }
// };


// import { Request, Response } from 'express';
// import { db } from '../config/database';


// interface QuestionController {
//     getQuestion: (req: Request, res: Response) => Promise<Response | void>;
// }

// export const questionController: QuestionController = {
//     getQuestion: async (req: Request, res: Response): Promise<Response | void> => {
//         try {
//             const { category = 'general' } = req.query;
//             console.log(`Fetching question for category: ${category}`);
//             // Primero intentamos obtener una pregunta de la base de datos
//             const existingQuestion = await db('questions')
//                 .where('category', category)
//                 .orderByRaw('RANDOM()')
//                 .first();

//             if (existingQuestion) {
//                 const options = [
//                     existingQuestion.correct_answer,
//                     ...existingQuestion.incorrect_answers
//                 ].sort(() => Math.random() - 0.5);

//                 return res.json({
//                     id: existingQuestion.id,
//                     question: existingQuestion.question,
//                     category: existingQuestion.category,
//                     options,
//                     correctAnswer: existingQuestion.correct_answer,
//                     difficulty: existingQuestion.difficulty
//                 });
//             }

//             // Si no hay preguntas, obtener de la API...
//             const response = await fetch(
//                 `https://opentdb.com/api.php?amount=1&category=${category}&type=multiple`
//             );
            
//             const data = await response.json();
//             console.log('API response:', data);
//             if (data.results && data.results.length > 0) {
//                 const questionData = data.results[0];
                
//                 const [newQuestion] = await db('questions')
//                     .insert({
//                         question: questionData.question,
//                         category: questionData.category,
//                         correct_answer: questionData.correct_answer,
//                         incorrect_answers: questionData.incorrect_answers,
//                         difficulty: questionData.difficulty
//                     })
//                     .returning('*');

//                 const options = [
//                     questionData.correct_answer,
//                     ...questionData.incorrect_answers
//                 ].sort(() => Math.random() - 0.5);

//                 res.json({
//                     id: newQuestion.id,
//                     question: questionData.question,
//                     category: questionData.category,
//                     options,
//                     correctAnswer: questionData.correct_answer,
//                     difficulty: questionData.difficulty
//                 });
//             } else {
//                 throw new Error('No questions available');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             if (error instanceof Error) {
//                 res.status(500).json({ 
//                     error: 'Error generating question',
//                     details: error.message 
//                 });
//             } else {
//                 res.status(500).json({ 
//                     error: 'Error generating question',
//                     details: 'An unknown error occurred'
//                 });
//             }
//         }
//     }
// };

