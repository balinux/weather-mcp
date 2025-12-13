import { z } from "zod";
import { getRealWeather, WeatherData } from "../utils/weatherAPI";

export const getWeatherSchema = z.object({
    city: z.string().describe("The city to get weather for"),
});

export async function getWeather({city}:{city:string}): Promise<WeatherData> {
    return await getRealWeather(city);
}