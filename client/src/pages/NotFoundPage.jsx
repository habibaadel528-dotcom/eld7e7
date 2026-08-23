import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import Header from '../sections/Header';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import { Error404Graphic } from '../components/Error404Graphic';

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[var(--page-bg)] text-[var(--primary-text)] transition-colors duration-200">
      <Helmet>
        <title>Page Not Found - 404 | El-D7E7</title>
        <meta
          name="description"
          content="Sorry, the page you are looking for is not available on El-D7E7."
        />
      </Helmet>

      {/* Header & Navigation */}
      <div>
        <Header />
        <Navigation />
      </div>

      {/* 404 Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        {/* Graphic */}
        <div className="mb-6 max-w-[320px] sm:max-w-[420px]">
          <Error404Graphic />
        </div>

        {/* Headings */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black uppercase tracking-wider text-[#c53938] sm:text-4xl">
            404 — Page Not Found
          </h1>
          <p className="max-w-md text-sm text-[var(--secondary-text)] sm:text-base">
            Sorry! The page you are looking for does not exist or has been moved.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-3 rounded-full bg-[#c53938] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#c53938]/20 transition-all duration-200 hover:bg-[#ef5350] hover:shadow-xl active:scale-[0.98]"
          >
            <span>Go To Home Page</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </main>

      {/* Landing Page Footer */}
      <Footer />
    </div>
  );
};

export default NotFoundPage;
