import React from 'react';
import { Shield } from 'lucide-react';
import { SystemSettings } from '@/src/App';

interface BannerProps {
  activeThreats: number;
  settings: SystemSettings;
}

export const LogBanner = ({ activeThreats, settings }: BannerProps) => (
  <div className="bg-slate-950 border-b border-white/5 px-6 py-3 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`${activeThreats > 0 ? 'bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-blue-500/10'} p-2 rounded transition-all`}>
        <Shield className={`w-5 h-5 ${activeThreats > 0 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
      </div>
      <div>
        <h1 className="text-sm font-black tracking-[0.2em] uppercase text-white">Aegis Command</h1>
        <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">Hybrid Cloud Orchestrator // {settings.primaryRegion}</p>
      </div>
    </div>
    <div className="flex items-center gap-8">
      <div className="text-right">
        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Deployment</p>
        <p className={`text-[10px] font-mono font-bold ${settings.telemetryEnabled ? 'text-blue-400' : 'text-slate-500'}`}>
          {settings.telemetryEnabled ? 'ACTIVE_NODE' : 'READ_ONLY'}
        </p>
      </div>
      <div className="text-right">
        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Threat Level</p>
        <p className={`text-[10px] font-mono font-bold ${activeThreats > 3 ? 'text-red-500' : activeThreats > 0 ? 'text-orange-400' : 'text-green-400'}`}>
          {activeThreats > 3 ? 'CRITICAL (L5)' : activeThreats > 0 ? 'ELEVATED (L2)' : 'STABLE (L0)'}
        </p>
      </div>
    </div>
  </div>
);
