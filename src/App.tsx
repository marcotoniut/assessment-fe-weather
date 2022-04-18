import * as O from 'fp-ts/Option';
import { Box, Link } from '@material-ui/core';
import { COORDINATES_DEGREE_FIXED } from 'units';
import { GeoLocation, OpenWeatherApi, TryGetCurrentWeatherData } from 'openWeather';
import { WeatherDisplay } from './components/WeatherDisplay';
import { boxSize, secondaryColor, spacing } from 'theme';
import { constNull, pipe } from 'fp-ts/lib/function';
import { useSearchParams } from 'react-router-dom';
import Input from '@material-ui/core/Input';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  readonly openWeatherApi: OpenWeatherApi;
}

function App({ openWeatherApi }: Props): JSX.Element {
  const [params, setParams] = useSearchParams();
  const q = params.get('q');

  const [searchInputValue, setSearchInputValue] = useState(() => q ?? '');

  const [fetchingCity, setFetchingCity] = useState(false);
  const [locations, setLocations] = useState<readonly GeoLocation[]>([]);
  const [weatherDataO, setWeatherO] = useState<O.Option<TryGetCurrentWeatherData>>(() => O.none);

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  useEffect(() => {
    setWeatherO(O.none);
    setFetchingCity(true);
    setParams({ q: searchInputValue });

    clearTimeout(Number(timeoutRef.current));
    if (searchInputValue) {
      timeoutRef.current = setTimeout(() => {
        (async () => {
          const res = await openWeatherApi.tryDirectGeocoding({ city: searchInputValue });
          setFetchingCity(false);
          if (res._tag === 'Right') {
            setLocations(res.right.data);
          } else {
            setLocations([]);
          }
        })();
      }, 400);
    }
  }, [searchInputValue]);

  const match = locations.find(x => x.name.toUpperCase() === searchInputValue.toUpperCase());

  useEffect(() => {
    if (match) {
      (async () => {
        const res = await openWeatherApi.tryGetCurrentWeather(match);
        pipe(
          res,
          O.fromEither,
          O.map(x => x.data),
          setWeatherO,
        );
      })();
    }
  }, [match]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
      <Box style={{ marginTop: '10em' }}>
        <Box style={{ marginBottom: spacing.default, padding: spacing.default, width: boxSize }}>
          <Input
            style={{ width: '100%' }}
            value={searchInputValue}
            onChange={e => setSearchInputValue(e.target.value)}
          />
          <div data-testid="city-input-feedback">
            {locations.length === 0 ? (
              fetchingCity ? (
                <></>
              ) : !searchInputValue ? (
                <>Search by city name</>
              ) : (
                <>
                  Can't find a match for <em>{searchInputValue}</em>
                </>
              )
            ) : !match ? (
              <>
                {'Did you mean '}
                <Link href={`?q=${locations[0].name}`}>{locations[0].name}</Link>
                {'?'}
              </>
            ) : (
              <div style={{ display: 'flex', color: secondaryColor }}>
                <span>
                  Weather in {match.name} (
                  {`${Math.abs(match.lat).toFixed(COORDINATES_DEGREE_FIXED)} ${match.lat > 0 ? 'N' : 'S'}`}
                  {', '}
                  {`${Math.abs(match.lon).toFixed(COORDINATES_DEGREE_FIXED)} ${match.lon > 0 ? 'W' : 'E'}`})
                </span>
              </div>
            )}
          </div>
        </Box>
        {pipe(
          weatherDataO,
          O.fold(constNull, weatherData => (
            <WeatherDisplay
              data={weatherData}
              variant={
                weatherData.dt < weatherData.sys.sunrise || weatherData.sys.sunset < weatherData.dt ? 'night' : 'day'
              }
            />
          )),
        )}
      </Box>
    </div>
  );
}

export default App;
