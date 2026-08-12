import { useEffect, useState } from 'react';

import { checkHealth } from '../services/api';
import AnnouncementBar from '../sections/AnnouncementBar';
import Header from '../sections/Header';
import Navigation from '../sections/Navigation';
import HeroSection from '../sections/HeroSection';
import WhyChooseUs from '../sections/WhyChooseUs';
import CategorySection from '../sections/CategorySection';
import BestSeller from '../sections/BestSeller';
import TrustedBrands from '../sections/TrustedBrands';
import CustomerReviews from '../sections/CustomerReviews';
import Footer from '../sections/Footer';
import Newsletter from '../sections/Newsletter';
export default function Home() {
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    checkHealth()
      .then((data) => setApiStatus(data))
      .catch(() =>
        setApiStatus({
          success: false,
          message: 'Server unreachable',
        }),
      );
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#121212]">
      <AnnouncementBar />
      <Header />
      <Navigation />

      <main>
        <HeroSection />
        <WhyChooseUs />
        <CategorySection />
        <BestSeller />
        <TrustedBrands />
        <CustomerReviews />
        <Newsletter />
        <Footer />
      </main>

      {apiStatus && (
        <div
          className={`fixed bottom-4 right-4 z-50 rounded-full px-4 py-2 text-xs font-medium shadow-lg ${
            apiStatus.success
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          API: {apiStatus.message}
        </div>
      )}
    </div>
  );
}