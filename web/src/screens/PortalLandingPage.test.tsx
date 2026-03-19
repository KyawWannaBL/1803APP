import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { PortalLandingPage } from '@/screens/PortalLandingPage';
import { I18nProvider } from '@/i18n/I18nProvider';
import { AuthProvider } from '@/auth/AuthProvider';

describe('PortalLandingPage', () => {
  beforeEach(() => {
    localStorage.setItem('britium-demo-user-role', 'EA');
    localStorage.setItem('britium-locale', 'en');
  });

  it('renders accessible portal cards for the current role', async () => {
    render(
      <MemoryRouter>
        <I18nProvider>
          <AuthProvider>
            <PortalLandingPage />
          </AuthProvider>
        </I18nProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/Enterprise Admin/i)).toBeInTheDocument();
  });
});