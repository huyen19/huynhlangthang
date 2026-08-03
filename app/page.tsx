import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TourList from "@/components/TourList";
import CharitySection from "@/components/CharitySection";
import FinanceSection from "@/components/FinanceSection";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <TourList />
        <CharitySection />
        <GallerySection />
        <FinanceSection />
      </main>
      <Footer />
    </>
  );
}
