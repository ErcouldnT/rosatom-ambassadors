# Rosatom Ambassadors

A modern, responsive landing page and admin management system for the Rosatom Ambassadors program, designed to facilitate international engagement and promote sustainable energy education.

## 🚀 Key Features

### Public Platform

- **Modern UI/UX**: Built with [SvelteKit](https://kit.svelte.dev/), [TailwindCSS](https://tailwindcss.com/), and [DaisyUI v5](https://daisyui.com/).
- **🌍 Internationalization (i18n)**:
  - Full support for **English** and **Russian**.
  - Seamless language toggling with persistent preferences.
- **✨ Interactive Elements**:
  - **Infinite Ticker**: Smooth marquee for partners.
  - **News Slider**: Responsive content showcase.
  - **Global Presence**: Interactive visualization of ambassador locations.

### Admin Panel (`/admin`)

- **Secure Authentication**: Protected routes using **Lucia Auth**.
- **Content Management**:
  - **Ambassadors**: Create, edit, delete, and manage profiles.
  - **Events**: Schedule and manage upcoming events.
  - **News**: Publish news articles with categories and localized content.
  - **Statistics**: Update key metrics displayed on the landing page.
  - **Countries**: Manage the list of participating countries.
- **Localization**: Admin interface itself is fully localized (EN/RU).

### Infrastructure

- **Serverless Ready**: Optimized for Vercel deployment.
- **Database**: **Turso (LibSQL)** for edge-compatible SQLite.
- **ORM**: **Drizzle ORM** for type-safe database interactions.
- **Auth**: **Lucia Auth** for secure session management.

## 🛠 Tech Stack

- **Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: TailwindCSS, DaisyUI v5
- **Backend**: Serverless Functions (Vercel)
- **Database**: Turso (LibSQL) / Drizzle ORM
- **Authentication**: Lucia Auth
- **Quality Control**: ESLint, Prettier, Husky, Lint-Staged

## ⚙️ Setup & Installation

### Prerequisites

- Node.js 20+
- Turso Database (Remote) or just local file support

### Local Development

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/rosatom-ambassadors.git
    cd rosatom-ambassadors
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Configuration**:
    Create a `.env` file in the root directory (see `.env.example` for reference):

    ```env
    # Telegram Bot (for contact form)
    TELEGRAM_BOT_TOKEN=your_token
    THE_USER_CHAT_ID=your_chat_id

    # Database (Local Development)
    TURSO_CONNECTION_URL=file:local.db
    TURSO_AUTH_TOKEN=unused

    # Admin Setup (for auto-seeding)
    ADMIN_EMAIL=admin@example.com
    ADMIN_PASSWORD=secure_password
    ```

4.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    _Note: This command automatically runs migrations and seeds the database (Admin + Stats) before starting the server._

## 🛡️ Admin Access

To access the admin panel, navigate to `/admin/login`.

Default credentials (if unchanged in your `.env`):

- **Email**: `admin@example.com`
- **Password**: `secure_password`

## 📦 Database Management

We use **Drizzle Kit** for database management.

- `npm run db:push`: Push schema changes to the database.
- `npm run db:studio`: Open Drizzle Studio to manage data visually.
- `npm run db:generate`: Generate migrations based on schema changes.
- `npm run db:migrate`: Apply migrations.
- `npm run db:seed`: Manually run the seed script (usually not needed, runs on dev start).

## 🚀 Deployment (Vercel)

The project is configured for seamless Vercel deployment.

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Set your Environment Variables in Vercel (Production Turso URL/Token).
4.  **Important**: Vercel's default Build Command will execute `npm run build`, which is configured to:
    1.  Run Migrations (`db:migrate`)
    2.  Seed Data (`db:seed`)
    3.  Build App (`vite build`)

This ensures your production database is always up-to-date with every deploy.
