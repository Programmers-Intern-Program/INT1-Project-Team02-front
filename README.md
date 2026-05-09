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
VITE_DISCORD_CLIENT_ID=your_discord_client_id_here
VITE_API_BASE_URL=http://localhost:8080
VITE_ACTIVITY_API_BASE_URL=/api
```

`VITE_API_BASE_URL` is used in normal web mode. `VITE_ACTIVITY_API_BASE_URL` is used when the app detects a Discord Activity iframe with `window.self !== window.top`; `discord_activity=1` is supported only as a manual testing hint.

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

## Discord Activity Local Smoke Test

1. Set `VITE_DISCORD_CLIENT_ID` in `.env`.
2. Start Vite on port 5173.

```bash
npm run dev -- --port 5173
```

3. Start an HTTPS tunnel.

```bash
cloudflared tunnel --url http://localhost:5173
```

4. In Discord Developer Portal, enable Activities and map `/` to the cloudflared public URL.
5. Prefer `/activity` as the Activity Entry Point URL. If Discord opens `/`, the app detects iframe embedding and redirects to `/activity`.
6. Launch the Activity from Discord and verify SDK status, guild ID, and channel ID. If `channel_id` is unavailable, the app shows an empty state instead of crashing.

Use `/activity?debug=1` while testing to keep the Activity page from redirecting to the channel dashboard. The debug view shows SDK status, guild ID, channel ID, user ID, and the active API base URL.

API smoke tests inside Activity should wait until backend CORS allows the cloudflared URL. The final deployment target remains `app.flodi.site` for the frontend and `api.flodi.site` for the backend.

## Discord Activity Plan

The Discord boundary lives in `src/lib/discord/`. The current provider supports normal web mode and Discord Activity mode. Later production setup should use Discord URL Mapping with `/ -> app.flodi.site` and `/api -> api.flodi.site`.
