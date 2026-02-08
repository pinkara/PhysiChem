import { useState } from 'react';
import { ExternalLink, Maximize2, Minimize2, RotateCcw, Info } from 'lucide-react';

interface CircuitJSProps {
  height?: string;
  circuit?: string;
  format?: 'cct' | 'ctz';
  url?: string;  // URL complète de falstad
  controls?: boolean;
}

export function CircuitJS({ 
  height = '850px',
  circuit,
  format,
  url,
  controls = true
}: CircuitJSProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0);

  const getCircuitUrl = () => {
    // Si une URL complète est fournie, l'utiliser directement
    if (url) {
      console.log('Using provided URL:', url);
      return url;
    }

    const baseUrl = 'https://www.falstad.com/circuit/circuitjs.html';
    const params = new URLSearchParams();
    params.set('whiteBackground', 'true');
    
    if (circuit) {
      const paramName = format || 'cct';
      params.set(paramName, circuit);
      console.log(`Loading circuit with format: ${paramName}`);
    } else {
      // Circuit par défaut
      params.set('cct', '$+1+0.000005+10.20027730826997+50+5+50+158+96+0+0.001+0.002+0.001+1256+0.001+0.002+0.001+1256+0+0+0+1+1+0+0+1+1+0+0+0+1+1+1+0+0+1+1+0+0+0+1+1+1+0+0+1+1+0+0+0+1+1+1+0+0+1+1+0+0+0+1+1+1+0+0+1+1+0+0+0+1+1+1+0+0+1+1+0+0+0+1+1+1');
    }
    
    const fullUrl = `${baseUrl}?${params.toString()}`;
    console.log('CircuitJS URL:', fullUrl);
    return fullUrl;
  };

  const resetCircuit = () => {
    setKey(k => k + 1);
  };

  return (
    <div 
      className={`w-full bg-white rounded-lg border border-gray-200 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      style={{ height: isFullscreen ? '100vh' : (controls ? 'auto' : height) }}
    >
      {controls && (
        <div className="bg-gray-50 p-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="6" width="20" height="12" rx="2"/>
                  <path d="M6 10h.01M6 14h.01"/>
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M16 10h.01M16 14h.01"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">CircuitJS Simulator</h3>
                <p className="text-xs text-gray-500">Simulateur de circuits électroniques par Paul Falstad</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetCircuit}
                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                title="Réinitialiser"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                title={isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <a
                href="https://www.falstad.com/circuit/circuitjs.html?whiteBackground=true"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                title="Ouvrir dans un nouvel onglet"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full" style={{ 
        height: isFullscreen ? 'calc(100vh - 60px)' : (controls ? 'min(80vh, 800px)' : '100%'),
        minHeight: '600px'
      }}>
        <iframe
          key={key}
          src={getCircuitUrl()}
          className="w-full h-full border-0"
          style={{ minHeight: '600px' }}
          allow="fullscreen"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>

      {controls && (
        <div className="bg-gray-50 p-3 border-t border-gray-200">
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Comment utiliser CircuitJS :</p>
              <ul className="mt-1 space-y-0.5 list-disc list-inside">
                <li>Cliquez-droit pour ajouter des composants (résistances, condensateurs, sources...)</li>
                <li>Cliquez-glissez pour relier les composants avec des fils</li>
                <li>Cliquez sur un interrupteur pour l'actionner</li>
                <li>Utilisez la souris pour déplacer les composants</li>
                <li>Le simulateur calcule tension, intensité et puissance en temps réel</li>
              </ul>
              <p className="mt-2 text-gray-500">
                CircuitJS est un logiciel open source créé par Paul Falstad. 
                <a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  En savoir plus
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
