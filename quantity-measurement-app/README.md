# Quantity Measurement App

A modern React application for unit conversion with authentication, built with TypeScript, Vite, and Tailwind CSS.

## Features

- 🔐 User Authentication (Email/Password + Google OAuth)
- 📏 Unit Conversion (Length, Weight, Temperature, etc.)
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast development with Vite
- 🔒 Form validation and error handling
- 📱 Responsive design

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the environment file and configure your settings:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your configuration:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8080

# Google OAuth (Optional - for Google login)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 3. Google OAuth Setup (Optional)

To enable Google login:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID** → **Web Application**
5. Add these **Authorized JavaScript origins**:
   - `http://localhost:5173` (for development)
   - `https://yourdomain.com` (for production)
6. Copy your **Client ID** and paste it in `.env.local`

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Backend Setup

Make sure your backend server is running on `http://localhost:8080` with these endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/google` - Google OAuth login
- `GET/POST /api/v1/quantities/*` - Unit conversion APIs

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Authentication**: JWT + Google OAuth
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/
│   ├── Auth/          # Login/Signup components
│   ├── Converter/     # Dashboard and conversion logic
│   └── Layout/        # Navigation and protected routes
├── services/          # API calls and authentication
├── utils/            # Validation and helper functions
└── types/            # TypeScript type definitions
```

## Form Validation

The app includes comprehensive validation for:

- **Email**: Proper email format
- **Password**: Minimum 8 characters, mixed case, numbers
- **Name**: Letters and spaces only, minimum 2 characters
- **Phone**: 10-15 digits with auto-formatting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
