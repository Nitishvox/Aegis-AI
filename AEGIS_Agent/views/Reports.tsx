import React, { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, ShieldCheck, Clock, ExternalLink, Lock as LockIcon, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface Report {
  id: string;
  incidentId: string;
  title: string;
  date: string;
  content: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "DRAFT" | "FINAL";
}

interface ReportsViewProps {
  reports: Report[];
}

export default function ReportsView({ reports }: ReportsViewProps) {
  const [selectedReport, setSelectedReport] = React.useState<Report | null>(reports[0] || null);
  const [isExporting, setIsExporting] = React.useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!selectedReport || !reportRef.current) return;
    
    setIsExporting(true);
    const toastId = toast.loading("Generating Secure PDF Report...");

    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0a0a',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`AEGIS_REPORT_${selectedReport.incidentId}_${new Date().getTime()}.pdf`);
      
      toast.success("PDF Exported Successfully", { id: toastId });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to generate PDF", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ScrollArea className="h-full pr-4">
      <div className="flex flex-col gap-6 p-4 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight font-serif italic text-blue-500">Executive Incident Reports</h2>
          <div className="flex gap-2">
              <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/50" variant="outline">COMPLIANCE READY</Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50" variant="outline">SOC2 CERTIFIED</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Report List */}
          <Card className="bg-slate-900 border-white/5 flex flex-col h-fit lg:max-h-[600px]">
            <CardHeader className="pb-2 border-b border-white/5">
              <CardTitle className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Archives</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[300px] lg:h-full">
              <div className="p-2 space-y-1">
                {reports.length === 0 ? (
                  <div className="p-8 text-center text-slate-600 text-xs italic">
                    No reports generated yet. Analyze an incident to create one.
                  </div>
                ) : (
                  reports.map((report) => (
                    <button
                      key={`report-btn-item-${report.id}`}
                      onClick={() => setSelectedReport(report)}
                      className={`w-full text-left p-3 rounded-lg transition-all border ${
                        selectedReport?.id === report.id
                          ? 'bg-blue-500/10 border-blue-500/50'
                          : 'bg-transparent border-transparent hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-slate-500">{report.incidentId}</span>
                        <Badge className={`text-[8px] h-4 ${
                          report.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' :
                          report.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-500' :
                          'bg-blue-500/20 text-blue-500'
                        }`}>
                          {report.severity}
                        </Badge>
                      </div>
                      <div className="text-xs font-bold text-slate-200 truncate">{report.title}</div>
                      <div className="text-[9px] text-slate-500 mt-1 flex items-center gap-1">
                        <Clock className="w-2 h-2" /> {new Date(report.date).toLocaleDateString()}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>

          {/* Report Content */}
          <Card className="lg:col-span-3 bg-slate-900 border-white/5 flex flex-col overflow-hidden">
            {selectedReport ? (
              <>
                <CardHeader className="border-b border-white/5 bg-slate-950/50 flex flex-row items-center justify-between sticky top-0 z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                      <FileText className="text-blue-500 w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-serif italic text-white flex items-center gap-2">
                         {selectedReport.title}
                         <Badge variant="outline" className="text-[10px] text-slate-500 border-white/10 uppercase">{selectedReport.status}</Badge>
                      </CardTitle>
                      <p className="text-[10px] text-slate-500 font-mono">Generated: {new Date(selectedReport.date).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 gap-2 text-[10px] border-white/10 hover:bg-white/5"
                      onClick={handleExportPDF}
                      disabled={isExporting}
                     >
                        {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />} 
                        {isExporting ? 'EXPORTING...' : 'EXPORT PDF'}
                     </Button>
                     <Button size="sm" className="h-8 gap-2 text-[10px] bg-blue-600 hover:bg-blue-500">
                        <ShieldCheck className="w-3 h-3" /> VERIFY AUDIT
                     </Button>
                  </div>
                </CardHeader>
                <div className="bg-white/[0.02] p-4 lg:p-12">
                  <div ref={reportRef} className="max-w-4xl mx-auto bg-slate-950/60 rounded-xl p-8 border border-white/5 shadow-2xl">
                      <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                          <div>
                              <h1 className="text-3xl font-serif italic text-blue-500 mb-1 leading-tight">{selectedReport.title}</h1>
                              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">AEGIS SOC INCIDENT REPORT // CLASSIFIED</p>
                          </div>
                          <div className="text-right shrink-0">
                             <div className="text-[10px] font-mono text-slate-400">REF: {selectedReport.incidentId}</div>
                             <div className="text-[10px] font-mono text-slate-400">DATE: {new Date(selectedReport.date).toLocaleDateString()}</div>
                          </div>
                      </div>

                      <div className="markdown-body prose prose-invert prose-slate prose-sm max-w-none 
                                      prose-headings:font-serif prose-headings:italic prose-headings:text-blue-400
                                      prose-strong:text-white prose-code:text-red-400 prose-p:text-slate-300">
                          <ReactMarkdown>{selectedReport.content}</ReactMarkdown>
                      </div>

                      <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 gap-8">
                          <div>
                              <h4 className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mb-2">Security Authorization</h4>
                              <div className="h-8 border-b border-white/10 w-48 mb-1"></div>
                              <p className="text-[8px] text-slate-600 font-mono italic">AEGIS-PRIME COMMANDER SIGNATURE</p>
                          </div>
                          <div className="text-right">
                              <Badge variant="outline" className="bg-blue-500/5 text-blue-400 border-blue-500/20 text-[8px]">IMMUTABLE BLOCKCHAIN RECORD: 0x4f8...e2q</Badge>
                          </div>
                      </div>
                  </div>
                </div>
                <div className="p-3 border-t border-white/5 bg-slate-950 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <span className="text-[9px] text-slate-500 flex items-center gap-1 font-mono tracking-tighter uppercase"><LockIcon className="w-2.5 h-2.5" /> AES-256 Encrypted</span>
                      <span className="text-[9px] text-slate-500 flex items-center gap-1 font-mono tracking-tighter uppercase"><ShieldCheck className="w-2.5 h-2.5" /> Immutable Hash Verified</span>
                   </div>
                   <Button variant="link" className="h-auto p-0 text-[10px] text-blue-500 gap-1 uppercase tracking-widest font-bold">
                      View in Azure Cloud Registry <ExternalLink className="w-2 h-2" />
                   </Button>
                </div>
              </>
            ) : (
              <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-600 opacity-50">
                 <FileText className="w-16 h-16 mb-4 stroke-[1]" />
                 <p className="text-sm font-serif italic">Select a report to view details</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
