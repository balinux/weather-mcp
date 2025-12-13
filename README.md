# weather-mcp

Model Context Protocol (MCP) server untuk layanan cuaca.

## Instalasi

```bash
bun install
```

## Penggunaan

### Development
```bash
bun run dev
```

### Production
```bash
# Build project
bun run build

# Jalankan hasil build
bun run start
```

### Testing Fungsi Cuaca
```bash
bun run test_weather.ts
```

Contoh output:
```
Testing weather function...
Weather result: {
  city: "Jakarta",
  temperature: "6°C",
  humidity: "74%",
  windSpeed: "16m/s",
  description: "snow",
  weatherIcon: "01d",
  pressure: "1048 hPa",
  visibility: "2097m",
}
```

## Konfigurasi API

Untuk menggunakan API cuaca sebenarnya, set environment variable berikut:

```bash
export OPENWEATHER_API_KEY="your_api_key_here"
```

Jika environment variable ini tidak diset, maka sistem akan menggunakan simulasi data cuaca.

## Integrasi dengan Qwen CLI

Untuk mengintegrasikan MCP ini dengan Qwen CLI atau sistem lain yang mendukung MCP:

1. Pastikan MCP server dapat dijalankan sebagai executable
2. Konfigurasi client MCP untuk menjalankan perintah: `bun run dist/index.js` atau `node dist/index.js`
3. MCP akan berkomunikasi melalui STDIO sesuai spesifikasi Model Context Protocol

## Implementasi di Gemini CLI

Untuk mengimplementasikan server MCP ini di Gemini CLI, tambahkan konfigurasi berikut ke file konfigurasi MCP Anda:

```json
{
  "theme": "GitHub",
  "selectedAuthType": "oauth-personal",
  "mcpServers": {
    "weather": {
      "command": "bun",
      "args": ["run", "/home/balinux/Documents/code/AI-LLM-dev/mcp/weather-mcp/dist/index.js"], // absolute path
      "env": {
        "OPENWEATHER_API_KEY": "key"
      }
    }
  }
}
```

Pastikan untuk:

1. Mengganti path `/home/balinux/Documents/code/AI-LLM-dev/mcp/weather-mcp/dist/index.js` dengan path absolut ke file hasil build Anda
2. Mengganti nilai `OPENWEATHER_API_KEY` dengan API key OpenWeather yang valid
3. Memastikan bahwa `bun` telah terinstal di sistem Anda
4. Menjalankan `bun run build` sebelum menggunakan server MCP untuk memastikan file `dist/index.js` tersedia

## Struktur Project

- `src/index.ts` - Server MCP utama
- `src/tools/weather.ts` - Definisi alat cuaca dan skema Zod
- `src/utils/weatherAPI.ts` - Logika pengambilan data cuaca dari API
- `dist/index.js` - Hasil build untuk deployment
