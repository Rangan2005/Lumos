"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, SendHorizontal } from "lucide-react"
import { Spotlight } from "@/components/ui/spotlight"

export default function AudioPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const fileInputRef = useRef(null)

  const handleSend = async () => {
    const file = fileInputRef.current?.files?.[0]

    if (!file) {
      alert("Please upload a file before sending.")
      return
    }

    setIsGenerating(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/file-upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      console.log("Upload successful:", data)
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Error uploading file.")
    } finally {
      setIsGenerating(false)
    }
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <p className="text-3xl font-bold text-white animate-pulse">Generating...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black/[0.96] bg-grid-white/[0.02] text-white relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <div className="container mx-auto px-4 py-8 max-w-3xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-9xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            LUMOS
          </h1>
          <p className="text-neutral-300 text-4xl tracking-widest max-w-lg mx-auto font-mono">Record and Remember</p>
        </div>

        <Card className="w-full border-gray-800 bg-[#111111]/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white font-mono">Convert Your Audio</CardTitle>
            <CardDescription className="text-gray-400 font-mono">
              Upload an audio file to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-800 rounded-lg bg-[#161616]/80">
              <Upload className="w-12 h-12 mb-4 text-gray-400" />
              <p className="mb-4 text-sm text-gray-400 font-mono">Upload your audio file (MP3, WAV, M4A)</p>
              <Input
                type="file"
                accept="audio/*"
                className="max-w-sm bg-[#1A1A1A] border-gray-800 text-white"
                ref={fileInputRef}
              />
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleSend} className="bg-gray-600 hover:bg-blue-700 font-mono">
                <SendHorizontal className="w-4 h-4 mr-2 font-mono" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
