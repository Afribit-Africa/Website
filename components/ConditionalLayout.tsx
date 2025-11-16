'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import PageTransition from './PageTransition';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if we're on an admin page
  const isAdminPage = pathname.startsWith('/admin');

  // For admin pages, render children directly without Header/Footer
  if (isAdminPage) {
    return <>{children}</>;
  }

  // For regular pages, render with Header/Footer
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </>
  );
}
