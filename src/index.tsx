import * as DIO from 'io-ts/Decoder';
import { BrowserRouter } from 'react-router-dom';
import { makeOpenWeatherApi } from 'openWeather';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import env from 'react-dotenv';
import reportWebVitals from './reportWebVitals';

import './index.scss';

const DIO_env = DIO.struct({
  OPENWEATHER_API_KEY: DIO.string,
});

const envE = DIO_env.decode(env);
if (envE._tag === 'Left') {
  throw new Error('Env is not defined');
}
const { OPENWEATHER_API_KEY } = envE.right;

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App
        openWeatherApi={makeOpenWeatherApi({
          appid: OPENWEATHER_API_KEY,
        })}
      />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
