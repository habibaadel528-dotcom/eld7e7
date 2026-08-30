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
    </div>
  );
}