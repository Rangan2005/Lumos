"use client";

import { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MoreVertical, Edit, Check, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import axios from "axios";

export default function TranscriptionComponent() {
  const [heading, setHeading] = useState("Your Transcription Title");
  const [transcription, setTranscription] = useState("Edit this transcription...");
  const [isEditingHeading, setIsEditingHeading] = useState(false);
  const [isEditingTranscription, setIsEditingTranscription] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState("");

  const menuOptions = [
    "Custom",
    "Summary",
    "Meeting report",
    "Main points",
    "To-do list",
    "Translate",
    "Tweet",
    "Blog post",
    "Email",
    "Cleanup"
  ];

  const handleHeadingToggle = () => setIsEditingHeading(!isEditingHeading);
  const handleTranscriptionToggle = () => setIsEditingTranscription(!isEditingTranscription);

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    try {
      const response = await axios.post("/api/process", {
        option,
        transcription,
      });
      setResult(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResult("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black/[0.96] bg-grid-white/[0.02] text-white relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <div className="container mx-auto px-4 py-8 max-w-3xl relative z-10">
        <div className="text-center mb-8">
          <p className="text-neutral-300 text-4xl tracking-widest max-w-lg mx-auto font-mono mb-8">
            Edit and Transform
          </p>
          
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto mb-8">
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
        </div>

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
                      {option}
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
                <p className="whitespace-pre-wrap text-sm text-gray-300 font-mono">{result || "Loading..."}</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}