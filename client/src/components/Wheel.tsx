import React, { useState, useEffect, useContext, useCallback } from "react";
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

const WheelComponent: React.FC<WheelComponentProps> = () => {
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
  const {  apiUrl } = useContext(AuthContext);
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

  
//PROBANDO NUEVO TIMER
  const handleAnswerSubmit = useCallback((isCorrect: boolean, points: number): void => {
      if (isCorrect) {
        setScore(prev => prev + points);
      }
      setCurrentQuestion(null);        // Quitamos la pregunta actual
      setSelectedCategory("");         // Limpiamos la categoría seleccionada
      setError(null);                  // Limpiamos cualquier error
      setMustSpin(false);             // Aseguramos que la rueda pueda girar nuevamente
    }, []);

  const handleSpinClick = () => {
      setCurrentQuestion(null);
      setError(null);
      const newPrizeNumber = Math.floor(Math.random() * categories.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
  };
  

  //esto es para el temporizador
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (currentQuestion) {
      console.log("Iniciando temporizador");
      setTimer(20);

      interval = setInterval(() => {
        setTimer((prev: number): number => {
          console.log("Timer:", prev);
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            handleAnswerSubmit(false, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        console.log("Limpiando temporizador");
        clearInterval(interval);
      }
    };
  }, [currentQuestion]);

  const handleGameEnd = (): void => {
    setScore(0);
    setTimer(20);
    setCurrentQuestion(null);
    setMustSpin(false);
    setSelectedCategory("");
  };

  // log para debugging
  useEffect(() => {
    console.log({
      currentQuestionExists: !!currentQuestion,
      timerValue: timer,
      isSpinning: mustSpin,
      category: selectedCategory
    });
  }, [currentQuestion, timer, mustSpin, selectedCategory]);
 
  return (
    <div className="wheel-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
    <div className="difficulty-selector" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
      {DIFFICULTIES.map(difficulty => (
        <button
          key={difficulty}
          data-difficulty={difficulty}
          onClick={() => setSelectedDifficulty(difficulty)}
          className={`difficulty-button ${selectedDifficulty === difficulty ? 'selected' : ''}`}
          style={{
            backgroundColor: selectedDifficulty === difficulty ? '#3f51b5' : 'white',
            color: selectedDifficulty === difficulty ? 'white' : '#3f51b5',
            padding: '10px',
            margin: '5px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {difficulty.toUpperCase()}
        </button>
      ))}
    </div>

    <div className="game-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
      <div className="wheel-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            "#46AEFF"
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

        <div className="score-display" style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '24px' }}>
          Score: {score}
        </div>

        <div className="timer-display" style={{ color: timer <= 5 ? 'red' : 'black', fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>
          Time remaining: {timer} seconds
        </div>

        <div className="controls-section" style={{ marginTop: '20px' }}>
          <button 
            onClick={handleSpinClick}
            className="spin-button"
            disabled={isLoading}
            style={{
              backgroundColor: '#3f51b5',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            {isLoading ? 'Loading...' : 'SPIN'}
          </button>
        </div>
      </div>

      <div className="info-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {!mustSpin && selectedCategory && (
          <div className="selected-category" style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '20px' }}>
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

        <button onClick={handleGameEnd} style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', marginTop: '20px' }}>
          Finish
        </button>
      </div>
    </div>
  </div>
);
  //     <div className="wheel-container"style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
  //       <div className="wheel-section" style={{ flex: '1', marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  //         <Wheel
  //                   mustStartSpinning={mustSpin}
  //                   prizeNumber={prizeNumber}
  //                   data={categories}
  //                   outerBorderColor="#f2f2f2"       
  //                   outerBorderWidth={10}             
  //                   innerBorderColor="#f2f2f2"      
  //                   radiusLineColor="#dedede"         
  //                   radiusLineWidth={1}        
  //                   fontSize={15}
  //                   textColors={["#ffffff"]}
  //                   backgroundColors={[
  //                       "#F22B35",
  //                       "#F99533",
  //                       "#24CA69",
  //                       "#514E50",
  //                       "#46AEFF"  // Reducido a 5 colores para match con 5 categorías
  //                   ]}
  //                   onStopSpinning={async () => {
  //                       setMustSpin(false);
  //                       const category = categories[prizeNumber].option as ValidCategory;
  //                       setSelectedCategory(category);
  //                       const questionData = await fetchQuestion(category);
  //                       if (questionData) {
  //                         setCurrentQuestion(questionData);
  //                     }
  //                   }}
  //               />

  //         <div className="score-display" style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '24px' }}>
  //               Score: {score}
  //         </div>

  //         <div className="timer-display" style={{ color: timer <= 5 ? 'red' : 'black', fontSize: '24px',
  //         fontWeight: 'bold', marginBottom: '20px'  }}>
  //           Time remaining: {timer} seconds
  //         </div>

  //       </div>
        

  //       <div className="game-section" style={{flex: '1', display: 'flex', flexDirection: 'column'}}>
  //         <div className="difficulty-selector" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
  //               {DIFFICULTIES.map(difficulty => (
  //                   <button
  //                       key={difficulty}
  //                       data-difficulty={difficulty}
  //                       onClick={() => setSelectedDifficulty(difficulty)}
  //                       className={`difficulty-button ${selectedDifficulty === difficulty ? 'selected' : ''}`}
  //                       style={{
  //                         backgroundColor: selectedDifficulty === difficulty ? '#3f51b5' : 'white',
  //                         color: selectedDifficulty === difficulty ? 'white' : '#3f51b5',
  //                         padding: '10px',
  //                         margin: '5px',
  //                         border: 'none',
  //                         borderRadius: '5px',
  //                         cursor: 'pointer'
  //                       }}
  //                   >
  //                       {difficulty.toUpperCase()}
  //                   </button>
  //               ))}
  //         </div>
  //       </div>
          
          
          
  //         <div className="controls-section" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'  }}>
  //             <button 
  //                 onClick={handleSpinClick}
  //                 className="spin-button"
  //                 disabled={isLoading}
  //                 style={{
  //                   backgroundColor: '#3f51b5',
  //                   color: 'white',
  //                   padding: '10px 20px',
  //                   border: 'none',
  //                   borderRadius: '5px',
  //                   cursor: 'pointer',
  //                   fontWeight: 'bold',
  //                   fontSize: '18px'
  //                 }}
  //             >
  //                 {isLoading ? 'Loading...' : 'SPIN'}
  //             </button>
  //         </div>

  //         <div className="info-section" style={{ flex: '1'}}>
  //             {!mustSpin && selectedCategory && (
  //                 <div className="selected-category" style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '20px' }}>
  //                     Selected Category: {selectedCategory}
  //                 </div>
  //             )}

  //             {error && (
  //                 <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
  //                     {error}
  //                 </div>
  //             )}

  //             {currentQuestion && (
  //         <QuestionComponent
  //           question={currentQuestion}
  //           onAnswerSubmit={handleAnswerSubmit}
  //         />
  //           )}
  //           <button onClick={handleGameEnd} style={{ backgroundColor: '#3f51b5', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', marginTop: 'auto' }}>Finish</button>
  //         </div>

  //     </div>
  // );
};

export default WheelComponent;
