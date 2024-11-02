import React, { useState, useEffect, useContext } from "react";
import { Wheel } from "react-custom-roulette";
import { VALID_CATEGORIES, ValidCategory, Difficulty, DIFFICULTIES } from '../types/categories';
import QuestionComponent from "./Question";
import { AuthContext } from '../App';

interface WheelComponentProps {
  mode: 'Play';  
}

interface Category {
  option: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  category: ValidCategory; // Usamos el tipo ValidCategory;
  difficulty: Difficulty
}

// Usar las categorías definidas
const categories: Category[] = VALID_CATEGORIES.map(category => ({
  option: category
}));

const WheelComponent: React.FC<WheelComponentProps> = ({ mode }) => {
  const [mustSpin, setMustSpin] = useState<boolean>(false);
  const [prizeNumber, setPrizeNumber] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<ValidCategory | "">("");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //aca agrego lo nuevo a partir de la seleccion de la respuesta
  const [score, setScore] = useState<number>(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [timer, setTimer] = useState<number>(20);
  const { userId, userEmail, apiUrl } = useContext(AuthContext);
//   const [gamesPlayed] = useState<number>(0);
  
  const fetchQuestion = async (category: ValidCategory) => {
      setIsLoading(true);
      setError(null);
      try {
          console.log('Fetching question for category:', category);
          const response = await fetch(
              `${apiUrl}/api/questions?category=${category}&difficulty=${selectedDifficulty}`
          );
    
          if (!response.ok) {
              throw new Error(`Error: ${response.status}`);
          }
    
          const data = await response.json();
          console.log('Question received:', data);

          if (data.error) {
              setError(data.error);
              return null;
          }

          return data;
      } catch (error) {
          console.error('Error fetching question:', error);
          setError(error instanceof Error ? error.message : 'Error fetching question');
          return null;
      } finally {
          setIsLoading(false);
      }
  };

  const handleSpinClick = () => {
      setCurrentQuestion(null);
      setError(null);
      const newPrizeNumber = Math.floor(Math.random() * categories.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
  };

  const handleAnswerSubmit = (isCorrect: boolean, points:number) => {
    if (isCorrect) {
      setScore(prev => prev + points);
    }  
    // agregar lógica para pasar a la siguiente pregunta
    handleSpinClick(); // Esto hará girar la rueda nuevamente
  };

  //esto es para el temporizador
  useEffect(() => {
    let interval: number | undefined;
    
    if (currentQuestion) {
        setTimer(20);
        
        interval = window.setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleAnswerSubmit(false, 0);
                    handleSpinClick();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    return () => {
        if (interval) clearInterval(interval);
    };
}, [currentQuestion, handleAnswerSubmit, handleSpinClick]);

    /// fin del juego y obtencion del puntaje
    const updateUserScore = async () => {
        try {
          console.log('Updating user score:', { userId, userEmail, score });
      
          if (!userEmail) {
            console.error('userEmail is undefined');
            return;
          }
      
          const response = await fetch('/api/leaderboard', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, userEmail, score }),
          });
      
          if (response.ok) {
            console.log('User score updated successfully');
          } else {
            console.error('Error updating user score:', response.statusText);
          }
        } catch (error) {
          console.error('Error updating user score:', error);
        }
      };
    const handleGameEnd = () => {
        updateUserScore();
        // Additional logic to reset the game, navigate to another page, etc.
    };


  return (
      <div className="wheel-container">
        <div className="difficulty-selector">
                {DIFFICULTIES.map(difficulty => (
                    <button
                        key={difficulty}
                        data-difficulty={difficulty}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={`difficulty-button ${selectedDifficulty === difficulty ? 'selected' : ''}`}
                    >
                        {difficulty.toUpperCase()}
                    </button>
                ))}
            </div>
          <h2>{mode}</h2>
          <div className="wheel-section">
              <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={categories}
                  outerBorderColor="#f2f2f2"       
                  outerBorderWidth={10}             
                  innerBorderColor="#f2f2f2"      
                  radiusLineColor="#dedede"         
                  radiusLineWidth={1}        
                  fontSize={15}
                  textColors={["#ffffff"]}
                  backgroundColors={[
                      "#F22B35",
                      "#F99533",
                      "#24CA69",
                      "#514E50",
                      "#46AEFF"  // Reducido a 5 colores para match con 5 categorías
                  ]}
                  onStopSpinning={async () => {
                      setMustSpin(false);
                      const category = categories[prizeNumber].option as ValidCategory;
                      setSelectedCategory(category);
                      const questionData = await fetchQuestion(category);
                      if (questionData) {
                        setCurrentQuestion(questionData);
                    }
                  }}
              />
          </div>
          <div className="score-display">
                Score: {score}
          </div>
          <div className="timer-display" style={{ color: timer <= 5 ? 'red' : 'black' }}>
            Time remaining: {timer} seconds
          </div>
          <div className="controls-section">
              <button 
                  onClick={handleSpinClick}
                  className="spin-button"
                  disabled={isLoading}
              >
                  {isLoading ? 'Loading...' : 'SPIN'}
              </button>
          </div>

          <div className="info-section">
              {!mustSpin && selectedCategory && (
                  <div className="selected-category">
                      Selected Category: {selectedCategory}
                  </div>
              )}

              {error && (
                  <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
                      {error}
                  </div>
              )}

              {currentQuestion && (
          <QuestionComponent
            question={currentQuestion}
            onAnswerSubmit={handleAnswerSubmit}
          />
            )}
            <button onClick={handleGameEnd}>Finalizar Juego</button>
          </div>

      </div>
  );
};

export default WheelComponent;
