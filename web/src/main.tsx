import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { assertRuntimeSafety } from './lib/runtimeGuard';
import './index.css';
import './styles.css';

function normalizeRecoveryRoute() {
  const url = new URL(window.location.href);

  const hashParams = new URLSearchParams(
    window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash,
  );

  const isRecovery =
    url.searchParams.get('type') === 'recovery' ||
    hashParams.get('type') === 'recovery' ||
    url.searchParams.has('code') ||
    (hashParams.has('access_token') && hashParams.get('type') === 'recovery');

  if (isRecovery && url.pathname !== '/reset-password') {
    const nextUrl = `${url.origin}/reset-password${url.search}${url.hash}`;
    window.location.replace(nextUrl);
    return true;
  }

  return false;
}

if (!normalizeRecoveryRoute()) {
  assertRuntimeSafety();

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
