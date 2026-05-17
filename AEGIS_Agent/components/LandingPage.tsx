import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Lock, Database, Terminal, ArrowRight, Bot, Globe, Server, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface LandingPageProps {
  onLogin: (email: string) => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onLogin(email);
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 overflow-x-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-red-600/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Shield size={20} className="text-white" />
          </div>
          <span className="text-xl font-serif italic tracking-tighter text-blue-500">AEGIS-PRIME</span>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
          <a href="#" className="hover:text-blue-400 transition-colors">Protocols</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Intelligence</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Neural Link</a>
        </div>
      </nav>

      <main className="relative z-10 pt-20 pb-32 px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Zap size={12} className="text-blue-400 group-hover:animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">v2.4 Autonomous Neural Defense</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif italic text-white leading-[0.9] mb-8 tracking-tighter">
              Command Your <br />
              Digital <span className="text-blue-500">Fortress.</span>
            </h1>
            <p className="text-lg text-slate-400 font-light leading-relaxed max-w-lg mb-10">
              AEGIS-PRIME is a cognitive security operations center designed to intercept, analyze, and neutralize threats before they reach your production environment. 
            </p>

            {/* Added Visual Asset */}
            <div className="mb-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group max-w-md relative">
               <img 
                 src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000" 
                 alt="Cybersecurity Machine" 
                 className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
               <div className="absolute bottom-4 left-4">
                  <p className="text-[8px] font-mono text-blue-400 uppercase tracking-[0.3em]">Neural Interface v2.0</p>
               </div>
            </div>
            
            {/* Pseudo-Login Form */}
            <form onSubmit={handleSubmit} className="relative max-w-md group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-red-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-slate-950 p-1.5 rounded-lg flex gap-2 border border-white/10 shadow-2xl">
                <Input 
                  type="email" 
                  required
                  placeholder="Enter Access Key (Email)..." 
                  className="bg-transparent border-none text-sm placeholder:text-slate-600 focus-visible:ring-0 h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 px-6 rounded shadow-lg transition-all active:scale-95"
                >
                  INITIALIZE <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
              <p className="mt-4 text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Lock size={10} /> Neural Link via encrypted handshake
              </p>
            </form>
          </motion.div>

          {/* Visual Bento Grid */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="col-span-2 aspect-[2/1] bg-slate-900/30 rounded-2xl border border-white/5 flex flex-col justify-end relative overflow-hidden group hover:border-blue-500/30 transition-all">
               <img 
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200" 
                  alt="Global Network" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-1000"
                  referrerPolicy="no-referrer"
               />
               <div className="relative z-10 p-8">
                 <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                    <Globe size={16} className="text-blue-400" />
                 </div>
                 <h3 className="text-2xl font-serif italic text-white mb-2">Global Threat Mesh</h3>
                 <p className="text-sm text-slate-400 max-w-sm">Real-time geolocation of active adversarial maneuvers across all nodes.</p>
               </div>
               <div className="absolute top-4 right-4 text-[8px] font-mono text-blue-500/50 uppercase tracking-widest">Live Telemetry 294.1ms</div>
            </div>
            
            <div className="bg-slate-900/30 rounded-2xl border border-white/5 p-6 aspect-square flex flex-col justify-between group hover:border-red-500/30 transition-all overflow-hidden relative">
               <img 
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800" 
                  alt="Neural Core" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                  referrerPolicy="no-referrer"
               />
               <div className="relative z-10 w-10 h-10 rounded-xl bg-red-500/5 flex items-center justify-center">
                  <Bot size={20} className="text-red-400" />
               </div>
               <div className="relative z-10">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-slate-200 mb-1">Neural Core</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">Self-correcting AI with predictive neutralization capabilities.</p>
               </div>
            </div>

            <div className="bg-slate-950/40 rounded-2xl border border-blue-500/10 p-6 aspect-square flex flex-col justify-between group hover:border-blue-500/40 transition-all shadow-[0_0_50px_rgba(37,99,235,0.05)] overflow-hidden relative">
               <img 
                  src="https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=800" 
                  alt="Immutable Ledger" 
                  className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-30 transition-opacity duration-700"
                  referrerPolicy="no-referrer"
               />
               <div className="relative z-10 w-10 h-10 rounded-xl bg-blue-500/5 flex items-center justify-center">
                  <Database size={20} className="text-blue-400" />
               </div>
               <div className="relative z-10">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-1">Immutability</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">Blockchain-verified audit trails for every tactical decision.</p>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Added Section: System Infrastructure */}
        <section className="mt-40">
           <div className="max-w-xl mb-16">
              <h2 className="text-4xl md:text-5xl font-serif italic text-white tracking-tighter mb-4">Hardened Infrastructure.</h2>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                 Aegis-Prime isn't just software; it's a globally distributed network of tactical defensive nodes designed for high-availability under siege.
              </p>
           </div>
           
           <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-3xl overflow-hidden border border-white/5 relative aspect-video group">
                 <img 
                    src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200" 
                    alt="Ops Center"
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                    referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                 <div className="absolute bottom-8 left-8">
                    <Badge className="bg-blue-600 mb-4 px-3">PRIMARY HUB</Badge>
                    <h3 className="text-2xl font-serif italic text-white">Central Command</h3>
                 </div>
              </div>
              <div className="rounded-3xl overflow-hidden border border-white/5 relative aspect-video group">
                 <img 
                    src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200" 
                    alt="Datacenter"
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                 <div className="absolute bottom-8 left-8">
                    <Badge className="bg-slate-800 mb-4 px-3">SOVEREIGN NODE</Badge>
                    <h3 className="text-2xl font-serif italic text-white">Zone 4 Persistence</h3>
                 </div>
              </div>
           </div>
        </section>

        {/* Clients/Trust Bar */}
        <div className="mt-32 pt-16 border-t border-white/5 opacity-40 grayscale hover:grayscale-0 transition-all">
           <div className="flex flex-wrap justify-center gap-12 md:gap-24 items-center opacity-50">
              <div className="text-xl font-bold font-serif italic">CYBER-DYNAMICS</div>
              <div className="text-xl font-bold font-mono tracking-tighter">PROTO_CORE</div>
              <div className="text-xl font-serif">NEURAL_NET</div>
              <div className="text-xl font-mono uppercase tracking-widest">Aegis_Labs</div>
           </div>
        </div>

        {/* Feature Grid Section */}
        <section className="mt-40">
           <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-serif italic text-white mb-4">Tactical Superiority.</h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm">Advanced defensive primitives for modern infra-as-code deployments.</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-1 px-4 md:px-0">
              {[
                { title: "Kernel Intercept", desc: "Deep packet inspection at the kernel level for zero-latency monitoring.", color: "blue", img: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=600" },
                { title: "Ghost Protocol", desc: "Invisible honeypots that trap and neutralize scanners effortlessly.", color: "red", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600" },
                { title: "Neural Cleanup", desc: "Automated remediation that resets local state post-incident.", color: "blue", img: "https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?auto=format&fit=crop&q=80&w=600" },
                { title: "Audit Immutability", desc: "Every action logged to an append-only distributed ledger.", color: "blue", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600" },
                { title: "Adaptive Firewall", desc: "Dynamic rules that evolve based on adversarial behavior patterns.", color: "red", img: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&q=80&w=600" },
                { title: "Shadow Detection", desc: "Spot lateral movement before attackers reach sensitive datasets.", color: "blue", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=600" }
              ].map((f, i) => (
                <div key={i} className="group p-8 bg-slate-900/20 border border-white/5 hover:bg-slate-900/40 transition-all flex flex-col gap-4 relative overflow-hidden">
                   <img 
                      src={f.img} 
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                      alt={f.title}
                      referrerPolicy="no-referrer"
                   />
                   <div className="relative z-10">
                      <div className={`w-8 h-8 rounded bg-${f.color}-500/10 flex items-center justify-center mb-4`}>
                          {f.color === 'blue' ? <Shield size={14} className="text-blue-400" /> : <Zap size={14} className="text-red-400" />}
                      </div>
                      <h3 className="text-md font-serif italic text-white">{f.title}</h3>
                      <p className="text-[12px] text-slate-500 leading-relaxed font-light">{f.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Architectural Gallery */}
        <section className="mt-40">
           <div className="flex items-end justify-between mb-12">
              <div>
                 <h2 className="text-4xl md:text-5xl font-serif italic text-white tracking-tight">System Core.</h2>
                 <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] mt-2">Visualizing the AEGIS-PRIME hardware stack.</p>
              </div>
              <div className="hidden md:block text-[10px] font-mono text-slate-600 uppercase tracking-widest max-w-[200px] text-right">
                 High-availability nodes distributed across 14 sovereign data zones.
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 aspect-[2/1]">
              <div className="md:col-span-2 rounded-3xl overflow-hidden border border-white/5 relative group">
                 <img 
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200" 
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                    alt="Network Hub"
                    referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                 <div className="absolute bottom-6 left-6">
                    <p className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Zone_01 // Frankfurt</p>
                 </div>
              </div>
              <div className="rounded-3xl overflow-hidden border border-white/5 relative group">
                 <img 
                    src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800" 
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                    alt="Security Crypt"
                    referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="rounded-3xl overflow-hidden border border-white/5 relative group">
                 <img 
                    src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800" 
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    alt="Neural Processor"
                    referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
              </div>
           </div>
        </section>

        {/* Tactical Explanation Section */}
        <section className="mt-40 grid md:grid-cols-3 gap-12 border-t border-white/5 pt-20">
            <div className="group">
                <div className="text-blue-500 font-mono text-3xl mb-4 group-hover:translate-x-2 transition-transform">01</div>
                <h3 className="text-lg font-serif italic text-white mb-3">Intercept</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-light">
                   Our agents capture system telemetry at the kernel level, identifying anomalies before they manifest as critical exploits.
                </p>
            </div>
            <div className="group">
                <div className="text-blue-500 font-mono text-3xl mb-4 group-hover:translate-x-2 transition-transform">02</div>
                <h3 className="text-lg font-serif italic text-white mb-3">Analyze</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-light">
                   AEGIS-PRIME correlates disparate logs into structured attack narratives, providing surgical clarity during chaos.
                </p>
            </div>
            <div className="group">
                <div className="text-blue-500 font-mono text-3xl mb-4 group-hover:translate-x-2 transition-transform">03</div>
                <h3 className="text-lg font-serif italic text-white mb-3">Neutralize</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-light">
                   Autonomous remediation workflows isolate infected hosts and block malicious identities with sub-second latency.
                </p>
            </div>
        </section>

        {/* Final CTA */}
        <section className="mt-40 mb-20 text-center relative py-32 overflow-hidden rounded-3xl border border-white/5 bg-slate-900/20">
           <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
           <div className="relative z-10 space-y-8">
              <h2 className="text-5xl md:text-7xl font-serif italic text-white">Ready for Command?</h2>
              <p className="text-slate-400 max-w-sm mx-auto text-sm">Join the network of autonomous defensive cores protected by Aegis-Prime.</p>
              <Button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                variant="outline" 
                className="h-14 px-10 border-white/10 hover:bg-white/5 rounded-full text-[10px] font-mono tracking-widest uppercase"
              >
                Return to Surface Input
              </Button>
           </div>
        </section>
      </main>

      <footer className="relative z-10 px-8 py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
           <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Shield size={24} className="text-blue-500" />
                <span className="text-xl font-serif italic tracking-tighter text-blue-500">AEGIS-PRIME</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                The world's first decentralised autonomous security operations center. Powered by neural inference and zero-trust primitives.
              </p>
           </div>
           <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-6">Capabilities</h4>
              <ul className="space-y-3 text-[10px] font-mono text-slate-500">
                 <li className="hover:text-blue-400 cursor-pointer">Kernel Intercept</li>
                 <li className="hover:text-blue-400 cursor-pointer">Adversarial ML</li>
                 <li className="hover:text-blue-400 cursor-pointer">Encrypted Trails</li>
              </ul>
           </div>
           <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-6">Legal</h4>
              <ul className="space-y-3 text-[10px] font-mono text-slate-500">
                 <li className="hover:text-blue-400 cursor-pointer">Protocol Terms</li>
                 <li className="hover:text-blue-400 cursor-pointer">Privacy Node</li>
                 <li className="hover:text-blue-400 cursor-pointer">Audit Rights</li>
              </ul>
           </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-white/5">
          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.3em]">
            © 2026 AEGIS DEFENSE SYSTEMS // [EST 04.22.88] // ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-8">
             <Terminal size={14} className="text-slate-600 hover:text-blue-400 cursor-pointer transition-colors" />
             <Globe size={14} className="text-slate-600 hover:text-blue-400 cursor-pointer transition-colors" />
             <Server size={14} className="text-slate-600 hover:text-blue-400 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
