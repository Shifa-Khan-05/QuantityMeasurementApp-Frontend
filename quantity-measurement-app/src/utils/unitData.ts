export type UnitCategory = 'length' | 'temperature' | 'volume' | 'weight';

export interface UnitConfig {
  units: string[];
  ratios?: Record<string, number>;
}

export const UNIT_DATA: Record<UnitCategory, UnitConfig> = {
  length: {
    units: ["Metres", "Centimetres", "Inches", "Feet", "Kilometres", "Miles"],
    ratios: { Metres: 1, Centimetres: 100, Inches: 39.3701, Feet: 3.28084, Kilometres: 0.001, Miles: 0.000621 }
  },
  temperature: {
    units: ["Celsius", "Fahrenheit", "Kelvin"]
  },
  volume: {
    units: ["Litres", "Millilitres", "Gallons", "Quarts", "Cups"],
    ratios: { Litres: 1, Millilitres: 1000, Gallons: 0.264172, Quarts: 1.05669, Cups: 4.22675 }
  },
  weight: {
    units: ["Kilograms", "Grams", "Pounds", "Ounces"],
    ratios: { Kilograms: 1, Grams: 1000, Pounds: 2.20462, Ounces: 35.274 }
  }
};