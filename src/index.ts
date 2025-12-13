import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getWeather, getWeatherSchema } from "./tools/weather";

const server = new McpServer(
    {
        name: "weather-mcp",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {

            }
        }
    }
)

server.tool(
    "getWeather",
    getWeatherSchema,
    async ({ city }) => {
        return await getWeather({ city })
    }
)

const transport = new StdioServerTransport();
await server.connect(transport);

