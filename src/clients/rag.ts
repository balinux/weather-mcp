import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
    command: "bun",
    args: ["src/index.ts"], // MCP RAG server
});

const client = new Client({
    name: "rag-client",
    version: "1.0.0",
});

const SESSION_ID = "48de0b0a-8950-41ac-831b-08b3a96f4fe9";

async function main() {
    await client.connect(transport);
    console.log("✅ RAG MCP client connected");

    // 1️⃣ List tools
    const tools = await client.listTools();
    console.log(
        "Available tools:",
        tools.tools.map((t) => t.name)
    );

    // 2️⃣ Search document (RAG)
    const result: any = await client.callTool({
        name: "searchDocument",
        arguments: {
            query: "siapa itu rio?",
            sessionId: SESSION_ID,
            topK: 3,
        },
    });

    console.log("\n🔎 Retrieved Context:");
    console.log("━━━━━━━━━━━━━━━━━━━━");

    result.content.forEach((item: any, i: number) => {
        if (item.type === "text") {
            console.log(`${i + 1}. ${item.text}`);
        }
    });
}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
