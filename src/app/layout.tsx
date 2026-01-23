import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
import ThemeRegistry from '@/theme/ThemeRegistry';

export const metadata : Metadata = {
  title: 'HRMS',
  description: 'Human Resource Management System',
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>

        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
