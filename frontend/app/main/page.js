"use client";

import { useState, useRef } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MoreVertical, Edit, Check, Search, Upload, SendHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import LumosNavigation from '@/components/LumosNavigate';

export default function AudioTranscriptionPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [heading, setHeading] = useState("");
  const [transcription, setTranscription] = useState("");
  const [isEditingHeading, setIsEditingHeading] = useState(false);
  const [isEditingTranscription, setIsEditingTranscription] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTranscription, setShowTranscription] = useState(false);

  const menuOptions = [
    { label: "Summary", endpoint: "summarize" },
    { label: "Meeting report", endpoint: "generate-report" },
    { label: "Main points", endpoint: "extract-main-points" },
  ];

  // Uploads the file and sets the transcription (similar to how the first snippet handles submission)
  const handleSend = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      alert("Please upload a file before sending.");
      return;
    }

    setIsUploading(true);
    setIsGenerating(true);
    setShowTranscription(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/file-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      
      // Set heading and transcription from response data
      setHeading(data.title || "Untitled Transcription");
      setTranscription(data.transcription || "");
      setShowTranscription(true);
      
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing file.");
    } finally {
      setIsUploading(false);
      setIsGenerating(false);
    }
  };

  // Processes the transcription using the selected endpoint—mirroring the first snippet’s proxy call logic
  const handleOptionSelect = async (option) => {
    setSelectedOption(option.label);
    setIsProcessing(true);
    setResult("");
    
    try {
      const payload = {
        endpoint: option.endpoint,
        text: transcription,
      };
  
      const response = await fetch('/api/process', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error(`Error with ${option.label}`);
  
      const data = await response.json();
      
      let processedResult = "";
      if (data.summary) {
        processedResult = data.summary;
      } else if (data.meeting_report) {
        processedResult = data.meeting_report;
      } else if (data.main_points) {
        processedResult = Array.isArray(data.main_points)
          ? data.main_points.join('\n')
          : data.main_points;
      } else if (data.todo_list) {
        processedResult = Array.isArray(data.todo_list)
          ? data.todo_list.join('\n')
          : data.todo_list;
      }
      
      setResult(processedResult);
    } catch (error) {
      console.error("Error processing request:", error);
      setResult("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  

  const handleHeadingToggle = () => setIsEditingHeading(!isEditingHeading);
  const handleTranscriptionToggle = () => setIsEditingTranscription(!isEditingTranscription);

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <p className="text-3xl font-bold text-white animate-pulse">
          {isUploading ? "Uploading..." : "Processing..."}
        </p>
      </div>
    );
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

        {!showTranscription ? (
          <Card className="w-full border-gray-800 bg-[#111111]/80 backdrop-blur-sm mb-8">
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
                  <SendHorizontal className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full border-gray-800 bg-[#111111]/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ duration: 0.3 }}
                  className="flex-1 mr-4"
                >
                  <Input
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    disabled={!isEditingHeading}
                    className={`w-full text-xl font-semibold bg-[#161616]/80 text-white border-gray-800 focus:ring-2 ${
                      isEditingHeading 
                        ? "focus:ring-blue-400 focus:border-blue-400" 
                        : "cursor-not-allowed opacity-80"
                    }`}
                  />
                </motion.div>
                <Button 
                  onClick={handleHeadingToggle} 
                  className={`font-mono ${
                    isEditingHeading 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-gray-600 hover:bg-blue-700"
                  }`}
                >
                  {isEditingHeading ? (
                    <><Check className="w-4 h-4 mr-2" /> Done</>
                  ) : (
                    <><Edit className="w-4 h-4 mr-2" /> Edit</>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 max-w-full mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search in transcription..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 bg-[#161616]/80 border-gray-800 text-white font-mono placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <Button 
                  className="bg-gray-600 hover:bg-blue-700 font-mono"
                  onClick={() => console.log('Search:', searchQuery)}
                >
                  Search
                </Button>
              </div>

              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.3 }}
              >
                <Textarea
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  disabled={!isEditingTranscription}
                  className={`w-full min-h-[150px] p-3 text-base rounded-xl border bg-[#161616]/80 text-white border-gray-800 focus:outline-none focus:ring-2 ${
                    isEditingTranscription 
                      ? "focus:ring-blue-400 focus:border-blue-400" 
                      : "cursor-not-allowed opacity-80"
                  }`}
                />
              </motion.div>
              
              <div className="flex justify-between items-center mt-6">
                <Button 
                  onClick={handleTranscriptionToggle} 
                  className={`font-mono ${
                    isEditingTranscription 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-gray-600 hover:bg-blue-700"
                  }`}
                >
                  {isEditingTranscription ? (
                    <><Check className="w-4 h-4 mr-2" /> Done</>
                  ) : (
                    <><Edit className="w-4 h-4 mr-2" /> Edit</>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-[#1A1A1A] border-gray-800 text-white font-mono">
                      <MoreVertical className="w-4 h-4 mr-2" /> Options
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1A1A1A] border-gray-800 text-white">
                    {menuOptions.map((option, index) => (
                      <DropdownMenuItem 
                        key={index} 
                        className="cursor-pointer hover:bg-[#2A2A2A] font-mono"
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {selectedOption && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 p-4 border border-gray-800 rounded-xl bg-[#161616]/80"
                >
                  <h3 className="text-lg font-semibold mb-2 text-white font-mono">{selectedOption} Result:</h3>
                  {isProcessing ? (
                    <p className="text-sm text-gray-300 font-mono animate-pulse">Processing...</p>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm text-gray-300 font-mono">{result}</p>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <LumosNavigation></LumosNavigation>
    </div>
  );
}
