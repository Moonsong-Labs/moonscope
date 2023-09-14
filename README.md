# MoonScope

## Installation

### 1. Install Bun

```bash
curl -fsSL https://bun.sh/install | bash 
```

### 2. Install dependencies

```bash
bun install
```

### 3. Setup environment variables / DB

> [!IMPORTANT]  
> This assumes you already have a [PostgreSQL](https://www.postgresql.org/) database to connect to. You can create your own local one, connected to a remote one - but that's left upto you to decide!

This relies on connecting to a Postgres database via the `DB_CONNECTION_STRING` env var.

You can set this in a `.env` file in the root of the project, or in your shell environment.

```bash
export DB_CONNECTION_STRING="postgres://user:password@localhost:5432/reports"
```

## Development

To start the development server run:

```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.
