/**
 * Interface representing coordinate data from the API
 */
export interface Coord {
    lon: number;
    lat: number;
}

/**
 * Interface representing individual weather condition from the API
 */
export interface WeatherCondition {
    id: number;
    main: string;
    description: string;
    icon: string;
}

/**
 * Interface representing main weather data from the API
 */
export interface MainWeather {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
}

/**
 * Interface representing wind data from the API
 */
export interface Wind {
    speed: number;
    deg: number;
    gust?: number;
}

/**
 * Interface representing rain data from the API
 */
export interface Rain {
    "1h"?: number;
}

/**
 * Interface representing cloud data from the API
 */
export interface Clouds {
    all: number;
}

/**
 * Interface representing system data from the API
 */
export interface Sys {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
}

/**
 * Interface representing complete weather data from the API
 */
export interface RawWeatherApiResponse {
    coord: Coord;
    weather: WeatherCondition[];
    base: string;
    main: MainWeather;
    visibility: number;
    wind?: Wind;
    rain?: Rain;
    clouds?: Clouds;
    dt: number;
    sys: Sys;
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

/**
 * Interface representing simplified weather data for the MCP tool
 */
export interface WeatherData {
    isFake: string;
    city: string;
    temperature: string;
    humidity: string;
    windSpeed: string;
    description?: string;
    weatherIcon?: string;
    pressure?: string;
    visibility?: string;
}
