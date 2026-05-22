"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, BrainCircuit, Activity, Zap, Volume2, ShieldCheck } from "lucide-react";

// Explicit Interface to fix the Layout.tsx error
interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceAssistant({ isOpen, onClose }: VoiceAssistantProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  // 🎙️ START RECORDING
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = handleSendAudio;
      mediaRecorder.start();
      setIsRecording(true);
      setResponse(null);
    } catch (err) {
      alert("Neural Uplink Blocked: Microphone access denied.");
    }
  };

  // 🛑 STOP RECORDING
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // 🚀 SEND TO NEURAL ENGINE
  const handleSendAudio = async () => {
    setIsProcessing(true);
    const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", audioBlob, "voice.webm");

    try {
      // Use full URL if NEXT_PUBLIC_API_URL is set, otherwise relative
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
      const token = localStorage.getItem("access_token");

      const res = await fetch(`${apiBase}/ai-assistant/voice-query`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      const data = await res.json();
      setResponse(data?.response || "Neural engine could not parse the command.");
    } catch (err) {
      setResponse("Connection Error: Neural uplink interrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="bg-[#0f172a] border border-slate-800 w-full max-w-lg rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden relative"
          >
            {/* AMBIENT BACKGROUND GLOW */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-[100px] transition-colors duration-1000 ${isRecording ? 'bg-lime-500/20' : 'bg-blue-500/10'}`} />

            {/* HEADER */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-3">
                <BrainCircuit className="text-lime-400" size={24} />
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white italic">Neural Assistant</span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Uplink Alpha-01</span>
                </div>
              </div>
              <button onClick={onClose} className="h-10 w-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <X size={18} />
              </button>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="p-12 flex flex-col items-center gap-10 relative z-10">
              <div className="h-32 flex flex-col items-center justify-center text-center">
                {isProcessing ? (
                  <div className="space-y-4">
                    <Activity className="text-lime-400 animate-pulse mx-auto" size={48} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Decoding Voice Vectors...</p>
                  </div>
                ) : response ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                     <p className="text-lime-100 font-medium italic text-lg leading-relaxed">"{response}"</p>
                  </motion.div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-slate-300 font-black uppercase tracking-widest text-xs">
                        {isRecording ? "Listening to query..." : "Awaiting Command"}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Hold to speak / Release to process</p>
                  </div>
                )}
              </div>

              {/* PULSING MIC BUTTON */}
              <button 
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                className={`group relative h-28 w-28 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isRecording 
                  ? 'bg-lime-500 shadow-[0_0_60px_rgba(132,204,22,0.5)] scale-110' 
                  : 'bg-slate-800 hover:bg-slate-700 shadow-2xl'
                }`}
              >
                {isRecording && (
                  <motion.div 
                    animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 rounded-full bg-lime-500"
                  />
                )}
                <Mic className={isRecording ? 'text-slate-900' : 'text-lime-400'} size={40} strokeWidth={2.5} />
              </button>
            </div>

            {/* SYSTEM STATUS FOOTER */}
            <div className="bg-black/40 p-8 flex justify-between items-center border-t border-white/5">
                <div className="flex items-center gap-2 opacity-60">
                    <ShieldCheck size={14} className="text-lime-400" />
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Secure Session</span>
                </div>
                <div className="flex items-center gap-2 opacity-60">
                    <div className="h-1.5 w-1.5 bg-lime-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Neural Sync</span>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}