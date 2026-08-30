import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import './styles/global.css';

const savedTheme = localStorage.getItem('theme');

const initialTheme =
  savedTheme === 'light' || savedTheme === 'dark'
    ? savedTheme
    : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

document.documentElement.dataset.theme = initialTheme;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <HelmetProvider>
          <WishlistProvider>
            <CartProvider>
              <App />
              <Toaster position="top-right" richColors closeButton duration={3500} />
            </CartProvider>
          </WishlistProvider>
        </HelmetProvider>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
);