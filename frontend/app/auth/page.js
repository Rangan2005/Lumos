"use client";
import { UserButton, useUser, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import Image from 'next/image';

export default function MainPage() {
  const { user } = useUser();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-b from-zinc-900 via-black to-zinc-900">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMyMjIiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20" />

      {/* Main Content */}
      <div className="text-center w-full px-6 relative z-10">
        <SignedOut>
          <div className="flex gap-6 justify-center mb-8">
            <SignInButton redirectUrl="/main">
              <button className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-3 rounded-lg hover:from-blue-500 hover:to-blue-300 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 text-lg font-semibold">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton redirectUrl="/main">
              <button className="bg-gradient-to-r from-green-600 to-green-400 px-6 py-3 rounded-lg hover:from-green-500 hover:to-green-300 transition-all duration-300 shadow-lg hover:shadow-green-500/20 text-lg font-semibold">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <p className="text-2xl mb-16 bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-semibold">
            Welcome back, {user?.fullName || user?.username}!
          </p>
          
          {/* Large Glassmorphic Containers */}
          <div className="flex flex-col md:flex-row gap-16 justify-center items-stretch max-w-[95vw] mx-auto">
            <Card className="flex-1 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer group relative overflow-hidden min-h-[80vh] min-w-[400px]">
              <div className="absolute inset-0 z-0">
                <img 
                  src="/read.png"
                  alt="Reads background"
                  className="w-full h-full object-cover opacity-20 transition-opacity group-hover:opacity-30"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="relative z-10 h-full flex flex-col">
                <CardHeader className="flex-grow flex flex-col items-center justify-center">
                  <CardTitle className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-400 to-purple-300 group-hover:scale-105 transition-transform duration-500">
                    LUMOS WRITE
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-12">
    
                </CardContent>
              </div>
            </Card>

            <Card className="flex-1 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 cursor-pointer group relative overflow-hidden min-h-[80vh] min-w-[400px]">
              <div className="absolute inset-0 z-0">
                <img 
                  src="/record.png"
                  alt="Writes background"
                  className="w-full h-full object-cover opacity-20 transition-opacity group-hover:opacity-30"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="relative z-10 h-full flex flex-col">
                <CardHeader className="flex-grow flex flex-col items-center justify-center">
                  <CardTitle className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-pink-300 group-hover:scale-105 transition-transform duration-500">
                    LUMOS RECORDS
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-12">
                </CardContent>
              </div>
            </Card>
          </div>
        </SignedIn>

        <Link href="/" className="mt-16 inline-block text-gray-400 hover:text-gray-200 transition-colors duration-300">
          Back to Home
        </Link>
      </div>
    </main>
  );
}