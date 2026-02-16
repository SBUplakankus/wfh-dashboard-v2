
import React, { useEffect } from 'react';
import { Toast } from '../types';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastSystemProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastSystem: React.FC<ToastSystemProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => onRemove(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, 3000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-[#0d0e10]/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl min-w-[280px]"
    >
      {icons[toast.type]}
      <p className="text-xs font-medium text-neutral-200 flex-1">{toast.message}</p>
      <button onClick={onRemove} className="text-neutral-600 hover:text-white transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

export default ToastSystem;
