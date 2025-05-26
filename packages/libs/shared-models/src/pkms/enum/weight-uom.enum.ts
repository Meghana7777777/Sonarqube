export enum WeightUOM {
  KILOGRAM = 'kilogram',        // Base metric unit
  GRAM = 'gram',                // For smaller, precise weights
  TONNE = 'tonne',              // Metric ton, used for larger weights
  LBS = 'LBS',              // Common in the US
  OUNCE = 'ounce',              // Smaller weight, used for detailed packaging
  SHORT_TON = 'short ton',      // US ton, ~2000 pounds
  LONG_TON = 'long ton',        // UK ton, ~2240 pounds
  CWT = 'hundredweight',        // 112 pounds in the UK, 100 pounds in the US
}

export const containerConversionToKilogram: Map<WeightUOM, number> = new Map([
  [WeightUOM.KILOGRAM, 1],           // 1 kg = 1 kg
  [WeightUOM.GRAM, 0.001],           // 1 g = 0.001 kg
  [WeightUOM.TONNE, 1000],           // 1 tonne = 1000 kg
  [WeightUOM.LBS, 0.453592],       // 1 lb = 0.453592 kg
  [WeightUOM.OUNCE, 0.0283495],      // 1 oz = 0.0283495 kg
  [WeightUOM.SHORT_TON, 907.18474],  // 1 US ton = 907.18474 kg
  [WeightUOM.LONG_TON, 1016.04691],  // 1 UK ton = 1016.04691 kg
  [WeightUOM.CWT, 50.802345],        // 1 hundredweight (US) = 50.802345 kg
]);

export const containerConversionToGram: Map<WeightUOM, number> = new Map([
  [WeightUOM.KILOGRAM, 1000],        // 1 kg = 1000 g
  [WeightUOM.GRAM, 1],               // 1 g = 1 g
  [WeightUOM.TONNE, 1_000_000],      // 1 tonne = 1,000,000 g
  [WeightUOM.LBS, 453.592],        // 1 lb = 453.592 g
  [WeightUOM.OUNCE, 28.3495],        // 1 oz = 28.3495 g
  [WeightUOM.SHORT_TON, 907_184.74], // 1 US ton = 907,184.74 g
  [WeightUOM.LONG_TON, 1_016_046.91],// 1 UK ton = 1,016,046.91 g
  [WeightUOM.CWT, 50_802.345],       // 1 hundredweight (US) = 50,802.345 g
]);

export const containerConversionToPound: Map<WeightUOM, number> = new Map([
  [WeightUOM.KILOGRAM, 2.20462],        // 1 kg = 2.20462 lb
  [WeightUOM.GRAM, 0.00220462],         // 1 g = 0.00220462 lb
  [WeightUOM.TONNE, 2204.62],           // 1 tonne = 2204.62 lb
  [WeightUOM.LBS, 1],                 // 1 lb = 1 lb
  [WeightUOM.OUNCE, 0.0625],            // 1 oz = 0.0625 lb
  [WeightUOM.SHORT_TON, 2000],          // 1 US ton = 2000 lb
  [WeightUOM.LONG_TON, 2240],           // 1 UK ton = 2240 lb
  [WeightUOM.CWT, 100],                 // 1 hundredweight (US) = 100 lb
]);
