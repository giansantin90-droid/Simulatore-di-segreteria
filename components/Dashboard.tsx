import React from 'react';
import { StudioType, SimulationState, STUDIO_THEMES } from '../types';
import { CheckCircle, Lock, Play, Award } from 'lucide-react';

interface Props {
  state: SimulationState;
  onStartMonth: (month: number) => void;
}

export const Dashboard: React.FC<Props> = ({ state, onStartMonth }) => {
  if (!state.selectedStudio) return null;
  
  const theme = STUDIO_THEMES[state.selectedStudio];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="mb-8 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Il Tuo Percorso</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Studio: <span className={`font-semibold ${theme.secondary}`}>{state.selectedStudio}</span></p>
        </div>
        <div className="w-full md:w-auto bg-white px-4 md:px-6 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3">
             <div className="bg-yellow-100 p-2 rounded-full">
                <Award className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Performance</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{state.score}/100</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {months.map((month) => {
          const isLocked = month > state.currentMonth;
          const isCompleted = month < state.currentMonth;
          const isCurrent = month === state.currentMonth;

          return (
            <div 
              key={month}
              className={`
                relative rounded-xl p-5 md:p-6 border-2 transition-all duration-300
                ${isLocked ? 'bg-gray-100 border-gray-200 opacity-70' : 'bg-white shadow-sm hover:shadow-md'}
                ${isCurrent ? `border-${theme.primary.replace('bg-', '')} ring-2 ring-offset-2 ring-${theme.primary.replace('bg-', '')}` : isCompleted ? 'border-green-200' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <span className={`text-xs font-bold uppercase tracking-wider ${isLocked ? 'text-gray-400' : theme.secondary}`}>
                  Mese {month}
                </span>
                {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                {isLocked && <Lock className="w-5 h-5 text-gray-400" />}
                {isCurrent && <Play className={`w-5 h-5 ${theme.secondary} animate-pulse`} />}
              </div>

              <h3 className={`text-lg md:text-xl font-bold mb-2 ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                {month <= 3 ? 'Onboarding & Routine' : month <= 6 ? 'Gestione Autonoma' : month <= 9 ? 'Problem Solving' : 'Responsabilità Senior'}
              </h3>
              
              <p className="text-sm text-gray-500 mb-4 md:mb-6 line-clamp-2 md:line-clamp-3">
                {month === 1 && "Impara a gestire l'agenda, filtrare le prime email e capire il tono di voce dello studio."}
                {month === 2 && "Aumenta il volume delle comunicazioni. Impara a gestire le priorità e i conflitti semplici."}
                {month === 3 && "Focus sulla gestione documentale e l'archiviazione digitale sicura."}
                {month === 6 && "Gestione di crisi: clienti insoddisfatti e urgenze dell'ultimo minuto."}
                {month === 12 && "Scenario Master: Gestione completa dello studio in assenza del titolare."}
                {!([1,2,3,6,12].includes(month)) && "Consolida le tue abilità con scenari misti di media difficoltà."}
              </p>

              <button
                disabled={isLocked}
                onClick={() => onStartMonth(month)}
                className={`
                  w-full py-2 px-4 rounded-lg font-medium transition-colors text-sm md:text-base
                  ${isLocked 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : isCurrent 
                      ? `${theme.primary} text-white hover:opacity-90` 
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {isCurrent ? 'Inizia Simulazione' : isCompleted ? 'Ripeti Mese' : 'Bloccato'}
              </button>
            </div>
          );
        })}
      </div>
      <div className="h-10 md:h-0"></div>
    </div>
  );
};