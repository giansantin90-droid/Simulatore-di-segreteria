import React, { useState } from 'react';
import { StudioSelector } from './components/StudioSelector';
import { Dashboard } from './components/Dashboard';
import { Workspace } from './components/Workspace';
import { StudioType, SimulationState, DailyScenario } from './types';
import { generateScenario } from './services/geminiService';

const INITIAL_STATE: SimulationState = {
  currentMonth: 1,
  selectedStudio: null,
  currentScenario: null,
  completedScenarios: [],
  score: 0,
  feedbackHistory: []
};

export default function App() {
  const [gameState, setGameState] = useState<SimulationState>(INITIAL_STATE);
  const [isLoadingScenario, setIsLoadingScenario] = useState(false);

  const handleStudioSelect = (type: StudioType) => {
    setGameState(prev => ({ ...prev, selectedStudio: type }));
  };

  const handleStartMonth = async (month: number) => {
    if (!gameState.selectedStudio) return;
    
    setIsLoadingScenario(true);
    const scenario = await generateScenario(month, gameState.selectedStudio);
    
    if (scenario) {
      setGameState(prev => ({
        ...prev,
        currentScenario: scenario
      }));
    } else {
        // Fallback minimal scenario if API fails or no key
        const fallbackScenario: DailyScenario = {
            id: 'fallback-1',
            month: month,
            dayTitle: 'Giornata di prova (Offline Mode)',
            description: 'Scenario generato localmente per mancanza di connessione AI.',
            difficulty: 1,
            objective: 'Familiarizza con l\'interfaccia.',
            emails: [
                { id: 'e1', from: 'Mario Rossi', subject: 'Benvenuto', body: 'Benvenuto nello studio. Rispondi a questa mail per provare.', date: '09:00', isRead: false, priority: 'Normal' }
            ],
            events: [
                { id: 'ev1', title: 'Briefing', start: '09:00', end: '09:30', type: 'meeting' }
            ]
        };
         setGameState(prev => ({
            ...prev,
            currentScenario: fallbackScenario
        }));
    }
    setIsLoadingScenario(false);
  };

  const handleExitWorkspace = () => {
    setGameState(prev => ({ ...prev, currentScenario: null }));
  };

  const handleTaskCompletion = (taskScore: number) => {
    setGameState(prev => {
        const newScore = Math.min(100, prev.score + Math.ceil(taskScore / 10)); // Simple scoring logic
        return { ...prev, score: newScore };
    });
  };

  // Loading Screen
  if (isLoadingScenario) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Generazione Scenario AI...</h2>
        <p className="text-gray-500 mt-2">Il tuo "Capo Virtuale" sta preparando la giornata.</p>
      </div>
    );
  }

  // 1. Studio Selection
  if (!gameState.selectedStudio) {
    return <StudioSelector onSelect={handleStudioSelect} />;
  }

  // 2. Workspace (Active Simulation)
  if (gameState.currentScenario) {
    return (
      <Workspace 
        scenario={gameState.currentScenario} 
        studioType={gameState.selectedStudio}
        onExit={handleExitWorkspace}
        onCompleteTask={handleTaskCompletion}
      />
    );
  }

  // 3. Dashboard (Career View)
  return (
    <Dashboard 
      state={gameState} 
      onStartMonth={handleStartMonth} 
    />
  );
}
