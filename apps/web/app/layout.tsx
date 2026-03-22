import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Travelo — Travel Safety Platform',
  description: 'Real-time safety alerts, verified local guides, and an interactive map to keep you safe wherever you go.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
