import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HashScrollManager from '@/components/common/HashScrollManager';
import IntersectObserver from '@/components/common/IntersectObserver';
import SiteHeader from '@/components/common/SiteHeader';

import routes from './routes';

// import { AuthProvider } from '@/contexts/AuthContext';
// import { RouteGuard } from '@/components/common/RouteGuard';
import { Toaster } from '@/components/ui/toaster';

function RouteLoadingState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="rounded-full border border-border/70 bg-background/90 px-5 py-3 text-sm font-medium text-muted-foreground shadow-sm">
        Loading page...
      </div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      {/*<AuthProvider>*/}
      {/*<RouteGuard>*/}
      <HashScrollManager />
      <IntersectObserver />
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-grow">
          <Suspense fallback={<RouteLoadingState />}>
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={<route.component />} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <Toaster />
      {/*</RouteGuard>*/}
      {/*</AuthProvider>*/}
    </Router>
  );
};

export default App;
