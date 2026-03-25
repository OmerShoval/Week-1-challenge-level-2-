/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Waves, 
  Play, 
  ClipboardCheck, 
  TrendingUp, 
  MessageSquare, 
  ChevronRight,
  Zap,
  Target,
  User,
  Calendar,
  Loader2,
  Upload,
  FileVideo,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { analyzeSurfVideo } from './services/geminiService';

// Utility to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data:image/png;base64, prefix
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'roadmap'>('video');
  
  // File states
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [roadmapFile, setRoadmapFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [roadmapPreview, setRoadmapPreview] = useState<string | null>(null);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleRoadmapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRoadmapFile(file);
      setRoadmapPreview(URL.createObjectURL(file));
    }
  };

  const handleAnalyze = async () => {
    if (!videoFile || !roadmapFile) {
      alert("Please upload both a video and a roadmap image first!");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const videoBase64 = await fileToBase64(videoFile);
      const roadmapBase64 = await fileToBase64(roadmapFile);
      
      const result = await analyzeSurfVideo(videoBase64, roadmapBase64);
      setAnalysis(result || "Analysis failed to generate.");
    } catch (error: any) {
      console.error("Analysis error:", error);
      const errorMsg = typeof error === 'object' ? JSON.stringify(error) : String(error);
      setAnalysis(`Analysis error:\n\`\`\`\n${errorMsg}\n\`\`\``);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 surf-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
            <Waves size={24} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight">StokeCoach</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">World Class Surf Coaching</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-600">
            <User size={14} />
            <span>Coach Kelly</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Submission & Roadmap */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                  <Play size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Weekly Submission: Noy</h2>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Calendar size={12} />
                    March 9, 2026 • Wave Pool Session
                  </p>
                </div>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveTab('video')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'video' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Video
                </button>
                <button 
                  onClick={() => setActiveTab('roadmap')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'roadmap' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Roadmap
                </button>
              </div>
            </div>

            <div className="aspect-video bg-slate-900 relative group">
              {activeTab === 'video' ? (
                <div className="w-full h-full flex items-center justify-center text-white/50 relative">
                  {videoPreview ? (
                    <video 
                      src={videoPreview} 
                      controls 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <label className="text-center cursor-pointer hover:text-white transition-colors p-8 border-2 border-dashed border-slate-700 rounded-2xl">
                      <input 
                        type="file" 
                        accept="video/*" 
                        className="hidden" 
                        onChange={handleVideoChange}
                      />
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                        <FileVideo size={32} />
                      </div>
                      <p className="text-sm font-bold">Upload Noy's Video</p>
                      <p className="text-xs mt-1 text-slate-500">MP4, MOV, etc.</p>
                    </label>
                  )}
                  {videoPreview && (
                    <label className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg cursor-pointer text-white transition-all">
                      <input type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
                      <Upload size={16} />
                    </label>
                  )}
                </div>
              ) : (
                <div className="w-full h-full p-4 bg-slate-100 overflow-auto relative">
                  {roadmapPreview ? (
                    <div className="space-y-4">
                      <img 
                        src={roadmapPreview} 
                        alt="Training Roadmap" 
                        className="w-full rounded-xl shadow-lg"
                        referrerPolicy="no-referrer"
                      />
                      <div className="p-4 bg-white rounded-xl border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                          <Target size={16} className="text-rose-500" />
                          Current Focus: Bottom Turn Efficiency
                        </h3>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Stay lower longer through the compression</li>
                          <li>• Avoid "ankle-only" power delivery</li>
                          <li>• Role Model: Harley Ingleby Flow</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <label className="text-center cursor-pointer hover:text-slate-600 transition-colors p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-white">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleRoadmapChange}
                        />
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                          <ImageIcon size={32} className="text-slate-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-600">Upload Training Roadmap</p>
                        <p className="text-xs mt-1 text-slate-400">PNG, JPG, etc.</p>
                      </label>
                    </div>
                  )}
                  {roadmapPreview && (
                    <label className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-lg cursor-pointer text-slate-600 shadow-sm transition-all">
                      <input type="file" accept="image/*" className="hidden" onChange={handleRoadmapChange} />
                      <Upload size={16} />
                    </label>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50/50">
              <div className="flex gap-4 mb-4">
                <div className={`flex-1 p-3 rounded-xl border flex items-center gap-3 transition-all ${videoFile ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white border-slate-200 text-slate-400'}`}>
                  <div className={`p-1.5 rounded-lg ${videoFile ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                    {videoFile ? <CheckCircle2 size={16} /> : <FileVideo size={16} />}
                  </div>
                  <span className="text-xs font-bold truncate">{videoFile ? videoFile.name : 'Video Required'}</span>
                </div>
                <div className={`flex-1 p-3 rounded-xl border flex items-center gap-3 transition-all ${roadmapFile ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white border-slate-200 text-slate-400'}`}>
                  <div className={`p-1.5 rounded-lg ${roadmapFile ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                    {roadmapFile ? <CheckCircle2 size={16} /> : <ImageIcon size={16} />}
                  </div>
                  <span className="text-xs font-bold truncate">{roadmapFile ? roadmapFile.name : 'Roadmap Required'}</span>
                </div>
              </div>
              
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !videoFile || !roadmapFile}
                className="w-full py-4 surf-gradient text-white rounded-2xl font-bold text-lg shadow-lg shadow-sky-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Analyzing Technique...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    Generate Coach's Summary
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Speed', value: '7.4', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: 'Flow', value: '6.2', icon: Waves, color: 'text-sky-500', bg: 'bg-sky-50' },
              { label: 'Power', value: '5.8', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className={`w-8 h-8 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-2`}>
                  <stat.icon size={18} />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-display font-extrabold text-slate-800">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Analysis Results */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <ClipboardCheck size={20} />
              </div>
              <h2 className="font-bold text-lg text-slate-800">Coach's Analysis</h2>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                {analysis ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-slate-600 prose-li:text-slate-600"
                  >
                    <Markdown>{analysis}</Markdown>
                  </motion.div>
                ) : isAnalyzing ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 py-20">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin"></div>
                      <Waves className="absolute inset-0 m-auto text-sky-500 animate-pulse" size={24} />
                    </div>
                    <p className="font-medium animate-pulse">Reading the waves...</p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                      <MessageSquare size={32} className="text-slate-300" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-500">No Analysis Yet</p>
                      <p className="text-sm max-w-[200px]">Click the button to generate a summary of Noy's submission.</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {analysis && (
              <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                      <img src="https://picsum.photos/seed/coach/100/100" alt="Coach" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Kelly Slater (AI)</span>
                  </div>
                  <button className="text-sky-600 text-sm font-bold flex items-center gap-1 hover:underline">
                    Share with Noy <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
