// ============================================
// SPECTRES D'ÉMISSION DES ÉLÉMENTS
// ============================================

export interface SpectralLine {
  wavelength: number;
  intensity: number;
  color: string;
}

// Raies spectrales principales par élément
export const elementSpectra: Record<number, SpectralLine[]> = {
  1: [ // Hydrogène
    { wavelength: 656.3, intensity: 100, color: '#FF0000' },
    { wavelength: 486.1, intensity: 80, color: '#0088FF' },
    { wavelength: 434.0, intensity: 60, color: '#6600FF' },
    { wavelength: 410.2, intensity: 40, color: '#8800FF' },
  ],
  2: [ // Hélium
    { wavelength: 587.6, intensity: 100, color: '#FFDD00' },
    { wavelength: 447.1, intensity: 90, color: '#0066FF' },
    { wavelength: 438.8, intensity: 80, color: '#6600FF' },
    { wavelength: 501.6, intensity: 70, color: '#00FF88' },
    { wavelength: 667.8, intensity: 60, color: '#FF0000' },
  ],
  3: [ // Lithium
    { wavelength: 670.8, intensity: 100, color: '#FF0000' },
    { wavelength: 610.4, intensity: 60, color: '#FF4400' },
  ],
  11: [ // Sodium
    { wavelength: 589.0, intensity: 100, color: '#FFAA00' },
    { wavelength: 589.6, intensity: 100, color: '#FFAA00' },
    { wavelength: 568.2, intensity: 50, color: '#FFCC00' },
  ],
  19: [ // Potassium
    { wavelength: 766.5, intensity: 100, color: '#CC0000' },
    { wavelength: 769.9, intensity: 100, color: '#CC0000' },
    { wavelength: 404.4, intensity: 60, color: '#6600FF' },
  ],
  20: [ // Calcium
    { wavelength: 422.7, intensity: 100, color: '#8800FF' },
    { wavelength: 430.3, intensity: 70, color: '#6600FF' },
    { wavelength: 616.2, intensity: 60, color: '#FF0000' },
  ],
  29: [ // Cuivre
    { wavelength: 324.7, intensity: 100, color: '#FF00FF' },
    { wavelength: 327.4, intensity: 100, color: '#FF00FF' },
    { wavelength: 578.2, intensity: 80, color: '#FFDD00' },
    { wavelength: 510.5, intensity: 60, color: '#00FF00' },
  ],
  80: [ // Mercure
    { wavelength: 546.1, intensity: 100, color: '#00FF00' },
    { wavelength: 435.8, intensity: 90, color: '#0066FF' },
    { wavelength: 577.0, intensity: 80, color: '#FFDD00' },
    { wavelength: 579.1, intensity: 80, color: '#FFDD00' },
    { wavelength: 404.7, intensity: 70, color: '#8800FF' },
  ],
  10: [ // Néon
    { wavelength: 585.2, intensity: 100, color: '#FFAA00' },
    { wavelength: 640.2, intensity: 90, color: '#FF0000' },
    { wavelength: 588.2, intensity: 90, color: '#FFCC00' },
    { wavelength: 616.4, intensity: 80, color: '#FF0000' },
    { wavelength: 633.4, intensity: 80, color: '#FF0000' },
    { wavelength: 650.7, intensity: 80, color: '#FF0000' },
  ],
  18: [ // Argon
    { wavelength: 696.5, intensity: 100, color: '#FF0000' },
    { wavelength: 706.7, intensity: 90, color: '#FF0000' },
    { wavelength: 750.4, intensity: 80, color: '#CC0000' },
    { wavelength: 763.5, intensity: 70, color: '#AA0000' },
    { wavelength: 415.9, intensity: 60, color: '#8800FF' },
  ],
  26: [ // Fer
    { wavelength: 358.1, intensity: 90, color: '#FF00FF' },
    { wavelength: 371.9, intensity: 85, color: '#FF00FF' },
    { wavelength: 373.7, intensity: 90, color: '#FF00FF' },
    { wavelength: 374.9, intensity: 85, color: '#FF00FF' },
    { wavelength: 382.0, intensity: 80, color: '#FF00FF' },
    { wavelength: 385.9, intensity: 80, color: '#FF00FF' },
    { wavelength: 404.6, intensity: 70, color: '#8800FF' },
    { wavelength: 438.4, intensity: 70, color: '#6600FF' },
    { wavelength: 440.5, intensity: 75, color: '#6600FF' },
    { wavelength: 441.5, intensity: 70, color: '#6600FF' },
    { wavelength: 516.7, intensity: 80, color: '#00FF00' },
    { wavelength: 526.6, intensity: 80, color: '#00FF00' },
    { wavelength: 532.4, intensity: 85, color: '#00FF00' },
    { wavelength: 536.7, intensity: 80, color: '#00FF00' },
  ],
  12: [ // Magnésium
    { wavelength: 280.3, intensity: 100, color: '#FF00FF' },
    { wavelength: 279.6, intensity: 90, color: '#FF00FF' },
    { wavelength: 285.2, intensity: 90, color: '#FF00FF' },
    { wavelength: 516.7, intensity: 100, color: '#00FF00' },
    { wavelength: 517.3, intensity: 100, color: '#00FF00' },
    { wavelength: 518.4, intensity: 100, color: '#00FF00' },
  ],
  13: [ // Aluminium
    { wavelength: 396.2, intensity: 100, color: '#8800FF' },
    { wavelength: 394.4, intensity: 90, color: '#8800FF' },
    { wavelength: 309.3, intensity: 80, color: '#FF00FF' },
    { wavelength: 308.2, intensity: 70, color: '#FF00FF' },
  ],
  6: [ // Carbone
    { wavelength: 426.7, intensity: 80, color: '#8800FF' },
    { wavelength: 426.9, intensity: 90, color: '#8800FF' },
    { wavelength: 477.1, intensity: 70, color: '#0066FF' },
    { wavelength: 477.6, intensity: 80, color: '#0066FF' },
  ],
  7: [ // Azote
    { wavelength: 409.9, intensity: 80, color: '#8800FF' },
    { wavelength: 410.3, intensity: 90, color: '#8800FF' },
    { wavelength: 411.0, intensity: 85, color: '#8800FF' },
    { wavelength: 566.7, intensity: 70, color: '#00FF00' },
  ],
  8: [ // Oxygène
    { wavelength: 777.2, intensity: 100, color: '#AA0000' },
    { wavelength: 777.4, intensity: 100, color: '#AA0000' },
    { wavelength: 777.5, intensity: 100, color: '#AA0000' },
    { wavelength: 407.2, intensity: 80, color: '#8800FF' },
    { wavelength: 407.5, intensity: 90, color: '#8800FF' },
  ],
  17: [ // Chlore
    { wavelength: 479.5, intensity: 80, color: '#0066FF' },
    { wavelength: 481.0, intensity: 90, color: '#0066FF' },
    { wavelength: 542.3, intensity: 70, color: '#00FF00' },
    { wavelength: 544.3, intensity: 80, color: '#00FF00' },
  ],
  9: [ // Fluor
    { wavelength: 623.9, intensity: 80, color: '#FF0000' },
    { wavelength: 634.9, intensity: 70, color: '#FF0000' },
    { wavelength: 641.4, intensity: 60, color: '#FF0000' },
  ],
  15: [ // Phosphore
    { wavelength: 253.4, intensity: 100, color: '#FF00FF' },
    { wavelength: 255.3, intensity: 90, color: '#FF00FF' },
    { wavelength: 255.5, intensity: 80, color: '#FF00FF' },
  ],
  16: [ // Soufre
    { wavelength: 469.4, intensity: 80, color: '#0066FF' },
    { wavelength: 469.6, intensity: 90, color: '#0066FF' },
    { wavelength: 488.3, intensity: 70, color: '#0066FF' },
    { wavelength: 488.6, intensity: 80, color: '#0066FF' },
  ],
};

export function getElementSpectrum(atomicNumber: number): SpectralLine[] {
  return elementSpectra[atomicNumber] || [];
}
