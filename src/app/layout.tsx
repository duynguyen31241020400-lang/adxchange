import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Adxchange | Hyperlocal DOOH Marketplace',
  description: 'Adxchange turns idle venue screens into a measurable hyperlocal advertising network.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
