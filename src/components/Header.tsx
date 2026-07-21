import React from 'react';
import { Layers, Shield, Sparkles, User, HelpCircle, HardDrive, Zap } from 'lucide-react';
import { Tier } from '../types';

interface HeaderProps {
  currentTier: Tier;
  onTierChange: (tier: Tier) => void;
  projectCount: number;
}

export default function Header({ currentTier, onTierChange, projectCount }: HeaderProps) {
  // Usage tracking variables based on current tier
  const maxExports = currentTier === 'free' ? 3 : currentTier === 'pro' ? 50 : 'Unlimited';
  const exportsUsed = currentTier === 'free' ? 1 : currentTier === 'pro' ? 12 : 38;
  const storageLimit = currentTier === 'free' ? '500 MB' : currentTier === 'pro' ? '10 GB' : '100 GB';
  const storageUsed = currentTier === 'free' ? '82 MB' : currentTier === 'pro' ? '1.4 GB' : '4.6 GB';

  return (
    <header className="border-b border-slate-800 bg-slate-950 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-40" id="backdrop-shift-header">
      {/* Brand logo & tagline */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-900/20 text-white animate-pulse">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-space tracking-tight text-white">BackdropShift</h1>
            <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">v1.2.4</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-light">Remove & replace video backgrounds in seconds</p>
        </div>
      </div>

      {/* Tier Switcher (Interactive Preview Controller) */}
      <div className="flex flex-wrap items-center gap-4 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
        <span className="text-xs font-mono text-slate-400 pl-2 pr-1 hidden sm:inline">Active Plan:</span>
        <div className="flex gap-1">
          {(['free', 'pro', 'business'] as Tier[]).map((tier) => (
            <button
              key={tier}
              id={`tier-button-${tier}`}
              onClick={() => onTierChange(tier)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 capitalize flex items-center gap-1.5 ${
                currentTier === tier
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-900/30 font-semibold scale-105'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tier === 'pro' && <Sparkles className="w-3.5 h-3.5" />}
              {tier === 'business' && <Shield className="w-3.5 h-3.5" />}
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Account Profile & Usage Statistics */}
      <div className="flex items-center gap-4 sm:gap-6 self-end md:self-auto">
        {/* Resource Usage Stats */}
        <div className="hidden lg:flex items-center gap-5 text-xs font-mono text-slate-400 border-r border-slate-800 pr-5">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <div>
              <span className="text-slate-300 font-medium">{exportsUsed}</span>
              <span className="text-slate-500">/{maxExports} exports</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
            <div>
              <span className="text-slate-300 font-medium">{storageUsed}</span>
              <span className="text-slate-500">/{storageLimit}</span>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-200 font-mono">januariobillgates@gmail.com</div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-end gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-ping"></span>
              Live Sandbox Engine
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-inner relative group cursor-pointer hover:border-violet-500 transition-colors">
            <User className="w-4 h-4" />
            <div className="absolute right-0 top-11 hidden group-hover:block bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs w-60 text-left shadow-xl z-50">
              <div className="font-bold text-white border-b border-slate-800 pb-1.5 mb-1.5">User Workspace</div>
              <div className="space-y-1 text-slate-300 font-mono text-[11px]">
                <p>Email: januariobillgates@gmail.com</p>
                <p>Saved Projects: {projectCount}/3 limit (free)</p>
                <p>Engine: WebAssembly GPU</p>
                <p className="text-violet-400 mt-2">Adjust Active Plan toggle to test higher resolutions & remove watermark!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
