# Rosatom Ambassadors

A modern, responsive landing page for the Rosatom Ambassadors program, built to facilitate international engagement and promote sustainable energy education.

## 🚀 Key Features

- **Modern UI/UX**: Crafted with [SvelteKit](https://kit.svelte.dev/), [TailwindCSS](https://tailwindcss.com/), and [DaisyUI v5](https://daisyui.com/), featuring a clean, professional aesthetic.
- **🌍 Internationalization (i18n)**:
  - Full support for **English** and **Russian**.
  - Automatic language detection with cookie-based persistence.
  - Seamless language toggling without page reloads.
- **🌓 Theme System**:
  - Robust Light/Dark mode.
  - Persisted user preference prevents "flash of unstyled content" (FOUC).
- **✨ Interactive Elements**:
  - **Infinite Ticker**: Smooth, CSS-only marquee animation for partners and key concepts.
  - **News Slider**: Horizontal scrollable news section.
  - **Global Toast Notifications**: Unified system for success/error alerts.
- **📬 Contact Integration**:
  - Secure contact form.
  - Direct integration with **Telegram Bot API** for instant notifications.

## 🛠 Tech Stack

- **Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: TailwindCSS, DaisyUI v5 (Beta)
- **Icons**: [Lucide-Svelte](https://lucide.dev/icons/)
- **State Management**: Svelte Stores

## ⚙️ Setup & Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/rosatom-ambassadors.git
    cd rosatom-ambassadors
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add your Telegram credentials:

    ```env
    TELEGRAM_BOT_TOKEN=your_bot_token_here
    THE_USER_CHAT_ID=your_chat_id_here
    ```

4.  **Start Development Server**:
    ```bash
    npm run dev
    ```

## 📜 Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint and Prettier checks.
- `npm run format`: Automatically format code with Prettier.

## 📂 Project Structure

```
src/
├── lib/
│   ├── components/    # Reusable UI components (Header, Footer, Hero, etc.)
│   ├── services/      # Business logic (Translations)
│   └── stores/        # Global state (Language, Toast)
├── routes/
│   ├── api/           # Server-side API endpoints (Contact form)
│   └── +page.svelte   # Main landing page
└── app.html           # Main document shell
```
