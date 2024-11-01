import React, { useState } from 'react';
import { Question } from './Wheel';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Fade,
  Alert
} from '@mui/material';


interface QuestionComponentProps {
  question: Question;
  onAnswerSubmit: (isCorrect: boolean, points: number) => void;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({ question, onAnswerSubmit }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer) return; // Prevenir múltiples selecciones
    
    setSelectedAnswer(answer);
    const correct = answer === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    let points;
    switch (question.difficulty) {
      case 'easy':
        points = 1;
        break;
      case 'medium':
        points = 2;
        break;
      case 'hard':
        points = 3;
        break;
      default:
        points = 0;
    }
    // Esperar 2 segundos antes de pasar a la siguiente pregunta
    setTimeout(() => {
      onAnswerSubmit(correct, points);
      setSelectedAnswer(null);
      setShowResult(false);
    }, 2000);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
    <Box sx={{ mb: 4 }}>
        <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'text.primary'
            }}
        >
            {question.question}
        </Typography>
    </Box>

    <Grid container spacing={2}>
        {question.options.map((option, index) => (
            <Grid item xs={12} sm={6} key={index}>
                <Button
                    variant="outlined"
                    onClick={() => handleAnswerClick(option)}
                    disabled={showResult}
                    className={
                        selectedAnswer === option
                            ? option === question.correctAnswer
                                ? 'correct'
                                : 'incorrect'
                            : ''
                    }
                >
                    {option}
                </Button>
            </Grid>
        ))}
    </Grid>

    <Fade in={showResult}>
        <Box sx={{ mt: 3 }}>
            <Alert 
                severity={isCorrect ? "success" : "error"}
                variant="filled"
                sx={{ 
                    justifyContent: 'center',
                    '& .MuiAlert-message': {
                        fontSize: '1.1rem'
                    }
                }}
            >
                {isCorrect 
                    ? 'Awesome! 🎉' 
                    : `The correct answer is: ${question.correctAnswer}`
                }
            </Alert>
        </Box>
    </Fade>

    {/* Indicador de dificultad */}
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Typography 
            variant="caption" 
            sx={{ 
                color: question.difficulty === 'easy' 
                    ? 'success.main' 
                    : question.difficulty === 'medium'
                    ? 'warning.main'
                    : 'error.main'
            }}
        >
            Difficulty: {question.difficulty.toUpperCase()} • 
            {question.difficulty === 'easy' && ' 1 point'}
            {question.difficulty === 'medium' && ' 2 points'}
            {question.difficulty === 'hard' && ' 3 points'}
        </Typography>
    </Box>
</Paper>
);
};
//     <div className="question-container">
//       <h3 className="question-text">{question.question}</h3>
//       <div className="options-grid">
//         {question.options.map((option, index) => (
//           <button
//             key={index}
//             className={`option-button 
//               ${selectedAnswer === option ? 
//                 (option === question.correctAnswer ? 'correct' : 'incorrect') 
//                 : ''}`}
//             onClick={() => handleAnswerClick(option)}
//             disabled={showResult}
//           >
//             {option}
//           </button>
//         ))}
//       </div>
//       {showResult && (
//         <div className={`result-message ${isCorrect ? 'correct' : 'incorrect'}`}>
//           {isCorrect ? 
//             'Awesome! 🎉' : 
//             `Sorry the correct answer is: ${question.correctAnswer}`}
//         </div>
//       )}
//     </div>
//   );
// };

export default QuestionComponent;
// import React, { useState } from 'react';
// import  {Question}  from './Wheel'; // Importa la interfaz Question

// interface QuestionComponentProps {
//   question: Question;
//   onCorrectAnswer: () => void;
//   onIncorrectAnswer: () => void;
// }

// const QuestionComponent: React.FC<QuestionComponentProps> = ({ question, onCorrectAnswer, onIncorrectAnswer }) => {
//   const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

//   const handleAnswerClick = (answer: string) => {
//     setSelectedAnswer(answer);
//     if (answer === question.correctAnswer) {
//       onCorrectAnswer();
//     } else {
//       onIncorrectAnswer();
//     }
//   };

//   return (
//     <div className="question-container">
//       <h3 className="question-text">{question.question}</h3>
//       <div className="options-grid">
//         {question.options.map((option, index) => (
//           <button
//             key={index}
//             className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
//             onClick={() => handleAnswerClick(option)}
//           >
//             {option}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QuestionComponent;