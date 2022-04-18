import { WeatherDisplay } from './WeatherDisplay';
import { mock_londonWeatherData } from '../mocks';
import type { Meta, Story } from '@storybook/react/types-6-0';
import type { WeatherDisplayProps } from './WeatherDisplay';

export default {
  title: 'WeatherDisplay',
  component: WeatherDisplay,
  parameters: {
    data: mock_londonWeatherData,
  },
} as Meta;

const Template: Story<WeatherDisplayProps> = args => <WeatherDisplay {...args} />;

export const Base = Template.bind({});
Base.args = {
  data: mock_londonWeatherData,
};
