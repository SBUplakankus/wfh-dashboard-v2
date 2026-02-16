import React, { useMemo, useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, Target, Clock, Activity, Eye, EyeOff, Settings
} from 'lucide-react';
import { mockKanriTasks } from '../mockData';
import { KanriTask } from '../types';

interface AnalyticsViewProps {
  currentProjectId?: string;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ currentProjectId }) => {
  // Chart visibility state
  const [visibleCharts, setVisibleCharts] = useState({
    burndown: true,
    velocity: true,
    taskDistribution: true,
    cycleTime: true,
    dailyActivity: true,
  });

  // Calculate analytics from real task data
  const analytics = useMemo(() => {
    const tasks = mockKanriTasks || [];
    
    // Task breakdown by column
    const tasksByColumn = tasks.reduce((acc, task) => {
      acc[task.column] = (acc[task.column] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Priority distribution
    const priorityDist = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Completion rate
    const completedTasks = tasks.filter(t => t.column === 'Done').length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Tasks in progress
    const inProgressTasks = tasks.filter(t => t.column === 'In Progress').length;

    // High priority tasks
    const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;

    // Generate mock velocity data (last 4 weeks)
    const velocityData = [
      { week: 'Week 1', completed: 8, planned: 10 },
      { week: 'Week 2', completed: 12, planned: 10 },
      { week: 'Week 3', completed: 9, planned: 10 },
      { week: 'Week 4', completed: completedTasks, planned: 10 }
    ];

    // Generate mock burndown data (14 days)
    const burndownData = [];
    const startTasks = totalTasks + completedTasks;
    for (let i = 0; i <= 14; i++) {
      const ideal = startTasks - (startTasks / 14) * i;
      const actual = startTasks - (completedTasks / 14) * i * (0.8 + Math.random() * 0.4);
      burndownData.push({
        day: `Day ${i}`,
        ideal: Math.max(0, ideal),
        actual: Math.max(0, actual)
      });
    }

    // Task breakdown for pie chart
    const taskBreakdown = [
      { name: 'To Do', value: tasksByColumn['To Do'] || 0, color: '#6366f1' },
      { name: 'In Progress', value: tasksByColumn['In Progress'] || 0, color: '#f59e0b' },
      { name: 'Review', value: tasksByColumn['Review'] || 0, color: '#8b5cf6' },
      { name: 'Done', value: tasksByColumn['Done'] || 0, color: '#10b981' }
    ];

    // Cycle time simulation (days to complete)
    const cycleTimeData = [
      { range: '0-2 days', count: 4 },
      { range: '3-5 days', count: 8 },
      { range: '6-10 days', count: 3 },
      { range: '10+ days', count: 1 }
    ];

    // Daily activity (last 7 days)
    const dailyActivity = [
      { day: 'Mon', created: 2, completed: 3 },
      { day: 'Tue', created: 3, completed: 2 },
      { day: 'Wed', created: 1, completed: 4 },
      { day: 'Thu', created: 4, completed: 2 },
      { day: 'Fri', created: 2, completed: 5 },
      { day: 'Sat', created: 0, completed: 1 },
      { day: 'Sun', created: 1, completed: 0 }
    ];

    return {
      tasksByColumn,
      priorityDist,
      completionRate,
      totalTasks,
      completedTasks,
      inProgressTasks,
      highPriorityTasks,
      velocityData,
      burndownData,
      taskBreakdown,
      cycleTimeData,
      dailyActivity
    };
  }, []);

  // Stats cards data - clean, no trends or emojis
  const stats = [
    {
      label: 'Completion Rate',
      value: `${analytics.completionRate.toFixed(0)}%`,
      icon: <Target className="w-5 h-5" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Tasks Completed',
      value: analytics.completedTasks,
      icon: <Activity className="w-5 h-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'In Progress',
      value: analytics.inProgressTasks,
      icon: <Clock className="w-5 h-5" />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'High Priority',
      value: analytics.highPriorityTasks,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    }
  ];

  const toggleChart = (chartName: keyof typeof visibleCharts) => {
    setVisibleCharts(prev => ({
      ...prev,
      [chartName]: !prev[chartName]
    }));
  };

  const chartControls = [
    { id: 'burndown', label: 'Sprint Burndown', icon: TrendingUp },
    { id: 'velocity', label: 'Velocity Trends', icon: Activity },
    { id: 'taskDistribution', label: 'Task Distribution', icon: Target },
    { id: 'cycleTime', label: 'Cycle Time', icon: Clock },
    { id: 'dailyActivity', label: 'Daily Activity', icon: Activity },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
          <p className="text-sm text-gray-400">Performance metrics and insights</p>
        </div>
        
        {/* Chart Visibility Controls */}
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 mr-2">Visible Charts:</span>
          <div className="flex gap-1">
            {chartControls.map(chart => (
              <button
                key={chart.id}
                onClick={() => toggleChart(chart.id as keyof typeof visibleCharts)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  visibleCharts[chart.id as keyof typeof visibleCharts]
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-800 text-gray-500 border border-gray-700'
                }`}
                title={visibleCharts[chart.id as keyof typeof visibleCharts] ? 'Hide chart' : 'Show chart'}
              >
                {visibleCharts[chart.id as keyof typeof visibleCharts] ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary - Simple and Clean */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-medium text-white mb-2">Summary</h3>
        <p className="text-sm text-gray-400">
          {analytics.totalTasks} total tasks: {analytics.completedTasks} completed ({analytics.completionRate.toFixed(0)}%), {analytics.inProgressTasks} in progress, {analytics.highPriorityTasks} high priority.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <div className={stat.color}>{stat.icon}</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid - Only show selected charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sprint Burndown Chart */}
        {visibleCharts.burndown && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Sprint Burndown</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={analytics.burndownData}>
                <defs>
                  <linearGradient id="colorIdeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="ideal" 
                  stroke="#6366f1" 
                  fillOpacity={1}
                  fill="url(#colorIdeal)"
                  name="Ideal"
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#10b981" 
                  fillOpacity={1}
                  fill="url(#colorActual)"
                  name="Actual"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Velocity Chart */}
        {visibleCharts.velocity && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">Velocity Trends</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar dataKey="planned" fill="#6366f1" name="Planned" radius={[8, 8, 0, 0]} />
                <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-2">
              Average: {(analytics.velocityData.reduce((sum, d) => sum + d.completed, 0) / analytics.velocityData.length).toFixed(1)} tasks/week
            </p>
          </div>
        )}

        {/* Task Breakdown Pie Chart */}
        {visibleCharts.taskDistribution && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Task Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics.taskBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {analytics.taskBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {analytics.taskBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-400">
                    {item.name}: <span className="text-white font-medium">{item.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cycle Time Distribution */}
        {visibleCharts.cycleTime && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold text-white">Cycle Time Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.cycleTimeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis type="category" dataKey="range" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-2">
              Most tasks complete in 3-5 days
            </p>
          </div>
        )}

        {/* Daily Activity */}
        {visibleCharts.dailyActivity && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">Daily Activity</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="created" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  name="Created"
                  dot={{ fill: '#6366f1', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Completed"
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsView;
