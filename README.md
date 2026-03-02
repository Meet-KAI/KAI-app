# KAI App

An event registration and knowledge hub platform for technologists. Built with Next.js 16, React 19 and TypeScript.

## Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 16.1.6 |
| React | 19.2.3 |
| TypeScript | 5.x |
| Node.js | 20+ |

## Prerequisites

- [Bun](https://bun.sh/) (package manager)
- [KAI Event Service API](https://github.com/Meet-KAI/KAI-event-service-api) running locally

### Installing Bun

If you don't have Bun installed, run one of the following:

**macOS / Linux:**

```bash
curl -fsSL https://bun.sh/install | bash
```

**Windows:**

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Via npm (any platform):**

```bash
npm install -g bun
```

After installing, verify it's working:

```bash
bun --version
```

## Getting Started

### 1. Start the API first

This app requires the **KAI Event Service API** to be running. See the [API repository](https://github.com/Meet-KAI/KAI-event-service-api) for setup instructions, or quickly:

```bash
cd KAI-event-service-api
uv sync
uv run uvicorn main:app --reload
```

The API runs on `http://localhost:8000` by default.

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment

Create a `.env.local` file in the project root:

```
API_BASE_URL=http://127.0.0.1:8000/api/v1
```

### 4. Run the app

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Important: In-Memory Data

All data in the API is stored **in memory** — there is no database. When the frontend starts, it automatically seeds the API with sample event data.

This means:

- **Restarting the API** will lose all created events, registrations, and any other changes
- **Restarting the frontend** will re-seed the sample data into the API
- Any events you create or registrations you make persist only as long as the API process is running

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start the development server |
| `bun run build` | Build for production |
| `bun start` | Start the production server |
| `bun run lint` | Run ESLint |
