import { MemoryRouter } from 'react-router';
import { mock_openWeatherApi } from 'mocks';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import React from 'react';

const testId = 'city-input-feedback';

test('displays weather information', async () => {
  render(
    <MemoryRouter initialEntries={['/?q=London']}>
      <App openWeatherApi={mock_openWeatherApi} />
    </MemoryRouter>,
  );
  await waitFor(() => {
    const el = screen.getByTestId(testId);
    expect(el).toHaveTextContent(/Weather in London/i);
  });
});

test('cant find a matching city', async () => {
  render(
    <MemoryRouter initialEntries={['/?q=fakecity']}>
      <App openWeatherApi={mock_openWeatherApi} />
    </MemoryRouter>,
  );
  await waitFor(() => {
    const el = screen.getByTestId(testId);
    expect(el).toHaveTextContent(/Can't find a match for fakecity/i);
  });
});

test('autocomplete suggestion', async () => {
  render(
    <MemoryRouter initialEntries={['/?q=lon']}>
      <App openWeatherApi={mock_openWeatherApi} />
    </MemoryRouter>,
  );
  await waitFor(() => {
    const el = screen.getByTestId(testId);
    expect(el).toHaveTextContent(/Did you mean London\?/i);
  });
});
