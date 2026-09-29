import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { AppProviders } from './providers';
import { router } from './router';

function RestoreRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');

    if (!redirect) {
      return;
    }

    const target = decodeURIComponent(redirect);

    if (!target.startsWith('/')) {
      return;
    }

    const base = '/P3/';

    window.history.replaceState(
      null,
      '',
      base,
    );

    window.history.replaceState(
      null,
      '',
      base.replace(/\/$/, '') + target,
    );

    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  return null;
}

export default function App() {
  return (
    <AppProviders>
      <RestoreRedirect />
      <RouterProvider router={router} />
    </AppProviders>
  );
}