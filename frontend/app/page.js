import { Button } from '@/components/ui/button';
import PricingCards from '@/components/Price';
import Hero from '@/components/LowHero';
import Spline from '@splinetool/react-spline/next';
import Link from 'next/link';  // ✅ Correct import
import FaqSection from '@/components/FAQ';

export default function Home() {
  return (
    <>
    
    <main className="min-h-screen flex items-center justify-center bg-black relative">
      {/* Spline Background */}
      <Spline scene="https://prod.spline.design/11W8DmfQpwL41xAp/scene.splinecode" />

      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

      {/* Floating Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="md:text-9xl sm:text-6xl font-extrabold mb-4 animate-fade-in font-serif tracking-widest">
          LUMOS
        </h1>
        <p className="text-lg sm:text-2xl font-medium animate-fade-in italic delay-200">
          The AI for your notes
        </p>

        <Link href="/auth" passHref>
          <Button className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md animate-fade-in delay-400">
            Get Started
          </Button>
        </Link>

      </div>
    </main>
    <Hero />
    <PricingCards />
    <FaqSection></FaqSection>
    </>
  );
}
