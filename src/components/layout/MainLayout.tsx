import * as React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="space-y-6">{children}</div>
    </main>
  );
}
