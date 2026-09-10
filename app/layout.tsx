import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { DocumentProvider } from '@/lib/store';
import { NavigationShell } from '@/components/nav/NavigationShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SmartLedger - AI Assistant for Accounting Work',
  description: 'Automate repetitive document-processing work with SmartLedger',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DocumentProvider>
          <NavigationShell>{children}</NavigationShell>
        </DocumentProvider>
      </body>
    </html>
  );
}
