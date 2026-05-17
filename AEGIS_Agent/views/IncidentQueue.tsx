import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  severity: string;
  status: string;
  detectedAt: string;
  summary: string;
}

export default function IncidentQueueView({ incidents, onAnalyze }: { incidents: Incident[], onAnalyze: (i: Incident) => void }) {
  const activeIncidents = incidents.filter(i => i.status !== 'REMEDIATED');
  
  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6 p-4 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight font-serif italic text-red-500">Security Incident Command</h2>
          <Badge variant="outline" className="font-mono">{activeIncidents.length} Active Threats</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeIncidents.map((incident) => (
            <Card key={`iq-inc-card-${incident.id}`} className="bg-slate-900 border-white/5 hover:border-red-500/30 transition-all cursor-pointer group" onClick={() => onAnalyze(incident)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant={incident.severity === 'CRITICAL' ? 'destructive' : 'outline'} className="mb-2 uppercase tracking-widest text-[10px]">{incident.severity}</Badge>
                  <span className="font-mono text-[10px] text-slate-500">{new Date(incident.detectedAt).toLocaleTimeString()}</span>
                </div>
                <CardTitle className="text-lg group-hover:text-red-400 transition-colors">{incident.id}: {incident.title}</CardTitle>
                <CardDescription className="line-clamp-2 italic">"{incident.summary}"</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold uppercase tracking-widest">Status: {incident.status}</span>
                  <span className="text-blue-400 font-bold uppercase tracking-widest">Deploy Agents &rarr;</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {incidents.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-xl">
               <Shield className="w-12 h-12 text-slate-800 mx-auto mb-4" />
               <p className="text-slate-500 italic">No active security incidents detected.</p>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
