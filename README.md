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

- **Secure Authentication**: Protected routes using PocketBase authentication.
- **Content Management**:
  - **Ambassadors**: Create, edit, delete, and manage profiles with photos.
  - **Events**: Schedule and manage upcoming events.
  - **News**: Publish news articles with categories and localized content.
  - **Statistics**: Update key metrics displayed on the landing page.
  - **Countries**: Manage the list of participating countries.
- **Localization**: Admin interface itself is fully localized (EN/RU).

### Infrastructure

- **Dockerized**: specific `docker-compose` setup for easy deployment.
- **PocketBase**: Self-hosted backend for real-time database and file storage.
- **Internal Networking**: Secure communication between App and PocketBase within Docker.
- **File Proxy**: Server-side proxy handling for secure and reliable file delivery.

## 🛠 Tech Stack

- **Framework**: SvelteKit (Node.js Adapter)
- **Language**: TypeScript
- **Styling**: TailwindCSS, DaisyUI v5
- **Backend**: PocketBase
- **Infrastructure**: Docker, Docker Compose
- **Quality Control**: ESLint, Prettier, Husky, Lint-Staged

## ⚙️ Setup & Installation

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)

### Quick Start (Docker)

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/rosatom-ambassadors.git
    cd rosatom-ambassadors
    ```

2.  **Configuration**:
    Create a `.env` file in the root directory (see `.env.example` for reference):

    ```env
    # Telegram Bot (for contact form)
    TELEGRAM_BOT_TOKEN=your_token
    THE_USER_CHAT_ID=your_chat_id

    # PocketBase Configuration
    POCKETBASE_URL=http://pocketbase:8090 # Internal Docker URL
    POCKETBASE_ADMIN_EMAIL=admin@example.com
    POCKETBASE_ADMIN_PASSWORD=secure_password
    ```

3.  **Run with Docker**:
    ```bash
    docker-compose up -d --build
    ```

    - **Public Site**: `http://localhost:3020`
    - **Admin Panel**: `http://localhost:3020/admin`
    - **PocketBase UI**: `http://localhost:8020/_/`

### Local Development

1.  **Install dependencies**:

    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

## 🛡️ Admin Access

To access the admin panel, navigate to `/admin`.
Default credentials (defined in your `.env`):

- **Email**: `your_configured_email` (as set in `.env`)
- **Password**: `your_configured_password` (as set in `.env`)

## 💻 Development Workflow

This project enforces code quality via pre-commit hooks.

- **Committing**: `husky` triggers `lint-staged` and `svelte-check`.
  - Staged files are automatically formatted (`prettier`) and linted (`eslint`).
  - Full project type checking (`npm run check`) runs before commit.
  - **Note**: If checks fail, the commit is blocked.

### Manual Commands

- `npm run check`: Run SvelteKit sync and type check.
- `npm run lint`: Run ESLint and Prettier check.
- `npm run format`: Fix formatting issues.

## 📂 Project Structure

```
src/
├── lib/
│   ├── components/    # Public UI components (Hero, NewsSlider, etc.)
│   ├── services/      # Business logic (Translations, API)
│   ├── stores/        # Global state (Language)
│   ├── server/        # Server-side logic (PocketBase client)
│   └── types.ts       # TypeScript definitions
├── routes/
│   ├── admin/         # Admin panel pages (protected)
│   ├── api/           # API endpoints (Contact, Admin APIs, File Proxy)
│   └── +page.svelte   # Public landing page
├── hooks.server.ts    # Server hooks (Auth protection)
└── app.html           # Document shell
```
