import { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw, Type } from 'lucide-react';

type DisplayMode = 'spacefill' | 'ballstick' | 'ball' | 'stick' | 'lines' | 'off';
type LabelSize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'off';

interface Molecule3DmolVSEPREmbedProps {
  formula?: string;
  height?: string;
  credits?: string;
  controls?: boolean;
}

interface Atom3D {
  elem: string;
  x: number;
  y: number;
  z: number;
}

interface MoleculeConfig {
  name: string;
  atomList: Atom3D[];
  hasLonePairs: boolean;
  hasTetrahedron: boolean; // Utilise pour activer le tracé de la géométrie (polyèdre)
  lonePairs?: { x: number; y: number; z: number }[];
}

// --- BASE DE DONNÉES ÉTENDUE VSEPR ---
const MOLECULES: Record<string, MoleculeConfig> = {
  // --- AX2 (Linéaire) ---
  BECL2: {
    name: "Chlorure de béryllium (BeCl2)",
    atomList: [
      { elem: 'Be', x: 0, y: 0, z: 0 },
      { elem: 'Cl', x: 2.0, y: 0, z: 0 },
      { elem: 'Cl', x: -2.0, y: 0, z: 0 },
    ],
    hasLonePairs: false,
    hasTetrahedron: true, // Ligne simple
  },
  CUCL2: {
    name: "Dichlorure de cuivre (CuCl2)",
    atomList: [
      { elem: 'Cu', x: 0, y: 0, z: 0 },
      { elem: 'Cl', x: 2.0, y: 0, z: 0 },
      { elem: 'Cl', x: -2.0, y: 0, z: 0 },
    ],
    hasLonePairs: false,
    hasTetrahedron: true, // Active le tracé pour montrer la linéarité
  },
  CO2: {
    name: "Dioxyde de carbone (CO2)",
    atomList: [
      { elem: 'C', x: 0, y: 0, z: 0 },
      { elem: 'O', x: 1.16, y: 0, z: 0 },
      { elem: 'O', x: -1.16, y: 0, z: 0 },
    ],
    hasLonePairs: false,
    hasTetrahedron: true,
  },
  HCN: {
    name: "Cyanure d'hydrogène (HCN)",
    atomList: [
      { elem: 'C', x: 0, y: 0, z: 0 },
      { elem: 'N', x: 1.15, y: 0, z: 0 },
      { elem: 'H', x: -1.06, y: 0, z: 0 },
    ],
    hasLonePairs: true, // N a un doublet
    hasTetrahedron: true,
    lonePairs: [{ x: 2.0, y: 0, z: 0 }] 
  },
  C2H2: {
    name: "Acétylène (C2H2)",
    atomList: [
      { elem: 'C', x: 0.6, y: 0, z: 0 },
      { elem: 'C', x: -0.6, y: 0, z: 0 },
      { elem: 'H', x: 1.66, y: 0, z: 0 },
      { elem: 'H', x: -1.66, y: 0, z: 0 },
    ],
    hasLonePairs: false,
    hasTetrahedron: false,
  },

  // --- AX3 (Trigonal Plan) ---
  BF3: {
    name: "Trifluorure de bore (BF3)",
    atomList: [
      { elem: 'B', x: 0, y: 0, z: 0 },
      { elem: 'F', x: 1.3, y: 0, z: 0 },
      { elem: 'F', x: -0.65, y: 1.12, z: 0 },
      { elem: 'F', x: -0.65, y: -1.12, z: 0 },
    ],
    hasLonePairs: false,
    hasTetrahedron: true,
  },
  BCL3: {
    name: "Trichlorure de bore (BCl3)",
    atomList: [
      { elem: 'B', x: 0, y: 0, z: 0 },
      { elem: 'Cl', x: 1.74, y: 0, z: 0 },
      { elem: 'Cl', x: -0.87, y: 1.5, z: 0 },
      { elem: 'Cl', x: -0.87, y: -1.5, z: 0 },
    ],
    hasLonePairs: false,
    hasTetrahedron: true,
  },
  SO3: {
    name: "Trioxyde de soufre (SO3)",
    atomList: [
      { elem: 'S', x: 0, y: 0, z: 0 },
      { elem: 'O', x: 1.42, y: 0, z: 0 },
      { elem: 'O', x: -0.71, y: 1.23, z: 0 },
      { elem: 'O', x: -0.71, y: -1.23, z: 0 },
    ],
    hasLonePairs: false,
    hasTetrahedron: true,
  },
  CH2O: {
    name: "Méthanal (Formaldéhyde)",
    atomList: [
      { elem: 'C', x: 0, y: 0, z: 0 },
      { elem: 'O', x: 1.2, y: 0, z: 0 },
      { elem: 'H', x: -0.6, y: 0.94, z: 0 },
      { elem: 'H', x: -0.6, y: -0.94, z: 0 },
    ],
    hasLonePairs: true, // O a des doublets
    hasTetrahedron: true,
    lonePairs: [
      { x: 1.8, y: 0.5, z: 0 },
      { x: 1.8, y: -0.5, z: 0 }
    ]
  },

  // --- AX2E1 (Coudée 120°) ---
  SO2: {
    name: "Dioxyde de soufre (SO2)",
    atomList: [
      { elem: 'S', x: 0, y: 0, z: 0 },
      { elem: 'O', x: 1.23, y: -0.72, z: 0 },
      { elem: 'O', x: -1.23, y: -0.72, z: 0 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    lonePairs: [{ x: 0, y: 1.2, z: 0 }]
  },
  O3: {
    name: "Ozone (O3)",
    atomList: [
      { elem: 'O', x: 0, y: 0, z: 0 },
      { elem: 'O', x: 1.1, y: -0.5, z: 0 },
      { elem: 'O', x: -1.1, y: -0.5, z: 0 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    lonePairs: [{ x: 0, y: 1.0, z: 0 }]
  },

  // --- AX4 (Tétraédrique) ---
  CH4: {
    name: "Méthane (CH4)",
    atomList: [
      { elem: 'C', x: 0, y: 0, z: 0 },
      { elem: 'H', x: 0.63, y: 0.63, z: 0.63 },
      { elem: 'H', x: -0.63, y: -0.63, z: 0.63 },
      { elem: 'H', x: -0.63, y: 0.63, z: -0.63 },
      { elem: 'H', x: 0.63, y: -0.63, z: -0.63 },
    ],
    hasLonePairs: false,
    hasTetrahedron: true,
  },
  CH2CL2: {
    name: "Dichlorométhane (CH2Cl2)",
    atomList: [
      { elem: 'C', x: 0, y: 0, z: 0 },
      // 2 Hydrogènes
      { elem: 'H', x: 0.63, y: 0.63, z: 0.63 },
      { elem: 'H', x: -0.63, y: -0.63, z: 0.63 },
      // 2 Chlores (plus gros, liaisons plus longues)
      { elem: 'Cl', x: 1.0, y: -1.0, z: -1.0 },
      { elem: 'Cl', x: -1.0, y: 1.0, z: -1.0 },
    ],
    hasLonePairs: false, // On ignore les doublets du Cl en général en VSEPR autour du C
    hasTetrahedron: true,
  },
  CCL4: {
    name: "Tétrachlorométhane (CCl4)",
    atomList: [
      { elem: 'C', x: 0, y: 0, z: 0 },
      { elem: 'Cl', x: 1.0, y: 1.0, z: 1.0 },
      { elem: 'Cl', x: -1.0, y: -1.0, z: 1.0 },
      { elem: 'Cl', x: -1.0, y: 1.0, z: -1.0 },
      { elem: 'Cl', x: 1.0, y: -1.0, z: -1.0 },
    ],
    hasLonePairs: false,
    hasTetrahedron: true,
  },
  SIH4: {
    name: "Silane (SiH4)",
    atomList: [
      { elem: 'Si', x: 0, y: 0, z: 0 },
      { elem: 'H', x: 0.86, y: 0.86, z: 0.86 },
      { elem: 'H', x: -0.86, y: -0.86, z: 0.86 },
      { elem: 'H', x: -0.86, y: 0.86, z: -0.86 },
      { elem: 'H', x: 0.86, y: -0.86, z: -0.86 },
    ],
    hasLonePairs: false,
    hasTetrahedron: true,
  },
  "NH4+": {
    name: "Ammonium (NH4+)",
    atomList: [
      { elem: 'N', x: 0, y: 0, z: 0 },
      { elem: 'H', x: 0.6, y: 0.6, z: 0.6 },
      { elem: 'H', x: -0.6, y: -0.6, z: 0.6 },
      { elem: 'H', x: -0.6, y: 0.6, z: -0.6 },
      { elem: 'H', x: 0.6, y: -0.6, z: -0.6 },
    ],
    hasLonePairs: false,
    hasTetrahedron: true,
  },

  // --- AX3E1 (Pyramidale trigonale) ---
  NH3: {
    name: "Ammoniac (NH3)",
    atomList: [
      { elem: 'N', x: 0, y: 0, z: 0 },
      { elem: 'H', x: 0, y: 0.94, z: -0.38 },
      { elem: 'H', x: -0.81, y: -0.47, z: -0.38 },
      { elem: 'H', x: 0.81, y: -0.47, z: -0.38 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    lonePairs: [{ x: 0, y: 0, z: 1.0 }]
  },
  PH3: {
    name: "Phosphine (PH3)",
    atomList: [
      { elem: 'P', x: 0, y: 0, z: 0 },
      { elem: 'H', x: 0, y: 1.1, z: -0.6 },
      { elem: 'H', x: -0.95, y: -0.55, z: -0.6 },
      { elem: 'H', x: 0.95, y: -0.55, z: -0.6 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    lonePairs: [{ x: 0, y: 0, z: 1.2 }]
  },
  NF3: {
    name: "Trifluorure d'azote (NF3)",
    atomList: [
      { elem: 'N', x: 0, y: 0, z: 0 },
      { elem: 'F', x: 0, y: 1.15, z: -0.4 },
      { elem: 'F', x: -1.0, y: -0.57, z: -0.4 },
      { elem: 'F', x: 1.0, y: -0.57, z: -0.4 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    lonePairs: [{ x: 0, y: 0, z: 1.0 }]
  },
  "H3O+": {
    name: "Hydronium (H3O+)",
    atomList: [
      { elem: 'O', x: 0, y: 0, z: 0 },
      { elem: 'H', x: 0, y: 0.9, z: -0.3 },
      { elem: 'H', x: -0.78, y: -0.45, z: -0.3 },
      { elem: 'H', x: 0.78, y: -0.45, z: -0.3 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    lonePairs: [{ x: 0, y: 0, z: 0.8 }]
  },

  // --- AX2E2 (Coudée 109°) ---
  H2O: {
    name: "Eau (H2O)",
    atomList: [
      { elem: 'O', x: 0, y: 0, z: 0 },
      { elem: 'H', x: 0.76, y: 0.59, z: 0 },
      { elem: 'H', x: -0.76, y: 0.59, z: 0 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    lonePairs: [
      { x: 0, y: -0.6, z: 0.8 },
      { x: 0, y: -0.6, z: -0.8 }
    ]
  },
  ETHANOL: {
    name: "Éthanol (CH3CH2OH)",
    atomList: [
      { elem: 'C', x: -1.22, y: 0.0, z: 0.0 }, // C1 (Methyl)
      { elem: 'C', x: 0.0, y: 0.0, z: 0.0 },   // C2 (Methylene)
      { elem: 'O', x: 1.43, y: 0.0, z: 0.0 },  // O
      // H's on C1
      { elem: 'H', x: -1.67, y: 1.02, z: 0.0 },
      { elem: 'H', x: -1.67, y: -0.51, z: 0.88 },
      { elem: 'H', x: -1.67, y: -0.51, z: -0.88 },
      // H's on C2 (Correction: CH2 a 2 H, pas 3)
      { elem: 'H', x: 0.49, y: -0.51, z: 0.88 },
      { elem: 'H', x: 0.49, y: -0.51, z: -0.88 },
      // H on O (Correction: Coudé, pas linéaire)
      { elem: 'H', x: 1.80, y: 0.80, z: 0.0 }, 
    ],
    hasLonePairs: true,
    hasTetrahedron: true, // Géométrie autour de O est tétraédrique
    // Doublets orientés pour former le tétraèdre avec C-O et O-H
    lonePairs: [
      { x: 1.6, y: -0.4, z: 0.8 },
      { x: 1.6, y: -0.4, z: -0.8 }
    ]
  },
  H2S: {
    name: "Sulfure d'hydrogène (H2S)",
    atomList: [
      { elem: 'S', x: 0, y: 0, z: 0 },
      { elem: 'H', x: 0.95, y: 0.7, z: 0 },
      { elem: 'H', x: -0.95, y: 0.7, z: 0 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    lonePairs: [
      { x: 0, y: -0.7, z: 0.9 },
      { x: 0, y: -0.7, z: -0.9 }
    ]
  },
  OF2: {
    name: "Difluorure d'oxygène (OF2)",
    atomList: [
      { elem: 'O', x: 0, y: 0, z: 0 },
      { elem: 'F', x: 1.1, y: 0.8, z: 0 },
      { elem: 'F', x: -1.1, y: 0.8, z: 0 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    lonePairs: [
      { x: 0, y: -0.6, z: 0.8 },
      { x: 0, y: -0.6, z: -0.8 }
    ]
  },
  SCL2: {
    name: "Dichlorure de soufre (SCl2)",
    atomList: [
      { elem: 'S', x: 0, y: 0, z: 0 },
      { elem: 'Cl', x: 1.4, y: 1.0, z: 0 },
      { elem: 'Cl', x: -1.4, y: 1.0, z: 0 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    lonePairs: [
      { x: 0, y: -0.8, z: 1.0 },
      { x: 0, y: -0.8, z: -1.0 }
    ]
  },

  // --- AX5 (Bipyramide trigonale) ---
  PCL5: {
    name: "Pentachlorure de phosphore (PCl5)",
    atomList: [
      { elem: 'P', x: 0, y: 0, z: 0 },
      { elem: 'Cl', x: 0, y: 0, z: 2.1 }, // Axial
      { elem: 'Cl', x: 0, y: 0, z: -2.1 }, // Axial
      { elem: 'Cl', x: 2.0, y: 0, z: 0 }, // Équatorial
      { elem: 'Cl', x: -1.0, y: 1.73, z: 0 }, // Équatorial
      { elem: 'Cl', x: -1.0, y: -1.73, z: 0 }, // Équatorial
    ],
    hasLonePairs: false,
    hasTetrahedron: true,
  },
  PF5: {
    name: "Pentafluorure de phosphore (PF5)",
    atomList: [
      { elem: 'P', x: 0, y: 0, z: 0 },
      { elem: 'F', x: 0, y: 0, z: 1.58 },
      { elem: 'F', x: 0, y: 0, z: -1.58 },
      { elem: 'F', x: 1.54, y: 0, z: 0 },
      { elem: 'F', x: -0.77, y: 1.33, z: 0 },
      { elem: 'F', x: -0.77, y: -1.33, z: 0 },
    ],
    hasLonePairs: false,
    hasTetrahedron: true,
  },
  ASF5: {
    name: "Pentafluorure d'arsenic (AsF5)",
    atomList: [
      { elem: 'As', x: 0, y: 0, z: 0 },
      { elem: 'F', x: 0, y: 0, z: 1.7 },
      { elem: 'F', x: 0, y: 0, z: -1.7 },
      { elem: 'F', x: 1.6, y: 0, z: 0 },
      { elem: 'F', x: -0.8, y: 1.4, z: 0 },
      { elem: 'F', x: -0.8, y: -1.4, z: 0 },
    ],
    hasLonePairs: false,
    hasTetrahedron: true,
  },

  // --- AX4E1 (Bascule / Tape-cul) ---
  SF4: {
    name: "Tétrafluorure de soufre (SF4)",
    atomList: [
      { elem: 'S', x: 0, y: 0, z: 0 },
      { elem: 'F', x: 0, y: 0, z: 1.6 }, // Axial
      { elem: 'F', x: 0, y: 0, z: -1.6 }, // Axial
      { elem: 'F', x: -1.5, y: 0.5, z: 0 }, // Équatorial distordu
      { elem: 'F', x: -1.5, y: -0.5, z: 0 }, // Équatorial distordu
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    // Doublet en position équatoriale (ici sur +X pour visualiser)
    lonePairs: [{ x: 1.5, y: 0, z: 0 }]
  },
  TECL4: {
    name: "Tétrachlorure de tellure (TeCl4)",
    atomList: [
      { elem: 'Te', x: 0, y: 0, z: 0 },
      { elem: 'Cl', x: 0, y: 0, z: 2.3 },
      { elem: 'Cl', x: 0, y: 0, z: -2.3 },
      { elem: 'Cl', x: -2.1, y: 0.7, z: 0 },
      { elem: 'Cl', x: -2.1, y: -0.7, z: 0 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    lonePairs: [{ x: 2.0, y: 0, z: 0 }]
  },

  // --- AX3E2 (Forme en T) ---
  CLF3: {
    name: "Trifluorure de chlore (ClF3)",
    atomList: [
      { elem: 'Cl', x: 0, y: 0, z: 0 },
      { elem: 'F', x: 0, y: 0, z: 1.6 }, // Axial
      { elem: 'F', x: 0, y: 0, z: -1.6 }, // Axial
      { elem: 'F', x: -1.6, y: 0, z: 0 }, // Équatorial
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    // 2 doublets en positions équatoriales
    lonePairs: [
      { x: 1.4, y: 1.0, z: 0 },
      { x: 1.4, y: -1.0, z: 0 }
    ]
  },
  BRF3: {
    name: "Trifluorure de brome (BrF3)",
    atomList: [
      { elem: 'Br', x: 0, y: 0, z: 0 },
      { elem: 'F', x: 0, y: 0, z: 1.7 },
      { elem: 'F', x: 0, y: 0, z: -1.7 },
      { elem: 'F', x: -1.7, y: 0, z: 0 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    lonePairs: [
      { x: 1.5, y: 1.1, z: 0 },
      { x: 1.5, y: -1.1, z: 0 }
    ]
  },

  // --- AX2E3 (Linéaire) ---
  XEF2: {
    name: "Difluorure de xénon (XeF2)",
    atomList: [
      { elem: 'Xe', x: 0, y: 0, z: 0 },
      { elem: 'F', x: 0, y: 0, z: 2.0 },
      { elem: 'F', x: 0, y: 0, z: -2.0 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    // 3 doublets formant un triangle équatorial
    lonePairs: [
      { x: 2.0, y: 0, z: 0 },
      { x: -1.0, y: 1.73, z: 0 },
      { x: -1.0, y: -1.73, z: 0 }
    ]
  },
  "I3-": {
    name: "Ion triiodure (I3-)",
    atomList: [
      { elem: 'I', x: 0, y: 0, z: 0 },
      { elem: 'I', x: 0, y: 0, z: 2.9 },
      { elem: 'I', x: 0, y: 0, z: -2.9 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    lonePairs: [
      { x: 2.5, y: 0, z: 0 },
      { x: -1.25, y: 2.1, z: 0 },
      { x: -1.25, y: -2.1, z: 0 }
    ]
  },

  // --- AX6 (Octaédrique) ---
  SF6: {
    name: "Hexafluorure de soufre (SF6)",
    atomList: [
      { elem: 'S', x: 0, y: 0, z: 0 },
      { elem: 'F', x: 1.6, y: 0, z: 0 },
      { elem: 'F', x: -1.6, y: 0, z: 0 },
      { elem: 'F', x: 0, y: 1.6, z: 0 },
      { elem: 'F', x: 0, y: -1.6, z: 0 },
      { elem: 'F', x: 0, y: 0, z: 1.6 },
      { elem: 'F', x: 0, y: 0, z: -1.6 },
    ],
    hasLonePairs: false,
    hasTetrahedron: true,
  },
  SEF6: {
    name: "Hexafluorure de sélénium (SeF6)",
    atomList: [
      { elem: 'Se', x: 0, y: 0, z: 0 },
      { elem: 'F', x: 1.7, y: 0, z: 0 },
      { elem: 'F', x: -1.7, y: 0, z: 0 },
      { elem: 'F', x: 0, y: 1.7, z: 0 },
      { elem: 'F', x: 0, y: -1.7, z: 0 },
      { elem: 'F', x: 0, y: 0, z: 1.7 },
      { elem: 'F', x: 0, y: 0, z: -1.7 },
    ],
    hasLonePairs: false,
    hasTetrahedron: true,
  },

  // --- AX5E1 (Pyramide à base carrée) ---
  BRF5: {
    name: "Pentafluorure de brome (BrF5)",
    atomList: [
      { elem: 'Br', x: 0, y: 0, z: 0 },
      { elem: 'F', x: 0, y: 0, z: 1.8 }, // Sommet
      { elem: 'F', x: 1.8, y: 0, z: 0 }, // Base
      { elem: 'F', x: -1.8, y: 0, z: 0 }, // Base
      { elem: 'F', x: 0, y: 1.8, z: 0 }, // Base
      { elem: 'F', x: 0, y: -1.8, z: 0 }, // Base
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    // Doublet à l'opposé du sommet
    lonePairs: [{ x: 0, y: 0, z: -1.8 }]
  },
  IF5: {
    name: "Pentafluorure d'iode (IF5)",
    atomList: [
      { elem: 'I', x: 0, y: 0, z: 0 },
      { elem: 'F', x: 0, y: 0, z: 1.9 },
      { elem: 'F', x: 1.9, y: 0, z: 0 },
      { elem: 'F', x: -1.9, y: 0, z: 0 },
      { elem: 'F', x: 0, y: 1.9, z: 0 },
      { elem: 'F', x: 0, y: -1.9, z: 0 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    lonePairs: [{ x: 0, y: 0, z: -2.0 }]
  },

  // --- AX4E2 (Plan carré) ---
  XEF4: {
    name: "Tétrafluorure de xénon (XeF4)",
    atomList: [
      { elem: 'Xe', x: 0, y: 0, z: 0 },
      { elem: 'F', x: 1.95, y: 0, z: 0 },
      { elem: 'F', x: -1.95, y: 0, z: 0 },
      { elem: 'F', x: 0, y: 1.95, z: 0 },
      { elem: 'F', x: 0, y: -1.95, z: 0 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    // 2 doublets opposés (axial)
    lonePairs: [
      { x: 0, y: 0, z: 2.0 },
      { x: 0, y: 0, z: -2.0 }
    ]
  },
  "ICL4-": {
    name: "Ion tétrachloroiodate (ICl4-)",
    atomList: [
      { elem: 'I', x: 0, y: 0, z: 0 },
      { elem: 'Cl', x: 2.5, y: 0, z: 0 },
      { elem: 'Cl', x: -2.5, y: 0, z: 0 },
      { elem: 'Cl', x: 0, y: 2.5, z: 0 },
      { elem: 'Cl', x: 0, y: -2.5, z: 0 },
    ],
    hasLonePairs: true,
    hasTetrahedron: true,
    lonePairs: [
      { x: 0, y: 0, z: 2.2 },
      { x: 0, y: 0, z: -2.2 }
    ]
  },
  CUCL: {
    name: "Chlorure de cuivre (I) (CuCl)",
    atomList: [
      { elem: 'Cu', x: 0, y: 0, z: 0 },
      { elem: 'Cl', x: 2.05, y: 0, z: 0 },
    ],
    hasLonePairs: false,
    hasTetrahedron: true, // Montre la liaison
  },
  C12H22O11: {
    name: "Saccharose (Sucre de table)",
    atomList: [
      // Glucose Ring (Chair)
      { elem: 'C', x: -2.333, y: 0.198, z: -0.554 }, // C1
      { elem: 'C', x: -2.709, y: 1.637, z: -0.193 }, // C2
      { elem: 'C', x: -4.219, y: 1.838, z: -0.323 }, // C3
      { elem: 'C', x: -4.956, y: 0.828, z: 0.569 },  // C4
      { elem: 'C', x: -4.568, y: -0.615, z: 0.231 }, // C5
      { elem: 'O', x: -3.155, y: -0.730, z: 0.457 }, // O5 (Ring)
      { elem: 'C', x: -5.319, y: -1.603, z: 1.157 }, // C6
      { elem: 'O', x: -4.831, y: -2.923, z: 0.957 }, // O6
      { elem: 'O', x: -2.080, y: 2.457, z: -1.164 }, // O2
      { elem: 'O', x: -4.686, y: 1.655, z: -1.666 }, // O3
      { elem: 'O', x: -6.368, y: 1.042, z: 0.449 },  // O4

      // Linkage
      { elem: 'O', x: -0.923, y: -0.063, z: -0.490 }, // O1 (Bridge)

      // Fructose Ring (Envelope)
      { elem: 'C', x: 0.000, y: 0.000, z: 0.589 },   // C2'
      { elem: 'O', x: 0.359, y: 1.341, z: 0.884 },   // O2' (Ring)
      { elem: 'C', x: 1.764, y: 1.399, z: 1.109 },   // C5'
      { elem: 'C', x: 2.227, y: 0.055, z: 1.650 },   // C4'
      { elem: 'C', x: 1.343, y: -0.920, z: 0.835 },  // C3'
      { elem: 'C', x: -0.222, y: -0.803, z: 1.862 }, // C1'
      { elem: 'O', x: -1.488, y: -0.619, z: 2.483 }, // O1'
      { elem: 'C', x: 2.378, y: 2.684, z: 1.652 },   // C6'
      { elem: 'O', x: 3.791, y: 2.658, z: 1.480 },   // O6'
      { elem: 'O', x: 1.464, y: -2.234, z: 1.353 },  // O3'
      { elem: 'O', x: 3.619, y: -0.158, z: 1.516 },  // O4'
      
      // Hydrogen approximations for visual completeness
      { elem: 'H', x: -2.573, y: 0.038, z: -1.610 },
      { elem: 'H', x: -2.275, y: 1.968, z: 0.751 },
      { elem: 'H', x: -4.432, y: 2.871, z: -0.016 },
      { elem: 'H', x: -4.721, y: 0.963, z: 1.624 },
      { elem: 'H', x: -4.757, y: -0.806, z: -0.830 },
      { elem: 'H', x: -5.113, y: -1.365, z: 2.203 },
      { elem: 'H', x: -6.402, y: -1.474, z: 1.009 },
      { elem: 'H', x: -5.399, y: -3.468, z: 1.503 }, // HO6

      { elem: 'H', x: 1.849, y: 1.258, z: 0.027 },
      { elem: 'H', x: 2.029, y: 0.037, z: 2.726 },
      { elem: 'H', x: 1.666, y: -0.806, z: -0.211 },
      { elem: 'H', x: 0.548, y: -0.592, z: 2.613 },
      { elem: 'H', x: -0.068, y: -1.839, z: 1.547 },
      { elem: 'H', x: -1.465, y: -1.037, z: 3.351 }, // HO1'
      { elem: 'H', x: 1.942, y: 3.525, z: 1.104 },
      { elem: 'H', x: 2.164, y: 2.822, z: 2.721 },
      { elem: 'H', x: 4.145, y: 3.486, z: 1.817 }, // HO6'
    ],
    hasLonePairs: true,
    hasTetrahedron: false,
    lonePairs: [
       { x: -0.9, y: 0.0, z: 0.5 },
       { x: -0.9, y: 0.0, z: -1.5 }
    ]
  },
  C7H6O: { 
    name: "Benzaldéhyde (C7H6O)",
    atomList: [
      // Hexagonal Ring
      { elem: 'C', x: 0.0, y: 0.0, z: 0.0 }, // C1
      { elem: 'C', x: 1.4, y: 0.0, z: 0.0 }, // C2
      { elem: 'C', x: 2.1, y: 1.21, z: 0.0 }, // C3
      { elem: 'C', x: 1.4, y: 2.42, z: 0.0 }, // C4
      { elem: 'C', x: 0.0, y: 2.42, z: 0.0 }, // C5
      { elem: 'C', x: -0.7, y: 1.21, z: 0.0 }, // C6
      // Aldehyde Group attached to C6
      { elem: 'C', x: -2.2, y: 1.21, z: 0.0 }, // Carbonyl C
      { elem: 'O', x: -2.9, y: 1.8, z: 0.0 },  // Carbonyl O
      { elem: 'H', x: -2.7, y: 0.3, z: 0.0 },  // Aldehyde H
      // Ring Hydrogens
      { elem: 'H', x: -0.5, y: -0.9, z: 0.0 }, // H on C1
      { elem: 'H', x: 1.9, y: -0.9, z: 0.0 },  // H on C2
      { elem: 'H', x: 3.2, y: 1.21, z: 0.0 },  // H on C3
      { elem: 'H', x: 1.9, y: 3.3, z: 0.0 },   // H on C4
      { elem: 'H', x: -0.5, y: 3.3, z: 0.0 },  // H on C5
    ],
    hasLonePairs: true,
    hasTetrahedron: false, // Planar
    lonePairs: [
      { x: -2.9, y: 1.8, z: 0.8 }, // Lone pair 1 (sticks up)
      { x: -2.9, y: 1.8, z: -0.8 } // Lone pair 2 (sticks down)
    ]
  }
};

const generateXYZ = (formula: string, atoms: Atom3D[]): string => {
  const lines = [atoms.length.toString(), formula];
  atoms.forEach(atom => {
    lines.push(`${atom.elem} ${atom.x.toFixed(4)} ${atom.y.toFixed(4)} ${atom.z.toFixed(4)}`);
  });
  return lines.join('\n');
};

let mol3dLoadPromise: Promise<void> | null = null;

const load3Dmol = (): Promise<void> => {
  if (mol3dLoadPromise) return mol3dLoadPromise;
  if ((window as any).$3Dmol) return Promise.resolve();

  mol3dLoadPromise = new Promise((resolve) => {
    if (document.getElementById('3dmol-script')) {
      const check = setInterval(() => {
        if ((window as any).$3Dmol) { clearInterval(check); resolve(); }
      }, 50);
      return;
    }
    const script = document.createElement('script');
    script.id = '3dmol-script';
    script.src = 'https://3Dmol.org/build/3Dmol-min.js';
    script.async = true;
    script.onload = () => {
      const check = setInterval(() => {
        if ((window as any).$3Dmol) { clearInterval(check); resolve(); }
      }, 50);
    };
    document.head.appendChild(script);
  });
  return mol3dLoadPromise;
};

export function Molecule3DmolVSEPREmbed({ 
  formula = 'CH2CL2', // Default changed to CH2Cl2
  height = '400px',
  credits,
  controls = true
}: Molecule3DmolVSEPREmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('ballstick');
  const [labelSize, setLabelSize] = useState<LabelSize>('off');
  const [showLonePairs, setShowLonePairs] = useState(false);
  const [showGeometry, setShowGeometry] = useState(false);

  const config = MOLECULES[formula.toUpperCase()];

  const applyDisplayStyle = useCallback(() => {
    if (!viewerRef.current) return;
    const viewer = viewerRef.current;

    switch (displayMode) {
      case 'spacefill':
        viewer.setStyle({}, { sphere: { scale: 1.0 } });
        break;
      case 'ballstick':
        viewer.setStyle({}, { stick: { radius: 0.15 }, sphere: { scale: 0.3 } });
        break;
      case 'ball':
        viewer.setStyle({}, { sphere: { scale: 0.5 } });
        break;
      case 'stick':
        viewer.setStyle({}, { stick: { radius: 0.2 } });
        break;
      case 'lines':
        viewer.setStyle({}, { line: {} });
        break;
      case 'off':
        viewer.setStyle({}, {});
        break;
    }
  }, [displayMode]);

  const applyLabels = useCallback(() => {
    if (!viewerRef.current || !config) return;
    const viewer = viewerRef.current;

    viewer.removeAllLabels();

    if (labelSize !== 'off') {
      const fontSize = { S: 10, M: 14, L: 18, XL: 24, XXL: 32 }[labelSize];
      
      config.atomList.forEach((atom) => {
        viewer.addLabel(atom.elem, {
          position: { x: atom.x, y: atom.y, z: atom.z },
          backgroundColor: 'rgba(0,0,0,0.6)',
          fontColor: 'white',
          fontSize: fontSize,
          borderThickness: 0,
          borderRadius: 2,
          inFront: true,
        });
      });
    }
  }, [labelSize, config]);

  const applyShapes = useCallback(() => {
    if (!viewerRef.current || !config) return;
    const viewer = viewerRef.current;
    
    // 1. Nettoyage complet
    viewer.removeAllShapes();

    // Pour l'éthanol, l'atome central "VSEPR" est l'oxygène (index 2 dans la liste).
    // Mais pour les autres, c'est souvent l'index 0.
    // Hack propre : on cherche l'atome qui a les LPs associés. 
    // Ici, config.lonePairs est défini par rapport aux coordonnées absolues, donc on peut dessiner direct.
    // MAIS pour les lignes "geometry", il faut savoir d'où elles partent.
    // Convention : Pour Ethanol, l'atome "central" pour les lobes est l'Oxygène.
    let centralAtom = config.atomList[0];
    if (config.name.includes("Éthanol")) {
        centralAtom = config.atomList.find(a => a.elem === 'O') || config.atomList[0];
    } else if (config.name.includes("Saccharose")) {
        // Pour le saccharose, on dessine juste les lobes sans tige depuis un atome central unique
        // car il n'y a pas un seul atome central pour toute la molécule.
        centralAtom = { elem: 'O', x: 0, y: 0, z: 0 }; // Dummy
    } else if (config.name.includes("Benzaldéhyde")) {
        // Pour le benzaldéhyde, les doublets sont sur l'oxygène
        centralAtom = config.atomList.find(a => a.elem === 'O') || config.atomList[0];
    }

    // --- CONSTRUCTION DES LOBES (DOUBLETS NON-LIANTS) ---
    if (showLonePairs && config.lonePairs) {
      const lobeColor = '#87CEEB'; // Bleu ciel
      const lobeAlpha = 0.5;

      config.lonePairs.forEach((lp) => {
        // Logique spéciale pour les grosses molécules comme le saccharose
        // Si c'est le saccharose, on ne dessine que la sphère "nuage" pour éviter des tiges bizarres
        // traversant toute la molécule si l'atome central n'est pas le bon.
        const isMacromolecule = config.name.includes("Saccharose");

        if (!isMacromolecule) {
            const start = { x: centralAtom.x, y: centralAtom.y, z: centralAtom.z };
            const end = { x: lp.x, y: lp.y, z: lp.z };

            // A. La Base (Cylindre évasé)
            viewer.addCylinder({
            start: start,
            end: {
                x: start.x + (end.x - start.x) * 0.4,
                y: start.y + (end.y - start.y) * 0.4,
                z: start.z + (end.z - start.z) * 0.4
            },
            radius: 0.25,
            color: lobeColor,
            alpha: lobeAlpha,
            clickable: false,
            });

            // B. Le Corps de l'ampoule (Sphères superposées)
            viewer.addSphere({
            center: { 
                x: start.x + (end.x - start.x) * 0.35,
                y: start.y + (end.y - start.y) * 0.35,
                z: start.z + (end.z - start.z) * 0.35
            },
            radius: 0.35,
            color: lobeColor,
            alpha: lobeAlpha,
            clickable: false,
            });

            viewer.addSphere({
            center: { 
                x: start.x + (end.x - start.x) * 0.65,
                y: start.y + (end.y - start.y) * 0.65,
                z: start.z + (end.z - start.z) * 0.65
            },
            radius: 0.50,
            color: lobeColor,
            alpha: lobeAlpha,
            clickable: false,
            });
             
            viewer.addSphere({
                center: end,
                radius: 0.65,
                color: lobeColor,
                alpha: lobeAlpha,
                clickable: false,
            });
        } else {
             // Pour Saccharose, juste une sphère simple pour marquer les doublets
             viewer.addSphere({
                center: { x: lp.x, y: lp.y, z: lp.z },
                radius: 0.4,
                color: lobeColor,
                alpha: 0.7,
                clickable: false,
            });
        }
      });
    }

    // --- GÉOMÉTRIE (MESH) ---
    // Connecte tous les atomes externes + doublets pour former le polyèdre VSEPR
    if (showGeometry && config.hasTetrahedron) {
      // Pour l'éthanol, on veut voir la géométrie autour de l'Oxygène uniquement
      let connectedAtoms: Atom3D[] = [];
      
      if (config.name.includes("Éthanol")) {
        // Pour l'éthanol, voisins de O sont C2 et H(O)
        // C2 est à (0,0,0) -> index 1
        // H(O) est le dernier de la liste -> index 8
        const c2 = config.atomList[1]; 
        const hOnO = config.atomList[config.atomList.length - 1];
        connectedAtoms = [c2, hOnO];
      } else {
         // Cas général : Atome 0 est central, les autres sont autour
         connectedAtoms = config.atomList.slice(1);
      }
      
      const vertices: {x:number, y:number, z:number}[] = [...connectedAtoms];
      if (showLonePairs && config.lonePairs) {
        config.lonePairs.forEach(lp => vertices.push(lp));
      }
      
      if (vertices.length >= 2) { // Au moins 2 points pour faire des lignes (ou 1 ligne entre 2 pts)
        // 1. Rayons (Centre -> Sommets)
        vertices.forEach((vertex) => {
          viewer.addCylinder({
            start: { x: centralAtom.x, y: centralAtom.y, z: centralAtom.z },
            end: { x: vertex.x, y: vertex.y, z: vertex.z },
            radius: 0.03,
            color: '#FF8C00', // Orange foncé
            alpha: 1.0,
            clickable: false,
            dashed: true,
          });
        });
        
        // 2. Arêtes (Sommet -> Sommet)
        // Pour l'éthanol (et H2O), cela dessine le tétraèdre des LPs et liaisons
        for (let i = 0; i < vertices.length; i++) {
          for (let j = i + 1; j < vertices.length; j++) {
            viewer.addCylinder({
              start: { x: vertices[i].x, y: vertices[i].y, z: vertices[i].z },
              end: { x: vertices[j].x, y: vertices[j].y, z: vertices[j].z },
              radius: 0.03,
              color: '#FFA500', 
              alpha: 0.8,
              clickable: false,
            });
          }
        }
      }
    }
    
    viewer.render();
  }, [config, showLonePairs, showGeometry]);

  const renderMolecule = useCallback(() => {
    if (!viewerRef.current || !config) return;
    applyDisplayStyle();
    applyLabels();
    applyShapes();
    viewerRef.current.render();
  }, [applyDisplayStyle, applyLabels, applyShapes]);

  useEffect(() => {
    if (!config) { setIsLoading(false); return; }
    let isMounted = true;

    const init = async () => {
      await load3Dmol();
      if (!isMounted || !containerRef.current) return;

      const $3Dmol = (window as any).$3Dmol;
      if (!$3Dmol) { setIsLoading(false); return; }

      try {
        const viewer = $3Dmol.createViewer(containerRef.current, {
          backgroundColor: 'white',
          defaultcolors: $3Dmol.rasmolElementColors,
        });
        
        if (!viewer) throw new Error('Failed to create viewer');
        
        viewerRef.current = viewer;

        const xyz = generateXYZ(formula, config.atomList);
        viewer.addModel(xyz, 'xyz');
        viewer.zoomTo();
        
        setIsLoading(false);
        renderMolecule();
        
      } catch (e) {
        console.error('3Dmol error:', e);
        setIsLoading(false);
      }
    };

    init();
    return () => { isMounted = false; };
  }, [formula, config, renderMolecule]);

  useEffect(() => {
    if (viewerRef.current && !isLoading) {
      renderMolecule();
    }
  }, [displayMode, labelSize, showLonePairs, showGeometry, isLoading, renderMolecule]);

  if (!config) {
    return (
      <div className="w-full rounded-lg bg-red-50 text-red-600 text-sm p-4" style={{ height }}>
        Molécule "{formula}" non disponible. Essayer: H2O, CO2, ETHANOL, NH3, CH4, C12H22O11, C7H6O...
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: controls ? 'auto' : height }}>
      <div className="relative bg-white" style={{ height: controls ? height : '100%' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
        {credits && !controls && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white/90 px-2 py-1 rounded">
            {credits}
          </div>
        )}
      </div>

      {controls && (
        <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 space-y-2">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs font-medium text-gray-600 mr-1">Display:</span>
            {(['spacefill', 'ballstick', 'ball', 'stick', 'lines', 'off'] as DisplayMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setDisplayMode(mode)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  displayMode === mode 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {mode === 'ballstick' ? 'Ball&Stick' : mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs font-medium text-gray-600 mr-1">
              <Type className="w-3 h-3 inline mr-1" />
              Labels:
            </span>
            {(['S', 'M', 'L', 'XL', 'XXL', 'off'] as LabelSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setLabelSize(size)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  labelSize === size 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {config.hasLonePairs && (
              <label className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                <input
                  type="checkbox"
                  checked={showLonePairs}
                  onChange={(e) => setShowLonePairs(e.target.checked)}
                  className="w-4 h-4 text-sky-500 rounded focus:ring-sky-500"
                />
                <span className="text-xs text-gray-700 font-medium">Lone Pairs</span>
              </label>
            )}
            
            {config.hasTetrahedron && (
              <label className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                <input
                  type="checkbox"
                  checked={showGeometry}
                  onChange={(e) => setShowGeometry(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                />
                <span className="text-xs text-gray-700 font-medium">Geometry</span>
              </label>
            )}

            <button
              onClick={() => {
                if (viewerRef.current) viewerRef.current.zoomTo();
                setDisplayMode('ballstick');
                setLabelSize('off');
                setShowLonePairs(false);
                setShowGeometry(false);
              }}
              className="flex items-center gap-1 px-2 py-1 bg-white text-gray-700 border border-gray-300 rounded text-xs hover:bg-gray-100 ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Molecule3DmolVSEPREmbed;