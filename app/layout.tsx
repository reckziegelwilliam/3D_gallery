import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Mom's Virtual Gallery",
  description: 'A personal virtual art gallery showcasing beautiful artwork',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

