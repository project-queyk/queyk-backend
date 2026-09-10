# Queyk Backend: Earthquake Telemetry & Emergency Notification API

[![Express.js](https://img.shields.io/badge/Express-5.1-black.svg?logo=express)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.44-C5F74F.svg?logo=drizzle)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg?logo=postgresql)](https://www.postgresql.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-black.svg?logo=socket.io)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Queyk Backend is the central server application powering the Queyk disaster resilience ecosystem. Built with Express 5, TypeScript, Drizzle ORM, and PostgreSQL, it ingests live seismic telemetry from IoT hardware, streams real-time updates over WebSockets, generates contextual AI emergency alerts, and coordinates multi-channel notification dispatches across Web, Mobile, and Desktop clients.

---

## 1. Overview & Key Capabilities

The backend serves as the core broker between the Omron D7S seismic sensor units, database persistence, external communication channels, and the client applications.

### Key Capabilities

- **Seismic Telemetry Ingestion & Downsampling**: High-throughput REST endpoints receiving Spectral Intensity (SI) and Peak Ground Acceleration (PGA) metrics from IoT sensors, with intelligent downsampling algorithms for performant client chart rendering across 24-hour, 7-day, and 30-day spans.
- **Real-Time WebSocket Streaming**: Bi-directional communication channel using Socket.io for instantaneous metric broadcasts to web and desktop command center dashboards.
- **AI-Driven Emergency Alert Generation**: Integrations with **Google Gemini** and **Anthropic Claude** to generate concise, urgent, non-panicking emergency notification copy tailored to detected earthquake magnitude levels.
- **Multi-Channel Notification Dispatch**:
  - **Expo Push Notifications**: High-priority push alerts delivered directly to mobile clients running iOS and Android.
  - **Web Push Notifications**: Browser-level push alerts using the standard VAPID protocol for progressive web apps.
  - **Emergency Email Blasts**: Automated notification dispatch via Nodemailer and SMTP to campus leadership and emergency response personnel.
- **Unified Identity & Access Management**:
  - Google OAuth profile ingestion with institutional email domain enforcement (`SCHOOL_EMAIL_ADDRESS`).
  - Cryptographically signed stateless JWT issuance (`JWT_SECRET`) for authenticated client sessions across Web, Mobile, and Desktop.
  - Role-based authorization (`admin` / `user`) protecting sensitive administrative endpoints.
- **Device Health & Watchdog Monitoring**: Automated background interval service checking sensor connectivity, signal quality, and battery thresholds.

---

## 2. Architecture / How it Works

```mermaid
flowchart TD
    subgraph Ingestion ["IoT Sensor Ingestion"]
        A[ESP32 Seismic Sensor] -->|"POST /v1/api/iot/readings"| B[Reading Controller]
        A -->|"POST /v1/api/iot/earthquakes"| C[Earthquake Controller]
    end

    subgraph CoreEngine ["Queyk API Engine & Services"]
        B --> D[(PostgreSQL via Drizzle ORM)]
        C --> D
        B --> E[Socket.io Broadcast]
        C --> F{Magnitude >= 2.0?}
        F -- Yes --> G[AI Alert Generation Service\nGemini / Claude API]
        G --> H[Notification Pipeline]
    end

    subgraph NotificationChannels ["Multi-Channel Dispatch"]
        H --> I[Expo Server SDK -> Mobile Push]
        H --> J[Web Push / VAPID -> Web Browsers]
        H --> K[Nodemailer / SMTP -> Emergency Email]
    end

    subgraph Clients ["Connected Clients"]
        E --> L[Queyk Web Dashboard]
        E --> M[Queyk Desktop Client]
        I --> N[Queyk Mobile App]
        J --> L
    end
```

---

## 3. Tech Stack

- **Runtime & Language**: [Node.js](https://nodejs.org/) (v20+) & [TypeScript 5.9](https://www.typescriptlang.org/)
- **Framework**: [Express 5.1](https://expressjs.com/) with [Helmet](https://helmetjs.github.io/) & [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM 0.44](https://orm.drizzle.team/) & [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)
- **Real-Time Communication**: [Socket.io 4.8](https://socket.io/)
- **AI Integrations**: [@google/genai](https://www.npmjs.com/package/@google/genai) & [@anthropic-ai/sdk](https://www.npmjs.com/package/@anthropic-ai/sdk)
- **Push & Messaging**:
  - [expo-server-sdk](https://github.com/expo/expo-server-sdk-node) (Expo Push Notifications)
  - [web-push](https://github.com/web-push-libs/web-push) (VAPID Web Push)
  - [nodemailer](https://nodemailer.com/) (Emergency email dispatches)
- **Validation**: [Zod v4](https://zod.dev/) & [validator.js](https://github.com/validatorjs/validator.js)
- **Security & Tokens**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) & [nanoid](https://github.com/ai/nanoid)

---

## 4. API Endpoints Reference

### 🔐 Authentication & Users (`/v1/api/users`)
- `POST /v1/api/users` — User sign-in / registration (issues stateless JWT).
- `GET /v1/api/users` — Paginated user directory (admin).
- `GET /v1/api/users/:userId` — Retrieve user profile.
- `PATCH /v1/api/users/:userId/role` — Update user permissions (`user` / `admin`).
- `PATCH /v1/api/users/:userId/notifications` — Toggle general alert notifications.
- `PATCH /v1/api/users/:userId/push-notifications` — Toggle mobile push preferences.
- `PATCH /v1/api/users/:userId/push-token` — Update mobile Expo push token.
- `PATCH /v1/api/users/:userId/phone-number` — Update contact phone number for SMS.
- `PATCH /v1/api/users/:userId/location-status` — Update campus safety/evacuation status.
- `DELETE /v1/api/users/:userId` — Remove user profile.

### 📈 Seismic Telemetry (`/v1/api/readings` & `/v1/api/iot/readings`)
- `POST /v1/api/iot/readings` — Ingest 5-minute SI, PGA, battery, and signal strength summary from IoT unit.
- `GET /v1/api/readings` — Retrieve readings with query parameters (`range`, `platform`, downsampled resolution).

### 🚨 Seismic Events (`/v1/api/earthquakes` & `/v1/api/iot/earthquakes`)
- `POST /v1/api/iot/earthquakes` — Ingest detected earthquake event (magnitude, duration) and trigger automated alerts.
- `GET /v1/api/earthquakes` — Retrieve historical earthquake logs.

### 🔔 Notifications & Alerts (`/v1/api/push-notifications`, `/v1/api/email`, `/v1/api/notifications`)
- `POST /v1/api/push-notifications` — Trigger instant push broadcast (with AI copy generation).
- `POST /v1/api/push-notifications/subscribe` — Register Web Push (VAPID) browser subscription.
- `POST /v1/api/push-notifications/unsubscribe` — Remove Web Push subscription.
- `POST /v1/api/email/alert` — Dispatch emergency broadcast email.
- `GET /v1/api/notifications` — Retrieve historical alert log.

---

## 5. Project Structure

```
queyk-backend/
├── src/
│   ├── controllers/            # Route handler logic
│   │   ├── earthquakeController.ts
│   │   ├── emailController.ts
│   │   ├── notificationController.ts
│   │   ├── pushNotificationController.ts
│   │   ├── readingController.ts
│   │   ├── tokenController.ts
│   │   └── userController.ts
│   ├── drizzle/                # Database schema & migrations
│   │   ├── schema.ts           # Drizzle table & enum definitions
│   │   └── index.ts            # Database client connection
│   ├── lib/                    # Shared libraries & utilities
│   │   ├── auth/               # Auth verification & JWT helpers
│   │   ├── schema/             # Zod validation schemas
│   │   ├── service/            # External services (Gemini, Claude, Push, Email)
│   │   ├── socket.ts           # Socket.io initialization & events
│   │   └── utils.ts            # Formatting & error helpers
│   ├── routes/                 # Express route definitions
│   │   ├── earthquakes.ts
│   │   ├── email.ts
│   │   ├── iot.ts
│   │   ├── notifications.ts
│   │   ├── push-notifications.ts
│   │   ├── readings.ts
│   │   ├── tokens.ts
│   │   └── users.ts
│   ├── app.ts                  # Express application setup & middleware
│   └── index.ts                # HTTP & WebSocket server entrypoint
├── drizzle.config.ts           # Drizzle Kit migration configuration
├── .env.example                # Example environment configuration
├── package.json                # Project dependencies and npm scripts
└── tsconfig.json               # TypeScript compiler configuration
```

---

## 6. Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or newer
- [PostgreSQL](https://www.postgresql.org/) database (Supabase, Neon, or local instance)
- Google Cloud & Anthropic API keys (optional for local mock testing)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd queyk-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

### Environment Variables

Configure the following variables in `.env.local`:

| Variable | Description | Example / Required |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key for signing user session JWTs | Random 32+ char string |
| `JWT_EXPIRES_IN` | Duration before user JWT expires | `7d` |
| `GEMINI_API_KEY` | Google Gemini API key for emergency copy | `AIzaSy...` |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key (optional/fallback) | `sk-ant-...` |
| `EXPO_ACCESS_TOKEN` | Expo access token for mobile push service | `your-expo-token` |
| `VAPID_PUBLIC_KEY` | Web Push VAPID public key | Generated via `web-push` |
| `VAPID_PRIVATE_KEY` | Web Push VAPID private key | Generated via `web-push` |
| `APP_GMAIL_EMAIL` | Sender email address for emergency blasts | `alerts@school.edu` |
| `APP_GMAIL_PASSWORD` | App-specific password for email sender | `abcd efgh ijkl mnop` |
| `SCHOOL_EMAIL_ADDRESS` | Institutional domain for user restrictions | `@school.edu.ph` |
| `FRONTEND_APP_URL` | Allowed origin for web production client | `https://queyk.school.edu` |
| `LOCALHOST_APP_URL` | Allowed origin for local web development | `http://localhost:3000` |

### Database Migrations

Push schema updates directly to PostgreSQL using Drizzle Kit:

```bash
# Push schema changes
npx drizzle-kit push

# Launch visual Drizzle Studio database browser
npx drizzle-kit studio
```

### Running the Server

```bash
# Development mode with hot-reloading
npm run dev

# Production build
npm run build
npm run start:dist
```

---

## License

This project is open-source software licensed under the [MIT License](LICENSE).
