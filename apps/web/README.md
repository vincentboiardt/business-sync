# BusinessSync - Multi-Platform Business Profile Synchronization

BusinessSync is a SaaS platform that allows businesses to sync their Google Business Profile with other platforms like Bing Places, Apple Maps, Facebook, Yelp, and more. Keep your business information consistent across all platforms with a single update.

## 🚀 Features

- **Multi-Platform Sync**: Connect and sync with Google Business Profile, Bing Places, Apple Maps, Facebook, Yelp, and more
- **Real-time Updates**: Changes are pushed to all connected platforms instantly
- **Google OAuth Integration**: Secure authentication with Google Business Profile access
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **Dashboard**: Centralized management of business information and platform connections
- **Activity Tracking**: Monitor sync activities and platform connection status

## 🛠 Tech Stack

- **Frontend**: Next.js 15.4, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ and npm
- Google Cloud Console project with OAuth2 credentials
- Supabase project

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd business-sync
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://wjgdqwvdgeohzuxxsmvl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### 4. Database Setup

The application expects the following Supabase tables:

#### users table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### business_profiles table

```sql
CREATE TABLE business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  google_business_id TEXT,
  business_name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  website TEXT,
  opening_hours JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### platform_connections table

```sql
CREATE TABLE platform_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform_name TEXT NOT NULL,
  platform_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google My Business API
4. Create OAuth2 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth.js routes
│   │   ├── business-profile/ # Business profile management
│   │   ├── platform-connections/ # Platform connections
│   │   └── sync/          # Sync functionality
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── google-business.ts # Google Business API utilities
│   └── supabase.ts       # Supabase configuration
└── types/                 # TypeScript type definitions
```

## 🔧 API Endpoints

- `GET /api/business-profile` - Get user's business profile
- `PUT /api/business-profile` - Update business profile
- `POST /api/sync-google-business` - Sync business data from Google Business Profile

## 🎨 UI Components

The application uses custom components built with Tailwind CSS:

- **Landing Page**: Hero section, features, supported platforms
- **Authentication**: Google OAuth sign-in flow
- **Dashboard**: Business profile overview, platform connections, activity feed
- **Error Handling**: User-friendly error pages

## 🔒 Security Features

- **Protected Routes**: Middleware protects dashboard and API routes
- **Session Management**: Secure session handling with NextAuth.js
- **Input Validation**: Server-side validation for all API endpoints
- **CORS Protection**: API routes protected against unauthorized access

## 🚢 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to update these for production:

- `NEXTAUTH_URL`: Your production domain
- `NEXTAUTH_SECRET`: Generate a secure secret
- Update Google OAuth redirect URIs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@businesssync.com or create an issue in the repository.

## 🔮 Future Features

- [ ] Real Google My Business API integration
- [ ] Bing Places API integration
- [ ] Apple Maps Connect integration
- [ ] Facebook Business API integration
- [ ] Yelp Business API integration
- [ ] Bulk photo upload and sync
- [ ] Advanced analytics and reporting
- [ ] Team collaboration features
- [ ] White-label solution
