# BookBuddy - Book CRUD Application

A modern book management application built with React, TypeScript, and Vite. Features include Google OAuth authentication, book CRUD operations, Excel import/export, and PDF generation.

## Features

- 📚 Book management (Create, Read, Update, Delete)
- 🔐 Authentication with Email/Password and Google OAuth
- 📊 Excel file import for bulk book data
- 📄 PDF export of book collections
- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- 🔒 JWT-based authentication with token refresh

## Prerequisites

- Node.js (v18 or higher)
- npm or bun package manager
- Backend API server (running on the configured API URL)

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Configure your environment variables in `.env`:

   ### Required Variables:

   - **VITE_GOOGLE_CLIENT_ID**: Your Google OAuth 2.0 Client ID
     - Get it from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
     - Create a new OAuth 2.0 Client ID if you don't have one
     - Add authorized JavaScript origins (e.g., `http://localhost:8080`)
     - Add authorized redirect URIs

   - **VITE_API_URL**: Your backend API URL
     - Development: `https://localhost:5000` (default)
     - Production: Update to your production API URL

   Example `.env` file:
   ```env
   VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
   VITE_API_URL=https://localhost:5000
   ```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

## Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Security

- Never commit your `.env` file to version control
- Keep your Google OAuth Client ID and other secrets secure
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Use different credentials for development and production environments

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/        # React contexts (Auth, etc.)
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── pages/           # Page components
└── App.tsx          # Main application component
```

## Authentication

The application supports two authentication methods:
1. **Email/Password** - Traditional authentication
2. **Google OAuth** - Single sign-on with Google

All authenticated routes are protected and require a valid JWT token.

## License

This project is private and not licensed for public use.
