import React from 'react';
import { CalendarEvent } from '../types';

interface Props {
  events: CalendarEvent[];
}

export const CalendarView: React.FC<Props> = ({ events }) => {
  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 08:00 to 18:00

  const getEventStyle = (event: CalendarEvent) => {
    // Simple positioning logic assuming events are within the day view
    const [startHour, startMin] = event.start.split(':').map(Number);
    const [endHour, endMin] = event.end.split(':').map(Number);
    
    const startOffset = (startHour - 8) * 60 + startMin;
    const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    
    return {
      top: `${(startOffset / 60) * 80}px`, // 80px per hour
      height: `${(duration / 60) * 80}px`,
    };
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'call': return 'bg-green-100 border-green-300 text-green-700';
      case 'personal': return 'bg-gray-100 border-gray-300 text-gray-700';
      default: return 'bg-indigo-100 border-indigo-300 text-indigo-700';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Agenda di Oggi</h2>
        <div className="text-sm text-gray-500">Vista Giornaliera</div>
      </div>
      
      <div className="flex-1 overflow-y-auto relative custom-scrollbar">
        <div className="flex relative" style={{ height: `${hours.length * 80}px` }}>
          {/* Time column */}
          <div className="w-20 flex-shrink-0 border-r border-gray-100 bg-gray-50">
            {hours.map(h => (
              <div key={h} className="h-[80px] border-b border-gray-100 text-xs text-gray-400 p-2 text-right">
                {h.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>
          
          {/* Events Grid */}
          <div className="flex-1 relative">
            {/* Grid lines */}
            {hours.map(h => (
              <div key={`line-${h}`} className="h-[80px] border-b border-gray-100 w-full absolute" style={{ top: `${(h - 8) * 80}px` }}></div>
            ))}

            {/* Events */}
            {events.map(event => (
              <div
                key={event.id}
                className={`absolute w-[95%] left-[2.5%] rounded p-2 border-l-4 text-xs shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden ${getEventColor(event.type)}`}
                style={getEventStyle(event)}
              >
                <div className="font-bold">{event.title}</div>
                <div>{event.start} - {event.end}</div>
                {event.description && <div className="mt-1 opacity-80 truncate">{event.description}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
