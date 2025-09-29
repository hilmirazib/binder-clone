### 👤 **Demo Accounts**

Try the full experience with these test accounts:

| Account    | Email                | Phone         | Avatar    | Role         |
| ---------- | -------------------- | ------------- | --------- | ------------ |
| **Demo 1** | demo1@binder-web.com | +628111111111 | 🚀 Blue   | Group Owner  |
| **Demo 2** | demo2@binder-web.com | +628222222222 | 🌟 Green  | Team Member  |
| **Demo 3** | demo3@binder-web.com | +628333333333 | 🎯 Orange | Collaborator |

### 🏠 **Demo Groups**

- **🎉 "Welcome to Binder Web"** (Code: `DEMO2025`) - Feature showcase
- **💼 "Project Collaboration"** (Code: `TEAM2025`) - Team workspace example

---

## ✨ **Feature Highlights**

### 🎯 **Core Features**

- ✅ **Phone Authentication** - OTP via SMS with Supabase Auth
- ✅ **Emoji Avatars** - Customizable emoji + color combinations
- ✅ **Real-time Messaging** - Instant chat with typing indicators
- ✅ **Group Management** - Create, join, leave groups with invite codes
- ✅ **Collaborative Notes** - Block-based editor with real-time sync
- ✅ **Mobile-First PWA** - Installable app with offline support

### 🎨 **UX Excellence**

- ✅ **Professional Navigation** - Smooth animations, backdrop blur
- ✅ **Loading States** - Skeleton components, error boundaries
- ✅ **Responsive Design** - Perfect on all devices (320px - 1920px)
- ✅ **Accessibility** - WCAG 2.1 AA compliant, keyboard navigation
- ✅ **Performance** - 90+ Lighthouse score, PWA ready

---

## 🏗️ **Architecture**

### **Tech Stack**

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI, Lucide Icons
- **Backend**: Next.js API Routes, Supabase (Database, Auth, Realtime)
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel (Frontend), Supabase (Backend Services)

### **System Design**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   Supabase       │    │   PostgreSQL    │
│                 │    │                  │    │                 │
│ • App Router    │◄──►│ • Authentication │◄──►│ • User Data     │
│ • Server Actions│    │ • Realtime       │    │ • Groups        │
│ • API Routes    │    │ • Database API   │    │ • Messages      │
│ • Static Pages  │    │ • Row Level Sec. │    │ • Notes         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                        │
        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐
│     Vercel      │    │   Supabase       │
│   (Hosting)     │    │   (Backend)      │
└─────────────────┘    └──────────────────┘
```

---

## 🚀 **Quick Start (Development)**

### Setup Steps

```bash
# 1. Clone repository
git clone https://github.com/hilmirazib/binder-clone.git
cd binder-clone

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env
# Fill in your Supabase credentials

# 4. Setup database
pnpm prisma migrate dev
pnpm prisma generate

# 5. Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### **Project Structure**

```
binder-clone/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── space/             # Group management & chat
│   ├── you/               # Profile management
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/                # Base UI components
│   ├── forms/             # Form components
│   └── providers/         # Context providers
├── lib/                   # Utilities & configurations
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Helper functions
│   └── schemas/           # Zod validation schemas
├── services/              # Business logic layer
├── prisma/                # Database schema & migrations
└── public/                # Static assets
```

### **Available Scripts**

```bash
# Development
pnpm dev                   # Start dev server with Turbopack
pnpm build                 # Build for production
pnpm start                 # Start production server

# Database
pnpm prisma:generate       # Generate Prisma client
pnpm prisma:migrate        # Run database migrations
pnpm prisma:studio         # Open Prisma Studio

# Code Quality
pnpm lint                  # Run ESLint
pnpm format                # Format with Prettier
pnpm typecheck             # TypeScript checking

# Deployment
pnpm seed:production       # Seed production database
```

---

## 📱 **Mobile Experience**

### **PWA Features**

- 📱 **Installable App** - Add to home screen
- 🔄 **Offline Support** - Basic functionality without internet
- 🚀 **App Shortcuts** - Quick actions from home screen
- 📲 **Native Feel** - Standalone mode, custom splash screen

### **Mobile Optimizations**

- ✅ **Touch Targets** - All interactive elements 44px+ minimum
- ✅ **Safe Area** - Perfect on iPhone notch devices
- ✅ **Gesture Support** - Swipe, pinch, tap optimizations
- ✅ **Keyboard Handling** - Smart focus management
- ✅ **Responsive Design** - Fluid layouts for all screen sizes

---

## 🎯 **Roadmap & Future Features**

### **Upcoming Features (M13)**

- 🔄 WhatsApp OTP integration
- 🔄 Advanced admin permissions
- 🔄 Markdown support in notes
- 🔄 Global search functionality
- 🔄 Push notifications
- 🔄 @mentions system

---

## 🤝 **Contributing**

This project follows conventional commits and includes:

- TypeScript strict mode
- ESLint + Prettier configuration
- Husky pre-commit hooks
- Automated testing pipeline

---

## 📄 **License**

MIT License - feel free to use this project as reference or starting point for your own applications.

---

## 💬 **Contact & Support**

- **GitHub**: [hilmirazib/binder-clone](https://github.com/hilmirazib/binder-clone)

**Built with ❤️ using modern web technologies**
