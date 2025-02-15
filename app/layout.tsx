import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import { ThemeProvider } from "@/context/ThemeContext";
import { BlogProvider } from './blogs/[id]/page';
import { motion } from "framer-motion";


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://:3000";

export const metadata = {
  // metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

const linkVariants = {
  initial: { width: 'auto' },
  hover: { width: '150px', transition: { duration: 0.3 } },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeProvider>
            <BlogProvider>
              <main className="min-h-screen flex flex-col items-center">
                <div className="flex-1 w-full flex flex-col gap-5 items-center">
                  <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-gray-50 dark:bg-black">
                    <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                      <div className="relative group  gap-5 items-center font-semibold dark:text-stone-400 text-stone-600">
                        <Link href={"/blogs"} className="text-2xl ">LifeBlog</Link>
                        <div className="group-hover:w-24 rounded-full w-0 transition-all duration-300 h-2 bg-stone-600"/>
                      </div>
                      <div className="flex items-center gap-5">
                        <ThemeToggle />
                        {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                      </div>
                    </div>
                  </nav>
                  <div className="flex flex-col gap-20 max-w-5xl p-5 ">
                    {children}
                  </div>
                </div>
              </main>
            </BlogProvider>
          </ThemeProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
