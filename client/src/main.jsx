import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
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
    <BrowserRouter>
      <HelmetProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>,
);