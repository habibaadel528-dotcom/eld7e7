import React from 'react';
import { SEO } from '../components/SEO';
import Header from '../sections/Header';
import { Footer } from '../components/Footer';
import { Error404Graphic } from '../components/Error404Graphic';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <>
      <SEO 
        title="Error Page - 404" 
        description="Sorry! This Page is Not Available! - El Da7e7" 
      />

      {/* Full-width Real Web Page Layout */}
      <div className="w-full min-h-screen bg-white text-gray-900 flex flex-col justify-between font-sans selection:bg-[#C23434]/10 selection:text-[#C23434]">
        
        {/* Full-Width Header */}
        <Header />

        {/* 404 Hero Section - Full Page Centered */}
        <main className="flex-1 w-full bg-white flex flex-col items-center justify-center py-16 px-4 text-center">
          
          {/* Custom Red 404 Graphic */}
          <Error404Graphic />

          {/* Error Text Headings */}
          <div className="space-y-2 mt-4">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-800 uppercase tracking-wide">
              ERROR PAGE!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Sorry! This Page is Not Available!
            </p>
          </div>

          {/* Go To Home Page Button */}
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 bg-[#404040] hover:bg-[#202020] text-white text-xs font-semibold px-7 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 group"
            >
              <span>Go To Home Page</span>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </main>

        {/* Full-Width Footer */}
        <Footer />

      </div>
    </>
  );
};

export default NotFoundPage;
