## ✨ **Live Demo & Screenshots**

🚀 **Live Application**: https://binder-clone.vercel.app/
📹 **Demo Video**: https://drive.google.com/drive/folders/1Q5qynuqybgBAOfBBM-b3tDbUyVhqMqJu?usp=sharing

### 🧪 **Test Account for Immediate Access**

**Phone**: `628978663783`  
**OTP Code**: `123456`  
**Valid Until**: October 8, 2025 (extendable)

> **⚡ Quick Start**: Visit the live app, enter the phone number above, use OTP `123456`, and start exploring all features immediately!

### 📱 **Mobile-First Experience**

**🎯 Authentication Flow**

![Phone Authentication](docs/screenshots/binder1.jpg)
_Step 1: Spalash Screen Binder APP_

![Phone Authentication](docs/screenshots/binder2.jpg)
_Step 2: Register via Phone Number_

![Phone Authentication](docs/screenshots/binder3.jpg)
_Step 3: Choose Verification_

![Phone Authentication](docs/screenshots/binder4.jpg)
_Step 4: Enter 6-digit verification code_

![Choose Method](docs/screenshots/binder5.jpg)
_Step 5: Setup Your Profile_

![Choose Method](docs/screenshots/binder6.jpg)
_Step 6: Add a Profile Image (Emote)_

![Choose Method](docs/screenshots/binder7.jpg)
_Step 7: Pick Bg Color & Emote_

![Choose Method](docs/screenshots/binder8.jpg)
_Onboarding complete - siap mulai chatting!_

**👤 Tab You**

![Profile Setup](docs/screenshots/tabyou.png)
_Tab You_

![Avatar Selection](docs/screenshots/editprofile.png)
_Edit Profile_

**🏠 Space (Group Management)**

![Empty Space](docs/screenshots/binder9.jpg)
_Dashboard kosong - siap create atau join group_

![Create Group](docs/screenshots/binder10.jpg)
_Create group baru dengan nama dan deskripsi_

![Join Group](docs/screenshots/binder11.jpg)
_Join group menggunakan invite code (DEMO2025)_

**💬 Real-time Messaging**

![Group Chat](docs/screenshots/binder12.jpg)
_Real-time messaging dengan emoji avatars_

![Start Chatting](docs/screenshots/binder13.png)
_Empty chat state - mulai conversation pertama_

**💬 Note**

![Group Chat](docs/screenshots/add-note.png)
_add-note_

![Start Chatting](docs/screenshots/empty-note.png)
_Empty chat Note - Buat Catatan_

### ✅ **Implemented Features**

- 🔐 **Phone Authentication** - OTP verification via SMS/WhatsApp (Twilio)
- 👤 **Profile Management** - Custom emoji avatars dengan color picker
- 👥 **Group Management** - Create, join, leave groups dengan invite codes
- 💬 **Real-time Messaging** - Instant chat dengan typing indicators
- 📝 **Collaborative Notes** - Block-based editor seperti Notion
- 📱 **Mobile PWA** - Installable app dengan offline support
- 🎨 **Professional UX** - Smooth animations, loading states, error boundaries

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

### **1. Clone Repository**

```bash
git clone https://github.com/hilmirazib/binder-clone.git
cd binder-clone
```

### **2. Install Dependencies**

```bash
pnpm install
```

### **3. Environment Setup**

```bash
cp .env.example .env
```

Isi environment variables:

```bash
# Database
DATABASE_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

```

**💬 Twilio (untuk SMS OTP)**

![Group Chat](docs/screenshots/setuptwilio.png)
_Konfigurasi Twilio di Supabase_

Open [http://localhost:3000](http://localhost:3000)

### **Project Structure**

### **4. Database Setup**

```bash
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# Seed database dengan demo data
npx prisma db seed
```

**🌱 Seeder akan create:**

- 3 demo groups dengan sample messages
- Sample notes dengan block-based content
- Invite codes untuk testing: `DEMO2025`, `TEAM2025`

### **5. Start Development**

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

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

### **Upcoming Features**

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
