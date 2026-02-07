// ============================================================
// DONNÉES - Périodes 1-3 (éléments 1-18)
// ============================================================

// Type pour les données d'entrée
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

export const elements: ElementInput[] = [
  // ============================================================
  // PÉRIODE 1
  // ============================================================
  {
    atomicNumber: 1, symbol: 'H',
    names: { french: 'Hydrogène', english: 'Hydrogen', latin: 'Hydrogenium', german: 'Wasserstoff' },
    atomicMass: 1.008, category: 'nonmetal', group: 1, period: 1, block: 's',
    stateAtSTP: 'gas', crystalStructure: 'hexagonal', magneticOrdering: 'diamagnetic',
    electronConfiguration: '1s¹', electronConfigurationShort: '1s¹', valenceElectrons: 1, oxidationStates: ['+1', '-1'],
    electronegativityPauling: 2.20, electronegativityAllredRochow: 2.20,
    electronAffinity: -72.8, ionizationEnergies: [1312],
    atomicRadiusCalculated: 53, covalentRadius: 31, vanDerWaalsRadius: 120,
    density: 0.00008988, molarVolume: 11.42,
    meltingPoint: 13.99, boilingPoint: 20.271,
    heatOfFusion: 0.117, heatOfVaporization: 0.904, specificHeatCapacity: 14.304, thermalConductivity: 0.1805,
    abundances: { universe: 75, solarSystem: 70.68, earth: 0.14, earthCrust: 0.14, ocean: 10.8, atmosphere: 0.000055, humanBody: 100000 },
    discoveredBy: 'Henry Cavendish', discoveredYear: '1766', discoveryCountry: 'Angleterre',
    namingOrigin: 'Du grec "hydro" (eau) et "genes" (générateur)',
    casNumber: '1333-74-0',
    description: 'L\'hydrogène est l\'élément le plus léger et le plus abondant de l\'univers. Il constitue environ 75% de la masse baryonique de l\'univers.',
    uses: ['Carburant pour fusées', 'Synthèse de l\'ammoniac (Haber-Bosch)', 'Hydrogénation des graisses', 'Méthode de soudure oxyhydrique', 'Combustible pour piles à combustible'],
    isotopes: [
      { massNumber: 1, naturalAbundance: 99.985, decayMode: 'stable' },
      { massNumber: 2, naturalAbundance: 0.015, decayMode: 'stable' },
      { massNumber: 3, naturalAbundance: 0, decayMode: 'beta-', halfLife: '12.32 ans' }
    ],
    images: {
      material: { 
        url: 'https://upload.wikimedia.org/wikipedia/commons/a/af/N%C3%A9ons.JPG',
        alt: 'Tube à décharge contenant de l\'hydrogène luminescent',
        credit: 'Rogilbert~commonswiki'
      },
      everyday: [
        { url: 'https://trustmyscience.com/wp-content/uploads/2018/12/bepicolombo-mission-mercure-vaisseau-propulseur-ionique-plus-puissant-du-monde.jpg', alt: 'Moteur de navette spatiale utilisant l\'hydrogène', credit: 'NASA' },
        { url: 'https://www.h2-mobile.fr/img/post-h2/atawey-station-hydrogene_180221.jpg', alt: 'Station de remplissage d\'hydrogène', credit: 'NREL' }
      ]
    }
  },
  {
    atomicNumber: 2, symbol: 'He',
    names: { french: 'Hélium', english: 'Helium', latin: 'Helium' },
    atomicMass: 4.0026, category: 'noble-gas', group: 18, period: 1, block: 's',
    stateAtSTP: 'gas', crystalStructure: 'face-centered cubic', magneticOrdering: 'diamagnetic',
    electronConfiguration: '1s²', electronConfigurationShort: '1s²', valenceElectrons: 2, oxidationStates: ['0'],
    electronegativityPauling: undefined,
    ionizationEnergies: [2372, 5250],
    atomicRadiusCalculated: 31, covalentRadius: 28, vanDerWaalsRadius: 140,
    density: 0.0001785, molarVolume: 21.0,
    meltingPoint: 0.95, boilingPoint: 4.222,
    heatOfFusion: 0.0138, heatOfVaporization: 0.0829, specificHeatCapacity: 5.193, thermalConductivity: 0.1513,
    abundances: { universe: 23, solarSystem: 27.43, earth: 0.0000017, earthCrust: 0.00000033, atmosphere: 5.2, humanBody: 0 },
    discoveredBy: 'Pierre Janssen, Norman Lockyer', discoveredYear: '1868', discoveryCountry: 'France/Angleterre',
    namingOrigin: 'Du grec "helios" (soleil)',
    casNumber: '7440-59-7',
    description: 'L\'hélium est le deuxième élément le plus léger et le deuxième plus abondant dans l\'univers. C\'est un gaz noble inerte.',
    uses: ['Gonflage de ballons et dirigeables', 'Refroidissement des aimants supraconducteurs (IRM)', 'Mélange respiratoire pour plongée profonde', 'Cryogénie', 'Chromatographie en phase gazeuse'],
    isotopes: [{ massNumber: 3, naturalAbundance: 0.000137, decayMode: 'stable' }, { massNumber: 4, naturalAbundance: 99.999863, decayMode: 'stable' }]
  },

  // ============================================================
  // PÉRIODE 2
  // ============================================================
  {
    atomicNumber: 3, symbol: 'Li',
    names: { french: 'Lithium', english: 'Lithium', latin: 'Lithium' },
    atomicMass: 6.94, category: 'alkali-metal', group: 1, period: 2, block: 's',
    stateAtSTP: 'solid', crystalStructure: 'body-centered cubic', magneticOrdering: 'paramagnetic',
    electronConfiguration: '1s² 2s¹', electronConfigurationShort: '[He] 2s¹', valenceElectrons: 1, oxidationStates: ['+1'],
    electronegativityPauling: 0.98, electronegativityAllredRochow: 0.97,
    electronAffinity: -59.6, ionizationEnergies: [520.2, 7298, 11815],
    atomicRadiusCalculated: 167, covalentRadius: 128, vanDerWaalsRadius: 182, ionicRadii: { '1+': 76 },
    density: 0.534, molarVolume: 13.02,
    meltingPoint: 453.65, boilingPoint: 1603,
    heatOfFusion: 3.00, heatOfVaporization: 147.1, specificHeatCapacity: 3.582, thermalConductivity: 84.8,
    abundances: { universe: 0.0000006, earth: 0.0017, earthCrust: 0.0017, humanBody: 0.03 },
    discoveredBy: 'Johan August Arfwedson', discoveredYear: '1817', discoveryCountry: 'Suède',
    namingOrigin: 'Du grec "lithos" (pierre)',
    casNumber: '7439-93-2',
    description: 'Le lithium est le métal alcalin le plus léger. Il est très réactif et flotte sur l\'eau. Il est essentiel pour les batteries rechargeables modernes.',
    uses: ['Batteries rechargeables (Li-ion)', 'Traitement du trouble bipolaire', 'Alliages légers (aérospatiale)', 'Graisses lubrifiantes', 'Production de verre et céramique'],
    isotopes: [{ massNumber: 6, naturalAbundance: 7.59, decayMode: 'stable' }, { massNumber: 7, naturalAbundance: 92.41, decayMode: 'stable' }]
  },
  {
    atomicNumber: 4, symbol: 'Be',
    names: { french: 'Béryllium', english: 'Beryllium', latin: 'Beryllium' },
    atomicMass: 9.0122, category: 'alkaline-earth', group: 2, period: 2, block: 's',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal', magneticOrdering: 'diamagnetic',
    electronConfiguration: '1s² 2s²', electronConfigurationShort: '[He] 2s²', valenceElectrons: 2, oxidationStates: ['+2'],
    electronegativityPauling: 1.57, electronegativityAllredRochow: 1.47,
    electronAffinity: 0, ionizationEnergies: [899.5, 1757, 14849],
    atomicRadiusCalculated: 112, covalentRadius: 96, ionicRadii: { '2+': 45 },
    density: 1.85, molarVolume: 4.87,
    meltingPoint: 1560, boilingPoint: 2742,
    heatOfFusion: 7.895, heatOfVaporization: 297, specificHeatCapacity: 1.825, thermalConductivity: 200,
    abundances: { universe: 0.000001, earth: 0.00019, earthCrust: 0.00019, humanBody: 0.000036 },
    discoveredBy: 'Louis Nicolas Vauquelin', discoveredYear: '1798', discoveryCountry: 'France',
    namingOrigin: 'Du minéral béryl',
    casNumber: '7440-41-7',
    description: 'Le béryllium est un métal alcalino-terreux léger et rigide. Il est transparent aux rayons X.',
    uses: ['Alliages légers (cuivre-béryllium)', 'Fenêtres de tubes à rayons X', 'Miroirs de télescopes spatiaux', 'Réacteurs nucléaires', 'Composants aérospatiaux'],
    biologicalRole: 'Toxique - peut causer la bérylliose',
    isotopes: [{ massNumber: 9, naturalAbundance: 100, decayMode: 'stable' }]
  },
  {
    atomicNumber: 5, symbol: 'B',
    names: { french: 'Bore', english: 'Boron', latin: 'Borum' },
    atomicMass: 10.81, category: 'metalloid', group: 13, period: 2, block: 'p',
    stateAtSTP: 'solid', crystalStructure: 'rhombohedral', magneticOrdering: 'diamagnetic',
    electronConfiguration: '1s² 2s² 2p¹', electronConfigurationShort: '[He] 2s² 2p¹', valenceElectrons: 3, oxidationStates: ['+3'],
    electronegativityPauling: 2.04, electronegativityAllredRochow: 2.01,
    electronAffinity: -26.7, ionizationEnergies: [800.6, 2427, 3660],
    atomicRadiusCalculated: 87, covalentRadius: 84, vanDerWaalsRadius: 192,
    density: 2.34, molarVolume: 4.62,
    meltingPoint: 2349, boilingPoint: 4200,
    heatOfFusion: 50.2, heatOfVaporization: 480, specificHeatCapacity: 1.026, thermalConductivity: 27.4,
    abundances: { universe: 0.0000001, earth: 0.0001, earthCrust: 0.0001, ocean: 4.44, humanBody: 0.00007 },
    discoveredBy: 'Joseph Louis Gay-Lussac, Louis Jacques Thénard, Humphry Davy', discoveredYear: '1808',
    namingOrigin: 'De l\'arabe "buraq" (borax)',
    casNumber: '7440-42-8',
    description: 'Le bore est un métalloïde rare utilisé dans les matériaux de haute résistance.',
    uses: ['Fibres de bore (matériaux composites)', 'Borosilicate de verre (Pyrex)', 'Détergents (borax)', 'Insecticides et herbicides', 'Contrôle des réactions nucléaires'],
    isotopes: [{ massNumber: 10, naturalAbundance: 19.9, decayMode: 'stable' }, { massNumber: 11, naturalAbundance: 80.1, decayMode: 'stable' }]
  },
  {
    atomicNumber: 6, symbol: 'C',
    names: { french: 'Carbone', english: 'Carbon', latin: 'Carboneum' },
    atomicMass: 12.011, category: 'nonmetal', group: 14, period: 2, block: 'p',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal', magneticOrdering: 'diamagnetic',
    electronConfiguration: '1s² 2s² 2p²', electronConfigurationShort: '[He] 2s² 2p²', valenceElectrons: 4, oxidationStates: ['+4', '+2', '-4'],
    electronegativityPauling: 2.55, electronegativityAllredRochow: 2.50,
    electronAffinity: -153.9, ionizationEnergies: [1086.5, 2352.6, 4620.5],
    atomicRadiusCalculated: 67, covalentRadius: 76, vanDerWaalsRadius: 170,
    density: 2.267, molarVolume: 5.31,
    meltingPoint: 3915, boilingPoint: 3915,
    heatOfFusion: 117.4, heatOfVaporization: 715, specificHeatCapacity: 0.709, thermalConductivity: 140,
    abundances: { universe: 0.5, solarSystem: 0.3, earth: 0.18, earthCrust: 0.18, ocean: 28, humanBody: 230000 },
    discoveredBy: 'Connu depuis l\'Antiquité',
    namingOrigin: 'Du latin "carbo" (charbon)',
    casNumber: '7440-44-0',
    description: 'Le carbone est la base de toute vie connue. Il existe sous plusieurs formes allotropes: diamant, graphite, fullerènes, graphène.',
    uses: ['Acier et métallurgie', 'Filaments de lampes', 'Balais de moteurs électriques', 'Électrodes', 'Fibres de carbone'],
    biologicalRole: 'Élément fondamental de toute molécule organique',
    isotopes: [
      { massNumber: 12, naturalAbundance: 98.93, decayMode: 'stable' },
      { massNumber: 13, naturalAbundance: 1.07, decayMode: 'stable' },
      { massNumber: 14, naturalAbundance: 0, decayMode: 'beta-', halfLife: '5730 ans' }
    ],
    images: {
      material: { 
        url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Min_graphite.jpg',
        alt: 'Bloc de graphite naturel',
        credit: 'Fluka / CC BY-SA'
      },
      everyday: [
        { url: 'https://www.i-diamants.com/medias_upload/moxie/wysiwyg/diamant-taille-ancienne.jpg', alt: 'Diamant taillé', credit: 'Mario Sarto / CC BY-SA' },
        { url: 'https://assets.pyc.fr/uploads/media/image/0001/57/d76afbbe3edbeb21014b88ab7a254ea98fe8cc77.jpeg', alt: 'Mine de crayon en graphite', credit: 'Nevit Dilmen / CC BY-SA' }
      ]
    }
  },
  {
    atomicNumber: 7, symbol: 'N',
    names: { french: 'Azote', english: 'Nitrogen', latin: 'Nitrogenium', german: 'Stickstoff' },
    atomicMass: 14.007, category: 'nonmetal', group: 15, period: 2, block: 'p',
    stateAtSTP: 'gas', crystalStructure: 'hexagonal', magneticOrdering: 'diamagnetic',
    electronConfiguration: '1s² 2s² 2p³', electronConfigurationShort: '[He] 2s² 2p³', valenceElectrons: 5, oxidationStates: ['+5', '+4', '+3', '+2', '+1', '-1', '-2', '-3'],
    electronegativityPauling: 3.04, electronegativityAllredRochow: 3.07,
    electronAffinity: -7, ionizationEnergies: [1402.3, 2856, 4578],
    atomicRadiusCalculated: 56, covalentRadius: 71, vanDerWaalsRadius: 155,
    density: 0.0012506, molarVolume: 13.54,
    meltingPoint: 63.15, boilingPoint: 77.36,
    heatOfFusion: 0.72, heatOfVaporization: 5.56, specificHeatCapacity: 1.04, thermalConductivity: 0.02583,
    abundances: { universe: 0.1, solarSystem: 0.1, earth: 0.002, earthCrust: 0.002, ocean: 0.5, atmosphere: 780840, humanBody: 26000 },
    discoveredBy: 'Daniel Rutherford', discoveredYear: '1772', discoveryCountry: 'Écosse',
    namingOrigin: 'Du grec "nitron" et "genes"',
    casNumber: '7727-37-9',
    description: 'L\'azote constitue 78% de l\'atmosphère terrestre. C\'est un élément essentiel pour la vie.',
    uses: ['Engrais azotés', 'Conservation des aliments', 'Réfrigération cryogénique', 'Explosifs', 'Électronique'],
    biologicalRole: 'Composant essentiel des acides aminés, protéines et ADN',
    isotopes: [{ massNumber: 14, naturalAbundance: 99.632, decayMode: 'stable' }, { massNumber: 15, naturalAbundance: 0.368, decayMode: 'stable' }]
  },
  {
    atomicNumber: 8, symbol: 'O',
    names: { french: 'Oxygène', english: 'Oxygen', latin: 'Oxygenium' },
    atomicMass: 15.999, category: 'nonmetal', group: 16, period: 2, block: 'p',
    stateAtSTP: 'gas', crystalStructure: 'cubic', magneticOrdering: 'paramagnetic',
    electronConfiguration: '1s² 2s² 2p⁴', electronConfigurationShort: '[He] 2s² 2p⁴', valenceElectrons: 6, oxidationStates: ['-2', '-1', '+1', '+2'],
    electronegativityPauling: 3.44, electronegativityAllredRochow: 3.50,
    electronAffinity: -141, ionizationEnergies: [1313.9, 3388, 5300],
    atomicRadiusCalculated: 48, covalentRadius: 66, vanDerWaalsRadius: 152,
    density: 0.001429, molarVolume: 11.19,
    meltingPoint: 54.36, boilingPoint: 90.20,
    heatOfFusion: 0.444, heatOfVaporization: 6.82, specificHeatCapacity: 0.918, thermalConductivity: 0.02658,
    abundances: { universe: 1, solarSystem: 0.77, earth: 29.5, earthCrust: 46.1, ocean: 857000, atmosphere: 209460, humanBody: 650000 },
    discoveredBy: 'Carl Wilhelm Scheele, Joseph Priestley', discoveredYear: '1774',
    namingOrigin: 'Du grec "oxy genes"',
    casNumber: '7782-44-7',
    description: 'L\'oxygène est l\'élément le plus abondant de la croûte terrestre et essentiel à la respiration.',
    uses: ['Respiration médicale', 'Soudage et découpage', 'Traitement des eaux usées', 'Propulsion des fusées', 'Industrie sidérurgique'],
    biologicalRole: 'Essentiel à la respiration cellulaire et production d\'ATP',
    isotopes: [
      { massNumber: 16, naturalAbundance: 99.757, decayMode: 'stable' },
      { massNumber: 17, naturalAbundance: 0.038, decayMode: 'stable' },
      { massNumber: 18, naturalAbundance: 0.205, decayMode: 'stable' }
    ]
  },
  {
    atomicNumber: 9, symbol: 'F',
    names: { french: 'Fluor', english: 'Fluorine', latin: 'Fluorum' },
    atomicMass: 18.998, category: 'halogen', group: 17, period: 2, block: 'p',
    stateAtSTP: 'gas', crystalStructure: 'cubic', magneticOrdering: 'diamagnetic',
    electronConfiguration: '1s² 2s² 2p⁵', electronConfigurationShort: '[He] 2s² 2p⁵', valenceElectrons: 7, oxidationStates: ['-1'],
    electronegativityPauling: 3.98, electronegativityAllredRochow: 4.10,
    electronAffinity: -328, ionizationEnergies: [1681, 3374, 6050],
    atomicRadiusCalculated: 42, covalentRadius: 57, vanDerWaalsRadius: 147,
    density: 0.001696, molarVolume: 11.2,
    meltingPoint: 53.53, boilingPoint: 85.03,
    heatOfFusion: 0.51, heatOfVaporization: 6.51, specificHeatCapacity: 0.824, thermalConductivity: 0.0277,
    abundances: { universe: 0.00004, earth: 0.0585, earthCrust: 0.0585, ocean: 1.3, humanBody: 37 },
    discoveredBy: 'Henri Moissan', discoveredYear: '1886', discoveryCountry: 'France',
    namingOrigin: 'Du minéral "fluorite"',
    casNumber: '7782-41-4',
    description: 'Le fluor est l\'élément le plus électronégatif et le plus réactif. C\'est un gaz jaune-vert très toxique.',
    uses: ['Production d\'acide fluorhydrique', 'Fluoration de l\'eau potable', 'Pâtes dentifrices au fluorure', 'Téflon (PTFE)', 'Réfrigérants'],
    biologicalRole: 'Essentiel pour la santé dentaire',
    isotopes: [{ massNumber: 19, naturalAbundance: 100, decayMode: 'stable' }]
  },
  {
    atomicNumber: 10, symbol: 'Ne',
    names: { french: 'Néon', english: 'Neon', latin: 'Neon' },
    atomicMass: 20.180, category: 'noble-gas', group: 18, period: 2, block: 'p',
    stateAtSTP: 'gas', crystalStructure: 'face-centered cubic', magneticOrdering: 'diamagnetic',
    electronConfiguration: '1s² 2s² 2p⁶', electronConfigurationShort: '[He] 2s² 2p⁶', valenceElectrons: 8, oxidationStates: ['0'],
    electronegativityPauling: undefined,
    ionizationEnergies: [2080.7, 3952, 6122],
    atomicRadiusCalculated: 38, covalentRadius: 58, vanDerWaalsRadius: 154,
    density: 0.0008999, molarVolume: 13.9,
    meltingPoint: 24.56, boilingPoint: 27.07,
    heatOfFusion: 0.335, heatOfVaporization: 1.71, specificHeatCapacity: 1.03, thermalConductivity: 0.0491,
    abundances: { universe: 0.13, earth: 0.00000003, earthCrust: 0.00000003, atmosphere: 18.18, humanBody: 0 },
    discoveredBy: 'William Ramsay, Morris Travers', discoveredYear: '1898', discoveryCountry: 'Écosse',
    namingOrigin: 'Du grec "neos" (nouveau)',
    casNumber: '7440-01-9',
    description: 'Le néon est un gaz noble rouge-orangé utilisé dans les enseignes lumineuses.',
    uses: ['Enseignes lumineuses', 'Indicateurs de haute tension', 'Lampes à décharge', 'Cryogénie', 'Tubes à vide'],
    isotopes: [
      { massNumber: 20, naturalAbundance: 90.48, decayMode: 'stable' },
      { massNumber: 21, naturalAbundance: 0.27, decayMode: 'stable' },
      { massNumber: 22, naturalAbundance: 9.25, decayMode: 'stable' }
    ]
  },

  // ============================================================
  // PÉRIODE 3
  // ============================================================
  {
    atomicNumber: 11, symbol: 'Na',
    names: { french: 'Sodium', english: 'Sodium', latin: 'Natrium' },
    atomicMass: 22.990, category: 'alkali-metal', group: 1, period: 3, block: 's',
    stateAtSTP: 'solid', crystalStructure: 'body-centered cubic', magneticOrdering: 'paramagnetic',
    electronConfiguration: '[Ne] 3s¹', electronConfigurationShort: '[Ne] 3s¹', valenceElectrons: 1, oxidationStates: ['+1'],
    electronegativityPauling: 0.93, electronegativityAllredRochow: 1.01,
    electronAffinity: -52.8, ionizationEnergies: [495.8, 4562, 6910],
    atomicRadiusCalculated: 190, covalentRadius: 166, vanDerWaalsRadius: 227, ionicRadii: { '1+': 102 },
    density: 0.971, molarVolume: 23.68,
    meltingPoint: 370.87, boilingPoint: 1156,
    heatOfFusion: 2.60, heatOfVaporization: 97.4, specificHeatCapacity: 1.228, thermalConductivity: 141,
    abundances: { universe: 0.002, earth: 0.23, earthCrust: 2.36, ocean: 10800, humanBody: 1400 },
    discoveredBy: 'Humphry Davy', discoveredYear: '1807', discoveryCountry: 'Angleterre',
    namingOrigin: 'Du latin "natrium"',
    casNumber: '7440-23-5',
    description: 'Le sodium est un métal alcalin mou et très réactif. C\'est un électrolyte essentiel.',
    uses: ['Lampes à vapeur de sodium', 'Alliage NaK', 'Production de tétréthylplomb', 'Feux d\'artifice', 'Sel de table'],
    biologicalRole: 'Électrolyte essentiel pour la transmission nerveuse',
    isotopes: [{ massNumber: 23, naturalAbundance: 100, decayMode: 'stable' }]
  },
  {
    atomicNumber: 12, symbol: 'Mg',
    names: { french: 'Magnésium', english: 'Magnesium', latin: 'Magnesium' },
    atomicMass: 24.305, category: 'alkaline-earth', group: 2, period: 3, block: 's',
    stateAtSTP: 'solid', crystalStructure: 'hexagonal', magneticOrdering: 'paramagnetic',
    electronConfiguration: '[Ne] 3s²', electronConfigurationShort: '[Ne] 3s²', valenceElectrons: 2, oxidationStates: ['+2'],
    electronegativityPauling: 1.31, electronegativityAllredRochow: 1.23,
    electronAffinity: 0, ionizationEnergies: [737.7, 1450.7, 7732.7],
    atomicRadiusCalculated: 145, covalentRadius: 141, vanDerWaalsRadius: 173, ionicRadii: { '2+': 72 },
    density: 1.738, molarVolume: 13.99,
    meltingPoint: 923, boilingPoint: 1363,
    heatOfFusion: 8.48, heatOfVaporization: 128, specificHeatCapacity: 1.023, thermalConductivity: 156,
    abundances: { universe: 0.06, earth: 2.9, earthCrust: 2.33, ocean: 1290, humanBody: 270 },
    discoveredBy: 'Humphry Davy', discoveredYear: '1808', discoveryCountry: 'Angleterre',
    namingOrigin: 'De Magnésie, Grèce',
    casNumber: '7439-95-4',
    description: 'Le magnésium est un métal léger utilisé dans les alliages. Il brille avec une lumière blanche vive.',
    uses: ['Alliages légers', 'Feux de Bengale', 'Anodes sacrificielles', 'Chlorure de magnésium', 'Suppléments'],
    biologicalRole: 'Cofacteur d\'enzymes, essentiel pour la photosynthèse',
    isotopes: [
      { massNumber: 24, naturalAbundance: 78.99, decayMode: 'stable' },
      { massNumber: 25, naturalAbundance: 10.00, decayMode: 'stable' },
      { massNumber: 26, naturalAbundance: 11.01, decayMode: 'stable' }
    ]
  },
  {
    atomicNumber: 13, symbol: 'Al',
    names: { french: 'Aluminium', english: 'Aluminum', latin: 'Aluminium' },
    atomicMass: 26.982, category: 'post-transition-metal', group: 13, period: 3, block: 'p',
    stateAtSTP: 'solid', crystalStructure: 'face-centered cubic', magneticOrdering: 'paramagnetic',
    electronConfiguration: '[Ne] 3s² 3p¹', electronConfigurationShort: '[Ne] 3s² 3p¹', valenceElectrons: 3, oxidationStates: ['+3'],
    electronegativityPauling: 1.61, electronegativityAllredRochow: 1.47,
    electronAffinity: -41.8, ionizationEnergies: [577.5, 1816.7, 2744.8],
    atomicRadiusCalculated: 118, covalentRadius: 121, vanDerWaalsRadius: 184, ionicRadii: { '3+': 53.5 },
    density: 2.70, molarVolume: 9.99,
    meltingPoint: 933.47, boilingPoint: 2792,
    heatOfFusion: 10.71, heatOfVaporization: 284, specificHeatCapacity: 0.897, thermalConductivity: 237,
    abundances: { universe: 0.005, earth: 1.5, earthCrust: 8.23, humanBody: 0.9 },
    discoveredBy: 'Hans Christian Ørsted', discoveredYear: '1825', discoveryCountry: 'Danemark',
    namingOrigin: 'De l\'alun',
    casNumber: '7429-90-5',
    description: 'L\'aluminium est le métal le plus abondant dans la croûte terrestre. Léger et résistant à la corrosion.',
    uses: ['Matériaux de construction', 'Emballages', 'Transport', 'Câbles électriques', 'Ustensiles de cuisine'],
    isotopes: [{ massNumber: 27, naturalAbundance: 100, decayMode: 'stable' }],
    images: {
      material: {
        url: 'https://themetalsfactory.com/wp-content/uploads/2023/03/Aluminium-Blocks-Manufacturers-Dealers-Factory.jpg',
        alt: 'Blocs d\'aluminium',
        credit: 'Jurii / CC BY'
      },
      everyday: [
        { url: 'https://beymedias.brightspotcdn.com/dims4/default/018e7a4/2147483647/strip/true/crop/3888x2027+0+278/resize/840x438!/quality/90/?url=http%3A%2F%2Fl-opinion-brightspot.s3.amazonaws.com%2Fd0%2F52%2F74920085657dc60dff3feda256d1%2Falu.jpg', alt: 'Canettes de soda en aluminium', credit: 'CC0' },
        { url: 'https://www.datocms-assets.com/10385/1552422115-aluminium-1.jpg', alt: 'Papier d\'aluminium', credit: 'Wdwd / CC BY-SA' }
      ]
    }
  },
  {
    atomicNumber: 14, symbol: 'Si',
    names: { french: 'Silicium', english: 'Silicon', latin: 'Silicium' },
    atomicMass: 28.085, category: 'metalloid', group: 14, period: 3, block: 'p',
    stateAtSTP: 'solid', crystalStructure: 'face-centered cubic', magneticOrdering: 'diamagnetic',
    electronConfiguration: '[Ne] 3s² 3p²', electronConfigurationShort: '[Ne] 3s² 3p²', valenceElectrons: 4, oxidationStates: ['+4', '-4'],
    electronegativityPauling: 1.90, electronegativityAllredRochow: 1.74,
    electronAffinity: -134.1, ionizationEnergies: [786.5, 1577.1, 3231.6],
    atomicRadiusCalculated: 111, covalentRadius: 111, vanDerWaalsRadius: 210,
    density: 2.3296, molarVolume: 12.06,
    meltingPoint: 1687, boilingPoint: 3265,
    heatOfFusion: 50.21, heatOfVaporization: 359, specificHeatCapacity: 0.705, thermalConductivity: 149,
    abundances: { universe: 0.07, earth: 15.2, earthCrust: 28.2, ocean: 2.2, humanBody: 260 },
    discoveredBy: 'Jöns Jacob Berzelius', discoveredYear: '1824', discoveryCountry: 'Suède',
    namingOrigin: 'Du latin "silex"',
    casNumber: '7440-21-3',
    description: 'Le silicium est la base de l\'électronique moderne. C\'est le deuxième élément le plus abondant de la croûte terrestre.',
    uses: ['Semi-conducteurs', 'Cellules solaires', 'Verre et céramique', 'Silicones', 'Lubrifiants'],
    isotopes: [
      { massNumber: 28, naturalAbundance: 92.223, decayMode: 'stable' },
      { massNumber: 29, naturalAbundance: 4.685, decayMode: 'stable' },
      { massNumber: 30, naturalAbundance: 3.092, decayMode: 'stable' }
    ]
  },
  {
    atomicNumber: 15, symbol: 'P',
    names: { french: 'Phosphore', english: 'Phosphorus', latin: 'Phosphorus' },
    atomicMass: 30.974, category: 'nonmetal', group: 15, period: 3, block: 'p',
    stateAtSTP: 'solid', crystalStructure: 'triclinic', magneticOrdering: 'diamagnetic',
    electronConfiguration: '[Ne] 3s² 3p³', electronConfigurationShort: '[Ne] 3s² 3p³', valenceElectrons: 5, oxidationStates: ['+5', '+3', '-3'],
    electronegativityPauling: 2.19, electronegativityAllredRochow: 2.06,
    electronAffinity: -72.0, ionizationEnergies: [1011.8, 1907, 2914.1],
    atomicRadiusCalculated: 98, covalentRadius: 107, vanDerWaalsRadius: 180,
    density: 1.82, molarVolume: 17.02,
    meltingPoint: 317.3, boilingPoint: 550,
    heatOfFusion: 0.66, heatOfVaporization: 12.4, specificHeatCapacity: 0.769, thermalConductivity: 0.236,
    abundances: { universe: 0.0007, earth: 0.105, earthCrust: 0.105, ocean: 0.06, humanBody: 11000 },
    discoveredBy: 'Hennig Brand', discoveredYear: '1669', discoveryCountry: 'Allemagne',
    namingOrigin: 'Du grec "phos phoros" (porteur de lumière)',
    casNumber: '7723-14-0',
    description: 'Le phosphore existe sous plusieurs formes allotropes. Il est essentiel à la vie.',
    uses: ['Engrais', 'Allumettes', 'Détergents', 'Pyrotechnie', 'Plastifiants'],
    biologicalRole: 'Essentiel pour les os, les dents, l\'ADN et l\'ATP',
    isotopes: [{ massNumber: 31, naturalAbundance: 100, decayMode: 'stable' }]
  },
  {
    atomicNumber: 16, symbol: 'S',
    names: { french: 'Soufre', english: 'Sulfur', latin: 'Sulphur' },
    atomicMass: 32.06, category: 'nonmetal', group: 16, period: 3, block: 'p',
    stateAtSTP: 'solid', crystalStructure: 'orthorhombic', magneticOrdering: 'diamagnetic',
    electronConfiguration: '[Ne] 3s² 3p⁴', electronConfigurationShort: '[Ne] 3s² 3p⁴', valenceElectrons: 6, oxidationStates: ['+6', '+4', '-2'],
    electronegativityPauling: 2.58, electronegativityAllredRochow: 2.44,
    electronAffinity: -200.4, ionizationEnergies: [999.6, 2252, 3357],
    atomicRadiusCalculated: 88, covalentRadius: 105, vanDerWaalsRadius: 180,
    density: 2.067, molarVolume: 15.50,
    meltingPoint: 388.36, boilingPoint: 717.8,
    heatOfFusion: 1.727, heatOfVaporization: 45, specificHeatCapacity: 0.71, thermalConductivity: 0.205,
    abundances: { universe: 0.05, earth: 0.042, earthCrust: 0.042, humanBody: 1000 },
    discoveredBy: 'Connu depuis l\'Antiquité',
    namingOrigin: 'Du sanskrit "sulvere"',
    casNumber: '7704-34-9',
    description: 'Le soufre est un élément jaune brillant utilisé depuis l\'Antiquité. Essentiel à la vie.',
    uses: ['Acide sulfurique', 'Vulcanisation du caoutchouc', 'Fongicides', 'Poudre à canon', 'Shampooings'],
    biologicalRole: 'Composant des acides aminés soufrés',
    isotopes: [
      { massNumber: 32, naturalAbundance: 94.99, decayMode: 'stable' },
      { massNumber: 33, naturalAbundance: 0.75, decayMode: 'stable' },
      { massNumber: 34, naturalAbundance: 4.25, decayMode: 'stable' },
      { massNumber: 36, naturalAbundance: 0.01, decayMode: 'stable' }
    ]
  },
  {
    atomicNumber: 17, symbol: 'Cl',
    names: { french: 'Chlore', english: 'Chlorine', latin: 'Chlorum' },
    atomicMass: 35.45, category: 'halogen', group: 17, period: 3, block: 'p',
    stateAtSTP: 'gas', crystalStructure: 'orthorhombic', magneticOrdering: 'diamagnetic',
    electronConfiguration: '[Ne] 3s² 3p⁵', electronConfigurationShort: '[Ne] 3s² 3p⁵', valenceElectrons: 7, oxidationStates: ['+7', '+5', '+1', '-1'],
    electronegativityPauling: 3.16, electronegativityAllredRochow: 2.83,
    electronAffinity: -349, ionizationEnergies: [1251.2, 2298, 3822],
    atomicRadiusCalculated: 79, covalentRadius: 99, vanDerWaalsRadius: 175,
    density: 0.003214, molarVolume: 17.45,
    meltingPoint: 171.6, boilingPoint: 239.11,
    heatOfFusion: 6.406, heatOfVaporization: 20.41, specificHeatCapacity: 0.479, thermalConductivity: 0.0089,
    abundances: { universe: 0.0001, earth: 0.017, earthCrust: 0.017, ocean: 19400, humanBody: 1200 },
    discoveredBy: 'Carl Wilhelm Scheele', discoveredYear: '1774', discoveryCountry: 'Suède',
    namingOrigin: 'Du grec "chloros" (vert-jaune)',
    casNumber: '7782-50-5',
    description: 'Le chlore est un gaz jaune-vert toxique utilisé comme désinfectant.',
    uses: ['Désinfection de l\'eau', 'Production de PVC', 'Blanchiment', 'Solvants', 'Pesticides'],
    biologicalRole: 'Électrolyte essentiel',
    isotopes: [
      { massNumber: 35, naturalAbundance: 75.76, decayMode: 'stable' },
      { massNumber: 37, naturalAbundance: 24.24, decayMode: 'stable' }
    ]
  },
  {
    atomicNumber: 18, symbol: 'Ar',
    names: { french: 'Argon', english: 'Argon', latin: 'Argon' },
    atomicMass: 39.948, category: 'noble-gas', group: 18, period: 3, block: 'p',
    stateAtSTP: 'gas', crystalStructure: 'face-centered cubic', magneticOrdering: 'diamagnetic',
    electronConfiguration: '[Ne] 3s² 3p⁶', electronConfigurationShort: '[Ne] 3s² 3p⁶', valenceElectrons: 8, oxidationStates: ['0'],
    electronegativityPauling: undefined,
    ionizationEnergies: [1520.6, 2665.8, 3931],
    atomicRadiusCalculated: 71, covalentRadius: 97, vanDerWaalsRadius: 188,
    density: 0.0017837, molarVolume: 22.4,
    meltingPoint: 83.8, boilingPoint: 87.3,
    heatOfFusion: 1.18, heatOfVaporization: 6.53, specificHeatCapacity: 0.52, thermalConductivity: 0.01772,
    abundances: { universe: 0.02, earth: 0.00004, earthCrust: 0.00004, atmosphere: 9340, humanBody: 0 },
    discoveredBy: 'Lord Rayleigh, William Ramsay', discoveredYear: '1894', discoveryCountry: 'Écosse',
    namingOrigin: 'Du grec "argos" (inactif)',
    casNumber: '7440-37-1',
    description: 'L\'argon est le gaz noble le plus abondant dans l\'atmosphère terrestre (0.93%).',
    uses: ['Gaz de protection en soudure', 'Ampoules à incandescence', 'Double vitrage', 'Cryochirurgie', 'Datation archéologique'],
    isotopes: [
      { massNumber: 36, naturalAbundance: 0.3365, decayMode: 'stable' },
      { massNumber: 38, naturalAbundance: 0.0632, decayMode: 'stable' },
      { massNumber: 40, naturalAbundance: 99.6003, decayMode: 'stable' }
    ]
  },
];
