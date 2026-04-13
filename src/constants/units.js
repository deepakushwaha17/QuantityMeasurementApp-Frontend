export const UNITS = {
  LengthUnit: ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
  WeightUnit: ['KILOGRAM', 'GRAM', 'POUND', 'MILIGRAM', 'TONNE'],
  TemperatureUnit: ['CELSIUS', 'FAHRENHEIT'],
  VolumeUnit: ['LITRE', 'MILLILITRE', 'GALLON'],
};

export const LABELS = {
  FEET: 'Feet',
  INCHES: 'Inches',
  YARDS: 'Yards',
  CENTIMETERS: 'Centimeters',
  KILOGRAM: 'Kilogram',
  GRAM: 'Gram',
  POUND: 'Pound',
  MILIGRAM: 'Milligram',
  TONNE: 'Tonne',
  CELSIUS: 'Celsius',
  FAHRENHEIT: 'Fahrenheit',
  LITRE: 'Litre',
  MILLILITRE: 'Millilitre',
  GALLON: 'Gallon',
};

export const MEASUREMENT_TYPES = [
  { key: 'LengthUnit', label: 'Length', icon: '📏' },
  { key: 'WeightUnit', label: 'Weight', icon: '⚖️' },
  { key: 'TemperatureUnit', label: 'Temperature', icon: '🌡️' },
  { key: 'VolumeUnit', label: 'Volume', icon: '🧴' },
];

export const ARITHMETIC_OPS = [
  { key: 'add', label: 'Add' },
  { key: 'add-with-target-unit', label: 'Add + Target' },
  { key: 'subtract', label: 'Subtract' },
  { key: 'subtract-with-target-unit', label: 'Sub + Target' },
  { key: 'divide', label: 'Divide' },
];
