import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

type HeaderProps = {
  title: string;
  onOpenSettings: () => void;
};

const Header = ({ title, onOpenSettings }: HeaderProps) => (
  <motion.header
    className="md3-card flex items-center justify-between px-6 py-5"
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.22, ease: 'easeOut' }}
  >
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight text-md3-on-surface">{title}</h1>
      <p className="text-sm text-md3-on-surface-variant">Game Dev Unified Dashboard v2</p>
    </div>
    <button className="md3-button h-9 w-9 p-0" aria-label="Open settings" onClick={onOpenSettings} type="button">
      <Settings size={16} aria-hidden="true" />
    </button>
  </motion.header>
);

export default Header;
