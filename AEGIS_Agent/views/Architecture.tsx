import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Database, Cloud, Zap, Server, Lock as LockIcon, Info, Activity, Fingerprint, Network } from 'lucide-react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';

import { SystemSettings } from '@/src/App';

interface ArchitectureViewProps {
  incidents: any[];
  settings?: SystemSettings;
}

interface NodeData {
  id: string;
  type: string;
  group: number;
  label: string;
  status: string;
  description: string;
  metadata: Record<string, string>;
  x?: number;
  y?: number;
}

export default function ArchitectureView({ incidents, settings }: ArchitectureViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const activeIncidents = incidents.filter(i => i.status !== 'REMEDIATED');
  const isUnderAttack = activeIncidents.length > 0;
  const criticalAttack = activeIncidents.some(i => i.severity === 'CRITICAL');

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 400;
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`);

    svg.selectAll("*").remove();

    const nodes: NodeData[] = [
      { 
        id: "User", 
        type: "actor", 
        group: 1, 
        label: "Field Analyst", 
        status: 'stable',
        description: "Authenticated security personnel interacting with the Aegis system terminal.",
        metadata: { "Auth_Level": "Tier-3", "Sync_Health": "98%", "Protocol": "Biometric" }
      },
      { 
        id: "Aegis_UI", 
        type: "system", 
        group: 2, 
        label: "Aegis Web Terminal", 
        status: 'stable',
        description: "The primary graphical interface for monitoring and response orchestration.",
        metadata: { "Framework": "React 19", "Encryption": "AES-256", "HMR": "Disabled" }
      },
      { 
        id: "API_Service", 
        type: "service", 
        group: 2, 
        label: "Node.js API Gateway", 
        status: isUnderAttack ? 'stressed' : 'stable',
        description: "Central routing and validation layer for all inbound telemetry and outbound directives.",
        metadata: { "Runtime": "Node.js 20", "Throughput": isUnderAttack ? "12k req/s" : "450 req/s", "Status": isUnderAttack ? "LATENCY_SPIKE" : "OK" }
      },
      { 
        id: "AI_Agent_Swarm", 
        type: "intelligence", 
        group: 3, 
        label: "Gemini AI Agents", 
        status: isUnderAttack ? 'active' : 'idle',
        description: "High-density neural processing swarm executing parallel threat investigations.",
        metadata: { "Model": "Gemini 3 Flash", "Concurrency": settings?.inferenceConcurrency?.toString() || "8", "Directives": "Active" }
      },
      { 
        id: "Azure_DB", 
        type: "database", 
        group: 4, 
        label: "Azure Cosmos DB", 
        status: activeIncidents.some(i => i.attackType?.includes('Database')) ? 'stressed' : 'stable',
        description: "Globally distributed NoSQL document store for incident telemetry and system state.",
        metadata: { "Region": settings?.primaryRegion || "Multi-Region", "Consistency": "Strong", "IOPS": "Unbounded" }
      },
      { 
        id: "Azure_SQL", 
        type: "database", 
        group: 4, 
        label: "Azure SQL Managed Instance", 
        status: activeIncidents.some(i => i.attackType?.includes('SQL')) ? 'stressed' : 'stable',
        description: "Relational backup and audit log persistence with managed infrastructure.",
        metadata: { "SLA": "99.99%", "Storage": "512GB Reserved", "Backup": "Point-in-Time" }
      },
      { 
        id: "Cloud_Logging", 
        type: "service", 
        group: 4, 
        label: "Azure Monitor Logs", 
        status: isUnderAttack ? 'high-throughput' : 'stable',
        description: "Immutable append-only log stream for all system events and heuristic detections.",
        metadata: { "Ingress": "4.5 GB/s", "Retention": "7 Years", "Alerting": "Active" }
      }
    ];

    const links = [
      { source: "User", target: "Aegis_UI", value: 1 },
      { source: "Aegis_UI", target: "API_Service", value: isUnderAttack ? 3 : 1 },
      { source: "API_Service", target: "AI_Agent_Swarm", value: isUnderAttack ? 5 : 2 },
      { source: "API_Service", target: "Azure_DB", value: 1 },
      { source: "API_Service", target: "Azure_SQL", value: 1 },
      { source: "AI_Agent_Swarm", target: "API_Service", value: isUnderAttack ? 5 : 2 },
      { source: "Cloud_Logging", target: "API_Service", value: isUnderAttack ? 4 : 1 }
    ];

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", (d: any) => isUnderAttack ? "#ef444455" : "#1e293b")
      .attr("stroke-width", (d: any) => d.value)
      .attr("stroke-dasharray", (d: any) => isUnderAttack ? "5,5" : "none")
      .attr("marker-end", "url(#arrowhead)");

    if (isUnderAttack) {
        link.append("animate")
            .attr("attributeName", "stroke-dashoffset")
            .attr("from", "100")
            .attr("to", "0")
            .attr("dur", "2s")
            .attr("repeatCount", "indefinite");
    }

    // Arrowhead marker
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", isUnderAttack ? "#ef4444" : "#3b82f6")
      .style("stroke", "none");

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("circle")
      .attr("r", (d: any) => selectedNode?.id === d.id ? 20 : 15)
      .attr("fill", (d: any) => {
        if (selectedNode?.id === d.id) return '#ffffff';
        if (d.status === 'stressed') return '#ef4444';
        if (d.type === 'actor') return '#3b82f6';
        if (d.type === 'intelligence') return isUnderAttack ? '#ef4444' : '#6366f1';
        if (d.type === 'database') return '#10b981';
        return '#64748b';
      })
      .attr("stroke", (d: any) => {
        if (selectedNode?.id === d.id) return '#3b82f6';
        return d.status === 'stressed' ? "#fca5a5" : "#0f172a";
      })
      .attr("stroke-width", (d: any) => selectedNode?.id === d.id ? 4 : 3)
      .attr("class", (d: any) => d.status === 'stressed' || selectedNode?.id === d.id ? "animate-pulse cursor-pointer" : "cursor-pointer")
      .on("click", (event: any, d: any) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    node.on("mouseover", function() {
        d3.select(this).select("circle").transition().attr("r", 18);
    }).on("mouseout", function(event: any, d: any) {
        if (selectedNode?.id !== d.id) {
            d3.select(this).select("circle").transition().attr("r", 15);
        }
    });

    svg.on("click", () => setSelectedNode(null));

    node.append("text")
      .text((d: any) => d.label)
      .attr("x", 20)
      .attr("y", 5)
      .attr("fill", (d: any) => d.status === 'stressed' ? "#f87171" : "#94a3b8")
      .style("font-size", "10px")
      .style("font-family", "monospace")
      .style("font-weight", "bold");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }, [isUnderAttack, selectedNode]);

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight font-serif italic text-red-500">Data Flow & Architecture</h2>
        <div className="flex gap-2">
            <Badge className={`border-blue-500/50 ${isUnderAttack ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {isUnderAttack ? 'THREAT DETECTED' : 'AZURE INTEGRATED'}
            </Badge>
            <Badge className={`border-green-500/50 ${criticalAttack ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {criticalAttack ? 'SYSTEM_CRITICAL' : 'CLOUD_STABLE'}
            </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={`lg:col-span-2 bg-slate-900 border-white/5 shadow-2xl relative overflow-hidden transition-colors duration-500 ${isUnderAttack ? 'ring-1 ring-red-500/20' : ''}`}>
          <CardHeader className="border-b border-white/5">
             <div className="flex items-center justify-between">
                <CardTitle className="text-sm uppercase tracking-widest">Neural Infrastructure Graph</CardTitle>
                {isUnderAttack && <div className="flex items-center gap-2 text-[9px] font-mono text-red-500 animate-pulse"><div className="w-1 h-1 rounded-full bg-red-500" /> ANOMALOUS TRAFFIC DETECTED</div>}
             </div>
          </CardHeader>
          <CardContent className="p-0 min-h-[450px] bg-slate-950/20 relative">
             <svg ref={svgRef} className="w-full h-full"></svg>
             
             <AnimatePresence>
                {selectedNode && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute top-4 right-4 w-64 bg-slate-900/95 backdrop-blur-md border border-blue-500/30 rounded-xl shadow-[0_0_40px_rgba(37,99,235,0.15)] overflow-hidden z-20 pointer-events-none"
                  >
                    <div className="bg-blue-600/10 p-3 border-b border-white/5 flex items-center justify-between">
                       <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                          <Info size={12} /> Neural Node Intel
                       </span>
                       <Badge variant="outline" className="text-[8px] border-blue-500/30 text-blue-300 uppercase">{selectedNode.status}</Badge>
                    </div>
                    <div className="p-4 space-y-4">
                       <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white uppercase">{selectedNode.label}</h4>
                          <p className="text-[9px] text-slate-400 leading-relaxed font-mono">{selectedNode.description}</p>
                       </div>
                       
                       <div className="grid grid-cols-1 gap-2 pt-2 border-t border-white/5">
                          {Object.entries(selectedNode.metadata).map(([key, val]) => (
                            <div key={key} className="flex items-center justify-between">
                               <span className="text-[8px] text-slate-500 uppercase font-bold">{key.replace('_', ' ')}</span>
                               <span className="text-[9px] text-slate-100 font-mono">{val}</span>
                            </div>
                          ))}
                       </div>

                       <div className="flex gap-2 pt-2">
                          <div className="p-1.5 rounded bg-slate-950/50 border border-white/5 flex flex-col items-center flex-1">
                             <Activity size={10} className="text-green-500 mb-1" />
                             <span className="text-[7px] text-slate-500 uppercase">Latency</span>
                             <span className="text-[8px] text-white">0.4ms</span>
                          </div>
                          <div className="p-1.5 rounded bg-slate-950/50 border border-white/5 flex flex-col items-center flex-1">
                             <Fingerprint size={10} className="text-blue-500 mb-1" />
                             <span className="text-[7px] text-slate-500 uppercase">Integrity</span>
                             <span className="text-[8px] text-white">99.9%</span>
                          </div>
                          <div className="p-1.5 rounded bg-slate-950/50 border border-white/5 flex flex-col items-center flex-1">
                             <Network size={10} className="text-purple-500 mb-1" />
                             <span className="text-[7px] text-slate-500 uppercase">Load</span>
                             <span className="text-[8px] text-white">{isUnderAttack ? '82%' : '12%'}</span>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}
             </AnimatePresence>

             <div className="absolute bottom-4 left-4 flex gap-4 text-[9px] uppercase font-bold text-slate-500 font-mono">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Actor</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Intelligence</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Storage</div>
             </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-slate-900 border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase flex items-center gap-2"><Database className="w-3 h-3 text-blue-500" /> Azure Cloud Connector</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="p-3 bg-slate-950 rounded border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] text-slate-400 uppercase">Cosmos DB Instance</span>
                     <Badge variant="outline" className={`text-[8px] border-green-500/50 text-green-400`}>CONNECTED</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] text-slate-400 uppercase">SQL Managed Instance</span>
                     <Badge variant="outline" className={`text-[8px] border-green-500/50 text-green-400`}>ENCRYPTED</Badge>
                  </div>
               </div>
               <div className="text-[10px] text-slate-500 font-mono italic px-1 flex justify-between">
                  <span>Latency: <span className={isUnderAttack ? 'text-red-400' : 'text-blue-400'}>{isUnderAttack ? '42ms' : '4ms'}</span></span>
                  <span className="text-[8px] opacity-50 uppercase">ExpressRoute-Priority</span>
               </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-white/5">
            <CardHeader className="pb-2">
               <CardTitle className="text-xs uppercase flex items-center gap-2"><Shield className="w-3 h-3 text-red-500" /> Security Boundaries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="space-y-1">
                  <div className="flex justify-between text-[9px] uppercase font-bold">
                     <span className="text-slate-500">WAF Protection</span>
                     <span className={isUnderAttack ? 'text-orange-500' : 'text-green-500'}>{isUnderAttack ? 'ADAPTIVE_SHIELD' : 'Active'}</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                     <div className={`h-full transition-all duration-1000 ${isUnderAttack ? 'bg-orange-500 w-[65%]' : 'bg-green-500 w-full'}`} />
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="flex justify-between text-[9px] uppercase font-bold">
                     <span className="text-slate-500">Heuristic Inspection</span>
                     <span className={settings?.deepPacketInspection ? 'text-red-500' : 'text-blue-500'}>{settings?.deepPacketInspection ? 'ACTIVE_HEU' : 'Standard'}</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                     <div className={`h-full transition-all duration-1000 ${settings?.deepPacketInspection ? 'bg-red-500 w-[95%]' : 'bg-blue-500 w-[45%]'}`} />
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="flex justify-between text-[9px] uppercase font-bold">
                     <span className="text-slate-500">DDOS Shield</span>
                     <span className={criticalAttack ? 'text-red-500' : isUnderAttack ? 'text-yellow-500' : 'text-blue-500'}>
                       {criticalAttack ? 'MITIGATING_CRITICAL' : isUnderAttack ? 'THROTTLING' : 'Standard'}
                     </span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                     <div className={`h-full transition-all duration-1000 ${criticalAttack ? 'bg-red-500 w-[95%]' : isUnderAttack ? 'bg-yellow-500 w-[65%]' : 'bg-blue-500 w-[85%]'}`} />
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-slate-900 border-white/5">
        <CardHeader>
           <CardTitle className="text-sm uppercase tracking-widest">Architecture Technical Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold"><Server className="w-4 h-4" /> Frontend Layer</div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">React 19 + Vite deployed as a Single Page Application with server-side proxying for API requests. Optimized for edge delivery.</p>
           </div>
           <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold"><Zap className="w-4 h-4" /> Intelligence Layer</div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">Google Gemini 3 Flash powering a multi-agent swarm for simultaneous classification, investigation, and remediation strategy.</p>
           </div>
           <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-400 text-xs font-bold"><LockIcon className="w-4 h-4" /> Data Persistence</div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">Azure Cosmos DB (Simulated) with automatic geo-replication and AES-256 at-rest encryption for audit trails and logs.</p>
           </div>
        </CardContent>
      </Card>
    </div>
    </ScrollArea>
  );
}
