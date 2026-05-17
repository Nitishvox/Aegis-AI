import React, { useState, useRef } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Shield, Cpu, Globe, Info, Database, Trash2, ShieldAlert, Download, Loader2 } from 'lucide-react';
import { SystemSettings } from '@/src/App';

interface SettingsViewProps {
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
}

function DelayedInfoCard({ title, info, children }: { title: string, info: string, children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setShow(true);
    }, 4000);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setShow(false);
  };

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute z-[100] top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-slate-950 border border-blue-500/30 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.2)] pointer-events-none"
          >
            <div className="flex items-start gap-2">
              <Info className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">{title}</p>
                <p className="text-[9px] text-slate-400 leading-relaxed font-mono">{info}</p>
              </div>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-8 border-transparent border-b-slate-950" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SettingsView({ settings, setSettings }: SettingsViewProps) {
  const [isRecovering, setIsRecovering] = useState(false);
  const [isDestroying, setIsDestroying] = useState(false);
  const [destructionLog, setDestructionLog] = useState<string[]>([]);
  
  // Destruction Verification State
  const [showVerify, setShowVerify] = useState(false);
  const [verifyChallenge, setVerifyChallenge] = useState({ a: 0, b: 0 });
  const [verifyInput, setVerifyInput] = useState('');
  const [isFinalConfirmation, setIsFinalConfirmation] = useState(false);

  const toggleSetting = (key: keyof SystemSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const setNumericSetting = (key: keyof SystemSettings, value: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDataRecovery = () => {
    setIsRecovering(true);
    setTimeout(() => {
      setIsRecovering(false);
      // Simulate file download
      const content = "AEGIS_RECOVERY_DATA_V3.4.2\nTIMESTAMP: " + new Date().toISOString() + "\nENCRYPTION: AES-256-GCM\nSTATUS: INTEGRITY_VERIFIED";
      const blob = new Blob([content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aegis_recovery_bundle_encrypted.csv.zip';
      a.click();
    }, 2000);
  };

  const startDataDestruction = () => {
    setShowVerify(true);
    setVerifyChallenge({ 
      a: Math.floor(Math.random() * 50) + 10, 
      b: Math.floor(Math.random() * 50) + 10 
    });
    setVerifyInput('');
    setIsFinalConfirmation(false);
  };

  const verifyHuman = () => {
    if (parseInt(verifyInput) === verifyChallenge.a + verifyChallenge.b) {
      setIsFinalConfirmation(true);
    } else {
      alert("VERIFICATION_FAILED: Neural pattern mismatch. Are you human?");
      setVerifyChallenge({ 
        a: Math.floor(Math.random() * 50) + 10, 
        b: Math.floor(Math.random() * 50) + 10 
      });
      setVerifyInput('');
    }
  };

  const handleDataDestruction = () => {
    setShowVerify(false);
    setIsDestroying(true);
    const logs = [
      "INITIATING DATA_DESTRUCTION_PROTOCOL...",
      "AUTHENTICATING COMMANDER BIOMETRIC HASH [VERIFIED]...",
      "SEVERED EXTERNAL WAREHOUSE CONNECTIONS (SSL_TERMINATED)...",
      "BROADCASTING KILL-CODE TO REMOTE FIELD AGENTS...",
      "DECOMMISSIONING EDGE COMPUTE NODES (AZURE_REGION_01)...",
      "WIPING LOCAL ENCRYPTED CACHE (SESSION_STATE)...",
      "WIPING LOCAL ENCRYPTED CACHE (PERSISTENT_STORAGE)...",
      "SHREDDING NEURAL NETWORK WEIGHT DATA (GEMINI_CORES)...",
      "DISMANTLING SYSTEM SUB-PROCESSORS (ASYNC_PULL)...",
      "RECURSIVE DIRECTORY PURGE: /usr/aegis/core/binary...",
      "RECURSIVE DIRECTORY PURGE: /var/db/encrypted/telemetry...",
      "NEUTRALIZING ACTIVE TELEMETRY STREAMS (INGRESS_BLOCK)...",
      "ZEROING OUT REMAINING VOLATILE MEMORY PAGES...",
      "OVERWRITING SECTORS WITH RANDOM ENTROPY (PASS 1/3)...",
      "OVERWRITING SECTORS WITH RANDOM ENTROPY (PASS 2/3)...",
      "OVERWRITING SECTORS WITH RANDOM ENTROPY (PASS 3/3)...",
      "REMOVING POTENTIAL THREAT VECTORS (MALWARE_SEVERANCE)...",
      "PURGING NEURAL SYSTEM LOGS (AUDIT_TRAIL_WIPE)...",
      "DISCONNECTING AZURE MASTER RELAY (CONNECTION_REFUSED)...",
      "FINAL INTEGRITY CHECK: DATA_COHERENCE = 0.00%...",
      "DATA_DESTROYED: ALL LOCALIZED STATE PURGED.",
      "UPLOADING 'FINAL_BREATH' TELEMETRY PACKET...",
      "INITIATING SYSTEM_RESTART (HARDWARE_FLUSH)...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setDestructionLog(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }, 3500);
  };

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight font-serif italic text-blue-500">System Configuration</h2>
        <div className="flex gap-2">
            <Badge variant="outline" className="text-[10px] border-white/10 uppercase">v3.4.2-stable</Badge>
            <Badge className={settings.telemetryEnabled ? "bg-blue-500/20 text-blue-400 border-blue-500/50" : "bg-slate-500/20 text-slate-400 border-slate-500/50"}>
              {settings.telemetryEnabled ? 'ACTIVE_MONITORING' : 'READ_ONLY_MODE'}
            </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DelayedInfoCard 
          title="Cloud Infrastructure" 
          info="Manages the physical localization of your SOC assets. Selecting diverse regions improves latency and provides disaster recovery capabilities via failover clusters."
        >
          <Card className="bg-slate-900 border-white/5 h-full">
            <CardHeader>
               <CardTitle className="text-sm flex items-center gap-2 text-blue-400"><Globe className="w-4 h-4" /> Regional Infrastructure</CardTitle>
               <CardDescription>Manage Azure primary and secondary regions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500">Primary Deployment Region</label>
                <select 
                  className="w-full bg-slate-950 border border-white/10 rounded-md p-2 text-xs font-bold text-slate-50 focus:outline-none focus:border-blue-500 transition-colors"
                  value={settings.primaryRegion}
                  onChange={(e) => setSettings(prev => ({ ...prev, primaryRegion: e.target.value }))}
                >
                  <option>East US 2 (Virginia)</option>
                  <option>West US 3 (Washington)</option>
                  <option>Central India (Pune)</option>
                  <option>UK South (London)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500">Failover Cluster</label>
                <select 
                  className="w-full bg-slate-950/50 border border-dashed border-white/10 rounded-md p-2 text-xs font-bold text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  value={settings.failoverRegion}
                  onChange={(e) => setSettings(prev => ({ ...prev, failoverRegion: e.target.value }))}
                >
                  <option>West Europe (Netherlands)</option>
                  <option>Southeast Asia (Singapore)</option>
                  <option>Japan East (Tokyo)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </DelayedInfoCard>

        <DelayedInfoCard 
          title="Neural Processing" 
          info="Inference concurrency determines how many AI agents can simultaneously investigate incidents. Higher safety sensitivity enforces stricter validation on AI-suggested remediation."
        >
          <Card className="bg-slate-900 border-white/5 h-full">
            <CardHeader>
               <CardTitle className="text-sm flex items-center gap-2 text-purple-400"><Cpu className="w-4 h-4" /> AI Swarm Orchestration</CardTitle>
               <CardDescription>Configure intelligence density and response latency.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <span className="text-xs text-slate-400">Inference Concurrency</span>
                   <span className="text-xs font-mono text-purple-400">{settings.inferenceConcurrency} Parallel Agents</span>
                </div>
                <input 
                  type="range" min="1" max="32" step="1" 
                  value={settings.inferenceConcurrency}
                  onChange={(e) => setNumericSetting('inferenceConcurrency', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <span className="text-xs text-slate-400">Safety Policy Sensitivity</span>
                   <span className="text-xs font-mono text-blue-400">{settings.safetySensitivity}% (Strict)</span>
                </div>
                <input 
                  type="range" min="50" max="100" step="5" 
                  value={settings.safetySensitivity}
                  onChange={(e) => setNumericSetting('safetySensitivity', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </DelayedInfoCard>

        <DelayedInfoCard 
          title="Security Protocols" 
          info="Auto-Remediation allows the system to automatically fix breaches. Deep Packet Inspection analyzes the contents of network traffic for zero-day signatures."
        >
          <Card className="bg-slate-900 border-white/5 h-full">
            <CardHeader>
               <CardTitle className="text-sm flex items-center gap-2 text-red-500"><Shield className="w-4 h-4" /> Cybersecurity Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between p-2 bg-slate-950/50 rounded-lg cursor-pointer hover:bg-slate-900 transition-colors" onClick={() => toggleSetting('autoRemediation')}>
                  <div className="space-y-0.5">
                     <p className="text-xs font-bold text-slate-200">Auto-Remediation</p>
                     <p className="text-[9px] text-slate-500">Allow AI to execute Azure SQL lockdowns</p>
                  </div>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${settings.autoRemediation ? 'bg-blue-600' : 'bg-slate-800'}`}>
                     <motion.div 
                      animate={{ x: settings.autoRemediation ? 16 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" 
                     />
                  </div>
               </div>
               <div className="flex items-center justify-between p-2 bg-slate-950/50 rounded-lg cursor-pointer hover:bg-slate-900 transition-colors" onClick={() => toggleSetting('deepPacketInspection')}>
                  <div className="space-y-0.5">
                     <p className="text-xs font-bold text-slate-200">Deep Packet Inspection</p>
                     <p className="text-[9px] text-slate-500">Heuristic analysis of UDP/TCP streams</p>
                  </div>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${settings.deepPacketInspection ? 'bg-red-600' : 'bg-slate-800'}`}>
                     <motion.div 
                      animate={{ x: settings.deepPacketInspection ? 16 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" 
                     />
                  </div>
               </div>
            </CardContent>
          </Card>
        </DelayedInfoCard>

        <DelayedInfoCard 
          title="External Connectivity" 
          info="The Alert Webhook provides a bridge to external platforms like Microsoft Teams or Slack for real-time notification of critical infrastructure failures."
        >
          <Card className="bg-slate-900 border-white/5 h-full">
            <CardHeader>
               <CardTitle className="text-sm flex items-center gap-2 text-orange-400"><Bell className="w-4 h-4" /> Telemetry & Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Alert Webhook URL</label>
                  <input 
                    className="w-full bg-slate-950 border border-white/10 rounded-md p-2 text-[10px] font-mono text-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                    value={settings.alertWebhook}
                    onChange={(e) => setSettings(prev => ({ ...prev, alertWebhook: e.target.value }))}
                  />
               </div>
               <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSetting('telemetryEnabled')}>
                     <div className={`w-2 h-2 rounded-full transition-colors ${settings.telemetryEnabled ? 'bg-blue-500' : 'bg-slate-600'}`} />
                     <span className="text-[10px] font-bold text-slate-500">TELEMETRY_{settings.telemetryEnabled ? 'ON' : 'OFF'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500" />
                     <span className="text-[10px] font-bold text-slate-500">AZURE_SYNC_OK</span>
                  </div>
               </div>
            </CardContent>
          </Card>
        </DelayedInfoCard>
      </div>

      {/* Strategic Emergency Directives */}
      <Card className="bg-red-950/20 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.05)]">
        <CardHeader className="border-b border-red-500/10">
          <CardTitle className="text-sm flex items-center gap-2 text-red-500">
            <ShieldAlert className="w-4 h-4" /> Strategic Emergency Directives
          </CardTitle>
          <CardDescription className="text-red-900/50">Fail-safe protocols for extreme threat scenarios.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200">Data Recovery Pipeline</h4>
                <p className="text-[9px] text-slate-500 leading-relaxed font-mono">Generates a point-in-time encrypted backup of all SOC state data. Use this before initiating destruction protocols.</p>
              </div>
              <Button 
                onClick={handleDataRecovery}
                disabled={isRecovering}
                className="w-full bg-blue-600 hover:bg-blue-500 h-9 gap-2 text-xs font-bold uppercase tracking-wider"
              >
                {isRecovering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {isRecovering ? 'Generating Bundle...' : 'Execute Recovery Pipeline'}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-red-400">Data Destruction Protocol</h4>
                <p className="text-[9px] text-slate-500 leading-relaxed font-mono">Emergency wipe of all localized data packets and severance of deep-link warehouse connections. IRREVERSIBLE ACTION.</p>
              </div>
              <Button 
                onClick={startDataDestruction}
                disabled={isDestroying}
                variant="destructive"
                className="w-full h-9 gap-2 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                {isDestroying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isDestroying ? 'WIPING SYSTEM...' : 'Initiate Destruction Protocol'}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showVerify && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-6 p-6 bg-slate-950 border border-red-500/30 rounded-xl space-y-4 shadow-2xl relative z-50"
              >
                {!isFinalConfirmation ? (
                  <>
                    <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest flex items-center gap-2">
                       <Shield className="w-3 h-3 text-red-500" /> Human Validation Required
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">Solve neural equation to prove biological origin:</p>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-mono text-red-500">{verifyChallenge.a} + {verifyChallenge.b} = </span>
                      <input 
                        type="number" 
                        value={verifyInput}
                        onChange={(e) => setVerifyInput(e.target.value)}
                        className="bg-black border border-white/10 rounded px-2 py-1 text-sm font-mono text-white w-24 focus:border-red-500 outline-none"
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="text-[10px] uppercase h-8" onClick={() => setShowVerify(false)}>Abort</Button>
                      <Button size="sm" variant="destructive" className="text-[10px] uppercase h-8" onClick={verifyHuman}>Verify Node</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest">CRITICAL_CONFIRMATION</h3>
                    <p className="text-[10px] text-slate-400 font-mono italic">"This directive will result in total data loss and system reset. No restoration pipeline exists after execution."</p>
                    <div className="flex gap-2 pt-4">
                      <Button size="sm" variant="outline" className="text-[10px] uppercase h-8" onClick={() => setShowVerify(false)}>Cancel Protocol</Button>
                      <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700 text-[10px] uppercase h-8 animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.4)]" onClick={handleDataDestruction}>Execute Purge</Button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {isDestroying && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 bg-black/60 rounded-lg border border-red-500/20 font-mono"
              >
                <div className="space-y-1">
                  {destructionLog.map((log, index) => (
                    <motion.p 
                      key={`dest-log-${index}`}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-[9px] ${log.includes('DESTROYED') || log.includes('REMOVED') ? 'text-red-500 font-bold' : 'text-slate-400'}`}
                    >
                      &gt; {log}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-900 border-white/5">
        <CardHeader>
           <CardTitle className="text-sm">Technical Environment Info</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-mono">
              <div className="space-y-1">
                 <p className="text-slate-500 uppercase tracking-tighter">Stack</p>
                 <p className="text-white">React 19 + Node.js</p>
              </div>
              <div className="space-y-1">
                 <p className="text-slate-500 uppercase tracking-tighter">Database</p>
                 <p className="text-white">Azure Cosmos DB</p>
              </div>
              <div className="space-y-1">
                 <p className="text-slate-500 uppercase tracking-tighter">AI Engine</p>
                 <p className="text-white">Gemini 3 Flash</p>
              </div>
              <div className="space-y-1">
                 <p className="text-slate-500 uppercase tracking-tighter">Encryption</p>
                 <p className="text-white">AES-256 (GCM)</p>
              </div>
           </div>
        </CardContent>
      </Card>
      </div>
    </ScrollArea>
  );
}
