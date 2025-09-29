import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { NetworkStatusProvider } from "@/components/providers/NetworkStatusProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Binder Web",
    template: "%s | Binder Web",
  },
  description:
    "Group chat and collaborative notes, simplified. Create groups, chat in real-time, and work together on structured notes with your team.",
  keywords: [
    "chat",
    "collaboration",
    "notes",
    "groups",
    "real-time",
    "messaging",
    "team communication",
    "collaborative editing",
    "group chat",
    "shared notes",
  ],
  authors: [{ name: "Binder Team", url: "https://binder-web.vercel.app" }],
  creator: "Binder Team",
  publisher: "Binder Team",
  category: "productivity",
  classification: "Social Communication App",

  // format detection
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    // url: process.env.NEXT_PUBLIC_APP_URL || 'https://binder-web.vercel.app',
    siteName: "Binder Web",
    title: "Binder Web - Group Chat & Collaborative Notes",
    description:
      "Create groups, chat in real-time, and collaborate on notes. Simple, fast, and reliable.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Binder Web - Group Chat & Notes",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Binder Web - Group Chat & Notes",
    description: "Create groups, chat in real-time, and collaborate on notes.",
    images: ["/og-image.png"],
    creator: "@binder_web",
  },

  //pwa
  manifest: "/manifest.json",

  //apple
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Binder Web",
  },

  // icons
  icons: {
    icon: [
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#2563eb",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white text-black">
      <head>
        {/* PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Binder" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* Preload critical resources */}
        <link rel="preload" href="/icons/icon-192x192.png" as="image" />

        {/* DNS prefetch for external services */}
        <link rel="dns-prefetch" href="//supabase.co" />

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta
          httpEquiv="Referrer-Policy"
          content="strict-origin-when-cross-origin"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {/* <a href="#main-content" className="skip-link">
          Skip to main content
        </a> */}

        <ErrorBoundary>
          <NetworkStatusProvider>
            <main id="main-content" className="flex-1 pb-16 safe-area-inset">
              {children}
            </main>
            <Nav />
            <Toaster
              position="top-center"
              richColors
              closeButton
              duration={4000}
              expand={false}
              visibleToasts={3}
              toastOptions={{
                style: {
                  background: "white",
                  border: "1px solid #e5e7eb",
                  color: "#374151",
                  fontSize: "14px",
                  padding: "12px 16px",
                },
                className: "touch-target",
              }}
            />
          </NetworkStatusProvider>
        </ErrorBoundary>

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
