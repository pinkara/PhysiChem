import { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw, Atom, AlertCircle } from 'lucide-react';

// --- TYPES ---
type DisplayMode = 'spacefill' | 'ballstick' | 'ball' | 'stick' | 'lines';

interface Atom3D {
  elem: string;
  x: number;
  y: number;
  z: number;
}

interface BondDef {
  atom1: number;
  atom2: number;
  order: number;
}

interface LonePairDef {
    x: number;
    y: number;
    z: number;
    atomIndex: number;
}

interface PartialCharge {
  atomIndex: number;
  charge: 'positive' | 'negative';
  label?: string;
}

interface MoleculeConfig {
  name: string;
  description: string;
  atomList: Atom3D[];
  lonePairs?: LonePairDef[];
  bonds: BondDef[];
  geometryLinks?: [number, number][]; 
  vseprGeometry?: boolean;
  partialCharges?: PartialCharge[];
}

interface Molecule3DmolVSEPREmbedProps {
  formula?: string;
  height?: string;
  credits?: string;
  controls?: boolean;
}

// --- DONNÉES MOLÉCULAIRES ---
const MOLECULES: Record<string, MoleculeConfig> = {
  H2O: {
    name: "Eau (H₂O)",
    description: "Géométrie Coudée (104.5°). Molécule polaire avec δ- sur O et δ+ sur H. Liaison O-H: 0.96 Å.",
    atomList: [
      { elem: 'O', x: 0, y: 0, z: 0 },     
      { elem: 'H', x: 0, y: 0.76, z: -0.58 },  
      { elem: 'H', x: 0, y: -0.76, z: -0.58 }, 
    ],
    lonePairs: [
      { atomIndex: 0, x: 0.8, y: 0, z: 0.6 },
      { atomIndex: 0, x: -0.8, y: 0, z: 0.6 }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 0, atom2: 2, order: 1 }
    ],
    geometryLinks: [[1, 2]],
    vseprGeometry: true,
    partialCharges: [
      { atomIndex: 0, charge: 'negative', label: 'δ-' },
      { atomIndex: 1, charge: 'positive', label: 'δ+' },
      { atomIndex: 2, charge: 'positive', label: 'δ+' }
    ]
  },
  NH3: {
    name: "Ammoniac (NH₃)",
    description: "Pyramide trigonale (107°). δ- sur N, δ+ sur H. Liaison N-H: 1.01 Å.",
    atomList: [
      { elem: 'N', x: 0, y: 0, z: 0 },
      { elem: 'H', x: 0, y: 0, z: -1.01 },
      { elem: 'H', x: 0.94, y: 0, z: 0.34 },
      { elem: 'H', x: -0.47, y: -0.81, z: 0.34 },
    ],
    lonePairs: [
      { atomIndex: 0, x: 0, y: 0, z: 1.0 }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 0, atom2: 2, order: 1 },
      { atom1: 0, atom2: 3, order: 1 }
    ],
    geometryLinks: [[1, 2], [2, 3], [3, 1]],
    vseprGeometry: true,
    partialCharges: [
      { atomIndex: 0, charge: 'negative', label: 'δ-' },
      { atomIndex: 1, charge: 'positive', label: 'δ+' },
      { atomIndex: 2, charge: 'positive', label: 'δ+' },
      { atomIndex: 3, charge: 'positive', label: 'δ+' }
    ]
  },
  CH4: {
    name: "Méthane (CH₄)",
    description: "Tétraèdrique. Molécule apolaire, charges équilibrées.",
    atomList: [
      { elem: 'C', x: 0, y: 0, z: 0 },
      { elem: 'H', x: 0.63, y: 0.63, z: 0.63 },
      { elem: 'H', x: -0.63, y: -0.63, z: 0.63 },
      { elem: 'H', x: -0.63, y: 0.63, z: -0.63 },
      { elem: 'H', x: 0.63, y: -0.63, z: -0.63 },
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 0, atom2: 2, order: 1 },
      { atom1: 0, atom2: 3, order: 1 },
      { atom1: 0, atom2: 4, order: 1 }
    ],
    geometryLinks: [[1, 2], [2, 3], [3, 4], [4, 1], [1, 3], [2, 4]],
    vseprGeometry: true
  },
  CO2: {
    name: "Dioxyde de Carbone (CO₂)",
    description: "Linéaire (180°). Molécule apolaire. Liaison C=O: 1.16 Å.",
    atomList: [
      { elem: 'C', x: 0, y: 0, z: 0 },      
      { elem: 'O', x: 0, y: 0, z: 1.16 },    
      { elem: 'O', x: 0, y: 0, z: -1.16 },   
    ],
    lonePairs: [
        { atomIndex: 1, x: 0, y: 0.9, z: 1.6 },  
        { atomIndex: 1, x: 0, y: -0.9, z: 1.6 },
        { atomIndex: 2, x: 0, y: 0.9, z: -1.6 }, 
        { atomIndex: 2, x: 0, y: -0.9, z: -1.6 }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 2 },
      { atom1: 0, atom2: 2, order: 2 }
    ],
    geometryLinks: [],
    partialCharges: [
      { atomIndex: 0, charge: 'positive', label: 'δ+' },
      { atomIndex: 1, charge: 'negative', label: 'δ-' },
      { atomIndex: 2, charge: 'negative', label: 'δ-' }
    ]
  },
  N2: {
    name: "Diazote (N₂)",
    description: "Linéaire. Molécule apolaire.",
    atomList: [
      { elem: 'N', x: 0, y: 0, z: 0.55 },   
      { elem: 'N', x: 0, y: 0, z: -0.55 },  
    ],
    lonePairs: [
        { atomIndex: 0, x: 0, y: 0, z: 1.55 },  
        { atomIndex: 1, x: 0, y: 0, z: -1.55 }  
    ],
    bonds: [
        { atom1: 0, atom2: 1, order: 3 }
    ],
    geometryLinks: []
  },
  C2H4: {
    name: "Éthène (C₂H₄)",
    description: "Plane (120°). Double liaison C=C: 1.34 Å, C-H: 1.09 Å.",
    atomList: [
      { elem: 'C', x: 0, y: 0, z: 0.67 },
      { elem: 'C', x: 0, y: 0, z: -0.67 },
      { elem: 'H', x: 0.92, y: 0, z: 1.23 },
      { elem: 'H', x: -0.92, y: 0, z: 1.23 },
      { elem: 'H', x: 0.92, y: 0, z: -1.23 },
      { elem: 'H', x: -0.92, y: 0, z: -1.23 },
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 2 },
      { atom1: 0, atom2: 2, order: 1 },
      { atom1: 0, atom2: 3, order: 1 },
      { atom1: 1, atom2: 4, order: 1 },
      { atom1: 1, atom2: 5, order: 1 }
    ],
    geometryLinks: [
        [2, 3], [4, 5], 
        [2, 4], [3, 5]
    ]
  },
  C2H2: {
    name: "Éthyne (C₂H₂)",
    description: "Linéaire (180°). Triple liaison C≡C: 1.20 Å, C-H: 1.06 Å.",
    atomList: [
      { elem: 'C', x: 0, y: 0, z: 0.60 },
      { elem: 'C', x: 0, y: 0, z: -0.60 },
      { elem: 'H', x: 0, y: 0, z: 1.66 },
      { elem: 'H', x: 0, y: 0, z: -1.66 },
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 3 },
      { atom1: 0, atom2: 2, order: 1 },
      { atom1: 1, atom2: 3, order: 1 }
    ],
    geometryLinks: []
  },
  C6H12: {
    name: "Cyclohexane (C₆H₁₂)",
    description: "Conformation Chaise. Liaison C-C: 1.54 Å, C-H: 1.09 Å.",
    atomList: [
      { elem: 'C', x: 1.26, y: 0.73, z: -0.25 },
      { elem: 'C', x: 1.26, y: -0.73, z: 0.25 },
      { elem: 'C', x: 0, y: -1.45, z: -0.25 },
      { elem: 'C', x: -1.26, y: -0.73, z: 0.25 },
      { elem: 'C', x: -1.26, y: 0.73, z: -0.25 },
      { elem: 'C', x: 0, y: 1.45, z: 0.25 },
      { elem: 'H', x: 1.26, y: 0.73, z: -1.28 },
      { elem: 'H', x: 1.26, y: -0.73, z: 1.28 },
      { elem: 'H', x: 0, y: -1.45, z: -1.28 },
      { elem: 'H', x: -1.26, y: -0.73, z: 1.28 },
      { elem: 'H', x: -1.26, y: 0.73, z: -1.28 },
      { elem: 'H', x: 0, y: 1.45, z: 1.28 },
      { elem: 'H', x: 2.15, y: 1.24, z: 0.1 },
      { elem: 'H', x: 2.15, y: -1.24, z: -0.1 },
      { elem: 'H', x: 0, y: -2.48, z: 0.1 },
      { elem: 'H', x: -2.15, y: -1.24, z: -0.1 },
      { elem: 'H', x: -2.15, y: 1.24, z: 0.1 },
      { elem: 'H', x: 0, y: 2.48, z: -0.1 },
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 }, { atom1: 1, atom2: 2, order: 1 },
      { atom1: 2, atom2: 3, order: 1 }, { atom1: 3, atom2: 4, order: 1 },
      { atom1: 4, atom2: 5, order: 1 }, { atom1: 5, atom2: 0, order: 1 },
      { atom1: 0, atom2: 6, order: 1 }, { atom1: 0, atom2: 12, order: 1 },
      { atom1: 1, atom2: 7, order: 1 }, { atom1: 1, atom2: 13, order: 1 },
      { atom1: 2, atom2: 8, order: 1 }, { atom1: 2, atom2: 14, order: 1 },
      { atom1: 3, atom2: 9, order: 1 }, { atom1: 3, atom2: 15, order: 1 },
      { atom1: 4, atom2: 10, order: 1 }, { atom1: 4, atom2: 16, order: 1 },
      { atom1: 5, atom2: 11, order: 1 }, { atom1: 5, atom2: 17, order: 1 },
    ],
    geometryLinks: []
  },
  CH2CL2: {
    name: "Dichlorométhane (CH₂Cl₂)",
    description: "Tétraèdrique. Molécule polaire avec δ+ sur C et H, δ- sur Cl.",
    atomList: [
      { elem: 'C', x: 0.0, y: 0.0, z: 0.0 },
      { elem: 'Cl', x: 1.02, y: 1.02, z: 1.02 },
      { elem: 'Cl', x: -1.02, y: -1.02, z: 1.02 },
      { elem: 'H', x: -0.63, y: 0.63, z: -0.63 },
      { elem: 'H', x: 0.63, y: -0.63, z: -0.63 },
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 0, atom2: 2, order: 1 },
      { atom1: 0, atom2: 3, order: 1 },
      { atom1: 0, atom2: 4, order: 1 }
    ],
    geometryLinks: [[1, 2], [2, 3], [3, 4], [4, 1], [1, 3], [2, 4]],
    vseprGeometry: true,
    partialCharges: [
      { atomIndex: 0, charge: 'positive', label: 'δ+' },
      { atomIndex: 1, charge: 'negative', label: 'δ-' },
      { atomIndex: 2, charge: 'negative', label: 'δ-' },
      { atomIndex: 3, charge: 'positive', label: 'δ+' },
      { atomIndex: 4, charge: 'positive', label: 'δ+' }
    ]
  },
  BF3: {
    name: "Trifluorure de bore (BF₃)",
    description: "Plane triangulaire (120°). Liaison B-F: 1.31 Å.",
    atomList: [
      { elem: 'B', x: 0.0, y: 0.0, z: 0.0 },
      { elem: 'F', x: 1.31, y: 0.0, z: 0.0 },
      { elem: 'F', x: -0.655, y: 1.135, z: 0.0 },
      { elem: 'F', x: -0.655, y: -1.135, z: 0.0 },
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 0, atom2: 2, order: 1 },
      { atom1: 0, atom2: 3, order: 1 }
    ],
    geometryLinks: [[1, 2], [2, 3], [3, 1]],
    partialCharges: [
      { atomIndex: 0, charge: 'positive', label: 'δ+' },
      { atomIndex: 1, charge: 'negative', label: 'δ-' },
      { atomIndex: 2, charge: 'negative', label: 'δ-' },
      { atomIndex: 3, charge: 'negative', label: 'δ-' }
    ]
  },
  SO2: {
    name: "Dioxyde de soufre (SO₂)",
    description: "Coudée (119°). Liaison S=O: 1.43 Å.",
    atomList: [
      { elem: 'S', x: 0.0, y: 0.0, z: 0.0 },
      { elem: 'O', x: 1.35, y: 0.47, z: 0.0 },
      { elem: 'O', x: -1.35, y: 0.47, z: 0.0 },
    ],
    lonePairs: [
      { atomIndex: 0, x: 0, y: -1.0, z: 0 }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 2 },
      { atom1: 0, atom2: 2, order: 2 }
    ],
    geometryLinks: [[1, 2]],
    vseprGeometry: true,
    partialCharges: [
      { atomIndex: 0, charge: 'positive', label: 'δ+' },
      { atomIndex: 1, charge: 'negative', label: 'δ-' },
      { atomIndex: 2, charge: 'negative', label: 'δ-' }
    ]
  }
};

// --- UTILITAIRES ---

const generateMOL = (config: MoleculeConfig): string => {
  let mol = '';
  mol += `${config.name}\nGenerated by PhysiChem\n\n`;
  
  const numAtoms = config.atomList.length.toString().padStart(3, ' ');
  const numBonds = config.bonds.length.toString().padStart(3, ' ');
  mol += `${numAtoms}${numBonds}  0  0  0  0  0  0  0  0999 V2000\n`;

  config.atomList.forEach(atom => {
    const x = atom.x.toFixed(4).padStart(10, ' ');
    const y = atom.y.toFixed(4).padStart(10, ' ');
    const z = atom.z.toFixed(4).padStart(10, ' ');
    const elem = atom.elem.padEnd(3, ' ');
    mol += `${x}${y}${z} ${elem} 0  0  0  0  0  0  0  0  0  0  0  0\n`;
  });

  config.bonds.forEach(bond => {
    const atom1 = (bond.atom1 + 1).toString().padStart(3, ' ');
    const atom2 = (bond.atom2 + 1).toString().padStart(3, ' ');
    const order = bond.order.toString().padStart(3, ' ');
    mol += `${atom1}${atom2}${order}  0  0  0  0\n`;
  });

  mol += 'M  END\n';
  return mol;
};

// Calculer le barycentre (centre de gravité) d'un ensemble de points
const calculateBarycenter = (points: { x: number; y: number; z: number }[]): { x: number; y: number; z: number } | null => {
  if (points.length === 0) return null;
  
  const sum = points.reduce((acc, p) => ({
    x: acc.x + p.x,
    y: acc.y + p.y,
    z: acc.z + p.z
  }), { x: 0, y: 0, z: 0 });
  
  return {
    x: sum.x / points.length,
    y: sum.y / points.length,
    z: sum.z / points.length
  };
};

let mol3dLoadPromise: Promise<void> | null = null;

const load3Dmol = (): Promise<void> => {
  if (mol3dLoadPromise) return mol3dLoadPromise;
  if ((window as any).$3Dmol) return Promise.resolve();

  mol3dLoadPromise = new Promise((resolve, reject) => {
    if (document.getElementById('3dmol-script')) {
        const check = setInterval(() => {
            if ((window as any).$3Dmol) { clearInterval(check); resolve(); }
        }, 100);
        return;
    }

    const script = document.createElement('script');
    script.id = '3dmol-script';
    script.src = 'https://3Dmol.org/build/3Dmol-min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Impossible de charger 3Dmol.js"));
    document.head.appendChild(script);
  });
  return mol3dLoadPromise;
};

// --- COMPOSANT ---

export function Molecule3DmolVSEPREmbed({ 
  formula = 'H2O', 
  height = '400px',
  credits,
  controls = true
}: Molecule3DmolVSEPREmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  
  const [displayMode, setDisplayMode] = useState<DisplayMode>('ballstick');
  const [showLonePairs, setShowLonePairs] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [showGeometry, setShowGeometry] = useState(false);
  const [showPartialCharges, setShowPartialCharges] = useState(false);
  const [showBarycenters, setShowBarycenters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const config = MOLECULES[formula.toUpperCase()];

  const drawLonePairs = useCallback((viewer: any, currentConfig: MoleculeConfig) => {
    if (!currentConfig.lonePairs || !showLonePairs) return;

    const lobeColor = '#4dabf7'; 
    const lobeAlpha = 0.8; 

    currentConfig.lonePairs.forEach(lp => {
      const parentAtom = currentConfig.atomList[lp.atomIndex];
      if (!parentAtom) return;

      const origin = { x: parentAtom.x, y: parentAtom.y, z: parentAtom.z };
      const end = { x: lp.x, y: lp.y, z: lp.z };
      
      viewer.addCylinder({
        start: origin,
        end: { 
           x: origin.x + (end.x - origin.x) * 0.5, 
           y: origin.y + (end.y - origin.y) * 0.5, 
           z: origin.z + (end.z - origin.z) * 0.5 
        },
        radius: 0.08,
        color: lobeColor,
        alpha: lobeAlpha,
        clickable: false
      });
      viewer.addSphere({
        center: end,
        radius: 0.3,
        color: lobeColor,
        alpha: lobeAlpha,
        clickable: false
      });
    });
  }, [showLonePairs]);

  const drawGeometry = useCallback((viewer: any, currentConfig: MoleculeConfig) => {
      if (!showGeometry) return;

      const cylinderStyle = {
          radius: 0.03,
          color: '#FF8C00',
          dashed: true,
          alpha: 0.8
      };

      if (currentConfig.geometryLinks) {
        currentConfig.geometryLinks.forEach(([idx1, idx2]) => {
            const atom1 = currentConfig.atomList[idx1];
            const atom2 = currentConfig.atomList[idx2];
            if (atom1 && atom2) {
                viewer.addCylinder({
                    start: { x: atom1.x, y: atom1.y, z: atom1.z },
                    end: { x: atom2.x, y: atom2.y, z: atom2.z },
                    ...cylinderStyle
                });
            }
        });
      }

      if (currentConfig.vseprGeometry && currentConfig.lonePairs && showLonePairs) {
          const peripheralAtoms = currentConfig.atomList.slice(1); 
          const lonePairs = currentConfig.lonePairs;

          peripheralAtoms.forEach(atom => {
             lonePairs.forEach(lp => {
                 viewer.addCylinder({
                     start: { x: atom.x, y: atom.y, z: atom.z },
                     end: { x: lp.x, y: lp.y, z: lp.z },
                     ...cylinderStyle
                 });
             });
          });

          for (let i = 0; i < lonePairs.length; i++) {
              for (let j = i + 1; j < lonePairs.length; j++) {
                  viewer.addCylinder({
                      start: { x: lonePairs[i].x, y: lonePairs[i].y, z: lonePairs[i].z },
                      end: { x: lonePairs[j].x, y: lonePairs[j].y, z: lonePairs[j].z },
                      ...cylinderStyle
                  });
              }
          }
      }
  }, [showGeometry, showLonePairs]);

  // Dessiner les charges partielles (δ+ et δ-) sur les atomes
  const drawPartialCharges = useCallback((viewer: any, currentConfig: MoleculeConfig) => {
    if (!showPartialCharges || !currentConfig.partialCharges) return;

    currentConfig.partialCharges.forEach(charge => {
      const atom = currentConfig.atomList[charge.atomIndex];
      if (!atom) return;

      const color = charge.charge === 'positive' ? '#dc2626' : '#2563eb'; // Rouge foncé ou Bleu foncé
      const label = charge.label || (charge.charge === 'positive' ? 'δ+' : 'δ-');

      // Ajouter un halo coloré autour de l'atome
      viewer.addSphere({
        center: { x: atom.x, y: atom.y, z: atom.z },
        radius: 0.45, // Légèrement plus grand que l'atome
        color: color,
        alpha: 0.3, // Transparent
        clickable: false
      });

      // Ajouter le label δ+ ou δ- directement sur l'atome (légèrement décalé pour ne pas cacher l'élément)
      const labelOffset = 0.35;
      viewer.addLabel(label, {
        position: { 
          x: atom.x + labelOffset, 
          y: atom.y + labelOffset, 
          z: atom.z + labelOffset 
        },
        backgroundColor: color,
        fontColor: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        borderRadius: 50,
        borderThickness: 0,
        inFront: true
      });
    });
  }, [showPartialCharges]);

  // Dessiner les barycentres des charges
  const drawBarycenters = useCallback((viewer: any, currentConfig: MoleculeConfig) => {
    if (!showBarycenters || !currentConfig.partialCharges) return;

    const positiveCharges = currentConfig.partialCharges
      .filter(c => c.charge === 'positive')
      .map(c => currentConfig.atomList[c.atomIndex]);
    
    const negativeCharges = currentConfig.partialCharges
      .filter(c => c.charge === 'negative')
      .map(c => currentConfig.atomList[c.atomIndex]);

    // Barycentre des charges positives (Rouge)
    const posBarycenter = calculateBarycenter(positiveCharges);
    if (posBarycenter) {
      viewer.addSphere({
        center: posBarycenter,
        radius: 0.25,
        color: '#dc2626', // Rouge foncé
        alpha: 0.9,
        clickable: false
      });
      viewer.addLabel('⊕', {
        position: { 
          x: posBarycenter.x, 
          y: posBarycenter.y + 0.4, 
          z: posBarycenter.z 
        },
        backgroundColor: '#dc2626',
        fontColor: 'white',
        fontSize: 16,
        borderRadius: 50,
        borderThickness: 0,
        inFront: true
      });
    }

    // Barycentre des charges négatives (Bleu)
    const negBarycenter = calculateBarycenter(negativeCharges);
    if (negBarycenter) {
      viewer.addSphere({
        center: negBarycenter,
        radius: 0.25,
        color: '#2563eb', // Bleu foncé
        alpha: 0.9,
        clickable: false
      });
      viewer.addLabel('⊖', {
        position: { 
          x: negBarycenter.x, 
          y: negBarycenter.y + 0.4, 
          z: negBarycenter.z 
        },
        backgroundColor: '#2563eb',
        fontColor: 'white',
        fontSize: 16,
        borderRadius: 50,
        borderThickness: 0,
        inFront: true
      });
    }

    // Dessiner une flèche du barycentre positif vers le négatif (moment dipolaire)
    if (posBarycenter && negBarycenter) {
      viewer.addCylinder({
        start: posBarycenter,
        end: negBarycenter,
        radius: 0.05,
        color: '#10b981', // Vert pour le moment dipolaire
        alpha: 0.7,
        clickable: false
      });
    }
  }, [showBarycenters]);

  const renderScene = useCallback(() => {
    if (!viewerRef.current || !config) return;
    
    try {
        const viewer = viewerRef.current;
        viewer.clear();
        viewer.removeAllLabels();

        const molString = generateMOL(config);
        viewer.addModel(molString, 'mol');

        switch (displayMode) {
        case 'spacefill':
            viewer.setStyle({}, { sphere: { scale: 1.0 } });
            break;
        case 'ballstick':
            viewer.setStyle({}, { stick: { radius: 0.10 }, sphere: { scale: 0.3 } });
            break;
        case 'stick':
            viewer.setStyle({}, { stick: { radius: 0.10 } });
            break;
        case 'lines':
            viewer.setStyle({}, { line: {} });
            break;
        default:
            viewer.setStyle({}, { stick: { radius: 0.10 }, sphere: { scale: 0.3 } });
        }

        if (showLonePairs) {
            drawLonePairs(viewer, config);
        }

        if (showGeometry) {
            drawGeometry(viewer, config);
        }

        if (showPartialCharges) {
            drawPartialCharges(viewer, config);
        }

        if (showBarycenters) {
            drawBarycenters(viewer, config);
        }

        if (showLabels) {
            config.atomList.forEach(atom => {
                viewer.addLabel(atom.elem, {
                    position: { x: atom.x, y: atom.y, z: atom.z },
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    fontColor: 'white',
                    fontSize: 14,
                    borderRadius: 4,
                    borderThickness: 0
                });
            });
        }

        viewer.zoomTo();
        viewer.render();
    } catch (err) {
        console.error("Erreur de rendu:", err);
    }
  }, [config, displayMode, showLonePairs, showLabels, showGeometry, showPartialCharges, showBarycenters, drawLonePairs, drawGeometry, drawPartialCharges, drawBarycenters]);

  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
        try {
            await load3Dmol();
            if (!isMounted || !containerRef.current) return;
            
            const $3Dmol = (window as any).$3Dmol;
            if (!$3Dmol) throw new Error("Bibliothèque 3Dmol introuvable");

            if (!viewerRef.current) {
                const viewer = $3Dmol.createViewer(containerRef.current, {
                    backgroundColor: 'white',
                    defaultcolors: $3Dmol.rasmolElementColors,
                });
                viewerRef.current = viewer;
            }

            setIsLoading(false);
            renderScene();
        } catch (err: any) {
            console.error(err);
            if (isMounted) {
                setIsLoading(false);
                setError(err.message || "Erreur de chargement");
            }
        }
    };

    init();
    return () => { isMounted = false; };
  }, []); 

  useEffect(() => {
    if (!isLoading && viewerRef.current && !error) {
      const timer = setTimeout(() => {
          renderScene();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isLoading, renderScene, formula, displayMode, showLonePairs, showLabels, showGeometry, showPartialCharges, showBarycenters, error]);

  if (!config) {
    return (
      <div className="w-full rounded-lg bg-red-50 text-red-600 text-sm p-4 flex items-center gap-2" style={{ height }}>
        <AlertCircle className="w-5 h-5" />
        Molécule "{formula}" non disponible
      </div>
    );
  }

  const hasPartialCharges = config.partialCharges && config.partialCharges.length > 0;

  return (
    <div className="w-full bg-white" style={{ height: controls ? 'auto' : height }}>
      {/* Header */}
      {controls && (
        <div className="bg-gray-50 p-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
              <Atom className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">{config.name}</h3>
              <p className="text-xs text-gray-500">{config.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Viewer */}
      <div className="relative bg-white" style={{ height: controls ? '300px' : '100%' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
              <span className="text-sm text-gray-500">Chargement...</span>
            </div>
          </div>
        )}

        {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10 p-4 text-center">
                <div className="flex flex-col items-center text-red-600">
                    <AlertCircle className="w-8 h-8" />
                    <p className="font-bold mt-2">Erreur</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        )}

        <div ref={containerRef} className="w-full h-full cursor-move absolute inset-0" />
        
        {/* Legend */}
        {config.lonePairs && showLonePairs && controls && !error && !isLoading && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1.5 rounded-lg shadow-sm border border-gray-100 text-xs pointer-events-none z-20">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4dabf7] opacity-80 border border-blue-400"></div>
                    <span>Doublet non-liant</span>
                </div>
            </div>
        )}

        {/* Legend for partial charges */}
        {hasPartialCharges && showPartialCharges && controls && !error && !isLoading && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1.5 rounded-lg shadow-sm border border-gray-100 text-xs pointer-events-none z-20">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>δ+ (positif)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>δ- (négatif)</span>
                    </div>
                </div>
            </div>
        )}

        {/* Legend for barycenters */}
        {hasPartialCharges && showBarycenters && controls && !error && !isLoading && (
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 py-1.5 rounded-lg shadow-sm border border-gray-100 text-xs pointer-events-none z-20">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-600"></div>
                        <span>⊕ Barycentre δ+</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                        <span>⊖ Barycentre δ-</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-0.5 bg-green-500"></div>
                        <span>Moment dipolaire</span>
                    </div>
                </div>
            </div>
        )}

        {/* Credits */}
        {credits && !controls && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white/90 px-2 py-1 rounded">
            {credits}
          </div>
        )}
      </div>

      {/* Controls */}
      {controls && (
        <div className="bg-gray-50 p-3 border-t border-gray-200 flex flex-wrap gap-3 items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium text-xs">Style:</span>
            <div className="flex bg-white rounded-md border border-gray-300 overflow-hidden">
                {(['ballstick', 'spacefill', 'stick', 'lines'] as DisplayMode[]).map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setDisplayMode(mode)}
                        className={`px-2 py-1 text-xs transition-colors ${displayMode === mode ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        {mode === 'ballstick' ? 'Bâtons' : mode === 'spacefill' ? 'Boules' : mode === 'stick' ? 'Fil' : 'Lignes'}
                    </button>
                ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer select-none px-2 py-1 rounded-md hover:bg-white transition-colors border border-transparent hover:border-gray-200">
                <input 
                    type="checkbox" 
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 rounded"
                />
                <span className="text-gray-700 text-xs">Labels</span>
            </label>

            {(config.vseprGeometry || (config.geometryLinks && config.geometryLinks.length > 0)) && (
                 <label className="flex items-center gap-1.5 cursor-pointer select-none px-2 py-1 rounded-md hover:bg-white transition-colors border border-transparent hover:border-gray-200">
                    <input 
                        type="checkbox" 
                        checked={showGeometry}
                        onChange={(e) => setShowGeometry(e.target.checked)}
                        className="w-3.5 h-3.5 text-orange-500 rounded"
                    />
                    <span className="text-gray-700 text-xs">Géométrie</span>
                </label>
            )}

            {config.lonePairs && (
                <label className="flex items-center gap-1.5 cursor-pointer select-none px-2 py-1 rounded-md hover:bg-white transition-colors border border-transparent hover:border-gray-200">
                    <input 
                        type="checkbox" 
                        checked={showLonePairs}
                        onChange={(e) => setShowLonePairs(e.target.checked)}
                        className="w-3.5 h-3.5 text-cyan-500 rounded"
                    />
                    <span className="text-gray-700 text-xs">Doublets</span>
                </label>
            )}

            {hasPartialCharges && (
                <>
                    <label className="flex items-center gap-1.5 cursor-pointer select-none px-2 py-1 rounded-md hover:bg-white transition-colors border border-transparent hover:border-gray-200">
                        <input 
                            type="checkbox" 
                            checked={showPartialCharges}
                            onChange={(e) => setShowPartialCharges(e.target.checked)}
                            className="w-3.5 h-3.5 text-purple-500 rounded"
                        />
                        <span className="text-gray-700 text-xs">Charges δ</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer select-none px-2 py-1 rounded-md hover:bg-white transition-colors border border-transparent hover:border-gray-200">
                        <input 
                            type="checkbox" 
                            checked={showBarycenters}
                            onChange={(e) => setShowBarycenters(e.target.checked)}
                            className="w-3.5 h-3.5 text-green-500 rounded"
                        />
                        <span className="text-gray-700 text-xs">Barycentres</span>
                    </label>
                </>
            )}

            <button 
                onClick={() => {
                    if (viewerRef.current) {
                        viewerRef.current.zoomTo();
                        viewerRef.current.render();
                    }
                }}
                className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors ml-1"
                title="Réinitialiser la vue"
            >
                <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Molecule3DmolVSEPREmbed;
