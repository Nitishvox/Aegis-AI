import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  source: string;
  message: string;
}

export default function LogStreamView({ logs }: { logs: LogEntry[] }) {
  const [filter, setFilter] = React.useState<string>('ALL');
  
  const filteredLogs = logs.filter(log => filter === 'ALL' || log.level === filter);

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6 flex flex-col h-[calc(100vh-180px)] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight font-serif italic text-red-500 underline decoration-red-500/20 underline-offset-8">Terminal Log Stream</h2>
          <div className="flex items-center gap-4">
            <div className="flex gap-1 bg-slate-900 border border-white/5 p-1 rounded-md">
              {['ALL', 'INFO', 'WARN', 'ERROR', 'CRITICAL'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setFilter(lvl)}
                  className={`text-[8px] font-mono px-2 py-1 rounded transition-all ${filter === lvl ? 'bg-red-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="font-mono bg-slate-900/50">{filteredLogs.length} EVENTS</Badge>
              <Badge variant="outline" className="font-mono border-green-500 text-green-400 bg-green-500/5 animate-pulse">● LIVE_FEED</Badge>
            </div>
          </div>
        </div>
        <Card className="bg-slate-900 border-white/5 flex-1 overflow-hidden flex flex-col shadow-2xl">
          <div className="border-b border-white/5 bg-slate-950/20">
            <Table>
              <TableHeader>
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="w-[180px] text-[10px] font-bold uppercase tracking-widest text-slate-500">TIMESTAMP</TableHead>
                  <TableHead className="w-[100px] text-[10px] font-bold uppercase tracking-widest text-slate-500">LEVEL</TableHead>
                  <TableHead className="w-[150px] text-[10px] font-bold uppercase tracking-widest text-slate-500">SOURCE</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">EVENT_MESSAGE</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
          <ScrollArea className="flex-1">
            <Table>
              <TableBody>
                {filteredLogs.slice().reverse().map((log) => (
                  <TableRow key={`ls-log-row-${log.id}`} className="border-white/5 hover:bg-white/5 group">
                    <TableCell className="w-[180px] font-mono text-[10px] text-slate-500 group-hover:text-slate-300">{log.timestamp}</TableCell>
                    <TableCell className="w-[100px]">
                      <Badge variant="outline" className={`text-[9px] h-4 uppercase tracking-tighter ${log.level === 'CRITICAL' ? 'border-red-500 text-red-400' : 'border-slate-500 text-slate-400'}`}>{log.level}</Badge>
                    </TableCell>
                    <TableCell className="w-[150px] font-mono text-xs text-slate-400 font-bold">{log.source}</TableCell>
                    <TableCell className="text-xs text-slate-300 font-mono italic opacity-80 group-hover:opacity-100 group-hover:text-white transition-all">{log.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </div>
    </ScrollArea>
  );
}
