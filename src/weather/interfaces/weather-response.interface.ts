export interface WeatherInfo {
  description: string;
}

export interface TempInfos {
  temp: number;
  feels_like: number;
}

export interface WeatherResponse {
  city: string;
  temp: number;
  feels_like: number;
  main: string;
}
