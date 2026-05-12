# Talkie Frontend

Talkie is a Discord-inspired chat client built with React, Vite, TypeScript, and Chakra UI. This repository contains the frontend application for the Talkie platform, including realtime chat views, settings, admin screens, and the friend management flow.

## Features

- Realtime chat UI with channels, direct messages, member lists, and notifications
- Settings area for profile and account management
- Admin management screens for roles, permissions, and access control
- Friends flow with searchable user selection instead of manual ID entry
- Auth-aware routing and role-based page protection

## Requirements

- Node.js 16+ recommended
- Backend API running locally at `http://localhost:3000`, or a custom API URL set through `VITE_API_URL`

## Scripts

- `npm run dev` - start the Vite development server
- `npm run build` - type-check and create a production build
- `npm run serve` - preview the production build locally

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the frontend:

```bash
npm run dev
```

3. If your backend does not run on the default port, create a `.env` file with:

```bash
VITE_API_URL=http://localhost:3000
```

## Notes

- The frontend expects the backend to expose the chat, user, role, access-control, and friend APIs used by the app.
- Authentication state is cached in local storage so the UI can restore the current session on reload.

