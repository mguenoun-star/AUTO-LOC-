import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import RootLayoutClient from '@/components/layout/RootLayoutClient';

export const metadata: Metadata = {
  title: 'AUTO LOC',
  description: 'Access the world\'s most exclusive fleet with a single touch. Automotive excellence redefined.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider>
            <RootLayoutClient>
              {children}
            </RootLayoutClient>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
