import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AuditTrailProps {
  auditTrails: any[];
}

export default function AuditTrailView({ auditTrails }: AuditTrailProps) {
  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-180px)]">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight font-serif italic text-red-500 underline decoration-red-500/20 underline-offset-8">Immutable Audit Trail</h2>
        <Badge variant="outline" className="font-mono text-[10px] bg-blue-500/5 text-blue-400 border-blue-500/30">AES-256 ENCRYPTED ARCHIVE</Badge>
      </div>
      <Card className="bg-slate-900 border-white/5 flex-1 overflow-hidden flex flex-col shadow-2xl">
        <div className="border-b border-white/5 bg-slate-950/20">
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="w-[180px] text-[10px] font-bold uppercase tracking-widest text-slate-500">BLOCK_TIME</TableHead>
                <TableHead className="w-[150px] text-[10px] font-bold uppercase tracking-widest text-slate-500">ACTION_TAG</TableHead>
                <TableHead className="w-[150px] text-[10px] font-bold uppercase tracking-widest text-slate-500">OPERATOR</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">CRYPTOGRAPHIC_DESCRIPTION</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>
        <ScrollArea className="flex-1">
          <Table>
            <TableBody>
              {auditTrails.slice().reverse().map((audit) => (
                <TableRow key={`audit-row-item-${audit.id}`} className="border-white/5 hover:bg-white/5 group">
                  <TableCell className="w-[180px] font-mono text-[10px] text-slate-500 group-hover:text-slate-300">{audit.timestamp}</TableCell>
                  <TableCell className="w-[150px]">
                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter border-blue-500/30 text-blue-400 bg-blue-500/5">{audit.action}</Badge>
                  </TableCell>
                  <TableCell className="w-[150px] font-mono text-[10px] text-slate-300 font-bold flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {audit.actor}
                  </TableCell>
                  <TableCell className="text-[11px] text-slate-400 italic group-hover:text-slate-200 transition-colors">{audit.description}</TableCell>
                </TableRow>
              ))}
              {auditTrails.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20">
                    <p className="text-slate-600 italic font-mono text-xs">AUDIT_LEDGER_EMPTY // AWAITING_INGRESS</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}
