import React, { useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, Target, Clock, Award, Zap, CheckCircle, 
  AlertCircle, Activity, Calendar
} from 'lucide-react';
import { mockKanriTasks } from '../mockData';
import { KanriTask } from '../types';

interface AnalyticsViewProps {
  currentProjectId?: string;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ currentProjectId }) => {
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

  // Stats cards data
  const stats = [
    {
      label: 'Completion Rate',
      value: `${analytics.completionRate.toFixed(0)}%`,
      icon: <Target className="w-5 h-5" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      trend: '+5%',
      trendUp: true
    },
    {
      label: 'Tasks Completed',
      value: analytics.completedTasks,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      trend: '+12',
      trendUp: true
    },
    {
      label: 'In Progress',
      value: analytics.inProgressTasks,
      icon: <Activity className="w-5 h-5" />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      trend: '-2',
      trendUp: false
    },
    {
      label: 'High Priority',
      value: analytics.highPriorityTasks,
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      trend: '0',
      trendUp: null
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Project Analytics</h1>
          <p className="text-gray-400">Track your progress and performance metrics</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <div className={stat.color}>{stat.icon}</div>
              </div>
              {stat.trend && (
                <span className={`text-xs font-medium ${
                  stat.trendUp === true ? 'text-green-400' : 
                  stat.trendUp === false ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {stat.trend}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sprint Burndown Chart */}
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
          <p className="text-xs text-gray-500 mt-2">
            {analytics.burndownData[analytics.burndownData.length - 1].actual < 
             analytics.burndownData[analytics.burndownData.length - 1].ideal
              ? '✅ On track! You\'re ahead of schedule.'
              : '⚠️ Slightly behind. Consider prioritizing remaining tasks.'}
          </p>
        </div>

        {/* Velocity Chart */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-400" />
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
            Average velocity: {(analytics.velocityData.reduce((sum, d) => sum + d.completed, 0) / analytics.velocityData.length).toFixed(1)} tasks/week
          </p>
        </div>

        {/* Task Breakdown Pie Chart */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-purple-400" />
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

        {/* Cycle Time Distribution */}
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
            Most tasks complete in 3-5 days. Average: 4.2 days
          </p>
        </div>

        {/* Daily Activity */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">Daily Activity (Last 7 Days)</h2>
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
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Productivity Insight</span>
            </div>
            <p className="text-sm text-gray-300 mt-1">
              You completed more tasks than you created this week! Great job staying ahead. 🎉
            </p>
          </div>
        </div>
      </div>

      {/* Motivation Section */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Award className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Keep Up the Great Work!</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>✨ You're {analytics.completionRate > 50 ? 'more than halfway' : 'making progress'} through your current sprint</p>
              <p>🔥 {analytics.completedTasks > 5 ? 'Impressive streak!' : 'Keep going!'} {analytics.completedTasks} tasks completed</p>
              <p>⚡ Your velocity is {analytics.velocityData[3].completed >= analytics.velocityData[3].planned ? 'on target' : 'improving'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
