import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, Disc } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, LayoutDashboard, Database, Cloud, Terminal } from 'lucide-react';
import { AgentCard } from '@/components/AgentCard';

interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  source: string;
  message: string;
}

interface Incident {
  id: string;
  title: string;
  attackType?: string;
  affectedSystem?: string;
  severity: string;
  status: string;
  detectedAt: string;
  logs: LogEntry[];
  summary: string;
}

export function LogMonitor({ logs }: { logs: LogEntry[] }) {
  return (
    <Card id="log-monitor-card" className="bg-slate-900 border-white/5 shadow-2xl flex flex-col h-[400px] overflow-hidden">
      <CardHeader className="pb-2 border-b border-white/5 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Live Telemetry Feed</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-red-500 font-mono animate-pulse">● SECURE_LINK_ESTABLISHED</span>
            <Disc className={`w-3 h-3 text-red-500 animate-pulse`} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 font-mono text-[10px] space-y-1.5">
            {logs.slice().reverse().map((log) => (
              <div key={`ov-log-entry-${log.id}`} className="flex gap-2 whitespace-nowrap border-b border-white/5 pb-1 last:border-0 hover:bg-white/5 transition-colors group">
                  <span className="text-slate-600 w-16 shrink-0">[{log.timestamp.split('T')[1]?.split('.')[0] || '??:??:??'}]</span>
                  <span className={`w-14 shrink-0 font-bold ${log.level === 'CRITICAL' ? 'text-red-500' : log.level === 'ERROR' ? 'text-orange-400' : log.level === 'WARN' ? 'text-yellow-500' : 'text-slate-400'}`}>
                    {log.level}
                  </span>
                  <span className="text-slate-300 truncate opacity-80 group-hover:opacity-100">{log.message}</span>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="py-20 text-center">
                 <p className="text-slate-600 italic">Listening for system events...</p>
                 <div className="mt-2 flex justify-center gap-1">
                    {[1,2,3].map(i => <motion.div key={`ov-pulse-dot-${i}`} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, delay: i * 0.2 }} className="w-1 h-1 bg-slate-700 rounded-full" />)}
                 </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function IncidentQueueList({ incidents, onAnalyze }: { incidents: Incident[], onAnalyze: (i: Incident) => void }) {
  return (
    <Card id="incident-queue-card" className="bg-slate-900 border-white/5 flex flex-col h-[400px] overflow-hidden">
      <CardHeader className="pb-2 border-b border-white/5 shrink-0">
        <CardTitle className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Active Threat Queue</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader className="sticky top-0 bg-slate-900 z-10">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-[10px] uppercase font-bold text-slate-500 h-8">ID / Status</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-slate-500 text-right h-8">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.slice().reverse().map((incident) => (
                <TableRow key={`ov-inc-row-${incident.id}`} className="border-white/5 hover:bg-white/5 cursor-pointer group" onClick={() => onAnalyze(incident)}>
                  <TableCell className="py-2">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] font-bold group-hover:text-red-400 transition-colors">{incident.id}</span>
                      <Badge variant="outline" className={`text-[8px] h-3.5 px-1 ${incident.severity === 'CRITICAL' ? 'border-red-500/50 text-red-400' : 'border-yellow-500/50 text-yellow-400'}`}>
                        {incident.severity}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-2">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px] text-blue-400 hover:bg-blue-500/10 hover:text-blue-300">INSPECT</Button>
                  </TableCell>
                </TableRow>
              ))}
              {incidents.length === 0 && (
                <TableRow key="ov-inc-empty">
                  <TableCell colSpan={2} className="text-center py-12 text-slate-600 text-[10px] italic">No active threats detected.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function NetworkTopology({ activeAlert }: { activeAlert?: boolean }) {
  const nodes = [
    { id: 'gw', label: 'GATEWAY', x: 50, y: 15, status: 'stable', icon: 'zap' },
    { id: 'db', label: 'VAULT_DB', x: 20, y: 50, status: activeAlert ? 'warning' : 'stable', icon: 'database' },
    { id: 'app', label: 'APP_CORE', x: 50, y: 50, status: activeAlert ? 'critical' : 'stable', icon: 'shield' },
    { id: 'cache', label: 'CACHE_H0', x: 80, y: 50, status: 'stable', icon: 'zap' },
    { id: 'auth', label: 'AUTH_0', x: 50, y: 85, status: 'stable', icon: 'lock' },
  ].filter(n => n && n.x !== undefined && n.y !== undefined);

  const connections = [
    ['gw', 'app'], ['app', 'db'], ['app', 'cache'], ['app', 'auth']
  ];

  return (
    <div className="relative w-full h-[220px] bg-slate-950/40 border border-white/5 rounded-xl overflow-hidden flex items-center justify-center p-6 group">
      {/* Background Grid/Scan Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px]" />
        <motion.div 
          animate={{ y: ['0%', '100%', '0%'] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-1 bg-blue-500/10 blur-[2px]"
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.08),transparent)] pointer-events-none" />
      
      <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-[0_0_8px_rgba(37,99,235,0.2)]">
        <defs>
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </radialGradient>
          <filter id="glow">
             <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
             <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
        </defs>

        {/* Connection Lines */}
        {connections.map(([fromId, toId], i) => {
          const from = nodes.find(n => n.id === fromId);
          const to = nodes.find(n => n.id === toId);
          if (!from || !to || from.x === undefined || from.y === undefined || to.x === undefined || to.y === undefined) return null;
          const isStressed = activeAlert && (from.id === 'app' || to.id === 'app' || from.id === 'db' || to.id === 'db');
          
          return (
            <g key={`conn-group-${i}`}>
              <motion.line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={isStressed ? '#ef4444' : '#1e293b'}
                strokeWidth={isStressed ? "0.8" : "0.5"}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isStressed ? 0.6 : 0.4 }}
                transition={{ duration: 1.5, delay: i * 0.2 }}
              />
              {/* Data Particles */}
              <motion.circle
                r="0.8"
                fill={isStressed ? '#f87171' : '#60a5fa'}
                filter="url(#glow)"
                animate={{
                  cx: [from.x, to.x],
                  cy: [from.y, to.y],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 2
                }}
              />
            </g>
          );
        })}
        
        {/* Nodes */}
        {nodes.map((node) => {
          if (!node || node.x === undefined || node.y === undefined) return null;
          const isCritical = node.status === 'critical';
          const isWarning = node.status === 'warning';
          
          return (
            <g key={node.id} className="cursor-pointer">
              {/* Outer Glow */}
              <motion.circle
                cx={node.x} cy={node.y} r="6"
                fill="url(#nodeGradient)"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 3, delay: Math.random() * 2 }}
              />
              
              {/* Alert Pulse */}
              {(isCritical || isWarning) && (
                <motion.circle
                  cx={node.x} cy={node.y} r="8"
                  stroke={isCritical ? '#ef4444' : '#f59e0b'}
                  strokeWidth="0.3"
                  fill="none"
                  animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}

              {/* Node Body */}
              <motion.circle
                cx={node.x} cy={node.y} r="3.5"
                fill={isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#0f172a'}
                stroke={isCritical ? '#fca5a5' : isWarning ? '#fbbf24' : '#3b82f6'}
                strokeWidth="0.8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
              />

              {/* Node Icon/Shape Details */}
              <path 
                d={`M${node.x-1} ${node.y-1} L${node.x+1} ${node.y+1} M${node.x+1} ${node.y-1} L${node.x-1} ${node.y+1}`} 
                stroke={isCritical || isWarning ? "white" : "#60a5fa"} 
                strokeWidth="0.3" 
                strokeLinecap="round" 
              />

              <text 
                x={node.x} y={node.y + 9} 
                textAnchor="middle" 
                className={`text-[3.5px] font-mono font-bold uppercase tracking-[0.1em] ${isCritical ? 'fill-red-400' : isWarning ? 'fill-orange-400' : 'fill-slate-500'}`}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="absolute top-3 left-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="text-[7px] font-mono text-slate-400 font-bold uppercase tracking-[0.2em]">Topology: Virtual_Cluster_09</span>
          </div>
          <span className="text-[6px] font-mono text-blue-500/60 uppercase ml-3.5 tracking-widest">Neural Link: SYNCED</span>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-black/40 border border-white/5 rounded-md">
         <div className="w-1 h-1 bg-green-500 rounded-full" />
         <span className="text-[6px] font-mono text-slate-500 uppercase tracking-tighter">Status: Nominal_Operations</span>
      </div>
    </div>
  );
}

export default function OverviewView({ logs, incidents, selectedIncident, analysis, isAnalyzing, isRemediating, onAnalyze, onRemediate }: any) {
  const [terminalInput, setTerminalInput] = React.useState('');
  const [terminalHistory, setTerminalHistory] = React.useState<string[]>([
    `AEGIS_KERNEL_ACTIVE @ ${new Date().toLocaleTimeString()}`,
    'NEURAL_MDS_INIT [OK]'
  ]);
  const terminalEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  const activeIncidents = incidents.filter((i: any) => i.status !== 'REMEDIATED');
  const criticalCount = activeIncidents.filter((i: any) => i.severity === 'CRITICAL').length;
  
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    setTerminalHistory(prev => [...prev, `> ${terminalInput}`]);
    
    // Command logic
    if (cmd === 'help' || cmd === 'aegis --help' || cmd === 'aegis -h') {
      setTerminalHistory(prev => [...prev, 
        'AVAILABLE COMMANDS:',
        '  aegis --contain --all    : Remediate all active threats',
        '  aegis --status           : System health check',
        '  aegis --purge --logs     : Clear terminal history',
        '  aegis --neural --sync    : Force AI baseline sync',
        '  clear                    : Clear terminal'
      ]);
    } else if (cmd === 'clear' || cmd === 'aegis --purge --logs') {
      setTerminalHistory([]);
    } else if (cmd === 'aegis --contain --all') {
      if (activeIncidents.length > 0) {
        setTerminalHistory(prev => [...prev, `[INITIATING] Global containment for ${activeIncidents.length} threats...`]);
        activeIncidents.forEach((inc: any) => onRemediate(inc));
      } else {
        setTerminalHistory(prev => [...prev, '[INFO] No active threats requiring containment.']);
      }
    } else if (cmd === 'aegis --status') {
      setTerminalHistory(prev => [...prev, 
        `[STATUS] System stable: ${criticalCount === 0 ? 'YES' : 'NO'}`,
        `[THREATS] Active incidents: ${activeIncidents.length}`,
        `[NETWORK] Topology synced: YES`,
        `[KERNEL] Response latency: 14ms`
      ]);
    } else if (cmd === 'aegis --neural --sync') {
      setTerminalHistory(prev => [...prev, '[SYNCING] AI baseline re-calibration in progress...', '[DONE] Neural confidence restored to 92%.']);
    } else {
      setTerminalHistory(prev => [...prev, `[ERROR] Unknown command: '${cmd}'. Type 'help' for available directives.`]);
    }

    setTerminalInput('');
  };

  return (
    <ScrollArea id="overview-scroll-viewport" className="h-full pr-4">
      <div className="flex flex-col gap-4 pb-8">
        {/* Top Banner: Global Threat Level */}
      <Card id="overview-hero-banner" className="bg-slate-900 border-white/5 overflow-hidden shrink-0 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between p-3 gap-4">
           <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${criticalCount > 0 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-green-500/20 text-green-500'}`}>
                 <Shield size={18} />
              </div>
              <div>
                 <h2 className="text-md font-bold tracking-tighter uppercase font-serif italic leading-tight">AEGIS COMMAND CORE</h2>
                 <p className="text-[8px] text-slate-500 font-mono tracking-widest">SYSTEM_VERSION_2.4 // LEVEL_3_ACCESS_GRANTED</p>
              </div>
           </div>
           
           <div className="flex gap-8">
              <div className="text-center border-l border-white/10 pl-8">
                 <p className="text-[7px] text-slate-500 uppercase font-bold tracking-widest opacity-50 flex items-center gap-1"><Cloud className="w-2 h-2" /> Azure Status</p>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-xs font-mono font-bold text-green-400">ONLINE</p>
                 </div>
              </div>
              <div className="text-center">
                 <p className="text-[7px] text-slate-500 uppercase font-bold tracking-widest opacity-50">Active Threats</p>
                 <p className={`text-lg font-mono font-bold ${criticalCount > 0 ? 'text-red-500' : 'text-white'}`}>{activeIncidents.length}</p>
              </div>
              <div className="text-center group cursor-help w-[80px]">
                 <p className="text-[7px] text-slate-500 uppercase font-bold tracking-widest opacity-50 mb-1">Stability</p>
                 <div className="flex flex-col items-center gap-1">
                    <p className={`text-[10px] font-mono font-bold leading-none ${criticalCount > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                       {criticalCount > 0 ? 'UNSTABLE' : 'STABLE'}
                    </p>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: "100%" }}
                        animate={{ width: criticalCount > 0 ? '45%' : '100%' }}
                        transition={{ type: 'spring', damping: 20 }}
                        className={`h-full ${criticalCount > 0 ? 'bg-orange-500' : 'bg-green-500'}`} 
                       />
                    </div>
                 </div>
              </div>
              <div className="text-center">
                 <p className="text-[7px] text-slate-500 uppercase font-bold tracking-widest opacity-50">Neural Confidence</p>
                 <p className="text-lg font-mono font-bold text-blue-400">92%</p>
              </div>
              <div className="text-center">
                 <p className="text-[7px] text-slate-500 uppercase font-bold tracking-widest opacity-50">Uptime</p>
                 <p className="text-lg font-mono font-bold text-green-500">99.8%</p>
              </div>
           </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Telemetry & Queue */}
        <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-0">
             <LogMonitor logs={logs} />
          </div>
          <div className="flex-1 min-h-0">
             <IncidentQueueList incidents={activeIncidents} onAnalyze={onAnalyze} />
          </div>
        </div>

        {/* Center Column: Active Command */}
        <div className="lg:col-span-6 border-x border-white/5 px-2">
          {!selectedIncident ? (
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-slate-950/40 font-mono p-12 text-center opacity-40">
              <Shield className="w-12 h-12 text-slate-800 mb-4" />
              <p className="text-[10px] uppercase tracking-widest text-slate-500">Awaiting Incident Selection</p>
              <div className="mt-4 flex gap-2">
                 {[1,2,3,4].map(i => <motion.div key={i} animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, delay: i * 0.4 }} className="w-1 h-1 bg-blue-500 rounded-full" />)}
              </div>
            </div>
          ) : (
              <div className="space-y-4 pb-4">
                <motion.div
                  key={`selected-incident-${selectedIncident.id}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <IncidentSummaryCard incident={selectedIncident} isAnalyzing={isAnalyzing} />
                  <AgentSwarm 
                    analysis={analysis} 
                    isAnalyzing={isAnalyzing} 
                    isRemediating={isRemediating}
                    onRemediate={() => onRemediate(selectedIncident)} 
                    incidentStatus={selectedIncident.status}
                  />
                </motion.div>
              </div>
          )}
        </div>

        {/* Right Column: Implementation & Insights */}
        <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
           {/* Response Terminal */}
           <Card className="bg-slate-900 border-blue-500/30 shadow-2xl overflow-hidden shrink-0 transition-colors">
            <CardHeader className="bg-blue-600/10 border-b border-blue-500/20 py-2">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-[9px] uppercase tracking-[0.2em] font-bold text-blue-400 flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Command Terminal
                  </CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
               <div className="bg-black/40 p-2 rounded border border-white/5 font-mono text-[9px] min-h-[140px] text-slate-400 overflow-y-auto max-h-[200px]">
                  {terminalHistory.map((line, i) => (
                    <p key={`term-line-${i}`} className={line.startsWith('>') ? 'text-blue-500' : line.includes('[ERROR]') ? 'text-red-400' : 'text-slate-400'}>
                      {line}
                    </p>
                  ))}
                  {selectedIncident && (
                    <motion.p 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="text-red-500 animate-pulse"
                    >
                      &gt; ALERT: {selectedIncident.id} DETECTED
                    </motion.p>
                  )}
                  <p className="text-blue-400 animate-pulse border-r-2 border-blue-400 pr-1 w-fit">&gt; _</p>
                  <div ref={terminalEndRef} />
               </div>
               <form onSubmit={handleCommand} className="flex gap-1.5 pt-1">
                  <Input 
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="aegis --help" 
                    className="bg-slate-950 border-white/10 h-7 text-[10px] font-mono py-0 focus-visible:ring-blue-500/50" 
                  />
                  <Button type="submit" className="h-7 bg-blue-600 hover:bg-blue-500 text-[9px] font-bold uppercase transition-all px-3 shadow-[0_0_15px_rgba(37,99,235,0.3)]">EXEC</Button>
               </form>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-white/5 shadow-xl flex-1 flex flex-col overflow-hidden min-h-0 transition-all hover:border-white/10">
             <CardHeader className="py-2 px-3 border-b border-white/5 shrink-0 flex flex-row items-center justify-between">
                <CardTitle className="text-[9px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-2">
                   <LayoutDashboard size={12} /> Network Topology
                </CardTitle>
                <Badge variant="outline" className="text-[7px] h-3 px-1 border-white/10 text-slate-500 uppercase">Live</Badge>
             </CardHeader>
             <CardContent className="flex-1 bg-slate-950/20 relative p-3">
                <NetworkTopology activeAlert={!!selectedIncident} />
                <div className="mt-3 space-y-2">
                   <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Network Load</span>
                      <span className="text-[8px] font-mono text-slate-400">12.4%</span>
                   </div>
                   <div className="w-full h-0.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div animate={{ width: '12.4%' }} className="h-full bg-blue-500" />
                   </div>
                   <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="p-1.5 bg-slate-900 border border-white/5 rounded">
                         <p className="text-[7px] text-slate-600 uppercase mb-1">Endpoints</p>
                         <p className="text-[10px] font-mono text-slate-400 font-bold">1,248</p>
                      </div>
                      <div className="p-1.5 bg-slate-900 border border-white/5 rounded">
                         <p className="text-[7px] text-slate-600 uppercase mb-1">DNS Latency</p>
                         <p className="text-[10px] font-mono text-green-500 font-bold">14ms</p>
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </ScrollArea>
  );
}

function IncidentSummaryCard({ incident, isAnalyzing }: { incident: Incident, isAnalyzing: boolean }) {
  return (
    <Card id={`summary-card-${incident.id}`} className="bg-slate-900 border-red-500/20 shadow-2xl text-slate-50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${incident.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
             <AlertTriangle size={24} />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-white">{incident.id}: {incident.title}</CardTitle>
            <CardDescription className="text-slate-400 font-mono text-xs">VECTOR IDENTIFIED @ {new Date(incident.detectedAt).toLocaleTimeString()}</CardDescription>
          </div>
        </div>
        <Badge variant="destructive" className="px-3 py-1 uppercase">{incident.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-950/50 rounded border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Affected System</p>
            <p className="text-sm font-mono text-slate-300">{incident.affectedSystem || 'N/A'}</p>
          </div>
          <div className="p-3 bg-slate-950/50 rounded border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Attack Category</p>
            <p className="text-sm font-mono text-red-400 font-bold">{incident.attackType || 'N/A'}</p>
          </div>
        </div>
        <div className="bg-slate-950/50 p-4 rounded-md border border-white/5 text-sm text-slate-300 italic">"{incident.summary}"</div>
      </CardContent>
    </Card>
  );
}

function AgentSwarm({ analysis, isAnalyzing, isRemediating, onRemediate, incidentStatus }: any) {
  const [activeAgent, setActiveAgent] = React.useState('classifier');

  return (
    <Tabs value={activeAgent} onValueChange={setActiveAgent} className="w-full">
      <TabsList className="grid grid-cols-4 w-full bg-slate-900/50 border border-white/5 p-1 h-auto">
        <TabsTrigger value="classifier" className="text-[10px] uppercase py-2">Classifier</TabsTrigger>
        <TabsTrigger value="investigator" className="text-[10px] uppercase py-2">Investigator</TabsTrigger>
        <TabsTrigger value="remediation" className="text-[10px] uppercase py-2">Remediation</TabsTrigger>
        <TabsTrigger value="reporter" className="text-[10px] uppercase py-2">Reporter</TabsTrigger>
      </TabsList>
      <div className="mt-4 relative min-h-[200px]">
        <AnimatePresence mode="wait">
            {isAnalyzing ? (
            <motion.div 
              key="analyzing-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 border border-white/5 bg-slate-900/50 rounded-lg"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-mono text-blue-400 animate-pulse uppercase tracking-[0.2em]">Deploying Neural Swarm...</span>
                   <span className="text-[10px] font-mono text-slate-500">653ms latency</span>
                </div>
                <div className="space-y-2">
                   {[
                     { label: "Threat Classifier", steps: ["Loading Signatures", "Analyzing Vector", "Calculating Confidence"] },
                     { label: "Technical Investigator", steps: ["Parsing Telemetry", "Tracing Origins", "Mapping Lateral Flows"] },
                     { label: "Remediation Specialist", steps: ["Gathering Safeguards", "Drafting Containment", "Pre-flight Validation"] },
                     { label: "Executive Reporter", steps: ["Synthesizing Findings", "Impact Correlation", "Formatting Report"] }
                   ].map((agent, i) => (
                     <div key={i} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                           <span className="text-[9px] font-bold text-slate-400 uppercase">{agent.label}</span>
                           <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 3, delay: i * 0.5 }}
                                className="h-full bg-blue-500"
                              />
                           </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                           {agent.steps.map((step, j) => (
                             <motion.span 
                                key={j}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: (i * 0.5) + (j * 0.3) }}
                                className="text-[8px] font-mono text-slate-600 bg-black/40 px-1 rounded border border-white/5 flex items-center gap-1"
                             >
                                <div className="w-1 h-1 rounded-full bg-blue-500/50" /> {step}
                             </motion.span>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </motion.div>
          ) : analysis ? (
            <motion.div
              key={`agent-content-${activeAgent}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeAgent === 'classifier' && <AgentCard response={analysis.classifier} icon={<Zap size={16} />} color="text-red-400" />}
              {activeAgent === 'investigator' && <AgentCard response={analysis.investigator} icon={<LayoutDashboard size={16} />} color="text-blue-400" />}
              {activeAgent === 'remediation' && <AgentCard response={analysis.remediation} icon={<Shield size={16} />} color="text-green-400" onAction={onRemediate} actionLabel="EXECUTE REMEDIATION" isActionLoading={isRemediating} incidentStatus={incidentStatus} />}
              {activeAgent === 'reporter' && <AgentCard response={analysis.reporter} icon={<Zap size={16} />} color="text-purple-400" onAction={() => window.print()} actionLabel="Export PDF" />}
            </motion.div>
          ) : (
            <motion.div 
              key="idle-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center text-slate-600 text-xs italic font-mono border border-dashed border-white/5 rounded-lg"
            >
              AWAITING_ANALYSIS_INSTRUCTION
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Tabs>
  );
}
