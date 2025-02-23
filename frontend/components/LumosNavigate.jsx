import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, PenLine } from "lucide-react";

export default function LumosNavigation() {
  const [activeTab, setActiveTab] = useState("record");
  
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-[300px]"
        >
          <TabsList className="grid grid-cols-2 bg-[#111111]/90 backdrop-blur-lg border border-gray-800">
            <TabsTrigger 
              value="record"
              className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white text-gray-400"
              onClick={() => window.location.href = '/main'}
            >
              <div className="flex items-center space-x-2">
                <Mic className="w-4 h-4" />
                <span className="font-mono">LumosAudio</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="write"
              className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white text-gray-400"
              onClick={() => window.location.href = '/main-write'}
            >
              <div className="flex items-center space-x-2">
                <PenLine className="w-4 h-4" />
                <span className="font-mono">LumosWrite</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>
    </div>
  );
}