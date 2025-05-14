
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ContentSection from '../components/ContentSection';
import Footer from '../components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <ContentSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
