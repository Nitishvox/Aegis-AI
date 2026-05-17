import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Terminal, AlertTriangle, Database, History, Shield, Settings, Zap, ChevronRight, ChevronDown, FileText, Fingerprint, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  simulateAttack: (scenarioId?: number) => void;
  onLogout?: () => void;
}

export function Sidebar({ activeView, setActiveView, simulateAttack, onLogout }: SidebarProps) {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [showScenarios, setShowScenarios] = useState(false);

  useEffect(() => {
    fetch('/api/scenarios')
      .then(res => {
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
          throw new Error(`API unstable or non-JSON response: ${res.status}`);
        }
        return res.json();
      })
      .then(setScenarios)
      .catch(err => console.error("Failed to fetch scenarios:", err));
  }, []);

  return (
    <div className="w-16 md:w-64 border-r border-white/5 bg-slate-900/50 flex flex-col pt-4 overflow-hidden">
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <SidebarItem key="nav-overview" icon={<LayoutDashboard size={20} />} label="Overview" active={activeView === 'overview'} onClick={() => setActiveView('overview')} />
        <SidebarItem key="nav-logs" icon={<Terminal size={20} />} label="Log Stream" active={activeView === 'logs'} onClick={() => setActiveView('logs')} />
        <SidebarItem key="nav-incidents" icon={<AlertTriangle size={20} />} label="Incidents" active={activeView === 'incidents'} onClick={() => setActiveView('incidents')} />
        <SidebarItem key="nav-protocols" icon={<Fingerprint size={20} />} label="Defensive Layers" active={activeView === 'protocols'} onClick={() => setActiveView('protocols')} />
        <SidebarItem key="nav-reports" icon={<FileText size={20} />} label="Executive Reports" active={activeView === 'reports'} onClick={() => setActiveView('reports')} />
        <SidebarItem key="nav-architecture" icon={<Database size={20} />} label="Architecture" active={activeView === 'architecture'} onClick={() => setActiveView('architecture')} />
        <SidebarItem key="nav-audit" icon={<History size={20} />} label="Audit Trail" active={activeView === 'audit'} onClick={() => setActiveView('audit')} />
        <SidebarItem key="nav-governance" icon={<Shield size={20} />} label="Governance" active={activeView === 'governance'} onClick={() => setActiveView('governance')} />
        <SidebarItem key="nav-settings" icon={<Settings size={20} />} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
      </nav>
      
      <div className="p-4 border-t border-white/5 bg-slate-900">
        <AnimatePresence>
          {showScenarios && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 space-y-1 overflow-hidden"
            >
              <p className="text-[9px] uppercase font-bold text-slate-500 mb-2 tracking-widest px-2">Select Attack Vector</p>
              <ScrollArea className="h-48 pr-2">
                {scenarios.map((s) => (
                  <button
                    key={`sidebar-scenario-item-${s.id}`}
                    onClick={() => {
                      simulateAttack(s.id);
                      setShowScenarios(false);
                    }}
                    className="w-full text-left p-2 text-[10px] font-mono hover:bg-white/5 rounded border border-transparent hover:border-white/10 transition-all flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{s.title}</span>
                    <span className={`text-[8px] px-1 rounded ${s.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-500'}`}>{s.severity[0]}</span>
                  </button>
                ))}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        <Button 
          variant="destructive" 
          className="w-full gap-2 text-xs font-bold uppercase tracking-tighter shadow-lg shadow-red-900/20 mb-4"
          onClick={() => setShowScenarios(!showScenarios)}
        >
          <Zap className={`${showScenarios ? 'fill-current' : ''}`} size={14} /> 
          {showScenarios ? 'CANCEL SIM' : 'Simulate Attack'}
          {showScenarios ? <ChevronDown size={14} className="ml-auto" /> : <ChevronRight size={14} className="ml-auto" />}
        </Button>

        {onLogout && (
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all text-left group"
          >
            <LogOut size={16} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <div 
      className={`flex items-center gap-3 p-2 rounded-md transition-all cursor-pointer group ${active ? 'bg-red-500/10 text-red-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
      onClick={onClick}
    >
      <span className="min-w-[20px]">{icon}</span>
      <span className="text-sm font-medium tracking-tight hidden md:block whitespace-nowrap">{label}</span>
      {active && <motion.div layoutId="nav-active" className="ml-auto w-1 h-4 bg-red-500 rounded-full" />}
    </div>
  );
}
