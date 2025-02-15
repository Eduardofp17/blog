import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AppRoutes } from './routes';
import './i18n';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { GlobalProvider } from './contexts/GlobalContext';
import { ThemeProvider } from './components/ui/theme-provider';
import { Header } from './components/ui/header';
import { Footer } from './components/ui/footer';
import { BrowserRouter as Router } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ThemeProvider>
        <Toaster />
        <AuthProvider>
          <GlobalProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <AppRoutes />
              </main>
              <Footer />
            </div>
          </GlobalProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  </StrictMode>
);
