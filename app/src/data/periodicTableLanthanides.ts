// ============================================================
// LANTHANIDES (57-71) ET ACTINIDES (89-103)
// ============================================================

// Type pour les données d'entrée (même structure que dans periodicTablePeriods1-3.ts)
export interface ElementInput {
  atomicNumber: number;
  symbol: string;
  names: {
    french: string;
    english: string;
    latin?: string;
    german?: string;
  };
  atomicMass: number;
  category: 'alkali-metal' | 'alkaline-earth' | 'transition-metal' | 'post-transition-metal' | 'metalloid' | 'nonmetal' | 'halogen' | 'noble-gas' | 'lanthanide' | 'actinide' | 'unknown';
  group: number | undefined;
  period: number;
  block: 's' | 'p' | 'd' | 'f';
  stateAtSTP: 'solid' | 'liquid' | 'gas' | 'unknown';
  crystalStructure?: 'cubic' | 'body-centered cubic' | 'face-centered cubic' | 'hexagonal' | 'tetragonal' | 'orthorhombic' | 'rhombohedral' | 'monoclinic' | 'triclinic' | 'unknown';
  magneticOrdering?: 'paramagnetic' | 'diamagnetic' | 'ferromagnetic' | 'antiferromagnetic' | 'unknown';
  electronConfiguration: string;
  electronConfigurationShort?: string;
  valenceElectrons: number;
  oxidationStates: string[];
  electronegativityPauling?: number;
  electronegativityAllredRochow?: number;
  electronAffinity?: number;
  ionizationEnergies: number[];
  atomicRadiusCalculated?: number;
  covalentRadius?: number;
  vanDerWaalsRadius?: number;
  ionicRadii?: Record<string, number>;
  density?: number;
  molarVolume?: number;
  meltingPoint?: number;
  boilingPoint?: number;
  heatOfFusion?: number;
  heatOfVaporization?: number;
  specificHeatCapacity?: number;
  thermalConductivity?: number;
  abundances?: {
    universe?: number;
    solarSystem?: number;
    earth?: number;
    earthCrust?: number;
    ocean?: number;
    atmosphere?: number;
    humanBody?: number;
  };
  discoveredBy?: string;
  discoveredYear?: string;
  discoveryCountry?: string;
  namingOrigin?: string;
  casNumber?: string;
  description?: string;
  uses?: string[];
  biologicalRole?: string;
  isotopes?: Array<{
    massNumber: number;
    naturalAbundance: number;
    halfLife?: string;
    decayMode?: 'stable' | 'alpha' | 'beta-' | 'beta+' | 'proton' | 'neutron' | 'fission' | 'electron capture';
  }>;
  images?: {
    material?: { url: string; alt: string; credit?: string };
    everyday?: Array<{ url: string; alt: string; credit?: string }>;
  };
}

export const lanthanidesAndActinides: ElementInput[] = [
  // ============================================================
  // LANTHANIDES (57-71)
  // ============================================================
  {
    atomicNumber: 57, symbol: 'La', names: { french: 'Lanthane', english: 'Lanthanum', latin: 'Lanthanum' },
    atomicMass: 138.91, category: 'lanthanide', group: 3, period: 6, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal',
    electronConfiguration: '[Xe] 5d¹ 6s²', valenceElectrons: 3, oxidationStates: ['+3'],
    electronegativityPauling: 1.10, electronegativityAllredRochow: 1.08,
    electronAffinity: -48, ionizationEnergies: [538.1, 1067, 1850, 4819, 5940],
    atomicRadiusCalculated: 169, covalentRadius: 207, vanDerWaalsRadius: 240,
    density: 6.162, meltingPoint: 1193, boilingPoint: 3737,
    heatOfFusion: 6.20, heatOfVaporization: 400, specificHeatCapacity: 0.195,
    thermalConductivity: 13.4,
    abundances: { universe: 0.000002, earth: 0.00039, earthCrust: 0.00039, humanBody: 0 },
    discoveredBy: 'Carl Gustaf Mosander', discoveredYear: '1839', discoveryCountry: 'Suède',
    namingOrigin: 'Du grec "lanthanein" (se cacher)',
    description: 'Le lanthane est le premier élément de la série des lanthanides. Il donne son nom à cette famille d\'éléments.',
    uses: ['Alliages spéciaux', 'Lentilles optiques', 'Catalyseurs pétrochimiques', 'Électrodes de batteries', 'Cathodes de tubes'],
    casNumber: '7439-91-0'
  },
  {
    atomicNumber: 58, symbol: 'Ce', names: { french: 'Cérium', english: 'Cerium', latin: 'Cerium' },
    atomicMass: 140.12, category: 'lanthanide', group: undefined, period: 6, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'face-centered cubic',
    electronConfiguration: '[Xe] 4f¹ 5d¹ 6s²', valenceElectrons: 4, oxidationStates: ['+4', '+3'],
    electronegativityPauling: 1.12, electronegativityAllredRochow: 1.08,
    electronAffinity: -50, ionizationEnergies: [534.4, 1050, 1949, 3547],
    atomicRadiusCalculated: undefined, covalentRadius: 204, vanDerWaalsRadius: 235,
    density: 6.770, meltingPoint: 1068, boilingPoint: 3716,
    heatOfFusion: 5.46, heatOfVaporization: 398, specificHeatCapacity: 0.192,
    thermalConductivity: 11.3,
    abundances: { universe: 0.000001, earth: 0.006, earthCrust: 0.006, humanBody: 0 },
    discoveredBy: 'Martin Heinrich Klaproth, Jöns Jacob Berzelius, Wilhelm Hisinger', discoveredYear: '1803', discoveryCountry: 'Allemagne/Suède',
    namingOrigin: 'De la planète naine Cérès',
    description: 'Le cérium est le plus abondant des terres rares. Il s\'oxyde rapidement à l\'air.',
    uses: ['Alliages pour briquets', 'Polissage du verre', 'Catalyseurs (convertisseurs)', 'Ferrocérium', 'Verres colorés'],
    casNumber: '7440-45-1'
  },
  {
    atomicNumber: 59, symbol: 'Pr', names: { french: 'Praséodyme', english: 'Praseodymium', latin: 'Praseodymium' },
    atomicMass: 140.91, category: 'lanthanide', group: undefined, period: 6, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal',
    electronConfiguration: '[Xe] 4f³ 6s²', valenceElectrons: 4, oxidationStates: ['+3', '+4'],
    electronegativityPauling: 1.13, electronegativityAllredRochow: 1.07,
    electronAffinity: -50, ionizationEnergies: [527, 1020, 2086, 3761],
    atomicRadiusCalculated: 247, covalentRadius: 203, vanDerWaalsRadius: 239,
    density: 6.77, meltingPoint: 1208, boilingPoint: 3793,
    heatOfFusion: 6.89, heatOfVaporization: 331, specificHeatCapacity: 0.193,
    thermalConductivity: 12.5,
    abundances: { universe: 0.0000002, earth: 0.00093, earthCrust: 0.00093, humanBody: 0 },
    discoveredBy: 'Carl Auer von Welsbach', discoveredYear: '1885', discoveryCountry: 'Autriche',
    namingOrigin: 'Du grec "prasios didymos" (vert jumeau)',
    description: 'Le praséodyme donne une couleur jaune-verte aux verres et émaux.',
    uses: ['Verres de soudure', 'Alliages pour aimants', 'Colorants (jaune-verte)', 'Lunettes de protection', 'Catalyseurs'],
    casNumber: '7440-10-0'
  },
  {
    atomicNumber: 60, symbol: 'Nd', names: { french: 'Néodyme', english: 'Neodymium', latin: 'Neodymium' },
    atomicMass: 144.24, category: 'lanthanide', group: undefined, period: 6, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal',
    electronConfiguration: '[Xe] 4f⁴ 6s²', valenceElectrons: 4, oxidationStates: ['+3', '+2'],
    electronegativityPauling: 1.14, electronegativityAllredRochow: 1.07,
    electronAffinity: -50, ionizationEnergies: [533.1, 1040, 2130, 3900],
    atomicRadiusCalculated: 206, covalentRadius: 201, vanDerWaalsRadius: 229,
    density: 7.01, meltingPoint: 1297, boilingPoint: 3347,
    heatOfFusion: 7.14, heatOfVaporization: 289, specificHeatCapacity: 0.190,
    thermalConductivity: 16.5,
    abundances: { universe: 0.000001, earth: 0.004, earthCrust: 0.004, humanBody: 0 },
    discoveredBy: 'Carl Auer von Welsbach', discoveredYear: '1885', discoveryCountry: 'Autriche',
    namingOrigin: 'Du grec "neos didymos" (nouveau jumeau)',
    description: 'Le néodyme est utilisé dans les aimants permanents très puissants.',
    uses: ['Aimants NdFeB (très puissants)', 'Verres de couleur (violet)', 'Lasers', 'Verres de soudure', 'Céramiques'],
    casNumber: '7440-00-8'
  },
  {
    atomicNumber: 61, symbol: 'Pm', names: { french: 'Prométhium', english: 'Promethium', latin: 'Promethium' },
    atomicMass: 145, category: 'lanthanide', group: undefined, period: 6, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal',
    electronConfiguration: '[Xe] 4f⁵ 6s²', valenceElectrons: 4, oxidationStates: ['+3'],
    electronegativityPauling: 1.13, electronegativityAllredRochow: 1.07,
    electronAffinity: -50, ionizationEnergies: [540, 1050, 2150, 3970],
    atomicRadiusCalculated: 205, covalentRadius: 199, vanDerWaalsRadius: 236,
    density: 7.26, meltingPoint: 1315, boilingPoint: 3273,
    heatOfFusion: 7.13, heatOfVaporization: 289, specificHeatCapacity: undefined,
    thermalConductivity: 17.9,
    abundances: { universe: 0, earth: 0, humanBody: 0 },
    discoveredBy: 'Charles D. Coryell, Jacob A. Marinsky, Lawrence E. Glendenin', discoveredYear: '1945', discoveryCountry: 'États-Unis',
    namingOrigin: 'De Prométhée de la mythologie grecque',
    description: 'Le prométhium est le seul lanthanide radioactif. Il n\'existe qu\'en traces dans la nature.',
    uses: ['Batteries nucléaires', 'Peintures lumineuses', 'Mesures d\'épaisseur'],
    isotopes: [{ massNumber: 145, naturalAbundance: 0, decayMode: 'beta-', halfLife: '17.7 ans' }],
    casNumber: '7440-12-2'
  },
  {
    atomicNumber: 62, symbol: 'Sm', names: { french: 'Samarium', english: 'Samarium', latin: 'Samarium' },
    atomicMass: 150.36, category: 'lanthanide', group: undefined, period: 6, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'rhombohedral',
    electronConfiguration: '[Xe] 4f⁶ 6s²', valenceElectrons: 4, oxidationStates: ['+3', '+2'],
    electronegativityPauling: 1.17, electronegativityAllredRochow: 1.07,
    electronAffinity: -50, ionizationEnergies: [544.5, 1070, 2260, 3990],
    atomicRadiusCalculated: 238, covalentRadius: 198, vanDerWaalsRadius: 229,
    density: 7.52, meltingPoint: 1345, boilingPoint: 2067,
    heatOfFusion: 8.62, heatOfVaporization: 192, specificHeatCapacity: 0.197,
    thermalConductivity: 13.3,
    abundances: { universe: 0.0000005, earth: 0.0007, earthCrust: 0.0007, humanBody: 0 },
    discoveredBy: 'Lecoq de Boisbaudran', discoveredYear: '1879', discoveryCountry: 'France',
    namingOrigin: 'Du minéral samarskite',
    description: 'Le samarium est utilisé dans les aimants permanents et pour capturer les neutrons dans les réacteurs nucléaires.',
    uses: ['Aimants permanents', 'Réacteurs nucléaires', 'Lasers', 'Lampes à incandescence'],
    casNumber: '7440-19-9'
  },
  {
    atomicNumber: 63, symbol: 'Eu', names: { french: 'Europium', english: 'Europium', latin: 'Europium' },
    atomicMass: 151.96, category: 'lanthanide', group: undefined, period: 6, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'body-centered cubic',
    electronConfiguration: '[Xe] 4f⁷ 6s²', valenceElectrons: 4, oxidationStates: ['+3', '+2'],
    electronegativityPauling: 1.2, electronegativityAllredRochow: 1.01,
    electronAffinity: -50, ionizationEnergies: [547.1, 1085, 2404, 4120],
    atomicRadiusCalculated: 231, covalentRadius: 198, vanDerWaalsRadius: 233,
    density: 5.244, meltingPoint: 1099, boilingPoint: 1802,
    heatOfFusion: 9.21, heatOfVaporization: 176, specificHeatCapacity: 0.182,
    thermalConductivity: 13.9,
    abundances: { universe: 0.00000005, earth: 0.00013, earthCrust: 0.00013, humanBody: 0 },
    discoveredBy: 'Eugène-Anatole Demarçay', discoveredYear: '1896', discoveryCountry: 'France',
    namingOrigin: 'De l\'Europe',
    description: 'L\'europium est le lanthanide le plus réactif. Il absorbe les neutrons et est utilisé dans les phosphores rouges.',
    uses: ['Phosphores rouges (écrans TV)', 'Détecteurs de neutrons', 'Alliages à bas point de fusion', 'Banques et sécurité'],
    casNumber: '7440-53-1'
  },
  {
    atomicNumber: 64, symbol: 'Gd', names: { french: 'Gadolinium', english: 'Gadolinium', latin: 'Gadolinium' },
    atomicMass: 157.25, category: 'lanthanide', group: undefined, period: 6, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal',
    electronConfiguration: '[Xe] 4f⁷ 5d¹ 6s²', valenceElectrons: 5, oxidationStates: ['+3'],
    electronegativityPauling: 1.20, electronegativityAllredRochow: 1.11,
    electronAffinity: -50, ionizationEnergies: [593.4, 1170, 1990, 4250],
    atomicRadiusCalculated: 237, covalentRadius: 196, vanDerWaalsRadius: 237,
    density: 7.90, meltingPoint: 1585, boilingPoint: 3546,
    heatOfFusion: 10.05, heatOfVaporization: 301.3, specificHeatCapacity: 0.236,
    thermalConductivity: 10.5,
    abundances: { universe: 0.0000002, earth: 0.00052, earthCrust: 0.00052, humanBody: 0 },
    discoveredBy: 'Jean Charles Galissard de Marignac', discoveredYear: '1880', discoveryCountry: 'Suisse',
    namingOrigin: 'De Johan Gadolin',
    description: 'Le gadolinium a le point de Curie le plus bas. Il est utilisé en IRM comme agent de contraste.',
    uses: ['Agent de contraste IRM', 'Réfrigération magnétique', 'Réacteurs nucléaires', 'Alliages', 'Cristaux lasers'],
    casNumber: '7440-54-2'
  },
  {
    atomicNumber: 65, symbol: 'Tb', names: { french: 'Terbium', english: 'Terbium', latin: 'Terbium' },
    atomicMass: 158.93, category: 'lanthanide', group: undefined, period: 6, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal',
    electronConfiguration: '[Xe] 4f⁹ 6s²', valenceElectrons: 4, oxidationStates: ['+3', '+4'],
    electronegativityPauling: 1.2, electronegativityAllredRochow: 1.10,
    electronAffinity: -50, ionizationEnergies: [565.8, 1110, 2114, 3839],
    atomicRadiusCalculated: 221, covalentRadius: 194, vanDerWaalsRadius: 221,
    density: 8.23, meltingPoint: 1629, boilingPoint: 3503,
    heatOfFusion: 10.15, heatOfVaporization: 293, specificHeatCapacity: 0.182,
    thermalConductivity: 11.1,
    abundances: { universe: 0.00000005, earth: 0.00012, earthCrust: 0.00012, humanBody: 0 },
    discoveredBy: 'Carl Gustaf Mosander', discoveredYear: '1843', discoveryCountry: 'Suède',
    namingOrigin: 'D\'Ytterby en Suède',
    description: 'Le terbium est utilisé dans les phosphores verts et dans les aimants à forte coercivité.',
    uses: ['Phosphores verts', 'Lampes fluorescentes', 'Détecteurs de rayons X', 'Aimants'],
    casNumber: '7440-27-9'
  },
  {
    atomicNumber: 66, symbol: 'Dy', names: { french: 'Dysprosium', english: 'Dysprosium', latin: 'Dysprosium' },
    atomicMass: 162.50, category: 'lanthanide', group: undefined, period: 6, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal',
    electronConfiguration: '[Xe] 4f¹⁰ 6s²', valenceElectrons: 4, oxidationStates: ['+3', '+2'],
    electronegativityPauling: 1.22, electronegativityAllredRochow: 1.10,
    electronAffinity: -50, ionizationEnergies: [573.0, 1130, 2200, 3990],
    atomicRadiusCalculated: 229, covalentRadius: 192, vanDerWaalsRadius: 229,
    density: 8.55, meltingPoint: 1680, boilingPoint: 2840,
    heatOfFusion: 11.06, heatOfVaporization: 280, specificHeatCapacity: 0.17,
    thermalConductivity: 10.7,
    abundances: { universe: 0.0000002, earth: 0.00052, earthCrust: 0.00052, humanBody: 0 },
    discoveredBy: 'Lecoq de Boisbaudran', discoveredYear: '1886', discoveryCountry: 'France',
    namingOrigin: 'Du grec "dysprositos" (difficile à atteindre)',
    description: 'Le dysprosium a la plus forte section efficace d\'absorption thermique des neutrons.',
    uses: ['Aimants NdFeB (haute température)', 'Réacteurs nucléaires', 'Lampes halogènes', 'Disques durs'],
    casNumber: '7429-91-6'
  },
  {
    atomicNumber: 67, symbol: 'Ho', names: { french: 'Holmium', english: 'Holmium', latin: 'Holmium' },
    atomicMass: 164.93, category: 'lanthanide', group: undefined, period: 6, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal',
    electronConfiguration: '[Xe] 4f¹¹ 6s²', valenceElectrons: 4, oxidationStates: ['+3'],
    electronegativityPauling: 1.23, electronegativityAllredRochow: 1.10,
    electronAffinity: -50, ionizationEnergies: [581.0, 1140, 2204, 4100],
    atomicRadiusCalculated: 216, covalentRadius: 192, vanDerWaalsRadius: 216,
    density: 8.79, meltingPoint: 1734, boilingPoint: 2873,
    heatOfFusion: 16.8, heatOfVaporization: 251, specificHeatCapacity: 0.165,
    thermalConductivity: 16.2,
    abundances: { universe: 0.00000005, earth: 0.00011, earthCrust: 0.00011, humanBody: 0 },
    discoveredBy: 'Marc Delafontaine, Jacques-Louis Soret, Per Teodor Cleve', discoveredYear: '1878', discoveryCountry: 'Suède',
    namingOrigin: 'De Stockholm (Holmia en latin)',
    description: 'L\'holmium a le moment magnétique le plus élevé de tous les éléments.',
    uses: ['Aimants permanents', 'Laser chirurgicaux', 'Réacteurs nucléaires', 'Colorants jaunes et rouges'],
    casNumber: '7440-60-0'
  },
  {
    atomicNumber: 68, symbol: 'Er', names: { french: 'Erbium', english: 'Erbium', latin: 'Erbium' },
    atomicMass: 167.26, category: 'lanthanide', group: undefined, period: 6, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal',
    electronConfiguration: '[Xe] 4f¹² 6s²', valenceElectrons: 4, oxidationStates: ['+3'],
    electronegativityPauling: 1.24, electronegativityAllredRochow: 1.11,
    electronAffinity: -50, ionizationEnergies: [589.3, 1150, 2194, 4120],
    atomicRadiusCalculated: 235, covalentRadius: 189, vanDerWaalsRadius: 235,
    density: 9.066, meltingPoint: 1802, boilingPoint: 3141,
    heatOfFusion: 19.9, heatOfVaporization: 280, specificHeatCapacity: 0.168,
    thermalConductivity: 14.5,
    abundances: { universe: 0.0000001, earth: 0.0003, earthCrust: 0.0003, humanBody: 0 },
    discoveredBy: 'Carl Gustaf Mosander', discoveredYear: '1843', discoveryCountry: 'Suède',
    namingOrigin: 'D\'Ytterby en Suède',
    description: 'L\'erbium est utilisé dans les amplificateurs de fibres optiques et dans les lasers médicaux.',
    uses: ['Amplificateurs de fibres optiques', 'Lasers médicaux', 'Verres de couleur', 'Métallurgie'],
    casNumber: '7440-52-0'
  },
  {
    atomicNumber: 69, symbol: 'Tm', names: { french: 'Thulium', english: 'Thulium', latin: 'Thulium' },
    atomicMass: 168.93, category: 'lanthanide', group: undefined, period: 6, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal',
    electronConfiguration: '[Xe] 4f¹³ 6s²', valenceElectrons: 4, oxidationStates: ['+3', '+2'],
    electronegativityPauling: 1.25, electronegativityAllredRochow: 1.11,
    electronAffinity: -50, ionizationEnergies: [596.7, 1160, 2285, 4120],
    atomicRadiusCalculated: 227, covalentRadius: 190, vanDerWaalsRadius: 227,
    density: 9.32, meltingPoint: 1818, boilingPoint: 2223,
    heatOfFusion: 16.84, heatOfVaporization: 191, specificHeatCapacity: 0.16,
    thermalConductivity: 16.9,
    abundances: { universe: 0.00000001, earth: 0.000045, earthCrust: 0.000045, humanBody: 0 },
    discoveredBy: 'Per Teodor Cleve', discoveredYear: '1879', discoveryCountry: 'Suède',
    namingOrigin: 'De la Thulé (ancien nom de la Scandinavie)',
    description: 'Le thulium est le lanthanide le moins abondant (hors prométhium). Il est utilisé dans les lasers portables.',
    uses: ['Lasers portables', 'Imagerie médicale', 'Ampoules à rayons X portables'],
    casNumber: '7440-30-4'
  },
  {
    atomicNumber: 70, symbol: 'Yb', names: { french: 'Ytterbium', english: 'Ytterbium', latin: 'Ytterbium' },
    atomicMass: 173.05, category: 'lanthanide', group: undefined, period: 6, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'face-centered cubic',
    electronConfiguration: '[Xe] 4f¹⁴ 6s²', valenceElectrons: 4, oxidationStates: ['+3', '+2'],
    electronegativityPauling: 1.1, electronegativityAllredRochow: 1.06,
    electronAffinity: -50, ionizationEnergies: [603.4, 1174, 2417, 4203],
    atomicRadiusCalculated: 242, covalentRadius: 187, vanDerWaalsRadius: 242,
    density: 6.90, meltingPoint: 1097, boilingPoint: 1469,
    heatOfFusion: 7.66, heatOfVaporization: 129, specificHeatCapacity: 0.155,
    thermalConductivity: 38.5,
    abundances: { universe: 0.0000001, earth: 0.00028, earthCrust: 0.00028, humanBody: 0 },
    discoveredBy: 'Jean Charles Galissard de Marignac', discoveredYear: '1878', discoveryCountry: 'Suisse',
    namingOrigin: 'D\'Ytterby en Suède',
    description: 'L\'ytterbium est utilisé dans les horloges atomiques et dans les alliages pour améliorer la résistance à la corrosion.',
    uses: ['Horloges atomiques', 'Alliages', 'Lasers', 'Métrologie', 'Catalyseurs'],
    casNumber: '7440-64-4'
  },
  {
    atomicNumber: 71, symbol: 'Lu', names: { french: 'Lutécium', english: 'Lutetium', latin: 'Lutetium' },
    atomicMass: 174.97, category: 'lanthanide', group: 3, period: 6, block: 'd',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal',
    electronConfiguration: '[Xe] 4f¹⁴ 5d¹ 6s²', valenceElectrons: 5, oxidationStates: ['+3'],
    electronegativityPauling: 1.27, electronegativityAllredRochow: 1.14,
    electronAffinity: -50, ionizationEnergies: [523.5, 1340, 2022, 4370],
    atomicRadiusCalculated: 221, covalentRadius: 187, vanDerWaalsRadius: 221,
    density: 9.84, meltingPoint: 1925, boilingPoint: 3675,
    heatOfFusion: 22, heatOfVaporization: 414, specificHeatCapacity: 0.154,
    thermalConductivity: 16.4,
    abundances: { universe: 0.00000001, earth: 0.000082, earthCrust: 0.000082, humanBody: 0 },
    discoveredBy: 'Georges Urbain, Carl Auer von Welsbach, Charles James', discoveredYear: '1907',
    namingOrigin: 'De Lutèce (ancien nom de Paris)',
    description: 'Le lutécium est le lanthanide le plus dense et le plus difficile à isoler.',
    uses: ['Catalyseurs pétrochimiques', 'Datation géochronologique', 'Réacteurs nucléaires', 'Céramiques'],
    casNumber: '7439-94-3'
  },

  // ============================================================
  // ACTINIDES (89-103)
  // ============================================================
  {
    atomicNumber: 89, symbol: 'Ac', names: { french: 'Actinium', english: 'Actinium', latin: 'Actinium' },
    atomicMass: 227, category: 'actinide', group: 3, period: 7, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'face-centered cubic',
    electronConfiguration: '[Rn] 6d¹ 7s²', valenceElectrons: 3, oxidationStates: ['+3'],
    electronegativityPauling: 1.1, electronegativityAllredRochow: 1.00,
    electronAffinity: -33.77, ionizationEnergies: [499, 1170],
    atomicRadiusCalculated: 215, covalentRadius: 215, vanDerWaalsRadius: undefined,
    density: 10.07, meltingPoint: 1500, boilingPoint: 3500,
    heatOfFusion: 14, heatOfVaporization: 400, specificHeatCapacity: 0.12,
    thermalConductivity: 12,
    abundances: { universe: 0, earth: 0.000000000000000000055, humanBody: 0 },
    discoveredBy: 'Friedrich Oskar Giesel', discoveredYear: '1902', discoveryCountry: 'Allemagne/France',
    namingOrigin: 'Du grec "aktis" (rayon)',
    description: 'L\'actinium est l\'élément éponyme des actinides. Il est très radioactif et brille faiblement dans l\'obscurité.',
    uses: ['Radiothérapie', 'Neutrons (réacteurs)', 'Recherche scientifique'],
    isotopes: [{ massNumber: 227, naturalAbundance: 0, decayMode: 'beta-', halfLife: '21.8 ans' }],
    casNumber: '7440-34-8'
  },
  {
    atomicNumber: 90, symbol: 'Th', names: { french: 'Thorium', english: 'Thorium', latin: 'Thorium' },
    atomicMass: 232.04, category: 'actinide', group: undefined, period: 7, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'face-centered cubic',
    electronConfiguration: '[Rn] 6d² 7s²', valenceElectrons: 4, oxidationStates: ['+4'],
    electronegativityPauling: 1.3, electronegativityAllredRochow: 1.11,
    electronAffinity: 0, ionizationEnergies: [587, 1110, 1930, 2780],
    atomicRadiusCalculated: 206, covalentRadius: 206, vanDerWaalsRadius: 240,
    density: 11.72, meltingPoint: 2115, boilingPoint: 5061,
    heatOfFusion: 13.81, heatOfVaporization: 514, specificHeatCapacity: 0.113,
    thermalConductivity: 54.0,
    abundances: { universe: 0.0000004, earth: 0.00096, earthCrust: 0.00096, humanBody: 0 },
    discoveredBy: 'Jöns Jacob Berzelius', discoveredYear: '1829', discoveryCountry: 'Suède',
    namingOrigin: 'Du dieu nordique Thor',
    description: 'Le thorium est un combustible nucléaire prometteur. Il est plus abondant que l\'uranium.',
    uses: ['Réacteurs nucléaires', 'Alliages pour aérospatiale', 'Catalyseurs', 'Verres optiques', 'Lampes'],
    isotopes: [{ massNumber: 232, naturalAbundance: 100, decayMode: 'alpha', halfLife: '14 milliards d\'années' }],
    casNumber: '7440-29-1'
  },
  {
    atomicNumber: 91, symbol: 'Pa', names: { french: 'Protactinium', english: 'Protactinium', latin: 'Protactinium' },
    atomicMass: 231.04, category: 'actinide', group: undefined, period: 7, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'tetragonal',
    electronConfiguration: '[Rn] 5f² 6d¹ 7s²', valenceElectrons: 5, oxidationStates: ['+5', '+4'],
    electronegativityPauling: 1.5, electronegativityAllredRochow: 1.14,
    electronAffinity: 0, ionizationEnergies: [568],
    atomicRadiusCalculated: 200, covalentRadius: 200, vanDerWaalsRadius: undefined,
    density: 15.37, meltingPoint: 1841, boilingPoint: 4300,
    heatOfFusion: 12.34, heatOfVaporization: 481, specificHeatCapacity: undefined,
    thermalConductivity: 47,
    abundances: { universe: 0.00000000002, earth: 0.00000000014, earthCrust: 0.00000000014, humanBody: 0 },
    discoveredBy: 'Kasimir Fajans, Oswald Helmuth Göhring', discoveredYear: '1913', discoveryCountry: 'Allemagne',
    namingOrigin: 'Du grec "protos" (premier) et actinium',
    description: 'Le protactinium est l\'un des éléments les plus rares et les plus chers. Il se désintègre en actinium.',
    uses: ['Recherche scientifique uniquement'],
    isotopes: [{ massNumber: 231, naturalAbundance: 100, decayMode: 'alpha', halfLife: '32760 ans' }],
    casNumber: '7440-13-3'
  },
  {
    atomicNumber: 92, symbol: 'U', names: { french: 'Uranium', english: 'Uranium', latin: 'Uranium' },
    atomicMass: 238.03, category: 'actinide', group: undefined, period: 7, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'orthorhombic',
    electronConfiguration: '[Rn] 5f³ 6d¹ 7s²', valenceElectrons: 6, oxidationStates: ['+6', '+5', '+4', '+3'],
    electronegativityPauling: 1.38, electronegativityAllredRochow: 1.22,
    electronAffinity: 0, ionizationEnergies: [597.6, 1420],
    atomicRadiusCalculated: 196, covalentRadius: 196, vanDerWaalsRadius: 186,
    density: 18.95, meltingPoint: 1405.3, boilingPoint: 4404,
    heatOfFusion: 9.14, heatOfVaporization: 417.1, specificHeatCapacity: 0.116,
    thermalConductivity: 27.5,
    abundances: { universe: 0.00000002, earth: 0.00018, earthCrust: 0.00018, humanBody: 0.001 },
    discoveredBy: 'Martin Heinrich Klaproth', discoveredYear: '1789', discoveryCountry: 'Allemagne',
    namingOrigin: 'De la planète Uranus',
    description: 'L\'uranium est le combustible principal des réacteurs nucléaires et des armes nucléaires.',
    uses: ['Combustible nucléaire', 'Armement nucléaire', 'Contrepoids', 'Colorants verre/céramique', 'Boucliers anti-radiation'],
    isotopes: [
      { massNumber: 235, naturalAbundance: 0.72, decayMode: 'alpha', halfLife: '704 millions d\'années' },
      { massNumber: 238, naturalAbundance: 99.27, decayMode: 'alpha', halfLife: '4.5 milliards d\'années' }
    ],
    casNumber: '7440-61-1'
  },
  {
    atomicNumber: 93, symbol: 'Np', names: { french: 'Neptunium', english: 'Neptunium', latin: 'Neptunium' },
    atomicMass: 237, category: 'actinide', group: undefined, period: 7, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'orthorhombic',
    electronConfiguration: '[Rn] 5f⁴ 6d¹ 7s²', valenceElectrons: 7, oxidationStates: ['+6', '+5', '+4', '+3'],
    electronegativityPauling: 1.36, electronegativityAllredRochow: 1.22,
    electronAffinity: 0, ionizationEnergies: [604.5],
    atomicRadiusCalculated: 190, covalentRadius: 190, vanDerWaalsRadius: undefined,
    density: 20.45, meltingPoint: 917, boilingPoint: 4273,
    heatOfFusion: 5.19, heatOfVaporization: 336, specificHeatCapacity: undefined,
    thermalConductivity: 6.3,
    abundances: { universe: 0, earth: 0, humanBody: 0 },
    discoveredBy: 'Edwin McMillan, Philip Abelson', discoveredYear: '1940', discoveryCountry: 'États-Unis',
    namingOrigin: 'De la planète Neptune',
    description: 'Le neptunium est le premier élément transuranien. Il est produit artificiellement à partir d\'uranium.',
    uses: ['Détection de neutrons', 'Production de plutonium-238', 'Recherche scientifique'],
    isotopes: [{ massNumber: 237, naturalAbundance: 0, decayMode: 'alpha', halfLife: '2.14 millions d\'années' }],
    casNumber: '7439-99-8'
  },
  {
    atomicNumber: 94, symbol: 'Pu', names: { french: 'Plutonium', english: 'Plutonium', latin: 'Plutonium' },
    atomicMass: 244, category: 'actinide', group: undefined, period: 7, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'monoclinic',
    electronConfiguration: '[Rn] 5f⁶ 7s²', valenceElectrons: 8, oxidationStates: ['+6', '+5', '+4', '+3'],
    electronegativityPauling: 1.28, electronegativityAllredRochow: 1.22,
    electronAffinity: 0, ionizationEnergies: [584.7],
    atomicRadiusCalculated: 187, covalentRadius: 187, vanDerWaalsRadius: undefined,
    density: 19.84, meltingPoint: 912.5, boilingPoint: 3501,
    heatOfFusion: 2.82, heatOfVaporization: 333.5, specificHeatCapacity: undefined,
    thermalConductivity: 6.74,
    abundances: { universe: 0, earth: 0.0000000000000003, humanBody: 0 },
    discoveredBy: 'Glenn T. Seaborg, Arthur C. Wahl, Joseph W. Kennedy, Edwin McMillan', discoveredYear: '1940', discoveryCountry: 'États-Unis',
    namingOrigin: 'De la planète naine Pluton',
    description: 'Le plutonium est utilisé dans les armes nucléaires et comme combustible dans les réacteurs rapides.',
    uses: ['Armes nucléaires', 'Combustible MOX', 'RTG (batteries nucléaires spatiales)', 'Chauffage'],
    isotopes: [{ massNumber: 239, naturalAbundance: 0, decayMode: 'alpha', halfLife: '24110 ans' }],
    casNumber: '7440-07-5'
  },
  {
    atomicNumber: 95, symbol: 'Am', names: { french: 'Américium', english: 'Americium', latin: 'Americium' },
    atomicMass: 243, category: 'actinide', group: undefined, period: 7, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal',
    electronConfiguration: '[Rn] 5f⁷ 7s²', valenceElectrons: 9, oxidationStates: ['+6', '+5', '+4', '+3'],
    electronegativityPauling: 1.13, electronegativityAllredRochow: 1.2,
    electronAffinity: 0, ionizationEnergies: [578],
    atomicRadiusCalculated: 180, covalentRadius: 180, vanDerWaalsRadius: undefined,
    density: 12, meltingPoint: 1449, boilingPoint: 2880,
    heatOfFusion: 14.39, heatOfVaporization: undefined, specificHeatCapacity: undefined,
    thermalConductivity: 10,
    abundances: { universe: 0, earth: 0, humanBody: 0 },
    discoveredBy: 'Glenn T. Seaborg, Ralph A. James, Leon O. Morgan, Albert Ghiorso', discoveredYear: '1944', discoveryCountry: 'États-Unis',
    namingOrigin: 'D\'Amérique',
    description: 'L\'américium est utilisé dans les détecteurs de fumée. Il est produit artificiellement.',
    uses: ['Détecteurs de fumée', 'Jauges d\'épaisseur', 'Irradiation médicale'],
    isotopes: [{ massNumber: 241, naturalAbundance: 0, decayMode: 'alpha', halfLife: '432.2 ans' }],
    casNumber: '7440-35-9'
  },
  {
    atomicNumber: 96, symbol: 'Cm', names: { french: 'Curium', english: 'Curium', latin: 'Curium' },
    atomicMass: 247, category: 'actinide', group: undefined, period: 7, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal',
    electronConfiguration: '[Rn] 5f⁷ 6d¹ 7s²', valenceElectrons: 10, oxidationStates: ['+4', '+3'],
    electronegativityPauling: 1.28, electronegativityAllredRochow: 1.2,
    electronAffinity: 0, ionizationEnergies: [581],
    atomicRadiusCalculated: 174, covalentRadius: 174, vanDerWaalsRadius: undefined,
    density: 13.51, meltingPoint: 1613, boilingPoint: 3383,
    heatOfFusion: 13.85, heatOfVaporization: undefined, specificHeatCapacity: undefined,
    thermalConductivity: undefined,
    abundances: { universe: 0, earth: 0, humanBody: 0 },
    discoveredBy: 'Glenn T. Seaborg, Ralph A. James, Albert Ghiorso', discoveredYear: '1944', discoveryCountry: 'États-Unis',
    namingOrigin: 'De Marie et Pierre Curie',
    description: 'Le curium est utilisé comme source de rayons X dans les analyseurs de roches sur Mars.',
    uses: ['Générateurs thermoélectriques', 'Analyseurs de roches spatiaux', 'Recherche scientifique'],
    isotopes: [{ massNumber: 247, naturalAbundance: 0, decayMode: 'alpha', halfLife: '15.6 millions d\'années' }],
    casNumber: '7440-51-9'
  },
  {
    atomicNumber: 97, symbol: 'Bk', names: { french: 'Berkélium', english: 'Berkelium', latin: 'Berkelium' },
    atomicMass: 247, category: 'actinide', group: undefined, period: 7, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal',
    electronConfiguration: '[Rn] 5f⁹ 7s²', valenceElectrons: 11, oxidationStates: ['+4', '+3'],
    electronegativityPauling: 1.3, electronegativityAllredRochow: 1.2,
    electronAffinity: 0, ionizationEnergies: [601],
    atomicRadiusCalculated: 170, covalentRadius: 170, vanDerWaalsRadius: undefined,
    density: 14.78, meltingPoint: 1259, boilingPoint: undefined,
    heatOfFusion: 7.92, heatOfVaporization: undefined, specificHeatCapacity: undefined,
    thermalConductivity: 10,
    abundances: { universe: 0, earth: 0, humanBody: 0 },
    discoveredBy: 'Glenn T. Seaborg, Albert Ghiorso, Stanley G. Thompson, Kenneth Street, Jr.', discoveredYear: '1949', discoveryCountry: 'États-Unis',
    namingOrigin: 'De Berkeley (Californie)',
    description: 'Le berkélium est un élément synthétique très rare produit en quantités microscopiques.',
    uses: ['Recherche scientifique uniquement'],
    isotopes: [{ massNumber: 247, naturalAbundance: 0, decayMode: 'alpha', halfLife: '1380 ans' }],
    casNumber: '7440-40-6'
  },
  {
    atomicNumber: 98, symbol: 'Cf', names: { french: 'Californium', english: 'Californium', latin: 'Californium' },
    atomicMass: 251, category: 'actinide', group: undefined, period: 7, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal',
    electronConfiguration: '[Rn] 5f¹⁰ 7s²', valenceElectrons: 12, oxidationStates: ['+4', '+3'],
    electronegativityPauling: 1.3, electronegativityAllredRochow: 1.2,
    electronAffinity: 0, ionizationEnergies: [608],
    atomicRadiusCalculated: 186, covalentRadius: 186, vanDerWaalsRadius: undefined,
    density: 15.1, meltingPoint: 1173, boilingPoint: undefined,
    heatOfFusion: undefined, heatOfVaporization: undefined, specificHeatCapacity: undefined,
    thermalConductivity: undefined,
    abundances: { universe: 0, earth: 0, humanBody: 0 },
    discoveredBy: 'Glenn T. Seaborg, Albert Ghiorso, Stanley G. Thompson, Kenneth Street, Jr.', discoveredYear: '1950', discoveryCountry: 'États-Unis',
    namingOrigin: 'De la Californie',
    description: 'Le californium est utilisé pour démarrer les réacteurs nucléaires et dans les analyseurs de sol.',
    uses: ['Démarrage des réacteurs nucléaires', 'Analyseurs de sols et de minerais', 'Traitement du cancer', 'Détection de métaux'],
    isotopes: [{ massNumber: 251, naturalAbundance: 0, decayMode: 'alpha', halfLife: '898 ans' }],
    casNumber: '7440-71-3'
  },
  {
    atomicNumber: 99, symbol: 'Es', names: { french: 'Einsteinium', english: 'Einsteinium', latin: 'Einsteinium' },
    atomicMass: 252, category: 'actinide', group: undefined, period: 7, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'face-centered cubic',
    electronConfiguration: '[Rn] 5f¹¹ 7s²', valenceElectrons: 13, oxidationStates: ['+3'],
    electronegativityPauling: 1.3, electronegativityAllredRochow: 1.2,
    electronAffinity: 0, ionizationEnergies: [619],
    atomicRadiusCalculated: 186, covalentRadius: 186, vanDerWaalsRadius: undefined,
    density: 8.84, meltingPoint: 1133, boilingPoint: undefined,
    heatOfFusion: undefined, heatOfVaporization: undefined, specificHeatCapacity: undefined,
    thermalConductivity: undefined,
    abundances: { universe: 0, earth: 0, humanBody: 0 },
    discoveredBy: 'Albert Ghiorso et al.', discoveredYear: '1952', discoveryCountry: 'États-Unis',
    namingOrigin: 'D\'Albert Einstein',
    description: 'L\'einsteinium a été découvert dans les débris de la première bombe H. Il n\'existe qu\'en quantités infimes.',
    uses: ['Recherche scientifique uniquement'],
    isotopes: [{ massNumber: 252, naturalAbundance: 0, decayMode: 'alpha', halfLife: '471.7 jours' }],
    casNumber: '7429-92-7'
  },
  {
    atomicNumber: 100, symbol: 'Fm', names: { french: 'Fermium', english: 'Fermium', latin: 'Fermium' },
    atomicMass: 257, category: 'actinide', group: undefined, period: 7, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'face-centered cubic',
    electronConfiguration: '[Rn] 5f¹² 7s²', valenceElectrons: 14, oxidationStates: ['+3'],
    electronegativityPauling: 1.3, electronegativityAllredRochow: 1.2,
    electronAffinity: 0, ionizationEnergies: [627],
    atomicRadiusCalculated: 175, covalentRadius: 175, vanDerWaalsRadius: undefined,
    density: 9.7, meltingPoint: 1800, boilingPoint: undefined,
    heatOfFusion: undefined, heatOfVaporization: undefined, specificHeatCapacity: undefined,
    thermalConductivity: undefined,
    abundances: { universe: 0, earth: 0, humanBody: 0 },
    discoveredBy: 'Albert Ghiorso et al.', discoveredYear: '1952', discoveryCountry: 'États-Unis',
    namingOrigin: 'D\'Enrico Fermi',
    description: 'Le fermium est le dernier élément qui peut être produit par bombardement de neutrons.',
    uses: ['Recherche scientifique uniquement'],
    isotopes: [{ massNumber: 257, naturalAbundance: 0, decayMode: 'alpha', halfLife: '100.5 jours' }],
    casNumber: '7440-72-4'
  },
  {
    atomicNumber: 101, symbol: 'Md', names: { french: 'Mendélévium', english: 'Mendelevium', latin: 'Mendelevium' },
    atomicMass: 258, category: 'actinide', group: undefined, period: 7, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'face-centered cubic',
    electronConfiguration: '[Rn] 5f¹³ 7s²', valenceElectrons: 15, oxidationStates: ['+3', '+2'],
    electronegativityPauling: 1.3, electronegativityAllredRochow: 1.2,
    electronAffinity: 0, ionizationEnergies: [635],
    atomicRadiusCalculated: 171, covalentRadius: 171, vanDerWaalsRadius: undefined,
    density: 10.3, meltingPoint: 1100, boilingPoint: undefined,
    heatOfFusion: undefined, heatOfVaporization: undefined, specificHeatCapacity: undefined,
    thermalConductivity: undefined,
    abundances: { universe: 0, earth: 0, humanBody: 0 },
    discoveredBy: 'Albert Ghiorso, Glenn T. Seaborg, Gregory R. Choppin, Bernard G. Harvey, Stanley G. Thompson', discoveredYear: '1955', discoveryCountry: 'États-Unis',
    namingOrigin: 'De Dmitri Mendeleïev',
    description: 'Le mendélévium fut le premier élément produit un atome à la fois.',
    uses: ['Recherche scientifique uniquement'],
    isotopes: [{ massNumber: 258, naturalAbundance: 0, decayMode: 'alpha', halfLife: '51.5 jours' }],
    casNumber: '7440-11-1'
  },
  {
    atomicNumber: 102, symbol: 'No', names: { french: 'Nobélium', english: 'Nobelium', latin: 'Nobelium' },
    atomicMass: 259, category: 'actinide', group: undefined, period: 7, block: 'f',
    stateAtSTP: 'solid', crystalStructure: 'face-centered cubic',
    electronConfiguration: '[Rn] 5f¹⁴ 7s²', valenceElectrons: 16, oxidationStates: ['+3', '+2'],
    electronegativityPauling: 1.3, electronegativityAllredRochow: 1.2,
    electronAffinity: 0, ionizationEnergies: [642],
    atomicRadiusCalculated: 176, covalentRadius: 176, vanDerWaalsRadius: undefined,
    density: 9.9, meltingPoint: 1100, boilingPoint: undefined,
    heatOfFusion: undefined, heatOfVaporization: undefined, specificHeatCapacity: undefined,
    thermalConductivity: undefined,
    abundances: { universe: 0, earth: 0, humanBody: 0 },
    discoveredBy: 'Albert Ghiorso, Glenn T. Seaborg, Torbjørn Sikkeland, John R. Walton', discoveredYear: '1958', discoveryCountry: 'États-Unis',
    namingOrigin: 'D\'Alfred Nobel',
    description: 'Le nobélium est un élément synthétique extrêmement radioactif.',
    uses: ['Recherche scientifique uniquement'],
    isotopes: [{ massNumber: 259, naturalAbundance: 0, decayMode: 'alpha', halfLife: '58 minutes' }],
    casNumber: '10028-14-5'
  },
  {
    atomicNumber: 103, symbol: 'Lr', names: { french: 'Lawrencium', english: 'Lawrencium', latin: 'Lawrencium' },
    atomicMass: 262, category: 'actinide', group: 3, period: 7, block: 'd',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal',
    electronConfiguration: '[Rn] 5f¹⁴ 7s² 7p¹', valenceElectrons: 17, oxidationStates: ['+3'],
    electronegativityPauling: 1.3, electronegativityAllredRochow: 1.2,
    electronAffinity: 0, ionizationEnergies: [470],
    atomicRadiusCalculated: 161, covalentRadius: 161, vanDerWaalsRadius: undefined,
    density: undefined, meltingPoint: 1900, boilingPoint: undefined,
    heatOfFusion: undefined, heatOfVaporization: undefined, specificHeatCapacity: undefined,
    thermalConductivity: undefined,
    abundances: { universe: 0, earth: 0, humanBody: 0 },
    discoveredBy: 'Albert Ghiorso, Torbjørn Sikkeland, Almon E. Larsh, Robert M. Latimer', discoveredYear: '1961', discoveryCountry: 'États-Unis',
    namingOrigin: 'D\'Ernest Lawrence',
    description: 'Le lawrencium marque la fin de la série des actinides.',
    uses: ['Recherche scientifique uniquement'],
    isotopes: [{ massNumber: 262, naturalAbundance: 0, decayMode: 'alpha', halfLife: '3.6 heures' }],
    casNumber: '22537-19-5'
  },
];
