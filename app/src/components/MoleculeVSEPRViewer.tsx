import { useEffect, useRef, useState, useCallback } from 'react';
import { Atom, RotateCw, Maximize, Minimize, Eye, EyeOff, Info } from 'lucide-react';

interface MoleculeVSEPRViewerProps {
  formula?: string;
  title?: string;
  height?: string;
  credits?: string;
}

type ViewMode = 'spacefill' | 'ballstick' | 'wireframe';
type VSEPRType = 'AX4' | 'AX3E' | 'AX2E2' | 'AX3' | 'AX2' | 'AX2E';

interface MoleculeConfig {
  name: string;
  notation: VSEPRType;
  geometry: string;
  shape: string;
  angles: string;
  atoms: string;
  description: string;
  hasLonePairs: boolean;
  hasTetrahedron: boolean;
  // Script Jmol pour construire la molécule
  dataScript: string;
  // Commande pour montrer les doublets
  lonePairsScript: string;
}

const MOLECULES: Record<string, MoleculeConfig> = {
  CH4: {
    name: "Méthane",
    notation: "AX4",
    geometry: "Tétraédrique",
    shape: "Tétraédrique",
    angles: "109.5°",
    atoms: "CH₄",
    description: "4 liaisons C-H. Géométrie de référence sans contrainte.",
    hasLonePairs: false,
    hasTetrahedron: true,
    dataScript: `C 0.0 0.0 0.0;H 0.629 0.629 0.629;H -0.629 -0.629 0.629;H -0.629 0.629 -0.629;H 0.629 -0.629 -0.629`,
    lonePairsScript: ``
  },
  NH3: {
    name: "Ammoniac",
    notation: "AX3E",
    geometry: "Tétraédrique",
    shape: "Pyramide trigone",
    angles: "107°",
    atoms: "NH₃",
    description: "3 liaisons N-H + 1 doublet non liant. Le doublet repousse plus fort.",
    hasLonePairs: true,
    hasTetrahedron: true,
    dataScript: `N 0.0 0.0 0.1;H 0.0 0.94 -0.33;H -0.814 -0.47 -0.33;H 0.814 -0.47 -0.33`,
    lonePairsScript: `lp 0.0 -0.8 0.5`
  },
  H2O: {
    name: "Eau",
    notation: "AX2E2",
    geometry: "Tétraédrique",
    shape: "Coudée (angulaire)",
    angles: "104.5°",
    atoms: "H₂O",
    description: "2 liaisons O-H + 2 doublets non liants. Forte répulsion.",
    hasLonePairs: true,
    hasTetrahedron: true,
    dataScript: `O 0.0 0.0 0.0;H 0.757 0.586 0.0;H -0.757 0.586 0.0`,
    lonePairsScript: `lp -0.4 -0.6 0;lp 0.4 -0.6 0`
  },
  BF3: {
    name: "Trifluorure de bore",
    notation: "AX3",
    geometry: "Triangulaire plane",
    shape: "Triangulaire plane",
    angles: "120°",
    atoms: "BF₃",
    description: "3 liaisons B-F. Pas de doublet sur le bore.",
    hasLonePairs: false,
    hasTetrahedron: false,
    dataScript: `B 0.0 0.0 0.0;F 1.3 0.0 0.0;F -0.65 1.126 0.0;F -0.65 -1.126 0.0`,
    lonePairsScript: ``
  },
  CO2: {
    name: "Dioxyde de carbone",
    notation: "AX2",
    geometry: "Linéaire",
    shape: "Linéaire",
    angles: "180°",
    atoms: "CO₂",
    description: "2 doubles liaisons C=O. Géométrie linéaire.",
    hasLonePairs: false,
    hasTetrahedron: false,
    dataScript: `C 0.0 0.0 0.0;O 1.16 0.0 0.0;O -1.16 0.0 0.0`,
    lonePairsScript: ``
  },
  SO2: {
    name: "Dioxyde de soufre",
    notation: "AX2E",
    geometry: "Triangulaire plane",
    shape: "Coudée",
    angles: "119°",
    atoms: "SO₂",
    description: "2 doubles liaisons S=O + 1 doublet sur le soufre.",
    hasLonePairs: true,
    hasTetrahedron: true,
    dataScript: `S 0.0 0.0 0.0;O 1.4 0.5 0.0;O -1.4 0.5 0.0`,
    lonePairsScript: `lp 0.0 -0.8 0`
  }
};

// Charger JSmol globalement
let jsmolLoadPromise: Promise<void> | null = null;

const loadJSmol = (): Promise<void> => {
  if (jsmolLoadPromise) return jsmolLoadPromise;
  
  if ((window as any).Jmol) {
    return Promise.resolve();
  }

  jsmolLoadPromise = new Promise((resolve) => {
    if (document.getElementById('jsmol-script')) {
      const check = setInterval(() => {
        if ((window as any).Jmol) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = 'jsmol-script';
    script.src = 'https://chemapps.stolaf.edu/jmol/jsmol/JSmol.min.js';
    script.async = true;
    
    script.onload = () => {
      const check = setInterval(() => {
        if ((window as any).Jmol) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    };
    
    document.head.appendChild(script);
  });

  return jsmolLoadPromise;
};

export function MoleculeVSEPRViewer({ 
  formula = 'CH4', 
  title,
  height = '500px',
  credits
}: MoleculeVSEPRViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('ballstick');
  const [showLonePairs, setShowLonePairs] = useState(false);
  const [showGeometry, setShowGeometry] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const appletIdRef = useRef<string>('');
  const JmolRef = useRef<any>(null);

  const config = MOLECULES[formula.toUpperCase()];
  const displayTitle = title || config?.name || formula;

  // Exécuter une commande Jmol
  const runScript = useCallback((script: string) => {
    if (JmolRef.current && appletIdRef.current) {
      JmolRef.current.script(appletIdRef.current, script);
    }
  }, []);

  // Initialiser JSmol
  useEffect(() => {
    if (!config) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const appletId = 'vsepr_' + formula.toLowerCase() + '_' + Date.now();
    appletIdRef.current = appletId;

    const init = async () => {
      await loadJSmol();
      
      if (!isMounted || !containerRef.current) return;

      const Jmol = (window as any).Jmol;
      if (!Jmol) {
        console.error('Jmol not available');
        setIsLoading(false);
        return;
      }

      JmolRef.current = Jmol;

      // Vider le conteneur
      containerRef.current.innerHTML = '';

      // Créer un div pour JSmol
      const jsmolDiv = document.createElement('div');
      jsmolDiv.id = appletId + '_div';
      jsmolDiv.style.width = '100%';
      jsmolDiv.style.height = '100%';
      containerRef.current.appendChild(jsmolDiv);

      // Info pour JSmol
      const Info = {
        width: '100%',
        height: '100%',
        debug: false,
        color: '#FFFFFF',
        addSelectionOptions: false,
        serverURL: 'https://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php',
        use: 'HTML5',
        j2sPath: 'https://chemapps.stolaf.edu/jmol/jsmol/j2s',
        disableJ2SLoadMonitor: true,
        disableInitialConsole: true,
        script: `background white;`
      };

      try {
        Jmol.setDocument(0);
        const html = Jmol.getAppletHtml(appletId, Info);
        jsmolDiv.innerHTML = html;

        // Charger la molécule après un délai
        setTimeout(() => {
          if (!isMounted) return;
          
          const atoms = config.dataScript.split(';');
          // first atom: atoms[0].split(' ')[0]
          // rest atoms: atoms.slice(1).join(';')
          
          // Construire la molécule atome par atome
          let loadScript = `load data "model"\n${formula}\n${atoms.join('\n')}\nend "model";`;
          loadScript += ' spacefill 20%; wireframe 0.15; color atoms cpk; background white; zoom 120;';
          
          Jmol.script(appletId, loadScript);
          
          setIsLoading(false);
          setIsReady(true);
        }, 500);

      } catch (e) {
        console.error('JSmol error:', e);
        setIsLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [formula, config]);

  // Changer le mode d'affichage
  useEffect(() => {
    if (!isReady) return;
    
    switch (viewMode) {
      case 'spacefill':
        runScript('spacefill 100%; wireframe off;');
        break;
      case 'ballstick':
        runScript('spacefill 20%; wireframe 0.15;');
        break;
      case 'wireframe':
        runScript('spacefill off; wireframe 0.2;');
        break;
    }
  }, [viewMode, isReady, runScript]);

  // Toggle lone pairs
  useEffect(() => {
    if (!isReady || !config?.hasLonePairs) return;
    
    if (showLonePairs) {
      // Ajouter des sphères représentant les doublets
      runScript('draw lone1 sphere @{atomno=1} diameter 0.8 color skyblue translucent 0.6 offset {0 -0.8 0};');
    } else {
      runScript('draw lone* delete;');
    }
  }, [showLonePairs, isReady, config, runScript]);

  // Toggle géométrie de référence
  useEffect(() => {
    if (!isReady || !config?.hasTetrahedron) return;
    
    if (showGeometry) {
      // Dessiner un tétraèdre autour de l'atome central
      runScript('draw tetrahedron polygon @{atomno=2} @{atomno=3} @{atomno=4} @{atomno=2} color yellow translucent 0.3;');
    } else {
      runScript('draw tetrahedron* delete;');
    }
  }, [showGeometry, isReady, config, runScript]);

  // Toggle rotation
  useEffect(() => {
    if (!isReady) return;
    runScript(isSpinning ? 'spin on;' : 'spin off;');
  }, [isSpinning, isReady, runScript]);

  if (!config) {
    return (
      <div className="my-4 p-6 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-700 font-medium">Molécule "{formula}" non disponible</p>
        <p className="text-sm text-gray-600 mt-2">
          Disponibles : {Object.keys(MOLECULES).join(', ')}
        </p>
      </div>
    );
  }

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="flex items-center gap-3">
          <Atom className="w-5 h-5" />
          <div>
            <h3 className="font-bold">{displayTitle}</h3>
            <p className="text-xs text-blue-100">
              {config.notation} • {config.shape}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs bg-white/20 px-2 py-1 rounded">
            ∠ {config.angles}
          </span>
        </div>
      </div>

      {/* Info panel */}
      <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
        <p className="text-sm text-blue-800">
          <Info className="w-4 h-4 inline mr-1" />
          {config.description}
        </p>
      </div>

      {/* Viewer */}
      <div 
        className="relative bg-white"
        style={{ height: typeof height === 'string' ? height : '400px' }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-gray-600 text-sm mt-2">Chargement JSmol...</span>
          </div>
        )}
        
        <div 
          ref={containerRef} 
          className="w-full h-full"
        />
      </div>

      {/* Controls */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 space-y-3">
        {/* View mode buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 font-medium uppercase mr-2">Affichage:</span>
          <button
            onClick={() => setViewMode('spacefill')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'spacefill' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Spacefill
          </button>
          <button
            onClick={() => setViewMode('ballstick')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'ballstick' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Bâtonnets
          </button>
          <button
            onClick={() => setViewMode('wireframe')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'wireframe' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Fil de fer
          </button>
        </div>

        {/* Option buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 font-medium uppercase mr-2">Options:</span>
          
          {config.hasLonePairs && (
            <button
              onClick={() => setShowLonePairs(!showLonePairs)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                showLonePairs 
                  ? 'bg-sky-500 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {showLonePairs ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              Doublets non liants (E)
            </button>
          )}
          
          {config.hasTetrahedron && (
            <button
              onClick={() => setShowGeometry(!showGeometry)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                showGeometry 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {showGeometry ? <Maximize className="w-3.5 h-3.5" /> : <Minimize className="w-3.5 h-3.5" />}
              Géométrie de référence
            </button>
          )}
          
          <button
            onClick={() => setIsSpinning(!isSpinning)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              isSpinning 
                ? 'bg-green-500 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
            Rotation
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-mono">{config.atoms}</span>
          <span>🖱️ Cliquez et glissez pour tourner • Molette pour zoomer</span>
        </div>
        {credits && (
          <p className="text-xs text-gray-400 italic mt-1 text-center">{credits}</p>
        )}
      </div>
    </div>
  );
}

export default MoleculeVSEPRViewer;
