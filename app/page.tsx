'use client';

import { Bubble } from "@typebot.io/react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-20">
      
      {/* 1. Navegación */}
      <nav className="p-6 flex justify-between items-center border-b border-slate-800 backdrop-blur-md sticky top-0 z-50 bg-[#0f172a]/80">
        <span className="text-2xl tracking-tighter">
          <span className="font-extrabold text-white">KHAZ</span>
          <span className="font-light text-blue-400">ONLI</span>
          <span className="ml-2 text-xs font-mono text-slate-500 uppercase tracking-widest">Ops</span>
        </span>
        <div className="space-x-6 text-sm font-medium">
          <a href="#proyectos" className="hover:text-blue-400 transition">Proyectos</a>
          <a href="mailto:tu-email@ejemplo.com" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition">
            Contacto
          </a>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="max-w-4xl mx-auto pt-24 pb-12 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Optimizando Operaciones con <span className="text-blue-500">Ingeniería y Código</span>
        </h1>
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
          Ingeniero Industrial especializado en automatización de procesos, 
          gestión de finanzas digitales y despliegue de soluciones tech.
        </p>
        <div className="flex justify-center gap-4 mb-20">
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 w-40">
            <p className="text-blue-400 font-bold text-xl">100%</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Automatizado</p>
          </div>
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 w-40">
            <p className="text-emerald-400 font-bold text-xl">P2P Expert</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Fintech Ops</p>
          </div>
        </div>
      </section>

      {/* 3. Casos de Éxito (Khazonli) */}
      <section id="proyectos" className="max-w-5xl mx-auto px-6 mb-20">
        <div className="flex flex-col md:flex-row gap-12 items-center bg-slate-800/30 p-10 rounded-[2rem] border border-slate-700/50 backdrop-blur-sm">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="text-blue-400 font-mono text-xs tracking-widest uppercase">Proyecto Principal</span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Ecosistema de Exchange & Servicios Digitales</h2>
            <p className="text-slate-400 leading-relaxed">
              Optimización del modelo operativo de <span className="text-white font-semibold italic">Khazonli.es</span> mediante flujos automatizados, 
              mejorando la eficiencia de atención en un <span className="text-emerald-400 font-bold">85%</span>.
            </p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                Lógica de precios dinámica para mercados P2P.
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                Triaje automatizado vía Typebot.
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/2 bg-slate-900/80 h-72 rounded-2xl border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
            <span className="text-slate-500 font-mono text-sm italic">Visual: System Architecture Flow</span>
          </div>
        </div>
      </section>

      {/* 4. Tech Stack */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h3 className="text-center text-slate-500 uppercase tracking-widest text-xs font-mono mb-10">Infraestructura Tecnológica</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Next.js / React', 'Typebot / IA', 'Meta Ads', 'Ingeniería Ops'].map((skill, i) => (
            <div key={i} className="p-6 bg-slate-800/20 border border-slate-700/50 rounded-2xl text-center hover:border-blue-500/50 transition">
              <p className="text-white font-semibold">{skill}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 mt-20">
        <p className="text-slate-500 text-sm">
          © 2026 KHAZ ONLI Ops. Robert Malave | Ingeniero Industrial.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-slate-400 hover:text-white transition text-sm">LinkedIn</a>
          <a href="#" className="text-slate-400 hover:text-white transition text-sm">GitHub</a>
          <a href="mailto:tu-email@ejemplo.com" className="text-blue-400 hover:underline text-sm font-medium">Contactar vía Email</a>
        </div>
      </footer>

      {/* 6. Terminal Typebot */}
      <Bubble
        typebot="khaz-onli-ops-t2jkawp"
        previewMessage={{
          text: "Terminal Operativa. ¿Iniciamos el diagnóstico?",
          autoShowDelay: 3000,
        }}
        theme={{ 
          button: { backgroundColor: "#2563eb", iconColor: "#FFFFFF" },
          previewMessage: { backgroundColor: "#1e293b", textColor: "#FFFFFF" }
        }}
      />
    </main>
  );
}