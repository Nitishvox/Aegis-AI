import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Zap, Lock, Eye, Terminal, Fingerprint } from 'lucide-react';
import { motion } from 'motion/react';

export default function SecurityProtocolsView({ settings, setSettings }: { settings: any, setSettings: (s: any) => void }) {
  const protocols = [
    { id: 'kernel', name: 'Kernel-Level Intercept', icon: <Fingerprint size={16} />, desc: 'Enables deep packet inspection at the OS level.', enabled: settings.protocols.kernel, tier: 'Core' },
    { id: 'honeypot', name: 'Ghost Honeypot Protocol', icon: <Eye size={16} />, desc: 'Deploys invisible traps to catch network scanners.', enabled: settings.protocols.honeypot, tier: 'Tactical' },
    { id: 'neural', name: 'Neural Neutralization', icon: <Zap size={16} />, desc: 'Allows AEGIS-AI to autonomously block malicious IPs.', enabled: settings.protocols.neural, tier: 'AI' },
    { id: 'audit', name: 'Immutable Audit Ledger', icon: <Lock size={16} />, desc: 'Logs all actions to an encrypted, append-only vault.', enabled: settings.protocols.audit, tier: 'Compliance' },
    { id: 'quantum', name: 'Quantum Encryption Node', icon: <Shield size={16} />, desc: 'Enforces post-quantum cryptographic handshakes.', enabled: settings.protocols.quantum, tier: 'Next-Gen' },
  ];

  const toggleProtocol = (id: string) => {
    setSettings({
      ...settings,
      protocols: {
        ...settings.protocols,
        [id]: !settings.protocols[id]
      }
    });
  };

  const activeCount = Object.values(settings.protocols).filter(Boolean).length;

  return (
    <ScrollArea className="h-full pr-4">
      <div className="flex flex-col gap-6 p-4 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex flex-col gap-1">
          <h2 className="text-2xl font-serif italic text-white leading-tight">Defensive Primitives</h2>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-[0.2em]">Configure tactical defense layers for AEGIS-PRIME.</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {protocols.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-900 border-white/5 hover:border-blue-500/20 transition-all overflow-hidden group h-full">
                 <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {p.icon}
                       </div>
                       <CardTitle className="text-sm font-bold text-slate-200">{p.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-[8px] border-white/10 text-slate-500">{p.tier}</Badge>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <p className="text-xs text-slate-400 font-light leading-relaxed">{p.desc}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                       <Label htmlFor={p.id} className="text-[10px] font-mono text-slate-500 uppercase cursor-pointer">Protocol Status</Label>
                       <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-mono ${p.enabled ? 'text-green-500' : 'text-slate-600'}`}>
                             {p.enabled ? 'ACTIVE' : 'OFFLINE'}
                          </span>
                          <Switch 
                            id={p.id} 
                            checked={p.enabled} 
                            onCheckedChange={() => toggleProtocol(p.id)}
                            className="scale-75 data-[state=checked]:bg-blue-600" 
                          />
                       </div>
                    </div>
                 </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-slate-950 border-blue-500/20 shadow-2xl mt-8">
           <CardHeader className="py-3 px-6 border-b border-white/5">
              <CardTitle className="text-[10px] uppercase tracking-widest text-blue-400 flex items-center gap-2">
                 <Terminal size={14} /> Tactical Deployment Status
              </CardTitle>
           </CardHeader>
           <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-8">
                 <div className="space-y-1">
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Active Layers</p>
                    <p className="text-2xl font-serif italic text-white transition-all">{activeCount.toString().padStart(2, '0')} / 05</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Neural Sync</p>
                    <p className="text-2xl font-serif italic text-green-500">100%</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Entropy Level</p>
                    <p className="text-2xl font-serif italic text-slate-300">{settings.protocols.quantum ? '0.0001%' : '0.002%'}</p>
                 </div>
                 <div className="space-y-1 text-right">
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Access Mode</p>
                    <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/20 border-red-500/30">READ_WRITE</Badge>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
