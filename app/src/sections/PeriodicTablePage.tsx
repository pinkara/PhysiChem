// ============================================================
// TABLEAU PÉRIODIQUE AVANCÉ - Inspiré de elementschimiques.fr
// ============================================================

import { useState, useMemo } from 'react';
import { 
  Atom, 
  Zap, 
  Thermometer, 
  Scale, 
  Info,
  Search,
  X,
  Beaker,
  Globe,
  Database,
  Flame,
  Droplets,
  Layers
} from 'lucide-react';
import { 
  elements, 
  categoryColors, 
  categoryLabels,
  type Element,
  type ElementCategory
} from '@/data/periodicTable';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ============================================================
// TYPES DE VUES ORGANISÉS PAR CATÉGORIE
// ============================================================
export type ViewMode = 
  // === GÉNÉRAL ===
  | 'category' 
  | 'block'
  | 'state'
  // === PROPRIÉTÉS ÉLECTRONIQUES ===
  | 'electronegativity-pauling'
  | 'electronegativity-allred'
  | 'electron-affinity'
  | 'ionization'
  | 'atomic-radius-calculated'
  | 'covalent-radius'
  | 'van-der-waals-radius'
  // === PROPRIÉTÉS PHYSIQUES ===
  | 'density'
  | 'molar-volume'
  | 'melting-point'
  | 'boiling-point'
  // === PROPRIÉTÉS THERMIQUES ===
  | 'heat-fusion'
  | 'heat-vaporization'
  | 'specific-heat'
  | 'thermal-conductivity'
  // === ABONDANCES ===
  | 'abundance-universe'
  | 'abundance-earth'
  | 'abundance-crust'
  | 'abundance-human';

// Définition des groupes de vues
const VIEW_GROUPS = [
  {
    category: 'Général',
    icon: Layers,
    modes: [
      { id: 'category', label: 'Familles', icon: Layers },
      { id: 'block', label: 'Blocs s/p/d/f', icon: Atom },
      { id: 'state', label: 'État (T ambiante)', icon: Droplets },
    ]
  },
  {
    category: 'Propriétés électroniques',
    icon: Zap,
    modes: [
      { id: 'electronegativity-pauling', label: 'Électronégativité (Pauling)', icon: Zap },
      { id: 'electronegativity-allred', label: 'Électronégativité (Allred)', icon: Zap },
      { id: 'electron-affinity', label: 'Affinité électronique', icon: Zap },
      { id: 'ionization', label: 'Énergie d\'ionisation', icon: Zap },
      { id: 'atomic-radius-calculated', label: 'Rayon atomique', icon: Atom },
      { id: 'covalent-radius', label: 'Rayon covalent', icon: Atom },
      { id: 'van-der-waals-radius', label: 'Rayon Van der Waals', icon: Atom },
    ]
  },
  {
    category: 'Propriétés physiques',
    icon: Scale,
    modes: [
      { id: 'density', label: 'Masse volumique', icon: Scale },
      { id: 'molar-volume', label: 'Volume molaire', icon: Database },
      { id: 'melting-point', label: 'Point de fusion', icon: Thermometer },
      { id: 'boiling-point', label: 'Point d\'ébullition', icon: Flame },
    ]
  },
  {
    category: 'Propriétés thermiques',
    icon: Flame,
    modes: [
      { id: 'heat-fusion', label: 'ΔH fusion', icon: Droplets },
      { id: 'heat-vaporization', label: 'ΔH vaporisation', icon: Flame },
      { id: 'specific-heat', label: 'Capacité thermique', icon: Thermometer },
      { id: 'thermal-conductivity', label: 'Conductivité thermique', icon: Flame },
    ]
  },
  {
    category: 'Abondances',
    icon: Globe,
    modes: [
      { id: 'abundance-universe', label: 'Abondance (Univers)', icon: Globe },
      { id: 'abundance-earth', label: 'Abondance (Terre)', icon: Globe },
      { id: 'abundance-crust', label: 'Abondance (Croûte)', icon: Database },
      { id: 'abundance-human', label: 'Abondance (Corps humain)', icon: Droplets },
    ]
  },
];

// ============================================================
// FONCTIONS DE COULEUR POUR CHAQUE MODE
// ============================================================

function getElementColorByViewMode(element: Element, viewMode: ViewMode): string {
  switch (viewMode) {
    // === GÉNÉRAL ===
    case 'category':
      return categoryColors[element.category].bg;
      
    case 'block':
      const blockColors: Record<string, string> = {
        's': 'bg-red-200',
        'p': 'bg-blue-200', 
        'd': 'bg-yellow-200',
        'f': 'bg-green-200'
      };
      return blockColors[element.block] || 'bg-gray-100';
      
    case 'state':
      const stateColors: Record<string, string> = {
        'solid': 'bg-gray-300',
        'liquid': 'bg-blue-300',
        'gas': 'bg-yellow-200',
        'unknown': 'bg-gray-100'
      };
      return stateColors[element.stateAtSTP || 'unknown'];

    // === ÉLECTRONÉGATIVITÉ PAULING ===
    case 'electronegativity-pauling':
      if (!element.electronegativityPauling) return 'bg-gray-100';
      if (element.electronegativityPauling < 0.8) return 'bg-blue-600 text-white';
      if (element.electronegativityPauling < 1.0) return 'bg-blue-500 text-white';
      if (element.electronegativityPauling < 1.2) return 'bg-blue-400';
      if (element.electronegativityPauling < 1.4) return 'bg-cyan-400';
      if (element.electronegativityPauling < 1.6) return 'bg-green-400';
      if (element.electronegativityPauling < 1.8) return 'bg-lime-400';
      if (element.electronegativityPauling < 2.0) return 'bg-yellow-400';
      if (element.electronegativityPauling < 2.2) return 'bg-amber-400';
      if (element.electronegativityPauling < 2.4) return 'bg-orange-400';
      if (element.electronegativityPauling < 2.6) return 'bg-orange-500 text-white';
      if (element.electronegativityPauling < 2.8) return 'bg-red-400 text-white';
      if (element.electronegativityPauling < 3.0) return 'bg-red-500 text-white';
      if (element.electronegativityPauling < 3.2) return 'bg-red-600 text-white';
      return 'bg-red-700 text-white';

    // === ÉLECTRONÉGATIVITÉ ALLRED ===
    case 'electronegativity-allred':
      if (!element.electronegativityAllredRochow) return 'bg-gray-100';
      if (element.electronegativityAllredRochow < 1.0) return 'bg-blue-500 text-white';
      if (element.electronegativityAllredRochow < 1.3) return 'bg-cyan-400';
      if (element.electronegativityAllredRochow < 1.6) return 'bg-green-400';
      if (element.electronegativityAllredRochow < 1.9) return 'bg-yellow-400';
      if (element.electronegativityAllredRochow < 2.2) return 'bg-orange-400';
      if (element.electronegativityAllredRochow < 2.5) return 'bg-red-400 text-white';
      return 'bg-red-600 text-white';

    // === AFFINITÉ ÉLECTRONIQUE ===
    case 'electron-affinity':
      if (!element.electronAffinity) return 'bg-gray-100';
      // Plus négatif = plus exothermique (plus stable)
      if (element.electronAffinity < -300) return 'bg-green-600 text-white';
      if (element.electronAffinity < -200) return 'bg-green-500';
      if (element.electronAffinity < -100) return 'bg-green-400';
      if (element.electronAffinity < 0) return 'bg-green-300';
      if (element.electronAffinity < 50) return 'bg-yellow-300';
      return 'bg-red-300'; // Endothermique (rare)

    // === ÉNERGIE D'IONISATION ===
    case 'ionization':
      if (!element.ionizationEnergies?.[0]) return 'bg-gray-100';
      const ie = element.ionizationEnergies[0];
      if (ie < 400) return 'bg-green-600 text-white';
      if (ie < 500) return 'bg-green-500';
      if (ie < 600) return 'bg-green-400';
      if (ie < 700) return 'bg-lime-400';
      if (ie < 800) return 'bg-yellow-400';
      if (ie < 900) return 'bg-amber-400';
      if (ie < 1000) return 'bg-orange-400';
      if (ie < 1200) return 'bg-red-400 text-white';
      if (ie < 1500) return 'bg-red-500 text-white';
      if (ie < 1800) return 'bg-red-600 text-white';
      return 'bg-purple-600 text-white';

    // === RAYONS ATOMIQUES ===
    case 'atomic-radius-calculated':
      if (!element.atomicRadiusCalculated) return 'bg-gray-100';
      const ar = element.atomicRadiusCalculated;
      if (ar < 50) return 'bg-red-700 text-white';
      if (ar < 60) return 'bg-red-600 text-white';
      if (ar < 70) return 'bg-red-500';
      if (ar < 80) return 'bg-orange-500';
      if (ar < 90) return 'bg-orange-400';
      if (ar < 100) return 'bg-yellow-400';
      if (ar < 120) return 'bg-lime-400';
      if (ar < 140) return 'bg-green-400';
      if (ar < 160) return 'bg-teal-400';
      if (ar < 180) return 'bg-cyan-400';
      if (ar < 200) return 'bg-blue-400';
      return 'bg-blue-600 text-white';

    case 'covalent-radius':
      if (!element.covalentRadius) return 'bg-gray-100';
      const cr = element.covalentRadius;
      if (cr < 70) return 'bg-red-600 text-white';
      if (cr < 90) return 'bg-orange-500';
      if (cr < 110) return 'bg-yellow-400';
      if (cr < 130) return 'bg-green-400';
      if (cr < 150) return 'bg-cyan-400';
      if (cr < 170) return 'bg-blue-400';
      return 'bg-blue-600 text-white';

    case 'van-der-waals-radius':
      if (!element.vanDerWaalsRadius) return 'bg-gray-100';
      const vdw = element.vanDerWaalsRadius;
      if (vdw < 120) return 'bg-red-600 text-white';
      if (vdw < 140) return 'bg-orange-500';
      if (vdw < 160) return 'bg-yellow-400';
      if (vdw < 180) return 'bg-green-400';
      if (vdw < 200) return 'bg-cyan-400';
      if (vdw < 220) return 'bg-blue-400';
      return 'bg-blue-600 text-white';

    // === MASSE VOLUMIQUE ===
    case 'density':
      if (!element.density) return 'bg-gray-100';
      const d = element.density;
      if (d < 1) return 'bg-blue-200';
      if (d < 2) return 'bg-cyan-200';
      if (d < 5) return 'bg-green-200';
      if (d < 8) return 'bg-yellow-200';
      if (d < 12) return 'bg-orange-300';
      if (d < 16) return 'bg-orange-500 text-white';
      if (d < 20) return 'bg-red-500 text-white';
      return 'bg-red-700 text-white';

    // === VOLUME MOLAIRE ===
    case 'molar-volume':
      if (!element.molarVolume) return 'bg-gray-100';
      const mv = element.molarVolume;
      if (mv < 5) return 'bg-red-600 text-white';
      if (mv < 8) return 'bg-orange-500';
      if (mv < 12) return 'bg-yellow-400';
      if (mv < 18) return 'bg-green-400';
      if (mv < 25) return 'bg-cyan-400';
      if (mv < 35) return 'bg-blue-400';
      return 'bg-purple-500 text-white';

    // === POINTS DE FUSION/ÉBULLITION ===
    case 'melting-point':
      if (!element.meltingPoint) return 'bg-gray-100';
      const mp = element.meltingPoint;
      if (mp < 100) return 'bg-blue-400';   // Très bas
      if (mp < 300) return 'bg-cyan-400';   // Bas
      if (mp < 600) return 'bg-green-400';  // Moyen
      if (mp < 1000) return 'bg-yellow-400'; // Élevé
      if (mp < 1500) return 'bg-orange-400'; // Très élevé
      if (mp < 2500) return 'bg-red-500 text-white'; // Extrême
      return 'bg-purple-600 text-white';     // Ultra haut

    case 'boiling-point':
      if (!element.boilingPoint) return 'bg-gray-100';
      const bp = element.boilingPoint;
      if (bp < 200) return 'bg-blue-400';
      if (bp < 500) return 'bg-cyan-400';
      if (bp < 1000) return 'bg-green-400';
      if (bp < 2000) return 'bg-yellow-400';
      if (bp < 3000) return 'bg-orange-400';
      if (bp < 4000) return 'bg-red-500 text-white';
      return 'bg-purple-600 text-white';

    // === PROPRIÉTÉS THERMIQUES ===
    case 'heat-fusion':
      if (!element.heatOfFusion) return 'bg-gray-100';
      const hf = element.heatOfFusion;
      if (hf < 5) return 'bg-blue-300';
      if (hf < 15) return 'bg-cyan-300';
      if (hf < 30) return 'bg-green-300';
      if (hf < 50) return 'bg-yellow-300';
      return 'bg-orange-400';

    case 'heat-vaporization':
      if (!element.heatOfVaporization) return 'bg-gray-100';
      const hv = element.heatOfVaporization;
      if (hv < 50) return 'bg-blue-300';
      if (hv < 150) return 'bg-cyan-300';
      if (hv < 300) return 'bg-green-300';
      if (hv < 500) return 'bg-yellow-300';
      return 'bg-orange-400';

    case 'specific-heat':
      if (!element.specificHeatCapacity) return 'bg-gray-100';
      const sh = element.specificHeatCapacity;
      if (sh < 0.2) return 'bg-red-500 text-white';
      if (sh < 0.5) return 'bg-orange-400';
      if (sh < 1.0) return 'bg-yellow-400';
      return 'bg-green-400';

    case 'thermal-conductivity':
      if (!element.thermalConductivity) return 'bg-gray-100';
      const tc = element.thermalConductivity;
      if (tc < 1) return 'bg-blue-300';
      if (tc < 10) return 'bg-cyan-300';
      if (tc < 50) return 'bg-green-300';
      if (tc < 100) return 'bg-yellow-300';
      if (tc < 200) return 'bg-orange-400';
      return 'bg-red-500 text-white';

    // === ABONDANCES (Échelle logarithmique) ===
    case 'abundance-universe':
      if (!element.abundances?.universe) return 'bg-gray-100';
      const au = element.abundances.universe;
      if (au < 0.001) return 'bg-purple-900 text-white';
      if (au < 0.01) return 'bg-purple-700 text-white';
      if (au < 0.1) return 'bg-purple-500';
      if (au < 1) return 'bg-blue-500 text-white';
      if (au < 10) return 'bg-cyan-500';
      return 'bg-yellow-400';

    case 'abundance-earth':
      if (!element.abundances?.earth) return 'bg-gray-100';
      const ae = element.abundances.earth;
      if (ae < 0.0001) return 'bg-purple-900 text-white';
      if (ae < 0.001) return 'bg-purple-700 text-white';
      if (ae < 0.01) return 'bg-purple-500';
      if (ae < 0.1) return 'bg-blue-500 text-white';
      if (ae < 1) return 'bg-cyan-500';
      if (ae < 10) return 'bg-green-500';
      return 'bg-yellow-400';

    case 'abundance-crust':
      if (!element.abundances?.earthCrust) return 'bg-gray-100';
      const ac = element.abundances.earthCrust;
      if (ac < 0.0001) return 'bg-purple-900 text-white';
      if (ac < 0.001) return 'bg-purple-700 text-white';
      if (ac < 0.01) return 'bg-purple-500';
      if (ac < 0.1) return 'bg-blue-500 text-white';
      if (ac < 1) return 'bg-cyan-500';
      if (ac < 10) return 'bg-green-500';
      return 'bg-yellow-400';

    case 'abundance-human':
      if (!element.abundances?.humanBody) return 'bg-gray-100';
      const ah = element.abundances.humanBody;
      if (ah < 0.00001) return 'bg-purple-900 text-white';
      if (ah < 0.0001) return 'bg-purple-700 text-white';
      if (ah < 0.001) return 'bg-purple-500';
      if (ah < 0.01) return 'bg-blue-500 text-white';
      if (ah < 0.1) return 'bg-cyan-500';
      if (ah < 1) return 'bg-green-500';
      return 'bg-yellow-400';

    default:
      return categoryColors[element.category].bg;
  }
}

// ============================================================
// AFFICHAGE DE LA VALEUR SUR LA CELLULE
// ============================================================

function getElementDisplayValue(element: Element, viewMode: ViewMode): string | null {
  switch (viewMode) {
    case 'electronegativity-pauling':
      return element.electronegativityPauling?.toFixed(2) || null;
    case 'electronegativity-allred':
      return element.electronegativityAllredRochow?.toFixed(2) || null;
    case 'electron-affinity':
      return element.electronAffinity?.toFixed(0) || null;
    case 'ionization':
      return element.ionizationEnergies?.[0]?.toFixed(0) || null;
    case 'atomic-radius-calculated':
      return element.atomicRadiusCalculated?.toString() || null;
    case 'covalent-radius':
      return element.covalentRadius?.toString() || null;
    case 'van-der-waals-radius':
      return element.vanDerWaalsRadius?.toString() || null;
    case 'density':
      return element.density?.toFixed(2) || null;
    case 'molar-volume':
      return element.molarVolume?.toFixed(1) || null;
    case 'melting-point':
      return element.meltingPoint?.toFixed(0) || null;
    case 'boiling-point':
      return element.boilingPoint?.toFixed(0) || null;
    case 'heat-fusion':
      return element.heatOfFusion?.toFixed(1) || null;
    case 'heat-vaporization':
      return element.heatOfVaporization?.toFixed(1) || null;
    case 'specific-heat':
      return element.specificHeatCapacity?.toFixed(2) || null;
    case 'thermal-conductivity':
      return element.thermalConductivity?.toFixed(1) || null;
    case 'abundance-universe':
      return element.abundances?.universe?.toExponential(1) || null;
    case 'abundance-earth':
      return element.abundances?.earth?.toExponential(1) || null;
    case 'abundance-crust':
      return element.abundances?.earthCrust?.toExponential(1) || null;
    case 'abundance-human':
      return element.abundances?.humanBody?.toExponential(1) || null;
    default:
      return null;
  }
}

function getValueUnit(viewMode: ViewMode): string {
  switch (viewMode) {
    case 'electronegativity-pauling':
    case 'electronegativity-allred':
      return '';
    case 'electron-affinity':
    case 'ionization':
    case 'heat-fusion':
    case 'heat-vaporization':
      return 'kJ';
    case 'atomic-radius-calculated':
    case 'covalent-radius':
    case 'van-der-waals-radius':
      return 'pm';
    case 'density':
      return 'g';
    case 'molar-volume':
      return 'cm³';
    case 'melting-point':
    case 'boiling-point':
      return 'K';
    case 'specific-heat':
      return 'J/g';
    case 'thermal-conductivity':
      return 'W/m';
    case 'abundance-universe':
    case 'abundance-earth':
    case 'abundance-crust':
      return '%';
    case 'abundance-human':
      return 'mg';
    default:
      return '';
  }
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export function PeriodicTablePage() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('category');
  const [showLanthanides, setShowLanthanides] = useState(false);
  const [showActinides, setShowActinides] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  // Filtrer les éléments
  const filteredElements = useMemo(() => {
    if (!searchQuery) return elements;
    const query = searchQuery.toLowerCase();
    return elements.filter(e => 
      e.name.toLowerCase().includes(query) ||
      e.frenchName.toLowerCase().includes(query) ||
      e.symbol.toLowerCase().includes(query) ||
      e.atomicNumber.toString().includes(query)
    );
  }, [searchQuery]);

  // Vérifier si un élément est filtré
  const isElementFiltered = (element: Element) => {
    if (!searchQuery) return true;
    return filteredElements.includes(element);
  };

  // Rendu d'une cellule d'élément
  const ElementCell = ({ element }: { element: Element }) => {
    const isFiltered = isElementFiltered(element);
    const displayValue = getElementDisplayValue(element, viewMode);
    const unit = getValueUnit(viewMode);
    
    return (
      <button
        onClick={() => setSelectedElement(element)}
        className={cn(
          "relative p-1 rounded border-2 transition-all duration-200",
          "hover:scale-110 hover:shadow-lg hover:z-10",
          getElementColorByViewMode(element, viewMode),
          !isFiltered && "opacity-20 grayscale",
          selectedElement?.symbol === element.symbol && "ring-2 ring-purple-600 ring-offset-2 scale-105 z-10"
        )}
        title={`${element.frenchName} (${element.symbol})`}
      >
        <div className="text-[9px] leading-none font-medium">{element.atomicNumber}</div>
        <div className="text-sm font-bold leading-tight">{element.symbol}</div>
        <div className="text-[7px] truncate leading-none">{element.frenchName}</div>
        {displayValue && (
          <div className="text-[8px] font-mono font-semibold mt-0.5">
            {displayValue}
            {unit && <span className="text-[6px]">{unit}</span>}
          </div>
        )}
      </button>
    );
  };

  const EmptyCell = () => <div className="p-1" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Titre */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Atom className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau Périodique</h1>
                <p className="text-sm text-gray-600">118 éléments chimiques détaillés</p>
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un élément..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sélecteur de mode par catégories */}
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Affichage:</div>
            <div className="flex flex-wrap gap-2">
              {VIEW_GROUPS.map((group) => (
                <div key={group.category} className="relative">
                  <Button
                    variant={expandedGroup === group.category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setExpandedGroup(expandedGroup === group.category ? null : group.category)}
                    className={cn(
                      "gap-1.5",
                      expandedGroup === group.category && "bg-purple-600 hover:bg-purple-700"
                    )}
                  >
                    <group.icon className="w-4 h-4" />
                    {group.category}
                    <span className="text-xs opacity-70">({group.modes.length})</span>
                  </Button>
                  
                  {/* Menu déroulant des modes */}
                  {expandedGroup === group.category && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border z-50 min-w-[280px] p-2">
                      <div className="space-y-1">
                        {group.modes.map((mode) => (
                          <button
                            key={mode.id}
                            onClick={() => {
                              setViewMode(mode.id as ViewMode);
                              setExpandedGroup(null);
                            }}
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors",
                              viewMode === mode.id 
                                ? "bg-purple-100 text-purple-700 font-medium" 
                                : "hover:bg-gray-100"
                            )}
                          >
                            <mode.icon className="w-4 h-4" />
                            {mode.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Mode actuel */}
            <div className="mt-2 text-sm">
              <span className="text-gray-500">Mode actuel:</span>
              <span className="ml-2 font-medium text-purple-700">
                {VIEW_GROUPS.flatMap(g => g.modes).find(m => m.id === viewMode)?.label || viewMode}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-[1800px] mx-auto px-4 py-6">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Tableau périodique */}
          <div className="flex-1">
            {/* Légende du mode actuel */}
            <Legend viewMode={viewMode} />

            {/* Grille du tableau périodique */}
            <div className="bg-white rounded-xl shadow-lg border p-4 overflow-x-auto">
              <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(18, minmax(50px, 1fr))' }}>
                {/* Période 1 */}
                <ElementCell element={elements.find(e => e.atomicNumber === 1)!} />
                <EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell />
                <ElementCell element={elements.find(e => e.atomicNumber === 2)!} />

                {/* Période 2 */}
                <ElementCell element={elements.find(e => e.atomicNumber === 3)!} />
                <ElementCell element={elements.find(e => e.atomicNumber === 4)!} />
                <EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell />
                <ElementCell element={elements.find(e => e.atomicNumber === 5)!} />
                <ElementCell element={elements.find(e => e.atomicNumber === 6)!} />
                <ElementCell element={elements.find(e => e.atomicNumber === 7)!} />
                <ElementCell element={elements.find(e => e.atomicNumber === 8)!} />
                <ElementCell element={elements.find(e => e.atomicNumber === 9)!} />
                <ElementCell element={elements.find(e => e.atomicNumber === 10)!} />

                {/* Période 3 */}
                <ElementCell element={elements.find(e => e.atomicNumber === 11)!} />
                <ElementCell element={elements.find(e => e.atomicNumber === 12)!} />
                <EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell /><EmptyCell />
                <ElementCell element={elements.find(e => e.atomicNumber === 13)!} />
                <ElementCell element={elements.find(e => e.atomicNumber === 14)!} />
                <ElementCell element={elements.find(e => e.atomicNumber === 15)!} />
                <ElementCell element={elements.find(e => e.atomicNumber === 16)!} />
                <ElementCell element={elements.find(e => e.atomicNumber === 17)!} />
                <ElementCell element={elements.find(e => e.atomicNumber === 18)!} />

                {/* Période 4 */}
                {[19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36].map(n => (
                  <ElementCell key={n} element={elements.find(e => e.atomicNumber === n)!} />
                ))}

                {/* Période 5 */}
                {[37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54].map(n => (
                  <ElementCell key={n} element={elements.find(e => e.atomicNumber === n)!} />
                ))}

                {/* Période 6 */}
                {[55, 56].map(n => (
                  <ElementCell key={n} element={elements.find(e => e.atomicNumber === n)!} />
                ))}
                <div className="text-[10px] text-center text-gray-500 flex items-center justify-center font-medium">*</div>
                {[72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86].map(n => (
                  <ElementCell key={n} element={elements.find(e => e.atomicNumber === n)!} />
                ))}

                {/* Période 7 */}
                {[87, 88].map(n => (
                  <ElementCell key={n} element={elements.find(e => e.atomicNumber === n)!} />
                ))}
                <div className="text-[10px] text-center text-gray-500 flex items-center justify-center font-medium">**</div>
                {[104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118].map(n => (
                  <ElementCell key={n} element={elements.find(e => e.atomicNumber === n)!} />
                ))}
              </div>

              {/* Lanthanides (57-71) */}
              <div className="mt-4">
                <button
                  onClick={() => setShowLanthanides(!showLanthanides)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-purple-600 mb-2"
                >
                  <span>* Lanthanides (57-71)</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                    {showLanthanides ? 'Masquer' : 'Afficher'}
                  </span>
                </button>
                {showLanthanides && (
                  <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(15, minmax(50px, 1fr))' }}>
                    {elements.filter(e => e.category === 'lanthanide').sort((a, b) => a.atomicNumber - b.atomicNumber).map(element => (
                      <ElementCell key={element.symbol} element={element} />
                    ))}
                  </div>
                )}
              </div>

              {/* Actinides (89-103) */}
              <div className="mt-2">
                <button
                  onClick={() => setShowActinides(!showActinides)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-purple-600 mb-2"
                >
                  <span>** Actinides (89-103)</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                    {showActinides ? 'Masquer' : 'Afficher'}
                  </span>
                </button>
                {showActinides && (
                  <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(15, minmax(50px, 1fr))' }}>
                    {elements.filter(e => e.category === 'actinide').sort((a, b) => a.atomicNumber - b.atomicNumber).map(element => (
                      <ElementCell key={element.symbol} element={element} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panneau d'information */}
          <ElementDetails 
            element={selectedElement} 
            onClose={() => setSelectedElement(null)}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPOSANT LÉGENDE
// ============================================================

function Legend({ viewMode }: { viewMode: ViewMode }) {
  const legends: Partial<Record<ViewMode, { title: string; items: { color: string; label: string }[] }>> = {
    'category': {
      title: 'Familles d\'éléments',
      items: Object.entries(categoryLabels).map(([key, label]) => ({
        color: categoryColors[key as ElementCategory].bg,
        label
      }))
    },
    'block': {
      title: 'Blocs quantiques',
      items: [
        { color: 'bg-red-200', label: 'Bloc s (Alcalins, Alcalino-terreux)' },
        { color: 'bg-blue-200', label: 'Bloc p (Métaux pauvres, Métalloïdes, Non-métaux)' },
        { color: 'bg-yellow-200', label: 'Bloc d (Métaux de transition)' },
        { color: 'bg-green-200', label: 'Bloc f (Lanthanides, Actinides)' },
      ]
    },
    'state': {
      title: 'État à température ambiante',
      items: [
        { color: 'bg-gray-300', label: 'Solide' },
        { color: 'bg-blue-300', label: 'Liquide' },
        { color: 'bg-yellow-200', label: 'Gaz' },
        { color: 'bg-gray-100', label: 'Inconnu' },
      ]
    },
    'electronegativity-pauling': {
      title: 'Électronégativité (Pauling)',
      items: [
        { color: 'bg-blue-600 text-white', label: '< 0.8 (Très faible)' },
        { color: 'bg-blue-400', label: '0.8 - 1.2 (Faible)' },
        { color: 'bg-green-400', label: '1.2 - 1.8 (Moyen)' },
        { color: 'bg-yellow-400', label: '1.8 - 2.4 (Élevé)' },
        { color: 'bg-orange-400', label: '2.4 - 2.8 (Très élevé)' },
        { color: 'bg-red-600 text-white', label: '> 2.8 (Extrême)' },
      ]
    },
    'electronegativity-allred': {
      title: 'Électronégativité (Allred-Rochow)',
      items: [
        { color: 'bg-blue-500 text-white', label: '< 1.0 (Faible)' },
        { color: 'bg-cyan-400', label: '1.0 - 1.3' },
        { color: 'bg-green-400', label: '1.3 - 1.6' },
        { color: 'bg-yellow-400', label: '1.6 - 1.9' },
        { color: 'bg-orange-400', label: '1.9 - 2.2' },
        { color: 'bg-red-400 text-white', label: '2.2 - 2.5' },
        { color: 'bg-red-600 text-white', label: '> 2.5 (Élevé)' },
      ]
    },
    'electron-affinity': {
      title: 'Affinité électronique (kJ/mol)',
      items: [
        { color: 'bg-green-600 text-white', label: '< -300 (Très exothermique)' },
        { color: 'bg-green-500', label: '-300 à -200' },
        { color: 'bg-green-400', label: '-200 à -100' },
        { color: 'bg-green-300', label: '-100 à 0' },
        { color: 'bg-yellow-300', label: '0 à 50' },
        { color: 'bg-red-300', label: '> 50 (Endothermique)' },
      ]
    },
    'ionization': {
      title: 'Énergie d\'ionisation (kJ/mol)',
      items: [
        { color: 'bg-green-600 text-white', label: '< 400' },
        { color: 'bg-green-500', label: '400 - 500' },
        { color: 'bg-green-400', label: '500 - 600' },
        { color: 'bg-lime-400', label: '600 - 700' },
        { color: 'bg-yellow-400', label: '700 - 800' },
        { color: 'bg-amber-400', label: '800 - 900' },
        { color: 'bg-orange-400', label: '900 - 1000' },
        { color: 'bg-red-400 text-white', label: '1000 - 1200' },
        { color: 'bg-red-500 text-white', label: '1200 - 1500' },
        { color: 'bg-purple-600 text-white', label: '> 1800' },
      ]
    },
    'atomic-radius-calculated': {
      title: 'Rayon atomique calculé (pm)',
      items: [
        { color: 'bg-red-600 text-white', label: '< 60 pm' },
        { color: 'bg-red-500', label: '60 - 70 pm' },
        { color: 'bg-orange-500', label: '70 - 80 pm' },
        { color: 'bg-orange-400', label: '80 - 90 pm' },
        { color: 'bg-yellow-400', label: '90 - 100 pm' },
        { color: 'bg-lime-400', label: '100 - 120 pm' },
        { color: 'bg-green-400', label: '120 - 140 pm' },
        { color: 'bg-teal-400', label: '140 - 160 pm' },
        { color: 'bg-cyan-400', label: '160 - 180 pm' },
        { color: 'bg-blue-400', label: '180 - 200 pm' },
        { color: 'bg-blue-600 text-white', label: '> 200 pm' },
      ]
    },
    'covalent-radius': {
      title: 'Rayon covalent (pm)',
      items: [
        { color: 'bg-red-600 text-white', label: '< 70 pm' },
        { color: 'bg-orange-500', label: '70 - 90 pm' },
        { color: 'bg-yellow-400', label: '90 - 110 pm' },
        { color: 'bg-green-400', label: '110 - 130 pm' },
        { color: 'bg-cyan-400', label: '130 - 150 pm' },
        { color: 'bg-blue-400', label: '150 - 170 pm' },
        { color: 'bg-blue-600 text-white', label: '> 170 pm' },
      ]
    },
    'van-der-waals-radius': {
      title: 'Rayon de Van der Waals (pm)',
      items: [
        { color: 'bg-red-600 text-white', label: '< 120 pm' },
        { color: 'bg-orange-500', label: '120 - 140 pm' },
        { color: 'bg-yellow-400', label: '140 - 160 pm' },
        { color: 'bg-green-400', label: '160 - 180 pm' },
        { color: 'bg-cyan-400', label: '180 - 200 pm' },
        { color: 'bg-blue-400', label: '200 - 220 pm' },
        { color: 'bg-blue-600 text-white', label: '> 220 pm' },
      ]
    },
    'density': {
      title: 'Masse volumique (g/cm³)',
      items: [
        { color: 'bg-blue-200', label: '< 1 (Très léger)' },
        { color: 'bg-cyan-200', label: '1 - 2' },
        { color: 'bg-green-200', label: '2 - 5' },
        { color: 'bg-yellow-200', label: '5 - 8' },
        { color: 'bg-orange-300', label: '8 - 12' },
        { color: 'bg-orange-500 text-white', label: '12 - 16' },
        { color: 'bg-red-500 text-white', label: '16 - 20' },
        { color: 'bg-red-700 text-white', label: '> 20' },
      ]
    },
    'molar-volume': {
      title: 'Volume molaire (cm³/mol)',
      items: [
        { color: 'bg-red-600 text-white', label: '< 5' },
        { color: 'bg-orange-500', label: '5 - 8' },
        { color: 'bg-yellow-400', label: '8 - 12' },
        { color: 'bg-green-400', label: '12 - 18' },
        { color: 'bg-cyan-400', label: '18 - 25' },
        { color: 'bg-blue-400', label: '25 - 35' },
        { color: 'bg-purple-500 text-white', label: '> 35' },
      ]
    },
    'boiling-point': {
      title: 'Point d\'ébullition (K)',
      items: [
        { color: 'bg-blue-400', label: '< 200 K' },
        { color: 'bg-cyan-400', label: '200 - 500 K' },
        { color: 'bg-green-400', label: '500 - 1000 K' },
        { color: 'bg-yellow-400', label: '1000 - 2000 K' },
        { color: 'bg-orange-400', label: '2000 - 3000 K' },
        { color: 'bg-red-500 text-white', label: '3000 - 4000 K' },
        { color: 'bg-purple-600 text-white', label: '> 4000 K' },
      ]
    },
    'melting-point': {
      title: 'Point de fusion (K)',
      items: [
        { color: 'bg-blue-400', label: '< 100 K (Très bas)' },
        { color: 'bg-cyan-400', label: '100 - 300 K (Bas - Gaz)' },
        { color: 'bg-green-400', label: '300 - 600 K (Moyen - Ga, Sn)' },
        { color: 'bg-yellow-400', label: '600 - 1000 K (Élevé - Al, Mg)' },
        { color: 'bg-orange-400', label: '1000 - 2000 K (Très élevé - Fe, Cu)' },
        { color: 'bg-red-600 text-white', label: '> 2000 K (Extrême - W, C)' },
      ]
    },
    'heat-fusion': {
      title: 'Chaleur de fusion (kJ/mol)',
      items: [
        { color: 'bg-blue-300', label: '< 5' },
        { color: 'bg-cyan-300', label: '5 - 15' },
        { color: 'bg-green-300', label: '15 - 30' },
        { color: 'bg-yellow-300', label: '30 - 50' },
        { color: 'bg-orange-400', label: '> 50' },
      ]
    },
    'heat-vaporization': {
      title: 'Chaleur de vaporisation (kJ/mol)',
      items: [
        { color: 'bg-blue-300', label: '< 50' },
        { color: 'bg-cyan-300', label: '50 - 150' },
        { color: 'bg-green-300', label: '150 - 300' },
        { color: 'bg-yellow-300', label: '300 - 500' },
        { color: 'bg-orange-400', label: '> 500' },
      ]
    },
    'specific-heat': {
      title: 'Capacité thermique massique (J/g·K)',
      items: [
        { color: 'bg-red-500 text-white', label: '< 0.2' },
        { color: 'bg-orange-400', label: '0.2 - 0.5' },
        { color: 'bg-yellow-400', label: '0.5 - 1.0' },
        { color: 'bg-green-400', label: '> 1.0' },
      ]
    },
    'thermal-conductivity': {
      title: 'Conductivité thermique (W/m·K)',
      items: [
        { color: 'bg-blue-300', label: '< 1' },
        { color: 'bg-cyan-300', label: '1 - 10' },
        { color: 'bg-green-300', label: '10 - 50' },
        { color: 'bg-yellow-300', label: '50 - 100' },
        { color: 'bg-orange-400', label: '100 - 200' },
        { color: 'bg-red-500 text-white', label: '> 200' },
      ]
    },
    'abundance-universe': {
      title: 'Abondance dans l\'univers (% massique)',
      items: [
        { color: 'bg-yellow-400', label: '> 1% (H, He)' },
        { color: 'bg-green-400', label: '0.01 - 1% (O, C, Ne, Fe)' },
        { color: 'bg-blue-400', label: '0.0001 - 0.01% (Métaux légers)' },
        { color: 'bg-purple-500 text-white', label: '< 0.0001% (Métaux lourds)' },
      ]
    },
    'abundance-earth': {
      title: 'Abondance dans la Terre (% massique)',
      items: [
        { color: 'bg-yellow-400', label: '> 10% (Fe, O)' },
        { color: 'bg-green-400', label: '1 - 10%' },
        { color: 'bg-cyan-400', label: '0.1 - 1%' },
        { color: 'bg-blue-400', label: '0.01 - 0.1%' },
        { color: 'bg-purple-500 text-white', label: '< 0.01%' },
      ]
    },
    'abundance-crust': {
      title: 'Abondance dans la croûte terrestre (% massique)',
      items: [
        { color: 'bg-yellow-400', label: '> 1%' },
        { color: 'bg-green-400', label: '0.1 - 1%' },
        { color: 'bg-cyan-400', label: '0.01 - 0.1%' },
        { color: 'bg-blue-400', label: '0.001 - 0.01%' },
        { color: 'bg-purple-500 text-white', label: '< 0.001%' },
      ]
    },
    'abundance-human': {
      title: 'Abondance dans le corps humain (mg/kg)',
      items: [
        { color: 'bg-yellow-400', label: '> 1000 (O, C, H)' },
        { color: 'bg-green-400', label: '100 - 1000' },
        { color: 'bg-cyan-400', label: '10 - 100' },
        { color: 'bg-blue-400', label: '1 - 10' },
        { color: 'bg-purple-500 text-white', label: '< 1' },
      ]
    },
  };

  const legend = legends[viewMode] || { title: viewMode, items: [] };

  return (
    <div className="mb-4 bg-white rounded-xl p-4 shadow-sm border">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{legend.title}</h3>
      <div className="flex flex-wrap gap-2">
        {legend.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <div className={cn("w-4 h-4 rounded border border-gray-300", item.color)} />
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// COMPOSANT DÉTAILS DE L'ÉLÉMENT
// ============================================================

function ElementDetails({ element, onClose }: { element: Element | null; onClose: () => void }) {
  if (!element) {
    return (
      <div className="xl:w-96 bg-white rounded-xl shadow-lg border p-8 text-center sticky top-24">
        <Atom className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Cliquez sur un élément pour voir ses détails complets</p>
      </div>
    );
  }

  const bgColor = categoryColors[element.category].bg;

  return (
    <div className="xl:w-[450px] bg-white rounded-xl shadow-lg border overflow-hidden sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
      {/* En-tête */}
      <div className={cn("p-6 text-center relative", bgColor)}>
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-7xl font-bold mb-1">{element.symbol}</div>
        <div className="text-2xl font-semibold">{element.frenchName}</div>
        <div className="text-sm opacity-75">{element.name}</div>
        
        {/* Noms dans d'autres langues */}
        {element.names && (
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs opacity-70">
            {element.names.english && <span>🇬🇧 {element.names.english}</span>}
            {element.names.latin && <span>🏛️ {element.names.latin}</span>}
            {element.names.german && <span>🇩🇪 {element.names.german}</span>}
          </div>
        )}
        
        <div className="mt-3 flex justify-center gap-2">
          <span className="px-3 py-1 bg-white/60 rounded-full text-sm font-medium">
            N° {element.atomicNumber}
          </span>
          <span className="px-3 py-1 bg-white/60 rounded-full text-sm font-medium">
            {categoryLabels[element.category]}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4 space-y-4">
        {/* Images illustratives */}
        {element.images && (
          <div className="space-y-3">
            {/* Image du matériau brut */}
            {element.images.material && (
              <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <div className="aspect-video relative">
                  <img 
                    src={element.images.material.url} 
                    alt={element.images.material.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-sm font-medium">{element.images.material.alt}</p>
                  {element.images.material.credit && (
                    <p className="text-white/70 text-xs">© {element.images.material.credit}</p>
                  )}
                </div>
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  🔬 Matériau
                </div>
              </div>
            )}
            
            {/* Images d'objets du quotidien */}
            {element.images.everyday && element.images.everyday.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span>🛒</span> Objets du quotidien
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {element.images.everyday.map((img, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden border border-gray-200">
                      <div className="aspect-square relative">
                        <img 
                          src={img.url} 
                          alt={img.alt}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs font-medium truncate">{img.alt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Configuration électronique */}
        <DetailSection icon={Atom} title="Configuration électronique">
          <div className="font-mono text-sm bg-gray-50 p-2 rounded">
            {element.electronConfiguration}
          </div>
          <div className="flex gap-4 mt-2 text-sm">
            <span><strong>Bloc:</strong> {element.block}</span>
            <span><strong>Groupe:</strong> {element.group}</span>
            <span><strong>Période:</strong> {element.period}</span>
          </div>
        </DetailSection>

        {/* Propriétés atomiques */}
        <DetailSection icon={Zap} title="Propriétés atomiques">
          <PropertyGrid>
            <Property label="Masse atomique" value={`${element.atomicMass} u`} />
            <Property label="Électronégativité (Pauling)" value={element.electronegativityPauling?.toFixed(2) || '—'} />
            <Property label="Électronégativité (Allred)" value={element.electronegativityAllredRochow?.toFixed(2) || '—'} />
            <Property label="Affinité électronique" value={element.electronAffinity ? `${element.electronAffinity} kJ/mol` : '—'} />
            <Property label="Rayon atomique" value={element.atomicRadiusCalculated ? `${element.atomicRadiusCalculated} pm` : '—'} />
            <Property label="Rayon covalent" value={element.covalentRadius ? `${element.covalentRadius} pm` : '—'} />
            <Property label="Rayon ionique" value={element.ionicRadii ? Object.entries(element.ionicRadii).map(([k, v]) => `${k}: ${v}pm`).join(', ') : '—'} />
          </PropertyGrid>
        </DetailSection>

        {/* Propriétés physiques */}
        <DetailSection icon={Scale} title="Propriétés physiques">
          <PropertyGrid>
            <Property label="Masse volumique" value={element.density ? `${element.density} g/cm³` : '—'} />
            <Property label="Volume molaire" value={element.molarVolume ? `${element.molarVolume} cm³/mol` : '—'} />
            <Property label="Point de fusion" value={element.meltingPoint ? `${element.meltingPoint} K (${(element.meltingPoint - 273.15).toFixed(1)}°C)` : '—'} />
            <Property label="Point d'ébullition" value={element.boilingPoint ? `${element.boilingPoint} K (${(element.boilingPoint - 273.15).toFixed(1)}°C)` : '—'} />
            <Property label="Structure cristalline" value={element.crystalStructure || '—'} />
            <Property label="État (T ambiante)" value={element.stateAtSTP === 'solid' ? 'Solide' : element.stateAtSTP === 'liquid' ? 'Liquide' : element.stateAtSTP === 'gas' ? 'Gaz' : '—'} />
          </PropertyGrid>
        </DetailSection>

        {/* Propriétés thermiques */}
        <DetailSection icon={Flame} title="Propriétés thermiques">
          <PropertyGrid>
            <Property label="ΔH fusion" value={element.heatOfFusion ? `${element.heatOfFusion} kJ/mol` : '—'} />
            <Property label="ΔH vaporisation" value={element.heatOfVaporization ? `${element.heatOfVaporization} kJ/mol` : '—'} />
            <Property label="Capacité thermique" value={element.specificHeatCapacity ? `${element.specificHeatCapacity} J/(g·K)` : '—'} />
            <Property label="Conductivité thermique" value={element.thermalConductivity ? `${element.thermalConductivity} W/(m·K)` : '—'} />
          </PropertyGrid>
        </DetailSection>

        {/* Abondances */}
        {element.abundances && (
          <DetailSection icon={Globe} title="Abondances">
            <PropertyGrid>
              <Property label="Univers" value={element.abundances.universe ? `${element.abundances.universe.toExponential(2)} %` : '—'} />
              <Property label="Terre" value={element.abundances.earth ? `${element.abundances.earth.toExponential(2)} %` : '—'} />
              <Property label="Croûte terrestre" value={element.abundances.earthCrust ? `${element.abundances.earthCrust.toExponential(2)} %` : '—'} />
              <Property label="Corps humain" value={element.abundances.humanBody ? `${element.abundances.humanBody.toExponential(2)} mg/kg` : '—'} />
            </PropertyGrid>
          </DetailSection>
        )}

        {/* Découverte */}
        {(element.discoveredBy || element.discoveredYear) && (
          <DetailSection icon={Info} title="Découverte">
            <div className="space-y-1 text-sm">
              <div><strong>Découvreur(s):</strong> {element.discoveredBy || '—'}</div>
              <div><strong>Année:</strong> {element.discoveredYear || '—'}</div>
              <div><strong>Pays:</strong> {element.discoveryCountry || '—'}</div>
              {element.namingOrigin && <div><strong>Origine du nom:</strong> {element.namingOrigin}</div>}
            </div>
          </DetailSection>
        )}

        {/* Utilisations */}
        {element.uses && element.uses.length > 0 && (
          <DetailSection icon={Beaker} title="Utilisations principales">
            <ul className="list-disc list-inside text-sm space-y-1">
              {element.uses.map((use, idx) => <li key={idx}>{use}</li>)}
            </ul>
          </DetailSection>
        )}

        {/* Description */}
        {element.description && (
          <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            {element.description}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// COMPOSANTS UTILITAIRES
// ============================================================

function DetailSection({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100 pb-3 last:border-0">
      <h4 className="flex items-center gap-2 font-semibold text-gray-700 mb-2 text-sm">
        <Icon className="w-4 h-4 text-purple-500" />
        {title}
      </h4>
      {children}
    </div>
  );
}

function PropertyGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {children}
    </div>
  );
}

function Property({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span className="text-gray-500 text-xs">{label}</span>
      <div className="font-medium">{value}</div>
    </div>
  );
}
