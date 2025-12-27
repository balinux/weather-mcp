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
            {
                name: "searchDocument",
                description: "Search relevant context from uploaded documents using RAG",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "User question or search query",
                        },
                        sessionId: {
                            type: "string",
                            description: "Document session identifier",
                            default: "48de0b0a-8950-41ac-831b-08b3a96f4fe9",
                        },
                        topK: {
                            type: "number",
                            default: 5,
                        },
                    },
                    required: ["query", "sessionId"],
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

    // 📄 RAG TOOL
    if (name === "searchDocument") {
        try {
            const { query, sessionId, topK = 5 } = args as {
                query: string;
                sessionId: string;
                topK?: number;
            };

            const res = await fetch("http://localhost:3000/api/rag", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, sessionId, topK }),
            });

            if (!res.ok) {
                throw new Error(`RAG API error: ${res.status}`);
            }

            const data: any = await res.json();

            if (!data.context || data.context.length === 0) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "No relevant information found in the document.",
                        },
                    ],
                };
            }

            // MCP RETURN = CONTEXT, BUKAN JAWABAN
            return {
                content: data.context.map((c: any, i: number) => ({
                    type: "text",
                    text: `[Context ${i + 1}] ${c.text}`,
                })),
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `RAG Error: ${error instanceof Error ? error.message : String(error)}`,
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