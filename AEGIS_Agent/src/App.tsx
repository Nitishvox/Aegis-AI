import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { X, Clock, LogOut } from 'lucide-react';

import { processIncident, IncidentAnalysis } from './lib/gemini';
const ChatBot = React.lazy(() => import('@/components/ChatBot').then(m => ({ default: m.ChatBot })));
const LandingPage = React.lazy(() => import('@/components/LandingPage').then(m => ({ default: m.LandingPage })));
const Sidebar = React.lazy(() => import('@/components/Sidebar').then(m => ({ default: m.Sidebar })));
const LogBanner = React.lazy(() => import('@/components/LogBanner').then(m => ({ default: m.LogBanner })));

// Lazy Import Views
const OverviewView = React.lazy(() => import('@/views/Overview'));
const LogStreamView = React.lazy(() => import('@/views/LogStream'));
const IncidentQueueView = React.lazy(() => import('@/views/IncidentQueue'));
const AuditTrailView = React.lazy(() => import('@/views/AuditTrail'));
const GovernanceView = React.lazy(() => import('@/views/Governance'));
const SettingsView = React.lazy(() => import('@/views/Settings'));
const ArchitectureView = React.lazy(() => import('@/views/Architecture'));
const ReportsView = React.lazy(() => import('@/views/Reports'));
const SecurityProtocolsView = React.lazy(() => import('@/views/SecurityProtocols'));

// --- Types ---
interface Report {
  id: string;
  incidentId: string;
  title: string;
  date: string;
  content: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "DRAFT" | "FINAL";
}
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

export interface SystemSettings {
  primaryRegion: string;
  failoverRegion: string;
  inferenceConcurrency: number;
  safetySensitivity: number;
  autoRemediation: boolean;
  deepPacketInspection: boolean;
  alertWebhook: string;
  telemetryEnabled: boolean;
  protocols: {
    kernel: boolean;
    honeypot: boolean;
    neural: boolean;
    audit: boolean;
    quantum: boolean;
  };
}

const DEFAULT_SETTINGS: SystemSettings = {
  primaryRegion: 'East US 2 (Virginia)',
  failoverRegion: 'West Europe (Netherlands)',
  inferenceConcurrency: 16,
  safetySensitivity: 85,
  autoRemediation: true,
  deepPacketInspection: false,
  alertWebhook: 'https://azure.monitor.internal/hooks/aegis-v1-critical-alerts',
  telemetryEnabled: true,
  protocols: {
    kernel: true,
    honeypot: false,
    neural: true,
    audit: true,
    quantum: false,
  }
};

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [auditTrails, setAuditTrails] = useState<any[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [analysis, setAnalysis] = useState<IncidentAnalysis | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [isRemediating, setIsRemediating] = useState(false);
  const [isCompromised, setIsCompromised] = useState(false);
  const [isSystemCrashed, setIsSystemCrashed] = useState(false);
  const [attackTimer, setAttackTimer] = useState<number | null>(null);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Attack timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (attackTimer !== null && attackTimer > 0 && !isSystemCrashed) {
      interval = setInterval(() => {
        setAttackTimer(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (attackTimer === 0 && !isSystemCrashed) {
      setIsSystemCrashed(true);
      toast.error("SYSTEM FAILURE: PRODUCTION DATA CORRUPTION DETECTED", { duration: Infinity });
    }
    return () => clearInterval(interval);
  }, [attackTimer, isSystemCrashed]);

  const resetSystem = () => {
    setIsSystemCrashed(false);
    setAttackTimer(null);
    setIsCompromised(false);
    setSelectedIncident(null);
    setAnalysis(null);
    // Optionally clear incidents or keep them? 
    // Usually "begiinning" means reset everything.
    setIncidents([]);
    setLogs([]);
    setActiveView('overview');
    toast.success("System Restored. Neural layers re-synchronized.");
  };

  // Poll for logs and incidents
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsRes, incidentsRes, auditRes] = await Promise.all([
          fetch('/api/logs'),
          fetch('/api/incidents'),
          fetch('/api/audit-trails')
        ]);

        const isJson = (res: Response) => res.ok && res.headers.get('content-type')?.includes('application/json');

        if (!isJson(logsRes) || !isJson(incidentsRes) || !isJson(auditRes)) {
          return; // Skip if server is still starting or non-JSON
        }

        const logsData = await logsRes.json();
        const incidentsData = await incidentsRes.json();
        const auditData = await auditRes.json();
        
        setLogs(logsData);
        setIncidents(incidentsData);
        setAuditTrails(auditData);
        
        if (selectedIncident) {
          const updated = incidentsData.find((i: Incident) => i.id === selectedIncident.id);
          if (updated && updated.status !== selectedIncident.status) {
            setSelectedIncident(updated);
          }
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [selectedIncident]);

  const simulateAttack = async (scenarioId?: number) => {
    toast.info("Deploying adversarial simulation...");
    try {
      const res = await fetch('/api/simulate-attack', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scenarioId,
          protocols: settings.protocols 
        })
      });

      if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
        throw new Error('API unstable or returned non-JSON response');
      }
      
      const newIncident = await res.json();
      setIncidents(prev => {
        if (prev.some(i => i.id === newIncident.id)) return prev;
        return [newIncident, ...prev];
      });

      // If Ghost Honeypot is active, give more time to solve (it slows down the attacker)
      let timeLimit = newIncident.severity === 'CRITICAL' ? 30 : 60;
      if (settings.protocols.honeypot) {
        timeLimit += 30;
        toast.info("Ghost Honeypot detected: Attacker lateral movement slowed.");
      }

      toast.error(`THREAT DETECTED: ${newIncident.id}`, { description: newIncident.title });
      
      setAttackTimer(timeLimit);
      
      if (settings.autoRemediation || settings.protocols.neural) {
        // Delay auto-remediation slightly to show the pressure
        const delay = settings.protocols.neural ? 3000 : 8000;
        setTimeout(() => handleRemediate(newIncident), delay);
        if (settings.protocols.neural) {
          toast.info("Neural Neutralization Protocol: Automatic containment initiated.");
        }
      }

      if (newIncident.severity === 'CRITICAL') {
        setIsCompromised(true);
        setTimeout(() => setIsCompromised(false), 5000);
      }
    } catch (err) {
      toast.error("Failed to simulate attack");
    }
  };

  const handleRemediate = async (incident: Incident) => {
    setIsRemediating(true);
    toast.loading("Executing remediation sequence...", { id: "remediation" });
    try {
      const res = await fetch('/api/remediate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          incidentId: incident.id, 
          action: "AUTO_CONTAIN",
          protocols: settings.protocols
        })
      });

      if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Remediation API unstable');
      }

      const data = await res.json();
      if (data.success) {
        toast.success("Threat neutralized successfully.", { id: "remediation" });
        // Stop the timer if this was the last active threat or if it matches certain logic
        setAttackTimer(null);
      }
    } catch (err) {
      toast.error("Remediation failure. Manual override required.", { id: "remediation" });
    } finally {
      setIsRemediating(false);
    }
  };

  const analyzeIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setActiveView('overview');
    if (analysis?.incidentId !== incident.id) {
      triggerAnalysis(incident);
    }
  };

  const triggerAnalysis = async (incident: Incident) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    toast.loading("Deploying AI Agents for investigation...", { id: "analysis" });
    try {
      // Pass protocol info to analysis
      const result = await processIncident({
        ...incident,
        systemProtocols: settings.protocols
      });
      setAnalysis(result);
      
      // Save report
      const newReport: Report = {
        id: `REP-${incident.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        incidentId: incident.id,
        title: `Executive Incident Report: ${incident.id} (${incident.title.split(' ').slice(0, 3).join(' ')})`,
        date: new Date().toISOString(),
        content: result.reporter.content,
        severity: result.overallThreatLevel as any,
        status: "FINAL"
      };
      setReports(prev => {
        // Prevent duplicate reports for the same incident if they already exist with the same content
        // But here we'll just allow multiple, ensuring unique IDs
        return [newReport, ...prev];
      });
      
      toast.success("Investigation complete. Report generated.", { id: "analysis" });
    } catch (err) {
      toast.error("Agents failed to complete the investigation.", { id: "analysis" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderContent = () => {
    const props = { logs, incidents, selectedIncident, analysis, isAnalyzing, isRemediating, onAnalyze: analyzeIncident, onRemediate: handleRemediate, auditTrails, settings };
    return (
      <React.Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Compiling Neural View...</p>
          </div>
        </div>
      }>
        {(() => {
          switch (activeView) {
            case 'overview': return <OverviewView {...props} />;
            case 'logs': return <LogStreamView logs={logs} />;
            case 'incidents': return <IncidentQueueView incidents={incidents} onAnalyze={analyzeIncident} />;
            case 'protocols': return <SecurityProtocolsView settings={settings} setSettings={setSettings} />;
            case 'architecture': return <ArchitectureView incidents={incidents} />;
            case 'reports': return <ReportsView reports={reports} />;
            case 'audit': return <AuditTrailView auditTrails={auditTrails} />;
            case 'governance': return <GovernanceView incidents={incidents} settings={settings} />;
            case 'settings': return <SettingsView settings={settings} setSettings={setSettings} />;
            default: return <OverviewView {...props} />;
          }
        })()}
      </React.Suspense>
    );
  };

  if (!userEmail) {
    return (
      <React.Suspense fallback={<div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" /></div>}>
        <LandingPage onLogin={(email) => setUserEmail(email)} />
      </React.Suspense>
    );
  }

  return (
    <div className={`dark transition-all duration-300 ${isCompromised || isSystemCrashed ? 'scale-[0.98] blur-[1px] brightness-50' : ''}`}>
      {isSystemCrashed && (
        <div className="fixed inset-0 z-[200] bg-red-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md space-y-6"
            >
              <div className="bg-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(239,68,68,0.5)]">
                 <X size={48} className="text-white" />
              </div>
              <h1 className="text-4xl font-serif italic text-white">FATAL SYSTEM ERROR</h1>
              <div className="space-y-2">
                <p className="text-red-200 font-mono text-sm leading-relaxed">
                  [REASON]: THREAT CONTAINMENT FAILURE<br/>
                  [IMPACT]: TOTAL LOSS OF PRODUCTION DATA<br/>
                  [STATUS]: AEGIS CORE UNRESPONSIVE
                </p>
                <p className="text-slate-400 text-xs italic">
                  Critical failure during adversarial simulation. High-priority investigation failed to intercept the breach in the allocated time-window.
                </p>
              </div>
              <div className="pt-8">
                <Button 
                  onClick={resetSystem}
                  className="bg-white text-red-600 hover:bg-red-50 font-bold px-8 h-12 rounded-lg shadow-xl uppercase tracking-widest active:scale-95 transition-all w-full"
                >
                  Initiate System Reconstruction
                </Button>
              </div>
            </motion.div>
        </div>
      )}
      {isCompromised && (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden mix-blend-screen opacity-50">
          <motion.div 
            animate={{ 
              background: [
                'linear-gradient(90deg, rgba(255,0,0,0.1) 0%, rgba(255,0,0,0) 50%, rgba(255,0,0,0.1) 100%)',
                'linear-gradient(90deg, rgba(0,0,255,0.1) 0%, rgba(0,0,255,0) 50%, rgba(0,0,255,0.1) 100%)',
              ],
              x: [-20, 20, -20]
            }}
            transition={{ repeat: Infinity, duration: 0.1 }}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <motion.div 
               initial={{ opacity: 0, scale: 2 }}
               animate={{ opacity: [0, 1, 0], scale: [2, 1, 1.5] }}
               transition={{ duration: 0.5, repeat: 5 }}
               className="text-red-500 font-mono text-9xl font-bold opacity-20"
             >
               SYSTEM_HIJACKED
             </motion.div>
          </div>
        </div>
      )}
      <TooltipProvider>
        <React.Suspense fallback={<div className="h-screen w-screen bg-slate-950 flex items-center justify-center text-blue-500 font-mono text-[10px] animate-pulse uppercase tracking-[0.2em]">Re-linking Neural Interface...</div>}>
          <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-50">
            <header className="flex items-center justify-between px-4 bg-slate-900 border-b border-white/5 py-1">
              <LogBanner activeThreats={incidents.filter(i => i.status !== 'REMEDIATED').length} settings={settings} />
              <div className="flex items-center gap-4">
                <div className="h-4 w-[1px] bg-white/10" />
                <button 
                  onClick={() => setUserEmail(null)} 
                  className="flex items-center gap-2 group px-2 py-1 rounded hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                  title="Terminate Session"
                >
                  <div className="text-[8px] text-right hidden sm:block">
                    <p className="text-slate-600 font-mono leading-none">TERMINATE_LINK</p>
                    <p className="text-slate-300 font-bold tracking-tight">{userEmail}</p>
                  </div>
                  <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-red-400 group-hover:bg-red-950/30 transition-colors">
                    <LogOut size={14} />
                  </div>
                </button>
              </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
              <Sidebar activeView={activeView} setActiveView={setActiveView} simulateAttack={simulateAttack} onLogout={() => setUserEmail(null)} />
              <main className="flex-1 flex flex-col overflow-hidden p-4 relative">
                 <div className="max-w-[1600px] mx-auto w-full h-full scroll-smooth">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeView}
                        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="h-full"
                      >
                        {renderContent()}
                      </motion.div>
                    </AnimatePresence>
                 </div>
              </main>
            </div>
            <footer className="h-8 bg-slate-900 border-t border-white/5 flex items-center justify-between px-4 text-[10px] text-slate-500 font-mono">
              <div className="flex gap-4 items-center">
                {attackTimer !== null && (
                  <span className="flex items-center gap-2 text-red-400 animate-pulse font-bold">
                    <Clock size={12} /> T-MINUS: {attackTimer}s
                  </span>
                )}
                <span key="footer-status" className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> OPERATIONAL</span>
                <span key="footer-agents" className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> AGENTS: 4</span>
                <div className="h-3 w-[1px] bg-white/10 mx-2" />
                <button 
                  onClick={() => setUserEmail(null)} 
                  className="flex items-center gap-1 hover:text-red-400 transition-colors"
                  title="Terminate Session"
                >
                  <LogOut size={10} /> TERMINATE: {userEmail}
                </button>
              </div>
              <div className="italic uppercase flex items-center gap-2">
                <span className="font-bold tracking-widest text-[#00f2ff]">MMH</span>
                <span className="opacity-30 text-slate-500">|</span>
                {new Date().toLocaleTimeString()} :: {activeView}_MODE
              </div>
            </footer>
            <Toaster theme="dark" position="top-right" />
            <ChatBot 
              onResetSystem={resetSystem}
              currentContext={{ 
              activeThreats: incidents.filter(i => i.status !== 'REMEDIATED').length, 
              selectedIncident: selectedIncident ? { 
                id: selectedIncident.id, 
                title: selectedIncident.title, 
                attackType: selectedIncident.attackType, 
                affectedSystem: selectedIncident.affectedSystem,
                summary: selectedIncident.summary
              } : null, 
              recentLogs: logs.slice(-5) 
            }} />
          </div>
        </React.Suspense>
      </TooltipProvider>
    </div>
  );
}
