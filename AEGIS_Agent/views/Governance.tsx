import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Lock, Scale, CheckCircle2, AlertCircle, FileCheck, Zap, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import { SystemSettings } from '@/src/App';

const chartData = [
  { time: '08:00', value: 92 },
  { time: '09:00', value: 88 },
  { time: '10:00', value: 95 },
  { time: '11:00', value: 94 },
  { time: '12:00', value: 98 },
  { time: '13:00', value: 97 },
  { time: '14:00', value: 99 },
];

interface GovernanceViewProps {
  incidents: any[];
  settings?: SystemSettings;
}

export default function GovernanceView({ incidents, settings }: GovernanceViewProps) {
  const activeIncidents = incidents.filter(i => i.status !== 'REMEDIATED');
  const isUnderAttack = activeIncidents.length > 0;
  const criticalThreat = activeIncidents.some(i => i.severity === 'CRITICAL');
  const isStrict = settings?.safetySensitivity && settings.safetySensitivity > 90;

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight font-serif italic text-blue-500">AI Governance & Compliance</h2>
        <div className="flex gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">SOC2 COMPLIANT</Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">ISO 27001</Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">GDPR_SYNC</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900 border-white/5 shadow-xl">
            <CardHeader className="border-b border-white/5">
              <div className="flex items-center justify-between">
                <div>
                   <CardTitle className="text-slate-100 flex items-center gap-2"><Scale className="w-5 h-5 text-blue-500" /> Decision Logic Policy</CardTitle>
                   <CardDescription>Real-time AI behavioral boundaries and ethical constraints.</CardDescription>
                </div>
                {isUnderAttack && (
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 animate-pulse">THREAT_ADAPTIVE_MODE</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg bg-slate-950 border transition-all ${isUnderAttack ? 'border-orange-500/30' : 'border-white/5'}`}>
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Self-Correction Mode</span>
                      <Shield className={`w-4 h-4 ${isUnderAttack ? 'text-orange-500' : 'text-blue-500'}`} />
                   </div>
                    <p className="text-sm font-bold text-slate-200 mb-1">
                      {criticalThreat || isStrict ? 'STRICT_VALIDATION' : isUnderAttack ? 'Adaptive Filtering' : 'Standard Validation'}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                       {criticalThreat || isStrict
                         ? `STRICT SAFETY PROTOCOL: AI models are ${isStrict ? 'manually set to' : 'forced into'} extreme validation mode with ${isStrict ? '90%+' : '100%'} human-gate requirement.`
                         : isUnderAttack 
                         ? 'AI models are strictly validating remediation steps against baseline safety protocols due to active threat.' 
                         : 'System is running optimal investigation logic with standard validation gates.'}
                    </p>
                </div>

                <div className={`p-4 rounded-lg bg-slate-950 border transition-all ${criticalThreat ? 'border-red-500/30' : 'border-white/5'}`}>
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Containment Protocol</span>
                      <Lock className={`w-4 h-4 ${criticalThreat ? 'text-red-500' : 'text-slate-600'}`} />
                   </div>
                   <p className="text-sm font-bold text-slate-200 mb-1">{criticalThreat ? 'FULL LOCKDOWN' : 'MONITOR ONLY'}</p>
                   <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                      {criticalThreat 
                        ? 'High-severity incidents detected. Automated quarantine of non-essential Azure nodes is ACTIVE.' 
                        : 'No critical threats detected. Automated containment systems in standby/audit mode.'}
                   </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Compliance Control Matrix</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-slate-950/50 rounded border border-white/5">
                    <span className="text-xs text-slate-400">Human-in-the-loop override</span>
                    <Badge variant="outline" className="text-[9px] text-green-400 border-green-500/30">MANDATORY</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-950/50 rounded border border-white/5">
                    <span className="text-xs text-slate-400">Deep Packet Inspection</span>
                    <Badge variant="outline" className={`text-[9px] font-mono ${settings?.deepPacketInspection ? 'text-red-400 border-red-500/30' : 'text-slate-500 border-white/10'}`}>
                      {settings?.deepPacketInspection ? 'HEU_ACTIVE' : 'DISABLED'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-950/50 rounded border border-white/5">
                    <span className="text-xs text-slate-400">Auto-Remediation Workflow</span>
                    <Badge variant="outline" className={`text-[9px] font-mono ${settings?.autoRemediation ? 'text-green-400 border-green-500/30' : 'text-slate-500 border-white/10'}`}>
                      {settings?.autoRemediation ? 'ACTIVE' : 'IDLE'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="bg-slate-900 border-white/5">
                <CardHeader>
                   <CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Operational Health</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="h-[100px] w-full mt-2">
                       <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                             <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
                             <Tooltip 
                                contentStyle={{ background: '#020617', border: '1px solid #1e293b', fontSize: '10px' }}
                                itemStyle={{ color: '#22c55e' }}
                             />
                          </LineChart>
                       </ResponsiveContainer>
                    </div>
                    <div className="space-y-1">
                       <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-500 uppercase tracking-widest">System Integrity</span>
                          <span className="text-green-500">99.99%</span>
                       </div>
                       <Progress value={99.99} className="h-1 bg-slate-800" />
                    </div>
                   <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                         <span className="text-slate-500 uppercase tracking-widest">Reporting Latency</span>
                         <span className="text-blue-500">12ms</span>
                      </div>
                      <Progress value={95} className="h-1 bg-slate-800" />
                   </div>
                </CardContent>
             </Card>

             <Card className="bg-slate-900 border-white/5">
                <CardHeader>
                   <CardTitle className="text-sm flex items-center gap-2 text-purple-400"><Zap className="w-4 h-4" /> AI Ethics Audit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-[10px] font-mono leading-relaxed text-slate-400">
                   <div className="flex items-center gap-2">
                       <FileCheck className="w-3 h-3 text-purple-500" />
                       <span>Model Transparency: <span className="text-white">VERIFIED</span></span>
                   </div>
                   <div className="flex items-center gap-2">
                       <FileCheck className="w-3 h-3 text-purple-500" />
                       <span>Bias Detection: <span className="text-white">NONE DETECTED</span></span>
                   </div>
                   <div className="flex items-center gap-2">
                       <FileCheck className="w-3 h-3 text-purple-500" />
                       <span>Safety Alignment: <span className="text-white">GEMINI-CORE-SA01</span></span>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
        
        <Card className="bg-slate-900 border-white/5 flex flex-col h-full shadow-2xl">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-slate-100 flex items-center gap-2"><FileCheck className="w-5 h-5 text-green-500" /> Verification logs</CardTitle>
            <CardDescription className="text-[10px] uppercase font-mono">Immutable Evidence Ledger</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-hidden">
            <ScrollArea className="h-[550px]">
               <div className="p-4 space-y-3">
                  {incidents.slice().reverse().map((incident) => (
                    <div key={`gov-v-tag-${incident.id}`} className="p-3 bg-slate-950 rounded-lg border border-white/5 space-y-2">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-slate-500">{incident.id}</span>
                          <Badge variant="outline" className="text-[8px] h-4 border-green-500/30 text-green-500">AUDITED</Badge>
                       </div>
                       <p className="text-[11px] font-bold text-slate-300 leading-tight">Remediation Proof for {incident.title}</p>
                       <div className="text-[9px] text-slate-600 font-mono truncate">
                          SIG: {Math.random().toString(36).substring(2, 15)}...
                       </div>
                       <div className="flex items-center gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                          <CheckCircle2 className="w-2.5 h-2.5 text-green-500" /> Verified by AI-Gov-01
                       </div>
                    </div>
                  ))}
                  {incidents.length === 0 && (
                    <div className="p-12 text-center text-slate-600 font-serif italic text-sm">
                       No verification entries found. Complete an investigation to generate audit evidence.
                    </div>
                  )}
               </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      </div>
    </ScrollArea>
  );
}
