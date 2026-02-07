// ============================================================
// DONNÉES COMPLÈTES DU TABLEAU PÉRIODIQUE
// Niveau: Avancé (inspiré de elementschimiques.fr)
// ============================================================

export type ElementCategory = 
  | 'alkali-metal' 
  | 'alkaline-earth' 
  | 'transition-metal' 
  | 'post-transition-metal'
  | 'metalloid' 
  | 'nonmetal' 
  | 'halogen' 
  | 'noble-gas' 
  | 'lanthanide' 
  | 'actinide'
  | 'unknown';

export type Block = 's' | 'p' | 'd' | 'f';
export type PhysicalState = 'solid' | 'liquid' | 'gas' | 'unknown';
export type CrystalStructure = 
  | 'cubic' 
  | 'body-centered cubic'
  | 'face-centered cubic'
  | 'hexagonal'
  | 'tetragonal'
  | 'orthorhombic'
  | 'rhombohedral'
  | 'monoclinic'
  | 'triclinic'
  | 'unknown';

// Structure pour les noms dans différentes langues
export interface ElementNames {
  french: string;
  english: string;
  latin?: string;
  german?: string;
  spanish?: string;
  italian?: string;
}

// Structure pour les abondances
export interface Abundances {
  universe?: number;      // % massique
  solarSystem?: number;   // % massique
  earth?: number;         // % massique
  earthCrust?: number;    // % massique
  ocean?: number;         // mg/L
  atmosphere?: number;    // ppm
  humanBody?: number;     // mg/kg
}

// Structure pour les isotopes
export interface Isotope {
  massNumber: number;
  naturalAbundance: number;  // %
  halfLife?: string;
  decayMode?: 'stable' | 'alpha' | 'beta-' | 'beta+' | 'proton' | 'neutron' | 'fission' | 'electron capture';
}

// Structure pour les images de l'élément
export interface ElementImages {
  /** Image du matériau brut (ex: morceau de métal) */
  material?: {
    url: string;
    alt: string;
    credit?: string;
  };
  /** Images d'objets du quotidien utilisant cet élément */
  everyday?: Array<{
    url: string;
    alt: string;
    credit?: string;
  }>;
  /** Spectre d'émission (URL de l'image) */
  spectrum?: string;
  /** Structure cristalline */
  crystalStructure?: string;
}

// Interface complète de l'élément
export interface Element {
  // === IDENTIFICATION ===
  atomicNumber: number;
  symbol: string;
  names: ElementNames;
  atomicMass: number;       // u (unités atomiques de masse)
  
  // Propriétés dérivées pour compatibilité
  name: string;             // Anglais (dérivé de names.english)
  frenchName: string;       // Français (dérivé de names.french)
  
  // === CLASSIFICATION ===
  category: ElementCategory;
  group: number | undefined;
  period: number;
  block: Block;
  
  // === ÉTAT ET STRUCTURE ===
  stateAtSTP: PhysicalState;     // État à 298K, 1 atm
  crystalStructure?: CrystalStructure;
  magneticOrdering?: 'paramagnetic' | 'diamagnetic' | 'ferromagnetic' | 'antiferromagnetic' | 'unknown';
  
  // === PROPRIÉTÉS ÉLECTRONIQUES ===
  electronConfiguration: string;
  electronConfigurationShort?: string;  // [He] 2s¹
  valenceElectrons: number;
  oxidationStates: string[];            // ex: ["+1", "-1"]
  
  // Propriétés électroniques détaillées
  electronegativityPauling?: number;
  electronegativityAllredRochow?: number;
  electronegativityMulliken?: number;
  electronegativityAllen?: number;
  electronAffinity?: number;            // kJ/mol
  workFunction?: number;                // eV
  ionizationEnergies: number[];         // kJ/mol (1ère, 2ème, 3ème...)
  
  // Rayons (pm)
  atomicRadiusCalculated?: number;
  atomicRadiusEmpirical?: number;
  covalentRadius?: number;
  vanDerWaalsRadius?: number;
  ionicRadii?: Record<string, number>;  // ex: {"1+": 102}
  
  // === PROPRIÉTÉS PHYSIQUES ===
  density?: number;             // g/cm³
  molarVolume?: number;         // cm³/mol
  
  // Points de changement d'état
  meltingPoint?: number;        // K
  boilingPoint?: number;        // K
  criticalTemperature?: number; // K
  criticalPressure?: number;    // MPa
  
  // Propriétés thermiques
  heatOfFusion?: number;        // kJ/mol
  heatOfVaporization?: number;  // kJ/mol
  heatOfCombustion?: number;    // kJ/mol
  specificHeatCapacity?: number; // J/(g·K)
  thermalConductivity?: number; // W/(m·K)
  thermalExpansion?: number;    // µm/(m·K)
  
  // Propriétés mécaniques
  youngModulus?: number;        // GPa
  shearModulus?: number;        // GPa
  bulkModulus?: number;         // GPa
  mohsHardness?: number;
  vickersHardness?: number;
  brinellHardness?: number;
  
  // Propriétés optiques
  refractiveIndex?: number;
  soundSpeed?: number;          // m/s
  
  // === ABONDANCES ===
  abundances?: Abundances;
  
  // === HISTOIRE ===
  discoveredBy?: string;
  discoveredYear?: string;
  discoveryCountry?: string;
  namingOrigin?: string;
  
  // === ISOTOPES ===
  isotopes?: Isotope[];
  
  // === INFORMATIONS COMPLÉMENTAIRES ===
  description?: string;
  uses?: string[];
  biologicalRole?: string;
  
  // === MÉTADONNÉES ===
  casNumber?: string;
  
  // === IMAGES ===
  images?: ElementImages;
}

// ============================================================
// COULEURS DES CATÉGORIES
// ============================================================

export const categoryColors: Record<ElementCategory, { bg: string; text: string; border: string }> = {
  'alkali-metal': { bg: 'bg-red-200', text: 'text-red-900', border: 'border-red-300' },
  'alkaline-earth': { bg: 'bg-orange-200', text: 'text-orange-900', border: 'border-orange-300' },
  'transition-metal': { bg: 'bg-yellow-200', text: 'text-yellow-900', border: 'border-yellow-300' },
  'post-transition-metal': { bg: 'bg-lime-200', text: 'text-lime-900', border: 'border-lime-300' },
  'metalloid': { bg: 'bg-teal-200', text: 'text-teal-900', border: 'border-teal-300' },
  'nonmetal': { bg: 'bg-green-200', text: 'text-green-900', border: 'border-green-300' },
  'halogen': { bg: 'bg-cyan-200', text: 'text-cyan-900', border: 'border-cyan-300' },
  'noble-gas': { bg: 'bg-purple-200', text: 'text-purple-900', border: 'border-purple-300' },
  'lanthanide': { bg: 'bg-pink-200', text: 'text-pink-900', border: 'border-pink-300' },
  'actinide': { bg: 'bg-rose-200', text: 'text-rose-900', border: 'border-rose-300' },
  'unknown': { bg: 'bg-gray-200', text: 'text-gray-900', border: 'border-gray-300' },
};

export const categoryLabels: Record<ElementCategory, string> = {
  'alkali-metal': 'Métal alcalin',
  'alkaline-earth': 'Métal alcalino-terreux',
  'transition-metal': 'Métal de transition',
  'post-transition-metal': 'Métal pauvre',
  'metalloid': 'Métalloïde',
  'nonmetal': 'Non-métal',
  'halogen': 'Halogène',
  'noble-gas': 'Gaz noble',
  'lanthanide': 'Lanthanide',
  'actinide': 'Actinide',
  'unknown': 'Inconnu',
};

// ============================================================
// FONCTIONS UTILITAIRES
// ============================================================

export function getElementBySymbol(symbol: string): Element | undefined {
  return elements.find(e => e.symbol === symbol);
}

export function getElementByAtomicNumber(number: number): Element | undefined {
  return elements.find(e => e.atomicNumber === number);
}

export function getElementsByCategory(category: ElementCategory): Element[] {
  return elements.filter(e => e.category === category);
}

export function getElementsByPeriod(period: number): Element[] {
  return elements.filter(e => e.period === period);
}

export function getElementsByGroup(group: number): Element[] {
  return elements.filter(e => e.group === group);
}

// ============================================================
// DONNÉES DES ÉLÉMENTS - COMPLET (118 éléments)
// ============================================================

// Type pour les données d'entrée sans propriétés dérivées
type ElementInput = Omit<Element, 'name' | 'frenchName'>;

// Import des données brutes
import { elements as period1to3Raw } from './periodicTablePeriods1-3';
import { extendedElements as extendedElementsRaw } from './periodicTableExtended';
import { lanthanidesAndActinides as lanthanidesAndActinidesRaw } from './periodicTableLanthanides';

// Fonction pour enrichir les éléments avec les propriétés dérivées
function enrichElement(element: ElementInput): Element {
  return {
    ...element,
    name: element.names.english,
    frenchName: element.names.french,
  };
}

// Fusionner tous les éléments
const allRawElements: ElementInput[] = [
  ...period1to3Raw,
  ...extendedElementsRaw,
  ...lanthanidesAndActinidesRaw,
];

export const elements: Element[] = allRawElements.map(enrichElement).sort((a, b) => a.atomicNumber - b.atomicNumber);
