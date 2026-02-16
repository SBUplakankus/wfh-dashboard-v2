
import React from 'react';
import { ThemeConfig } from '../types';
import { Palette, Type, Grid, Box, Layers, Zap } from 'lucide-react';

interface DesignSystemViewProps {
  theme: ThemeConfig;
}

const DesignSystemView: React.FC<DesignSystemViewProps> = ({ theme }) => {
  const spacing = [4, 8, 12, 16, 24, 32, 48, 64, 80, 96];
  const shadows = [
    { name: 'Subtle', class: 'shadow-sm', desc: 'Used for small UI elements' },
    { name: 'Card', class: 'shadow-md', desc: 'Used for primary containers' },
    { name: 'Floating', class: 'shadow-xl', desc: 'Used for modals and tooltips' },
    { name: 'Accent', class: 'shadow-2xl', desc: 'Used for active focus states' }
  ];

  return (
    <div className="p-12 max-w-[1200px] mx-auto space-y-20 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Design System</h1>
        <p className="text-lg text-neutral-500 max-w-2xl">A comprehensive guide to the visual language of the GameDev Dashboard.</p>
      </header>

      {/* 1. Color Palette */}
      <section>
        <h2 className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
          <Palette className="w-4 h-4" /> 01. Color Palette
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Background', hex: theme.background, desc: 'Primary application surface' },
            { label: 'Card Surface', hex: theme.cardBackground, desc: 'Elevated container surface' },
            { label: 'Accent Color', hex: theme.accent, desc: 'Primary interaction / Focus' },
            { label: 'Border Line', hex: theme.border, desc: 'Structural separation' },
            { label: 'Text Primary', hex: theme.textPrimary, desc: 'Headings and labels' },
            { label: 'Text Secondary', hex: theme.textSecondary, desc: 'Body and metadata' },
            { label: 'Success', hex: '#10b981', desc: 'Positive actions / states' },
            { label: 'Error', hex: '#ef4444', desc: 'Critical alerts / failure' },
          ].map((color) => (
            <div key={color.label} className="space-y-3">
              <div className="h-24 rounded-2xl border border-white/10 shadow-lg flex items-center justify-center font-mono text-[10px]" style={{ backgroundColor: color.hex }}>
                <span className="mix-blend-difference opacity-50">{color.hex}</span>
              </div>
              <div>
                <p className="text-sm font-bold">{color.label}</p>
                <p className="text-[11px] text-neutral-500 leading-relaxed">{color.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography */}
      <section>
        <h2 className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
          <Type className="w-4 h-4" /> 02. Typography
        </h2>
        <div className="space-y-8 bg-white/[0.02] border border-white/5 rounded-2xl p-8">
          <div className="flex items-baseline gap-12 border-b border-white/5 pb-8">
            <span className="text-neutral-500 text-[10px] w-24 uppercase tracking-widest font-bold">Heading 1</span>
            <span className="text-4xl font-bold tracking-tight">System Core Engine</span>
          </div>
          <div className="flex items-baseline gap-12 border-b border-white/5 pb-8">
            <span className="text-neutral-500 text-[10px] w-24 uppercase tracking-widest font-bold">Heading 2</span>
            <span className="text-2xl font-semibold">Workspace Overview</span>
          </div>
          <div className="flex items-baseline gap-12 border-b border-white/5 pb-8">
            <span className="text-neutral-500 text-[10px] w-24 uppercase tracking-widest font-bold">Body</span>
            <span className="text-sm leading-relaxed text-neutral-400 max-w-lg">
              Inter is a variable font family carefully crafted & designed for computer screens. It features a tall x-height to aid in readability of mixed-case and lower-case text.
            </span>
          </div>
          <div className="flex items-baseline gap-12">
            <span className="text-neutral-500 text-[10px] w-24 uppercase tracking-widest font-bold">Mono</span>
            <span className="text-xs font-mono text-blue-400">09:30 AM — standup_log_v2.json</span>
          </div>
        </div>
      </section>

      {/* 3. Spacing Scale */}
      <section>
        <h2 className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
          <Grid className="w-4 h-4" /> 03. Spacing Scale
        </h2>
        <div className="flex items-end gap-1 px-4 py-12 bg-black/40 rounded-2xl border border-white/5">
          {spacing.map((size) => (
            <div key={size} className="flex flex-col items-center gap-4">
              <div className="bg-blue-500/20 border border-blue-500/40 rounded-sm" style={{ width: size, height: size }} />
              <span className="text-[10px] font-mono text-neutral-600">{size}px</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Component Patterns */}
      <section>
        <h2 className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
          <Box className="w-4 h-4" /> 04. Interaction Patterns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-sm font-bold flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> Button Styles</h3>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all">PRIMARY</button>
              <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-xl hover:bg-white/10 active:scale-95 transition-all">SECONDARY</button>
              <button className="px-6 py-2.5 text-neutral-500 text-xs font-bold rounded-xl hover:text-white transition-all">GHOST</button>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-sm font-bold flex items-center gap-2"><Layers className="w-3.5 h-3.5" /> Elevation Levels</h3>
            <div className="grid grid-cols-2 gap-4">
              {shadows.map(s => (
                <div key={s.name} className={`p-4 rounded-2xl bg-white/[0.02] border border-white/5 ${s.class}`}>
                  <p className="text-[11px] font-bold mb-1">{s.name}</p>
                  <p className="text-[9px] text-neutral-600 leading-tight">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(DesignSystemView);
