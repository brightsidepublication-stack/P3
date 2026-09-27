import { useState, type ReactNode } from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { BottomNav } from '../components/common/BottomNav';
import { MobileDrawer } from '../components/common/MobileDrawer';
import { Container } from '../components/ui/Container';

type AppShellProps = {
  children: ReactNode;
  showBottomNav?: boolean;
};

export function AppShell({
  children,
  showBottomNav = true,
}: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header onMenuClick={() => setDrawerOpen(true)} />

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <main className="min-h-[calc(100vh-8rem)]">
        <Container className="py-6">{children}</Container>
      </main>

      <Footer />

      {showBottomNav ? <BottomNav /> : null}
    </div>
  );
}