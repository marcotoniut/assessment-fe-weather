import { Box } from '@material-ui/core';
import { TryGetCurrentWeatherData } from '../openWeather';
import { boxSize, fontSizes, secondaryColor, spacing } from '../theme';
import { displayAsCelsius, displayAsDegrees, knotsToKmh } from '../units';
import React from 'react';

type Variant = 'night' | 'day';

export interface WeatherDisplayProps {
  readonly variant?: Variant;
  readonly data: TryGetCurrentWeatherData;
}

export const WeatherDisplay = ({ data: { main, wind, weather }, variant = 'day' }: WeatherDisplayProps) => (
  <Box style={componentStyle(variant)}>
    <Box style={{ fontSize: fontSizes.large, fontWeight: 500 }}>
      {weather.map(w => (
        <div key={`${w.description}${w.main}`}>
          {w.main} <em>({w.description})</em>
        </div>
      ))}
    </Box>
    <Box>
      <div style={{ display: 'flex', gap: spacing.small, alignItems: 'baseline' }}>
        <span style={{ fontSize: fontSizes.large }}>{displayAsCelsius(main.temp)}</span>
        <span style={{ color: variant === 'day' ? secondaryColor : undefined }}>
          (feels like {displayAsDegrees(main.feels_like)})
        </span>
      </div>
      <div style={{ display: 'flex', gap: spacing.small }}>
        <span>{displayAsDegrees(main.temp_min)}</span>
        <span style={{ color: variant === 'day' ? secondaryColor : undefined }}>{displayAsDegrees(main.temp_max)}</span>
      </div>
    </Box>
    <Box style={{ display: 'flex', gap: spacing.default }}>
      <span>Humidity: {main.humidity} %</span>
      <span>Pressure: {main.pressure} hPa</span>
    </Box>
    <Box style={{ display: 'flex', gap: spacing.default }}>
      <span>{knotsToKmh(wind.speed).toFixed(2)} KPH</span>
      <span>{wind.deg} degrees</span>
    </Box>
  </Box>
);

const componentStyle = (variant: Variant) =>
  ({
    padding: spacing.default,
    borderRadius: spacing.small,
    boxShadow: '0 2px 4px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.23)',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.small,
    width: boxSize,
    ...(variant === 'night'
      ? {
          background: 'linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 100%)',
          color: 'white',
        }
      : {
          background: 'linear-gradient(0deg, rgb(150, 200, 245) 0%, rgb(235, 250, 255) 100%)',
          color: 'black',
        }),
  } as const);
