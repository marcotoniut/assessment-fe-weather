import { flow } from 'fp-ts/lib/function';

export const COORDINATES_DEGREE_FIXED = 2;

export function kelvinToCelsius(x: number): number {
  return x - 273.15;
}

export function displayCelsius(x: number): string {
  return `${x.toFixed(1)} °C`;
}

export const displayAsCelsius = flow(kelvinToCelsius, displayCelsius);
export const displayAsDegrees = flow(kelvinToCelsius, x => `${x.toFixed(0)}°`);

export function knotsToKmh(x: number): number {
  return x * 1.85;
}
