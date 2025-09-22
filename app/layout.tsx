import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Binder App",
  description: "Group chat & notes, simplified.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white text-black">
      <body className="min-h-screen flex flex-col">
        <main className="flex-1 pb-16">{children}</main>
        <Nav />
      </body>
    </html>
  );
}
