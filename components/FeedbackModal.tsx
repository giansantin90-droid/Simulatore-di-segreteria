import React from 'react';
import { X, Star } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  feedback: string;
  score: number;
  suggestions: string;
}

export const FeedbackModal: React.FC<Props> = ({ isOpen, onClose, feedback, score, suggestions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Valutazione AI</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                className="text-gray-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="56"
                cx="64"
                cy="64"
              />
              <circle
                className={`${score >= 70 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                strokeWidth="8"
                strokeDasharray={351.86}
                strokeDashoffset={351.86 - (score / 100) * 351.86}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="56"
                cx="64"
                cy="64"
              />
            </svg>
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">{score}</span>
              <span className="text-xs text-gray-500 uppercase">Punti</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-1 flex items-center gap-2">
              <Star className="w-4 h-4" /> Feedback
            </h3>
            <p className="text-blue-900 text-sm leading-relaxed">{feedback}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
             <h3 className="font-semibold text-purple-800 mb-1">Suggerimenti per migliorare</h3>
            <p className="text-purple-900 text-sm leading-relaxed">{suggestions}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Continua
          </button>
        </div>
      </div>
    </div>
  );
};
