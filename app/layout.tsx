import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CardVault - Trading Cards',
  description: 'The ultimate trading cards management platform. Track, value, and trade your collection.',
  keywords: 'trading cards, TCG, collectible cards, card games',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
