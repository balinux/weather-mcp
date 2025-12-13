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

## Struktur Project

- `src/index.ts` - Server MCP utama
- `src/tools/weather.ts` - Definisi alat cuaca dan skema Zod
- `src/utils/weatherAPI.ts` - Logika pengambilan data cuaca dari API
- `dist/index.js` - Hasil build untuk deployment
