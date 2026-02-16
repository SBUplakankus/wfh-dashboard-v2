import React, { useState, useEffect } from 'react';
import { Clock, FileText, BookOpen, CheckSquare, ArrowRight } from 'lucide-react';

interface RecentItem {
  id: string;
  type: 'file' | 'note' | 'task';
  title: string;
  subtitle?: string;
  timestamp: Date;
}

interface RecentItemsWidgetProps {
  maxItems?: number;
}

const RecentItemsWidget: React.FC<RecentItemsWidgetProps> = ({ maxItems = 5 }) => {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    // Mock recent items - in real implementation, this would track actual user activity
    const mockRecentItems: RecentItem[] = [
      {
        id: '1',
        type: 'file',
        title: 'API Reference',
        subtitle: 'docs/api/reference.md',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      },
      {
        id: '2',
        type: 'note',
        title: 'Sprint Planning Notes',
        subtitle: 'Project Notes',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      },
      {
        id: '3',
        type: 'task',
        title: 'Implement file browser UI',
        subtitle: 'Completed',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
      {
        id: '4',
        type: 'file',
        title: 'Getting Started',
        subtitle: 'docs/getting-started/index.md',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
      {
        id: '5',
        type: 'note',
        title: 'Architecture Decisions',
        subtitle: 'Project Notes',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
    ];

    setRecentItems(mockRecentItems.slice(0, maxItems));
  }, [maxItems]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <FileText className="w-4 h-4" style={{ color: '#10b981' }} />;
      case 'note':
        return <BookOpen className="w-4 h-4" style={{ color: '#3b82f6' }} />;
      case 'task':
        return <CheckSquare className="w-4 h-4" style={{ color: '#8b5cf6' }} />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleItemClick = (item: RecentItem) => {
    console.log('Navigate to recent item:', item);
    // In real implementation, this would navigate to the item
  };

  if (recentItems.length === 0) {
    return null;
  }

  return (
    <div
      className="p-4 rounded-xl border border-white/[0.05]"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: 'var(--radius)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
        <h3 className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          Recent Items
        </h3>
      </div>

      <div className="space-y-1">
        {recentItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className="w-full p-2.5 flex items-center gap-3 rounded-lg hover:bg-white/[0.02] transition-colors group"
          >
            <div className="flex-shrink-0">
              {getIcon(item.type)}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-[12px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {item.title}
              </div>
              {item.subtitle && (
                <div className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                  {item.subtitle}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                {getTimeAgo(item.timestamp)}
              </span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-secondary)' }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentItemsWidget;
