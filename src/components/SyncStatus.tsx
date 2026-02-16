import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';

interface SyncStatusProps {
  autoRefreshInterval?: number; // in seconds
  onRefresh?: () => Promise<void>;
}

const SyncStatus: React.FC<SyncStatusProps> = ({ 
  autoRefreshInterval = 30,
  onRefresh 
}) => {
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'success' | 'error' | 'idle'>('idle');
  const [timeAgo, setTimeAgo] = useState('Just now');

  // Update time ago string
  useEffect(() => {
    const updateTimeAgo = () => {
      const seconds = Math.floor((Date.now() - lastSyncTime.getTime()) / 1000);
      
      if (seconds < 60) {
        setTimeAgo('Just now');
      } else if (seconds < 120) {
        setTimeAgo('1 minute ago');
      } else if (seconds < 3600) {
        setTimeAgo(`${Math.floor(seconds / 60)} minutes ago`);
      } else if (seconds < 7200) {
        setTimeAgo('1 hour ago');
      } else {
        setTimeAgo(`${Math.floor(seconds / 3600)} hours ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [lastSyncTime]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefreshInterval) return;

    const interval = setInterval(() => {
      handleSync();
    }, autoRefreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefreshInterval]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('idle');

    try {
      // Simulate sync operation
      if (onRefresh) {
        await onRefresh();
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setLastSyncTime(new Date());
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
      {syncStatus === 'success' && (
        <Check className="w-3.5 h-3.5 text-green-500" />
      )}
      {syncStatus === 'error' && (
        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
      )}
      
      <span>
        {syncStatus === 'success' && 'Synced'}
        {syncStatus === 'error' && 'Sync failed'}
        {syncStatus === 'idle' && `Last synced: ${timeAgo}`}
      </span>

      <button
        onClick={handleSync}
        disabled={isSyncing}
        className="p-1 hover:bg-white/[0.05] rounded transition-colors disabled:opacity-50"
        title="Sync now"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};

export default SyncStatus;
