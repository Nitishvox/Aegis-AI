import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, User, Bot, X, ChevronDown, Shield, Zap, LayoutDashboard, RefreshCcw, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatWithAI } from '@/src/lib/gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatBotProps {
  currentContext: any;
  onResetSystem: () => void;
}

export function ChatBot({ currentContext, onResetSystem }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string, content: string, actionSuggested?: string }[]>([
    { role: 'assistant', content: "AEGIS-PRIME online. Strategic neural link established. Provide objectives." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (customMessage?: string) => {
    const userMessage = customMessage || input;
    if (!userMessage.trim() || isLoading) return;

    if (!customMessage) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatWithAI(userMessage, messages, JSON.stringify(currentContext));
      
      let cleanResponse = response;
      let actionName = undefined;
      
      const actionMatch = response.match(/ACTION_REQUIRED:\s*(.*)$/m);
      if (actionMatch) {
        actionName = actionMatch[1].trim();
        cleanResponse = response.replace(/ACTION_REQUIRED:.*$/, '').trim();
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: cleanResponse,
        actionSuggested: actionName
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Neural link disrupted. Check API configuration." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionConfirm = (actionName: string) => {
    const confirmMsg = `EXECUTE AUTHORIZATION: ${actionName}`;
    // Clear the pending action from previous message
    setMessages(prev => {
      const next = [...prev];
      if (next.length > 0) {
        next[next.length - 1] = { ...next[next.length - 1], actionSuggested: undefined };
      }
      return next;
    });
    handleSend(confirmMsg);
  };

  return (
    <div className="fixed bottom-12 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 md:w-[400px] bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="bg-slate-950 p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-200">AEGIS-PRIME</h3>
                </div>
                <div className="flex items-center gap-3 text-[7px] font-mono text-slate-500">
                   <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-green-500/50" /> LINK: STABLE</span>
                   {currentContext.selectedIncident && (
                     <span className="flex items-center gap-1 text-blue-400 bg-blue-500/5 px-1 rounded">
                        <Shield size={8} /> FOCUS: {currentContext.selectedIncident.id}
                     </span>
                   )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-slate-600 hover:text-blue-400" 
                  title="Restart System"
                  onClick={onResetSystem}
                >
                  <RefreshCcw size={12} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-slate-600 hover:text-red-400" 
                  title="Clear Chat Logs"
                  onClick={() => setMessages([{ role: 'assistant', content: "Memory buffer purged. Awaiting new intelligence." }])}
                >
                  <Trash2 size={12} />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white" onClick={() => setIsOpen(false)}>
                  <ChevronDown size={16} />
                </Button>
              </div>
            </div>

            <div ref={scrollRef} className="h-[400px] overflow-y-auto p-4 space-y-4 bg-slate-950/20 scroll-smooth">
              {messages.map((m, i) => (
                <div key={`msg-${i}`} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] p-3 rounded-lg text-xs leading-relaxed ${m.role === 'user' ? 'bg-blue-600/10 border border-blue-500/30 text-blue-100' : 'bg-slate-800/80 text-slate-200 border border-white/5 shadow-xl'}`}>
                    <div className={`flex items-center gap-2 mb-1.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                       {m.role === 'user' ? <User size={10} className="text-blue-400" /> : <Bot size={10} className="text-blue-400" />}
                       <span className="text-[8px] font-bold uppercase tracking-[0.15em] opacity-40">{m.role === 'user' ? 'Field Agent' : 'AEGIS-PRIME'}</span>
                    </div>
                    <div className={`prose prose-invert prose-xs max-w-none prose-p:leading-tight prose-p:my-1 prose-headings:my-1 prose-ul:my-1 prose-li:my-0.5 prose-table:border-collapse prose-th:border prose-th:border-white/10 prose-th:px-2 prose-th:py-1 prose-td:border prose-td:border-white/10 prose-td:px-2 prose-td:py-1 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                    </div>

                    {m.actionSuggested && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 p-3 bg-blue-600/10 rounded-md border border-blue-500/30 ring-1 ring-blue-500/20"
                      >
                        <div className="flex items-center gap-2 mb-2">
                           <Shield size={12} className="text-blue-400 animate-pulse" />
                           <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider">Tactical Override Required</span>
                        </div>
                        <div className="bg-black/40 p-2 rounded text-[10px] font-mono text-blue-300 border border-white/5 mb-3">
                           $ aegis execute --action="{m.actionSuggested}"
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            className="bg-blue-600 hover:bg-blue-500 text-white h-7 text-[9px] font-bold rounded grow shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                            onClick={() => handleActionConfirm(m.actionSuggested!)}
                          >
                            CONFIRM & EXECUTE
                          </Button>
                          <Button 
                            variant="outline"
                            className="h-7 text-[9px] font-bold text-slate-400 hover:text-white border-white/10 bg-transparent"
                            onClick={() => {
                              setMessages(prev => {
                                const next = [...prev];
                                const lastIdx = next.length - 1;
                                next[lastIdx] = { ...next[lastIdx], actionSuggested: undefined };
                                return next;
                              });
                            }}
                          >
                            DISREGARD
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-slate-800/50 p-3 rounded-lg text-xs flex flex-col gap-2 min-w-[140px] border border-white/5">
                      <div className="flex gap-1.5">
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-blue-500 rounded-full" />
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-blue-500 rounded-full" />
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-blue-500 rounded-full" />
                      </div>
                      <span className="text-[8px] font-mono text-blue-500/80 tracking-widest animate-pulse">SYNCHRONIZING NEURAL LAYERS...</span>
                   </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 bg-slate-950/90 border-t border-white/5">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-slate-500">Rapid Response Protocols</p>
                  <div className="h-[1px] flex-1 bg-white/5 ml-3" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Neutralize Threat", icon: <Shield size={10} />, className: "hover:bg-red-500/10 hover:border-red-500/40" },
                      { label: "Stabilize System", icon: <Zap size={10} />, className: "hover:bg-orange-500/10 hover:border-orange-500/40" },
                      { label: "Diagnostic Scan", icon: <LayoutDashboard size={10} />, className: "hover:bg-blue-500/10 hover:border-blue-500/40" },
                      { label: "Full Report", icon: <Bot size={10} />, className: "hover:bg-green-500/10 hover:border-green-500/40" }
                    ].map((btn, idx) => (
                      <Button 
                        key={idx}
                        variant="outline" 
                        size="sm" 
                        disabled={isLoading}
                        className={`h-7 justify-start text-[9px] gap-2 border-white/5 bg-slate-900/40 text-slate-400 hover:text-white transition-all ${btn.className}`}
                        onClick={() => {
                          handleSend(btn.label);
                        }}
                      >
                        {btn.icon} <span className="truncate">{btn.label}</span>
                      </Button>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/5 flex gap-2">
              <Input 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Direct command..." 
                className="h-10 bg-slate-900/50 border-white/10 text-xs focus-visible:ring-blue-500/50 placeholder:text-slate-600 rounded-lg"
              />
              <Button size="icon" className="h-10 w-10 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg active:scale-95 transition-transform" onClick={() => handleSend()} disabled={isLoading}>
                <Send size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-full h-12 w-12 shadow-2xl transition-all ${isOpen ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-500 scale-110'}`}
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </Button>
    </div>
  );
}
