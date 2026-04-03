import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { Providers } from "./providers";
import { ServiceWorkerRegister } from "./sw-register";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "CalTracker - Gestion Frigo & Précision Nutritionnelle",
  description: "Le seul tracker qui comprend vraiment les bodybuilders.",
  applicationName: "CalTracker",
  appleWebApp: {
    capable: true,
    title: "CalTracker",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}>
        <AuthProvider>
          <Providers>
            {children}
            <ServiceWorkerRegister />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
