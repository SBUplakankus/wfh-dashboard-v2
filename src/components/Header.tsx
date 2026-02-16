import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

type HeaderProps = {
  title: string;
  onOpenSettings: () => void;
};

const Header = ({ title, onOpenSettings }: HeaderProps) => (
  <motion.header
    className="flex h-16 items-center justify-between border-b border-md3-outline px-6"
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.22, ease: 'easeOut' }}
  >
    <div className="space-y-0.5">
      <h1 className="text-lg font-bold tracking-tight text-md3-on-surface">{title}</h1>
      <p className="text-[11px] font-medium text-md3-on-surface-variant">Game Dev Unified Dashboard v2</p>
    </div>
    <button className="md3-button h-8 w-8 p-0" aria-label="Open settings" onClick={onOpenSettings} type="button">
      <Settings size={16} aria-hidden="true" />
    </button>
  </motion.header>
);

export default Header;
