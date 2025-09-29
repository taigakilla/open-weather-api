import { WeatherResponse } from './weather-response.interface';

export interface IWeatherService {
  getWeatherInfos(): Promise<WeatherResponse>;
}
