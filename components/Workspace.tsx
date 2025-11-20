import React, { useState, useEffect } from 'react';
import { DailyScenario, StudioType, TaskType } from '../types';
import { EmailClient } from './EmailClient';
import { CalendarView } from './CalendarView';
import { FeedbackModal } from './FeedbackModal';
import { evaluateResponse } from '../services/geminiService';
import { Mail, Calendar, ArrowLeft, Clock, Menu } from 'lucide-react';

interface Props {
  scenario: DailyScenario;
  studioType: StudioType;
  onExit: () => void;
  onCompleteTask: (score: number) => void;
}

type View = 'MAIL' | 'CALENDAR';

export const Workspace: React.FC<Props> = ({ scenario, studioType, onExit, onCompleteTask }) => {
  const [activeView, setActiveView] = useState<View>('MAIL');
  const [processedEmails, setProcessedEmails] = useState<string[]>([]);
  
  // Feedback State
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ feedback: '', score: 0, suggestions: '' });
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEmailReply = async (emailId: string, content: string) => {
    setIsEvaluating(true);
    const email = scenario.emails.find(e => e.id === emailId);
    
    if (email) {
      const result = await evaluateResponse(
        TaskType.EMAIL_REPLY,
        content,
        `Risposta all'email di ${email.from} con oggetto "${email.subject}". Corpo: ${email.body}`,
        studioType
      );
      
      setFeedbackData(result);
      setShowFeedback(true);
      setProcessedEmails(prev => [...prev, emailId]);
      onCompleteTask(result.score);
    }
    setIsEvaluating(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        feedback={feedbackData.feedback}
        score={feedbackData.score}
        suggestions={feedbackData.suggestions}
      />

      {/* Sidebar (Desktop) / Bottom Bar (Mobile) */}
      <aside className="
        fixed bottom-0 w-full h-16 flex-row border-t border-gray-800 z-30
        md:relative md:w-20 md:h-full md:flex-col md:border-t-0
        bg-slate-900 flex items-center justify-between md:justify-start md:py-6 shadow-xl
        px-6 md:px-0
      ">
        <button onClick={onExit} className="hidden md:block mb-8 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <nav className="flex flex-row md:flex-col gap-1 md:gap-4 w-full justify-around md:justify-start md:px-3">
          <button
            onClick={() => setActiveView('MAIL')}
            className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${activeView === 'MAIL' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Mail className="w-6 h-6" />
            <span className="text-[10px] font-medium">Mail</span>
          </button>
          
          <button
            onClick={() => setActiveView('CALENDAR')}
            className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${activeView === 'CALENDAR' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-[10px] font-medium">Agenda</span>
          </button>

           {/* Mobile Exit Button inside Nav */}
           <button onClick={onExit} className="md:hidden p-3 rounded-xl flex flex-col items-center gap-1 text-red-400 hover:bg-slate-800 transition-all">
              <ArrowLeft className="w-6 h-6" />
              <span className="text-[10px] font-medium">Esci</span>
           </button>
        </nav>
        
        <div className="hidden md:flex mt-auto mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
            GS
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full md:h-auto pb-16 md:pb-0">
        {/* Top Bar */}
        <header className="h-16 min-h-[4rem] bg-white border-b border-gray-200 flex justify-between items-center px-4 md:px-8 shadow-sm z-10 shrink-0">
          <div className="overflow-hidden">
            <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">{scenario.dayTitle}</h1>
            <p className="text-xs md:text-sm text-gray-500 truncate">Obiettivo: {scenario.objective}</p>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
             <div className="hidden md:flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full border border-orange-100">
               <Clock className="w-4 h-4" />
               <span className="text-sm font-medium">Mese {scenario.month}</span>
             </div>
             {/* Mobile simplified month indicator */}
             <div className="md:hidden bg-orange-50 text-orange-700 px-2 py-1 rounded-full text-xs font-bold border border-orange-100">
                M{scenario.month}
             </div>

             {isEvaluating && (
               <div className="flex items-center gap-2 text-blue-600 text-xs md:text-sm animate-pulse font-medium">
                 <span className="hidden md:inline">Valutazione in corso...</span>
                 <span className="md:hidden">Valuto...</span>
               </div>
             )}
          </div>
        </header>

        {/* Workspace Area */}
        <div className="flex-1 p-0 md:p-6 overflow-hidden relative">
          {activeView === 'MAIL' && (
            <div className="absolute inset-0 md:relative md:h-full p-0 md:p-0">
              <EmailClient 
                emails={scenario.emails.filter(e => !processedEmails.includes(e.id))} 
                studioType={studioType}
                onReply={handleEmailReply} 
              />
            </div>
          )}
          {activeView === 'CALENDAR' && (
            <div className="h-full p-2 md:p-0 overflow-hidden">
              <CalendarView events={scenario.events} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};