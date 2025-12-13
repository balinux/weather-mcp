import type { WeatherData, RawWeatherApiResponse } from "../types/weather";

/**
 * Fetches weather data from OpenWeatherMap API
 * @param city Name of the city to get weather for
 * @returns Promise resolving to weather data
 */
export async function getRealWeather(city: string): Promise<WeatherData> {
    // Using OpenWeatherMap API - you'll need to set OPENWEATHER_API_KEY environment variable
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!API_KEY || API_KEY === "demo_key") {
        console.warn("OPENWEATHER_API_KEY environment variable not set, using simulation");
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        // Return simulated data based on city name
        return {
            city: city,
            temperature: `${Math.floor(Math.random() * 40 - 5)}°C`,
            humidity: `${Math.floor(Math.random() * 40 + 40)}%`,
            windSpeed: `${Math.floor(Math.random() * 20 + 5)}m/s`,
            description: ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 'shower rain', 'rain', 'thunderstorm', 'snow', 'mist'][Math.floor(Math.random() * 9)],
            weatherIcon: '01d',
            pressure: `${Math.floor(Math.random() * 50 + 1000)} hPa`,
            visibility: `${Math.floor(Math.random() * 5000 + 1000)}m`
        };
    }

    try {
        // PERBAIKAN: Ganti backtick dengan parentheses
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            // PERBAIKAN: Ganti backtick dengan parentheses
            throw new Error(
                `Weather API error: ${response.status} ${response.statusText}`
            );
        }

        const data: RawWeatherApiResponse = (await response.json()) as RawWeatherApiResponse;

        return {
            city: data.name,
            temperature: `${Math.round(data.main.temp)}°C`,
            humidity: `${data.main.humidity}%`,
            windSpeed: data.wind?.speed ? `${data.wind.speed}m/s` : 'N/A',
            description: data.weather[0]?.description || 'N/A',
            weatherIcon: data.weather[0]?.icon || '01d',
            pressure: `${data.main.pressure} hPa`,
            visibility: data.visibility ? `${data.visibility}m` : 'N/A'
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}