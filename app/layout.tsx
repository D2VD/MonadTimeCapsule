import './globals.css';
import { Providers } from '@/components/providers';

export const metadata = {
  title: 'Monad Time Capsule',
  description: 'Write now. Open later. Forever on Monad.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
