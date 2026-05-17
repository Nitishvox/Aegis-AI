import React from 'react';
import { motion } from 'motion/react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Shield, LayoutDashboard } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AgentResponse {
  role: string;
  content: string;
  confidenceScore: number;
  functionalities?: string[];
}

interface AgentCardProps {
  response: AgentResponse;
  icon: React.ReactNode;
  color: string;
  onAction?: () => void;
  actionLabel?: string;
  isActionLoading?: boolean;
  incidentStatus?: string;
}

export function AgentCard({ response, icon, color, onAction, actionLabel, isActionLoading, incidentStatus }: AgentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded bg-slate-900 border border-white/5 ${color}`}>
            {icon}
          </div>
          <div>
            <h3 className={`font-bold text-sm ${color}`}>{response.role}</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Deployment Status: ACTIVE</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Confidence Score</p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold">{(response.confidenceScore * 100).toFixed(0)}%</span>
            <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${response.confidenceScore * 100}%`, backgroundColor: 'currentColor' }} />
            </div>
          </div>
        </div>
      </div>
      
      <Card className="bg-slate-950/50 border-white/5 p-4 font-sans leading-relaxed text-sm text-slate-300">
        <div className="prose prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-headings:text-slate-100 prose-strong:text-white prose-table:border-collapse prose-th:border prose-th:border-white/10 prose-th:px-2 prose-th:py-1 prose-td:border prose-td:border-white/10 prose-td:px-2 prose-td:py-1">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{response.content}</ReactMarkdown>
        </div>
        
        {response.functionalities && response.functionalities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5">
             <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Internal Toolchain Status</p>
             <div className="grid grid-cols-2 gap-2">
                {response.functionalities.map((func, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-900/50 p-2 rounded border border-white/5 hover:border-blue-500/30 transition-colors group">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200 transition-colors uppercase">{func}</span>
                  </div>
                ))}
             </div>
          </div>
        )}
      </Card>
      
      <div className="bg-slate-900/40 p-3 rounded-md border border-white/5 flex items-center justify-between">
        <div className="flex gap-2">
          <Badge variant="outline" className="text-[9px] uppercase tracking-tighter border-white/10 text-slate-500">LLM-READY</Badge>
          <Badge variant="outline" className="text-[9px] uppercase tracking-tighter border-white/10 text-slate-500">ENCRYPTED</Badge>
        </div>
        <div className="flex gap-2">
           {onAction && (
             <Button 
               disabled={isActionLoading || incidentStatus === 'REMEDIATED'} 
               onClick={onAction} 
               size="sm" 
               className={`h-7 text-[10px] font-bold uppercase ${incidentStatus === 'REMEDIATED' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/20' : 'bg-red-500 hover:bg-red-600 text-white'}`}
             >
               {incidentStatus === 'REMEDIATED' ? '✓ NEUTRALIZED' : actionLabel || 'EXECUTE ACTION'}
             </Button>
           )}
           <Button variant="ghost" size="sm" className="h-6 text-[10px] uppercase font-bold text-slate-500 hover:text-white">Copy Audit Hash</Button>
        </div>
      </div>
    </motion.div>
  );
}
