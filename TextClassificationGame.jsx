import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Target, TrendingUp, BookOpen, Award } from 'lucide-react';

const TextClassificationGame = () => {
  const [gameState, setGameState] = useState('menu'); // menu, data, gradient, model, template, complete
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  // Data Preparation Game State
  const [selectedText, setSelectedText] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');
  
  // Gradient Descent Game State
  const [currentGuess, setCurrentGuess] = useState(50);
  const [targetValue, setTargetValue] = useState(75);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(6);
  const [gradientHistory, setGradientHistory] = useState([]);
  const [learningRate, setLearningRate] = useState(5);

  // Model Training State
  const [modelAccuracy, setModelAccuracy] = useState(0);
  const [isTraining, setIsTraining] = useState(false);

  const sampleData = [
    { id: 1, review_text: "This movie was amazing!", sentiment: "positive", user_id: "001", date: "2024-01-01" },
    { id: 2, review_text: "Terrible film, waste of time", sentiment: "negative", user_id: "002", date: "2024-01-02" },
    { id: 3, review_text: "Best movie ever made!", sentiment: "positive", user_id: "003", date: "2024-01-03" },
  ];

  const pythonTemplate = `# STEP 1: Import required libraries
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

# STEP 2: Load and prepare data
df = pd.read_csv('your_dataset.csv')
X = df['your_text_column']
y = df['your_target_column']

# STEP 3: Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# STEP 4: Feature engineering with TF-IDF
tfidf = TfidfVectorizer(
    max_features=5000,
    stop_words='english'
)
X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf = tfidf.transform(X_test)

# STEP 5: Train logistic regression model
model = LogisticRegression(class_weight='balanced')
model.fit(X_train_tfidf, y_train)

# STEP 6: Evaluate model
y_pred = model.predict(X_test_tfidf)
print(classification_report(y_test, y_pred))`;

  const resetGradientGame = () => {
    setCurrentGuess(Math.floor(Math.random() * 100));
    setTargetValue(Math.floor(Math.random() * 100));
    setAttempts(0);
    setGradientHistory([]);
  };

  const makeGuess = () => {
    if (attempts >= maxAttempts) return;
    
    const error = targetValue - currentGuess;
    const newGuess = Math.max(0, Math.min(100, currentGuess + (error * learningRate / 100)));
    
    setGradientHistory([...gradientHistory, { guess: currentGuess, error, target: targetValue }]);
    setCurrentGuess(Math.round(newGuess));
    setAttempts(attempts + 1);
    
    if (Math.abs(error) < 3) {
      setScore(score + Math.max(1, maxAttempts - attempts) * 10);
      setTimeout(() => {
        alert(`🎉 Success! You found the target in ${attempts + 1} attempts!`);
        if (level < 3) {
          setLevel(level + 1);
          resetGradientGame();
        } else {
          setGameState('model');
        }
      }, 500);
    }
  };

  const trainModel = () => {
    setIsTraining(true);
    let accuracy = 0;
    const interval = setInterval(() => {
      accuracy += Math.random() * 15;
      setModelAccuracy(Math.min(95, accuracy));
      
      if (accuracy >= 85) {
        clearInterval(interval);
        setIsTraining(false);
        setScore(score + 100);
        setTimeout(() => setGameState('template'), 1000);
      }
    }, 200);
  };

  const MenuScreen = () => (
    <div className="text-center space-y-6 p-8">
      <div className="mb-8">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Text Classification Academy</h1>
        <p className="text-gray-600">Master the 5-step framework through interactive challenges!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-blue-800">📊 Data Prep</h3>
          <p className="text-sm text-blue-600">Select the right columns</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-bold text-green-800">🎯 Gradient Descent</h3>
          <p className="text-sm text-green-600">Find the optimal value</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-bold text-purple-800">🤖 Model Training</h3>
          <p className="text-sm text-purple-600">Train your classifier</p>
        </div>
      </div>
      
      <button
        onClick={() => setGameState('data')}
        className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center mx-auto space-x-2"
      >
        <Play className="w-5 h-5" />
        <span>Start Learning Journey</span>
      </button>
    </div>
  );

  const DataPrepScreen = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🔍 Step 1: Data Preparation Challenge</h2>
      <p className="mb-6 text-gray-600">Select the correct TEXT column and TARGET column for sentiment analysis:</p>
      
      <div className="bg-white border rounded-lg p-4 mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              {Object.keys(sampleData[0]).map(key => (
                <th key={key} className="text-left p-2 font-semibold">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sampleData.map(row => (
              <tr key={row.id} className="border-b">
                {Object.entries(row).map(([key, value]) => (
                  <td key={key} className="p-2">{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-bold mb-3">Select TEXT Column (X):</h3>
          {Object.keys(sampleData[0]).map(col => (
            <button
              key={col}
              onClick={() => setSelectedText(col)}
              className={`block w-full text-left p-3 mb-2 rounded border ${
                selectedText === col 
                  ? 'bg-blue-100 border-blue-500' 
                  : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {col}
            </button>
          ))}
        </div>
        
        <div>
          <h3 className="font-bold mb-3">Select TARGET Column (y):</h3>
          {Object.keys(sampleData[0]).map(col => (
            <button
              key={col}
              onClick={() => setSelectedTarget(col)}
              className={`block w-full text-left p-3 mb-2 rounded border ${
                selectedTarget === col 
                  ? 'bg-green-100 border-green-500' 
                  : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      {selectedText && selectedTarget && (
        <div className="text-center">
          <button
            onClick={() => {
              if (selectedText === 'review_text' && selectedTarget === 'sentiment') {
                setScore(score + 50);
                setGameState('gradient');
                resetGradientGame();
              } else {
                alert('❌ Not quite! Remember: we need TEXT data to analyze and BINARY categories to predict.');
              }
            }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Confirm Selection
          </button>
        </div>
      )}
    </div>
  );

  const GradientDescentScreen = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🎯 Step 2: Gradient Descent Challenge</h2>
      <p className="mb-4 text-gray-600">
        Use gradient descent to find the target value! Level {level}/3
      </p>
      <p className="mb-6 text-sm text-gray-500">
        Learning Rate: {learningRate} | The algorithm will adjust your guess based on the error.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white border rounded-lg p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Target: {targetValue}</span>
              <span className="font-semibold">Attempts: {attempts}/{maxAttempts}</span>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span>Your Guess: {currentGuess}</span>
                <span className="text-sm text-gray-500">Error: {targetValue - currentGuess}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-8 relative">
                <div 
                  className="bg-blue-500 h-8 rounded-full transition-all duration-300"
                  style={{ width: `${currentGuess}%` }}
                />
                <div 
                  className="absolute top-0 w-1 h-8 bg-red-500"
                  style={{ left: `${targetValue}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            <div className="flex space-x-2 mb-4">
              <button
                onClick={makeGuess}
                disabled={attempts >= maxAttempts || Math.abs(targetValue - currentGuess) < 3}
                className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex-1"
              >
                Make Gradient Step
              </button>
              <button
                onClick={resetGradientGame}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Learning Rate:</label>
              <input
                type="range"
                min="1"
                max="20"
                value={learningRate}
                onChange={(e) => setLearningRate(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">
                Low = small steps, High = big jumps
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-3">Gradient History:</h3>
          <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
            {gradientHistory.length === 0 ? (
              <p className="text-gray-500 text-center">No steps taken yet...</p>
            ) : (
              gradientHistory.map((step, index) => (
                <div key={index} className="mb-2 p-2 bg-white rounded border">
                  <div className="text-sm">
                    <strong>Step {index + 1}:</strong> Guess {step.guess} → Error: {step.error}
                  </div>
                  <div className="text-xs text-gray-500">
                    {step.error > 0 ? '📈 Too low, going up' : '📉 Too high, going down'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-2">Score: {score} points</p>
        {level === 3 && Math.abs(targetValue - currentGuess) < 3 && (
          <button
            onClick={() => setGameState('model')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Proceed to Model Training
          </button>
        )}
      </div>
    </div>
  );

  const ModelTrainingScreen = () => (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🤖 Step 3: Train Your Logistic Regression Model</h2>
      <p className="mb-6 text-gray-600">
        Time to train your text classification model! Click to start the training process.
      </p>

      <div className="max-w-md mx-auto mb-8">
        <div className="bg-white border rounded-lg p-6">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-purple-600" />
          <h3 className="font-bold text-lg mb-4">Model Accuracy</h3>
          <div className="mb-4">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {modelAccuracy.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-purple-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${modelAccuracy}%` }}
              />
            </div>
          </div>
          
          {!isTraining && modelAccuracy === 0 && (
            <button
              onClick={trainModel}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Start Training Model
            </button>
          )}
          
          {isTraining && (
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-2" />
              <p className="text-gray-600">Training in progress...</p>
            </div>
          )}
          
          {modelAccuracy >= 85 && !isTraining && (
            <div className="text-green-600 font-semibold">
              ✅ Model trained successfully!
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
        <h4 className="font-bold text-blue-800 mb-2">What's happening during training:</h4>
        <ul className="text-left text-blue-700 text-sm space-y-1">
          <li>• Converting text to TF-IDF vectors</li>
          <li>• Finding optimal coefficients using gradient descent</li>
          <li>• Adjusting for class imbalance with balanced weights</li>
          <li>• Validating performance on test data</li>
        </ul>
      </div>
    </div>
  );

  const PythonTemplateScreen = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📝 Complete Python Template</h2>
      <p className="mb-6 text-gray-600">
        Here's your complete, reusable Python template for any text classification project!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4 text-blue-800">🛠️ The 5-Step Framework</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-800">1. Import Libraries</h4>
              <p className="text-sm text-blue-600">pandas, scikit-learn, and NLTK</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-green-800">2. Load & Clean Data</h4>
              <p className="text-sm text-green-600">Select text and target columns</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-800">3. Preprocess Text</h4>
              <p className="text-sm text-yellow-600">Apply tokenization, remove stopwords</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-semibold text-purple-800">4. Feature Engineering</h4>
              <p className="text-sm text-purple-600">Convert text to TF-IDF vectors</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <h4 className="font-semibold text-red-800">5. Train & Evaluate</h4>
              <p className="text-sm text-red-600">Build model and assess performance</p>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-800 mb-2">🔑 Key Insight</h4>
            <p className="text-sm text-gray-600">
              This template can be adapted to any binary text classification task by 
              changing just the dataset and column names.
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 text-green-800">💻 Ready-to-Use Code</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
            <pre>{pythonTemplate}</pre>
          </div>
          
          <div className="mt-4 space-y-2">
            <button
              onClick={() => navigator.clipboard.writeText(pythonTemplate)}
              className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition-colors w-full"
            >
              📋 Copy Template to Clipboard
            </button>
            
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
              <strong>To use this template:</strong><br/>
              1. Replace 'your_dataset.csv' with your file<br/>
              2. Replace 'your_text_column' with your text column name<br/>
              3. Replace 'your_target_column' with your target column name<br/>
              4. Run the script!
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => setGameState('complete')}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Complete Learning Journey
        </button>
      </div>
    </div>
  );

  const CompleteScreen = () => (
    <div className="text-center p-8">
      <Award className="w-20 h-20 mx-auto mb-6 text-yellow-500" />
      <h2 className="text-3xl font-bold mb-4 text-gray-800">🎉 Congratulations!</h2>
      <p className="text-lg mb-6 text-gray-600">
        You've mastered the Text Classification Framework!
      </p>
      
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
        <h3 className="font-bold text-lg mb-4">What You've Learned:</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
          <div>
            <h4 className="font-semibold text-blue-800">Data Preparation</h4>
            <p className="text-sm text-gray-600">Selecting the right columns for text classification</p>
          </div>
          <div>
            <h4 className="font-semibold text-green-800">Gradient Descent</h4>
            <p className="text-sm text-gray-600">How al
              
