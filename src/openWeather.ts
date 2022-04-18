import * as DIO from 'io-ts/Decoder';
import * as E from 'fp-ts/Either';
import Axios from 'axios';

export interface OpenWeatherApiConfig {
  readonly appid: string;
}

export interface TryGetCurrentWeatherParams {
  readonly lat: number;
  readonly lon: number;
}

export interface TryDirectGeocodingParams {
  readonly city: string;
}

const DIO_GeoLocation = DIO.readonly(
  DIO.struct({
    lat: DIO.number,
    lon: DIO.number,
    name: DIO.string,
  }),
);
export type GeoLocation = DIO.TypeOf<typeof DIO_GeoLocation>;

const DIO_TryDirectGeocodingResponse = DIO.struct({
  data: DIO.readonly(DIO.array(DIO_GeoLocation)),
});

const DIO_TryGetCurrentWeatherResponse = DIO.struct({
  data: DIO.struct({
    main: DIO.struct({
      temp: DIO.number,
      feels_like: DIO.number,
      temp_min: DIO.number,
      temp_max: DIO.number,
      pressure: DIO.number,
      humidity: DIO.number,
    }),
    weather: DIO.readonly(
      DIO.array(
        DIO.struct({
          description: DIO.string,
          main: DIO.string,
        }),
      ),
    ),
    wind: DIO.struct({
      speed: DIO.number,
      deg: DIO.number,
    }),
    dt: DIO.number,
    // timezone: DIO.number,
    sys: DIO.struct({
      // TODO actual data is tied to timezone attribute
      sunrise: DIO.number,
      sunset: DIO.number,
    }),
  }),
});

type TryGetCurrentWeatherResponse = DIO.TypeOf<typeof DIO_TryGetCurrentWeatherResponse>;

export interface OpenWeatherApi {
  readonly tryDirectGeocoding: (
    _: TryDirectGeocodingParams,
  ) => Promise<E.Either<unknown, DIO.TypeOf<typeof DIO_TryDirectGeocodingResponse>>>;
  readonly tryGetCurrentWeather: (
    _: TryGetCurrentWeatherParams,
  ) => Promise<E.Either<unknown, TryGetCurrentWeatherResponse>>;
}

export type TryGetCurrentWeatherData = TryGetCurrentWeatherResponse['data'];

export const makeOpenWeatherApi = ({ appid }: OpenWeatherApiConfig): OpenWeatherApi => ({
  tryDirectGeocoding: async (params: TryDirectGeocodingParams) => {
    const res = await Axios.get<unknown, unknown>(`http://api.openweathermap.org/geo/1.0/direct`, {
      params: {
        q: params.city,
        appid,
      },
    });
    console.log({ res });
    const y = DIO_TryDirectGeocodingResponse.decode(res);
    return y;
  },
  tryGetCurrentWeather: async (params: TryGetCurrentWeatherParams) => {
    const res = await Axios.get<unknown, unknown>('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        ...params,
        appid,
      },
    });
    console.log({ res });
    const y = DIO_TryGetCurrentWeatherResponse.decode(res);
    return y;
  },
});
