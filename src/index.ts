import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getWeather, getWeatherSchema } from "./tools/weather.js";

const server = new Server(
    {
        name: "weather-mcp",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// List tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "getWeather",
                description: "Get current weather information for a city. You can use either 'city' or 'location' parameter.",
                inputSchema: {
                    type: "object",
                    properties: {
                        city: {
                            type: "string",
                            description: "City name (e.g., 'Surabaya', 'Jakarta', 'London')",
                        },
                        location: {
                            type: "string",
                            description: "Location name (alternative to city)",
                        },
                    },
                },
            },
        ],
    };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "getWeather") {
        try {
            // Validasi dengan Zod schema
            const validatedArgs = getWeatherSchema.parse(args);

            // Panggil fungsi getWeather
            const weatherData = await getWeather({
                city: validatedArgs.city,
                location: validatedArgs.location,
            });

            // Format response yang lebih readable
            const formattedResponse = `🌤️ Weather in ${weatherData.city}:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
fake or not: ${weatherData.isFake}
🌡️  Temperature: ${weatherData.temperature}
💧 Humidity: ${weatherData.humidity}
💨 Wind Speed: ${weatherData.windSpeed}
🔽 Pressure: ${weatherData.pressure}
👁️  Visibility: ${weatherData.visibility}
☁️  Condition: ${weatherData.description}`;

            return {
                content: [
                    {
                        type: "text",
                        text: formattedResponse,
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
                isError: true,
            };
        }
    }

    return {
        content: [
            {
                type: "text",
                text: `Unknown tool: ${name}`,
            },
        ],
        isError: true,
    };
});

// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});