import * as E from 'fp-ts/Either';
import { OpenWeatherApi } from './openWeather';

/**
 * mock London coordinates
 */
export const mock_londonLocationData = { lon: -0.1278, lat: 51.5074, name: 'London' } as const;

/**
 * mock London weather data
 */
export const mock_londonWeatherData = {
  coord: { lon: -0.1278, lat: 51.5074 },
  weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
  base: 'stations',
  main: { temp: 291.25, feels_like: 290.66, temp_min: 289.34, temp_max: 292.53, pressure: 1023, humidity: 59 },
  visibility: 10000,
  wind: { speed: 3.6, deg: 210 },
  clouds: { all: 0 },
  dt: 1649936414,
  sys: {
    type: 2,
    id: 2019646,
    country: 'GB',
    sunrise: 1649912823,
    sunset: 1649962449,
  },
  timezone: 3600,
  id: 2643743,
  name: 'London',
  cod: 200,
} as const;

export const mock_openWeatherApi: OpenWeatherApi = {
  tryDirectGeocoding: async ({ city }: { city: string }) => {
    const ncity = city.toUpperCase();
    return E.right({
      data: [mock_londonLocationData].filter(x => x.name.toUpperCase().startsWith(ncity)),
    });
  },
  tryGetCurrentWeather: async () =>
    E.right({
      data: mock_londonWeatherData,
    }),
};
