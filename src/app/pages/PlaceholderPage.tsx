import React from 'react';
import { Settings } from 'lucide-react';

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 p-6 lg:p-8 mt-12 opacity-80">
      <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <Settings className="w-10 h-10 text-slate-500 animate-spin-slow" />
      </div>
      <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
        {title}
      </h1>
      <p className="text-slate-400 max-w-md text-center">
        This module is currently under development. The AIGIS team is working hard to bring you the next generation of secure trading tools.
      </p>
      
      <button className="mt-4 px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10">
        Return to Home
      </button>
    </main>
  );
}
