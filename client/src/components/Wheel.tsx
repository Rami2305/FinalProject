import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";

interface WheelComponenetProps {
    mode: 'Play';  
}
  
// Interfaz para las categorías
interface Category {
  option: string;
}

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    category: string;
  }
// Usar las mismas categorías que definimos en el backend
const categories: Category[] = [
    { option: "general" },
    { option: "mathematics" },
    { option: "sports" },
    { option: "geography" },
    { option: "history" },
    { option: "books" },
    { option: "art" },
    { option: "film" },
    { option: "music" },
    { option: "computers" },
    { option: "history" }
];

const WheelComponent: React.FC<WheelComponenetProps> = ({ mode }) => {
    const [mustSpin, setMustSpin] = useState<boolean>(false);
    const [prizeNumber, setPrizeNumber] = useState<number>(0);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
  // Función para obtener pregunta del backend
  const fetchQuestion = async (category: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching question for category:', category);
      const response = await fetch(
        `http://localhost:5000/api/questions?category=${category}` //aca cambie el ${categoryId}
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
  return (
    <div className="wheel-container">
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
          "#46AEFF",
          "#9145B7",
          "#F22B35",
          "#F99533",
          "#24CA69",
          "#514E50",
          "#46AEFF"
        ]}
        onStopSpinning={async () => {
          setMustSpin(false);
          const category = categories[prizeNumber].option;
          setSelectedCategory(category);
          const questionData = await fetchQuestion(category);
          if (questionData) {
            setCurrentQuestion(questionData);
          }
        }}
      />
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
        <div className="question-container">
          <h3 className="question-text">{currentQuestion.question}</h3>
          <div className="options-grid">
            {currentQuestion.options.map((option, index) => (
              <button 
                key={index}
                className="option-button"
                onClick={() => {
                  // Aquí manejaremos la selección de respuesta
                  console.log('Selected answer:', option);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default WheelComponent;