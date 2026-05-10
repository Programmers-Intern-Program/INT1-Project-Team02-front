# Flodi Front

Flodi Discord meeting assistant web dashboard MVP. The dashboard is designed to become the main UI while the Discord bot stays focused on entry points, notifications, and quick actions.

## Run

```bash
npm install
npm run dev
npm run build
npm run lint
```

The dev server runs with Vite. By default it is available at `http://localhost:5173` when the port is free.

## Environment

Copy `.env.example` to `.env` when local overrides are needed.

```env
VITE_API_BASE_URL=http://localhost:8080
```

`VITE_API_BASE_URL` points the dashboard at the Spring Boot API server.

## Backend Connection

This frontend expects the Spring Boot API server from the backend repository to run at `VITE_API_BASE_URL`. API calls are isolated under `src/api/` and unwrap backend responses shaped like `{ resultCode, msg, data }`.

Referenced backend contract document:

`C:\Users\c\Desktop\devcourse\INT1-Project-Team02\docs\references\internal-api-contracts.md`

Also referenced actual backend controllers under:

`C:\Users\c\Desktop\devcourse\INT1-Project-Team02\src\main\java\com\flodiback\api`

Currently used implemented APIs:

- `GET /api/v1/projects`
- `GET /api/v1/projects/{id}`
- `GET /api/v1/projects/channel/{channelId}`
- `GET /api/v1/projects/{projectId}/decisions`
- `GET /api/v1/meetings/{id}`
- `GET /internal/v1/meetings/{meetingId}/context`

Known gaps handled with empty states:

- Project-specific meeting list API
- Project-level work log list API
- Dedicated channel dashboard aggregate API

## Web Dashboard Tunnel

Start Vite on port 5173.

```bash
npm run dev -- --port 5173
```

Expose the dashboard when Discord bot links need to open it from outside localhost.

```bash
cloudflared tunnel --url http://localhost:5173
```

Set the backend bot's `FRONTEND_BASE_URL` to that public dashboard URL so meeting messages link to the web dashboard.
