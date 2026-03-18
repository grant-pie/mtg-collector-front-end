# MTG Collector - Front End

A Magic: The Gathering card collection management app built with Nuxt 3 and Vue 3. A single admin manages users and their card collections, while users can organize their cards into decks and trade with other players.

## Features

### Admin
- Manage registered users and their card collections (add/remove cards by Scryfall ID)
- Create and manage tournaments, including standings and win/loss results
- View all users with their roles and usernames

### Users
- Browse and search your card collection with filters (name, color, type, rarity, set)
- Organize cards into decks — create, edit, and delete decks
- Mark cards as willing to trade and propose trades with other players
- Browse the trading marketplace to find cards from other players
- Receive real-time notifications for trade activity
- View tournament rankings and standings

## Tech Stack

- **Nuxt 3** / **Vue 3** — SSR-enabled frontend framework
- **Pinia** — State management
- **Tailwind CSS** — Styling
- **Socket.io** — Real-time notifications
- **Axios** — HTTP client
- **Google OAuth 2.0** — Authentication

## Authentication

Login is handled via Google OAuth. JWT access tokens are stored in `localStorage` with optional remember-me persistence. Token refresh runs automatically every 10 minutes when remember me is enabled.

## Setup

### Prerequisites

- Node.js 18+
- A running instance of the MTG Collector backend API

### Environment Variables

Create a `.env` file in the project root:

```env
API_BASE_URL=http://localhost:3001
WS_BASE_URL=http://localhost:3001
```

### Install dependencies

```bash
npm install
```

### Development server

```bash
npm run dev
```

Runs on `http://localhost:3000`.

### Production build

```bash
npm run build
npm run preview
```

## Deployment

The app is configured for GitHub Pages deployment at the `/mtg-collector-front-end/` base path. See the [Nuxt deployment docs](https://nuxt.com/docs/getting-started/deployment) for other deployment targets.
