<div align="center">

# 🐦 Twitifa

**A modern full-stack social media platform built with Next.js 16 and React 19**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://mongoosejs.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square)](https://tanstack.com/query)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---
![Home](https://github.com/abolfazlmahdikhanii/twitifa/blob/master/public/screenshot/home.png)
## ✨ Features

### 🔐 Authentication & Account
- **JWT Authentication** — Secure access & refresh token system with httpOnly cookies
- **Google SSO** — One-click sign in with Google OAuth
- **Email Verification** — Account activation via verification email
- **Password Reset** — Secure multi-step reset flow with SHA-256 hashed tokens and TTL expiry
- **OTP Login** — One-time password login via email

### 👤 Profile
- **Edit Profile** — Update name, bio, avatar, banner, location, website, and birthdate
- **Follow / Unfollow** — Follow other users with follower & following counts
- **Shared Posts** — Dedicated tab for posts the user has reposted
- **Followers & Following Lists** — Browse who you follow and who follows you
- **Verified Badge** — Email-verified users get a verification badge
- **Pin Post** — Pin any post to the top of your profile
- **Post Analytics** — Per-post analytics dashboard with charts (views, likes, replies, reposts)

### 📝 Posts
- **Rich Text Editor** — Tiptap-powered editor with mention support (`@user`)
- **Edit Post** — Edit your posts after publishing
- **Remove Post** — Delete your own posts
- **Reply** — Threaded replies on posts
- **Repost** — Repost others' posts to your timeline
- **Quote Post** — Quote repost with your own commentary
- **Media Uploads** — Attach images to posts via ImageKit CDN

### 🔔 Notifications
- **Notification Center** — Real-time notifications for likes, replies, reposts, quotes, follows, and mentions

### 🔍 Discovery
- **Search** — Search for users and posts
- **Hashtags** — Clickable hashtags on posts with dedicated hashtag pages
- **Trending** — Trending hashtags section to discover what's popular right now

### 📱 UX & Performance
- **Fully Responsive** — Mobile-first design with Tailwind CSS breakpoints across all pages
- **Virtualized Feed** — React Virtuoso infinite scroll for performant large feeds
- **TwitTV** — Instagram-style media grid with cursor-based pagination
- **Video Playback** — Native video support with Video.js

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Framework |
| React 19 | UI Library |
| HeroUI | Component Library |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| TanStack React Query v5 | Server State Management |
| React Virtuoso | Virtualized Lists |
| Tiptap v3 | Rich Text Editor |
| Recharts | Data Visualization |
| Lucide React | Icons |
| Sonner | Toast Notifications |
| date-fns + date-fns-jalali | Date Utilities (Gregorian & Jalali) |

### Backend
| Technology | Purpose |
|---|---|
| Next.js API Routes | Backend API |
| MongoDB + Mongoose | Database |
| bcryptjs | Password Hashing |
| JSON Web Token | Auth Tokens |
| Nodemailer | Email Service (verification & reset) |
| Zod v4 | Schema Validation |
| Sharp | Image Processing |
| Formidable | Multipart Form Parsing |

### Media & Storage
| Technology | Purpose |
|---|---|
| ImageKit | Image CDN & Optimization |
| @imagekit/next | Next.js SDK |
| Video.js | Video Playback |

---

## 📁 Project Structure

```
twitifa/
├── app/               # Next.js App Router — pages & API routes
├── components/        # Reusable UI components
├── config/            # App configuration
├── context/           # React context providers (Auth, etc.)
├── hooks/             # Custom React hooks
├── models/            # Mongoose models (User, Post, ResetToken, ...)
├── public/            # Static assets
├── services/          # API service functions
├── utils/             # Helper utilities
└── validators/        # Zod validation schemas
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- ImageKit account

### Installation

```bash
# Clone the repository
git clone https://github.com/abolfazlmahdikhanii/twitifa.git
cd twitifa

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run doctor   # Run React Doctor for diagnostics
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/abolfazlmahdikhanii">Abolfazl Mahdikhani</a>
</div>
