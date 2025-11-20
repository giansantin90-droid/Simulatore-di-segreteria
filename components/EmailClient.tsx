import React, { useState } from 'react';
import { Email, StudioType, TaskType } from '../types';
import { Star, Reply, Trash2, Send, Paperclip, Sparkles, ArrowLeft, ChevronLeft } from 'lucide-react';
import { getAIHelp } from '../services/geminiService';

interface Props {
  emails: Email[];
  studioType: StudioType;
  onReply: (emailId: string, content: string) => void;
}

export const EmailClient: React.FC<Props> = ({ emails, studioType, onReply }) => {
  // On desktop, select first by default. On mobile, start with null to show list.
  const isMobile = window.innerWidth < 768;
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(!isMobile && emails.length > 0 ? emails[0].id : null);
  const [replyText, setReplyText] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  const handleSend = () => {
    if (selectedEmailId && replyText.trim()) {
      onReply(selectedEmailId, replyText);
      setReplyText('');
      setAiSuggestion('');
      if (isMobile) {
        setSelectedEmailId(null); // Go back to list on mobile after send
      }
    }
  };

  const handleRequestAI = async () => {
    if (!selectedEmail) return;
    setLoadingAI(true);
    const prompt = `Scrivi una bozza di risposta breve e professionale per questa email: 
    Mittente: ${selectedEmail.from}
    Oggetto: ${selectedEmail.subject}
    Testo: ${selectedEmail.body}`;
    
    const suggestion = await getAIHelp(prompt, studioType);
    setAiSuggestion(suggestion);
    setReplyText(suggestion); 
    setLoadingAI(false);
  };

  return (
    <div className="flex h-full bg-white md:rounded-lg shadow-sm overflow-hidden border-t md:border border-gray-200">
      {/* List View - Hidden on Mobile if email selected */}
      <div className={`
        w-full md:w-1/3 border-r border-gray-200 flex flex-col bg-white
        ${selectedEmailId ? 'hidden md:flex' : 'flex'}
      `}>
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-700">Posta in arrivo</h2>
        </div>
        <div className="overflow-y-auto flex-1">
          {emails.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nessuna nuova email</div>
          ) : (
            emails.map(email => (
              <div
                key={email.id}
                onClick={() => setSelectedEmailId(email.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedEmailId === email.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
              >
                <div className="flex justify-between mb-1">
                  <span className={`font-bold text-sm ${email.isRead ? 'text-gray-600' : 'text-black'}`}>{email.from}</span>
                  <span className="text-xs text-gray-400">{email.date}</span>
                </div>
                <div className="text-sm font-medium text-gray-800 truncate">{email.subject}</div>
                <div className="text-xs text-gray-500 truncate">{email.body}</div>
                {email.priority === 'High' && (
                  <span className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600">URGENTE</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail View - Hidden on Mobile if NO email selected */}
      <div className={`
        w-full md:w-2/3 flex-col bg-white h-full absolute md:relative z-10
        ${selectedEmailId ? 'flex' : 'hidden md:flex'}
      `}>
        {selectedEmail ? (
          <>
            <div className="p-4 md:p-6 border-b border-gray-200">
              {/* Mobile Back Button */}
              <button 
                onClick={() => setSelectedEmailId(null)}
                className="md:hidden mb-4 flex items-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5" /> Torna alla lista
              </button>

              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-2">{selectedEmail.subject}</h2>
                <div className="flex gap-2 text-gray-400 shrink-0 ml-2">
                  <Star className="w-5 h-5 cursor-pointer hover:text-yellow-400" />
                  <Trash2 className="w-5 h-5 cursor-pointer hover:text-red-500" />
                </div>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold shrink-0">
                  {selectedEmail.from.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{selectedEmail.from}</div>
                  <div className="text-sm text-gray-500">a me</div>
                </div>
              </div>
              <div className="prose text-sm md:text-base text-gray-800 mb-8 whitespace-pre-wrap max-h-[30vh] overflow-y-auto">
                {selectedEmail.body}
              </div>
            </div>

            <div className="p-4 md:p-6 bg-gray-50 flex-1 flex flex-col">
              <div className="relative flex-1 mb-4 min-h-[150px]">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Scrivi la tua risposta qui..."
                  className="w-full h-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm md:text-base"
                />
                {aiSuggestion && (
                  <div className="absolute top-2 right-2">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded border border-purple-200">AI Draft</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                <button
                  onClick={handleRequestAI}
                  disabled={loadingAI}
                  className="w-full md:w-auto flex justify-center items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors bg-purple-50 md:bg-transparent p-2 rounded-lg md:p-0"
                >
                  <Sparkles className={`w-4 h-4 ${loadingAI ? 'animate-spin' : ''}`} />
                  {loadingAI ? 'Generando...' : 'Suggerimento AI'}
                </button>

                <div className="flex gap-3 w-full md:w-auto">
                  <button className="hidden md:block p-2 text-gray-500 hover:bg-gray-200 rounded-full">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!replyText.trim()}
                    className="flex-1 md:flex-none justify-center flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Invia <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 p-8 text-center">
            <span className="hidden md:inline">Seleziona un'email per leggere</span>
          </div>
        )}
      </div>
    </div>
  );
};