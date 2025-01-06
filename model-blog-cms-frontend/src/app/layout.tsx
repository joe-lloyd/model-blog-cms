import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'My CMS App',
  description: 'Manage your posts easily',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-800`}
    >
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          {children}
        </div>
      </div>
    </body>
    </html>
);
}
