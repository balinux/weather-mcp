import { z } from "zod";
import { getRealWeather } from "../utils/weatherAPI";
import type { WeatherData } from "../types/weather";

export const getWeatherSchema = z.object({
  city: z.string().optional().describe("The city to get weather for"),
  location: z.string().optional().describe("Alternative location parameter for compatibility"),
}).refine(
  (data) => data.city || data.location,
  {
    message: "Either city or location must be provided",
  }
);

export async function getWeather({
  city,
  location
}: {
  city?: string;
  location?: string;
}): Promise<WeatherData> {
  // Use location if provided, otherwise fall back to city
  const targetLocation = location || city;
  
  if (!targetLocation) {
    throw new Error("Either city or location must be provided");
  }
  
  return await getRealWeather(targetLocation);
}