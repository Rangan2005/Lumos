import Spline from '@splinetool/react-spline/next';

export default function Home() {
  return (
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
        <p className="text-lg sm:text-2xl font-medium animate-fade-in delay-200">
          The AI for you
        </p>
      </div>
    </main>
  );
}
