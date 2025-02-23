import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* Gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/20 blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/20 blur-[150px] animate-pulse delay-700" />
      </div>

      {/* Chromatic aberration lines */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent transform -rotate-12" />
        <div className="absolute top-[60%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent transform rotate-12" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-wider">Transcript in Under <span className="text-blue-400 font-normal">a minute?</span></h1>
        <div className="space-y-6 max-w-3xl">
          <p className="text-2xl md:text-3xl text-white/90 font-light">
            (Yeah we do that too) 
          </p>
          <p className="text-2xl md:text-5xl font-extrabold text-white/70">The actionable AI for your needs</p>
          <div className="pt-8">    
          </div>
        </div>
      </div>

      {/* Glitch effect overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50" />
      </div>
    </div>
  )
}