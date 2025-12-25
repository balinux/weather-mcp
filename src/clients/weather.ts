import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";


const transport = new StdioClientTransport({
    command: "bun",
    args: ["src/index.ts"],
})

const client = new Client({
    name: "weather-client",
    version: "1.0.0",
})

async function main() {
    await client.connect(transport);
    console.log("Weather client connected");

    // List tools
    const tools = await client.listTools();
    console.log("Tools:", tools.tools);

    // Call tool
    const result = await client.callTool({
        name: "getWeather",
        arguments: {
            city: "Surabaya",
        }
    })

    console.log("Result:", result);
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
