import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/context/theme";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SpaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevFlow",
  description:
    "一个社区驱动的开发者网站,用户可以提问和解决问题,或探索软件技术相关比如手机APP,算法,前后端",
  icons: {
    icon: "/images/site-log.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider session={session}>
        <body
          className={`${interSans.variable} ${SpaceGrotesk.variable} antialiased`}
        >
          <ThemeProvider
            attribute={"class"}
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
