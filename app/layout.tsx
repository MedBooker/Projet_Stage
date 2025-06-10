import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clinique Amitié | Votre santé, notre priorité",
  description: "Plateforme de prise de rendez-vous médicaux en ligne",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  openGraph: {
    title: "Clinique Amitié | Votre santé, notre priorité",
    description: "Plateforme de prise de rendez-vous médicaux en ligne",
    url: "https://clinique-amitie.com", 
    siteName: "Clinique Amitié",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Clinique Amitié - Excellence Médicale",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} antialiased min-h-screen bg-white dark:bg-emerald-950 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />

          <main className="min-h-[calc(100vh-140px)] bg-gradient-to-b from-white via-emerald-50 to-white dark:from-gray-950 dark:via-emerald-950/20 dark:to-gray-950">
            {children}
          </main>

          <Footer />

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}