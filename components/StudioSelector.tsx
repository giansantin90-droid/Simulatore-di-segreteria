import React from 'react';
import { StudioType, STUDIO_THEMES } from '../types';
import { Briefcase, Stethoscope, Ruler, Calculator } from 'lucide-react';

interface Props {
  onSelect: (type: StudioType) => void;
}

export const StudioSelector: React.FC<Props> = ({ onSelect }) => {
  const getIcon = (type: StudioType) => {
    switch (type) {
      case StudioType.LEGAL: return <Briefcase className="w-8 h-8 mb-4" />;
      case StudioType.MEDICAL: return <Stethoscope className="w-8 h-8 mb-4" />;
      case StudioType.ARCHITECT: return <Ruler className="w-8 h-8 mb-4" />;
      case StudioType.ACCOUNTING: return <Calculator className="w-8 h-8 mb-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Benvenuto in SegreteriaPro Simulator</h1>
        <p className="text-xl text-gray-600">
          Scegli il tipo di studio professionale in cui vuoi iniziare il tuo percorso di simulazione.
          Ogni ambiente ha sfide, terminologie e priorità diverse.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {Object.values(StudioType).map((type) => {
          const theme = STUDIO_THEMES[type];
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md hover:shadow-xl transition-all duration-300 text-left border border-gray-100 hover:border-gray-300 flex flex-col items-start"
            >
              <div className={`${theme.secondary} transition-colors duration-300 group-hover:scale-110 transform origin-left`}>
                {getIcon(type)}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{type}</h3>
              <p className="text-gray-500">
                Simulazione focalizzata su scadenze {type === StudioType.LEGAL ? 'processuali' : type === StudioType.MEDICAL ? 'cliniche' : type === StudioType.ARCHITECT ? 'di cantiere' : 'fiscali'} e gestione clienti specifici.
              </p>
              <div className={`absolute bottom-0 left-0 w-full h-1 ${theme.primary} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
