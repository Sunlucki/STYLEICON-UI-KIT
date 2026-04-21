import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, Users, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StatData, RecentActivity } from './types';

export interface AdminDashboardProps {
  /** Page title */
  title?: string;
  /** Subtitle or date range */
  subtitle?: string;
  /** Statistics for the top cards */
  stats: StatData[];
  /** Recent activities, orders, or leads for the table */
  recentActivities: RecentActivity[];
  /** Custom children to append below the dashboard (charts, etc) */
  children?: React.ReactNode;
}

export function AdminDashboard({
  title = "Dashboard Overview",
  subtitle = "Welcome back, here's what's happening today.",
  stats,
  recentActivities,
  children,
}: AdminDashboardProps) {

  const getStatusColor = (color: RecentActivity['statusColor']) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50';
      case 'blue': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50';
      case 'red': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50';
      case 'purple': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50';
      case 'orange': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex gap-2">
          {/* Slot for action buttons like "Download Report", "Add New" etc. */}
          <button className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors">
            Export
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors">
            New Campaign
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="bg-card border border-border/40 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Background glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            
            <div className="mt-4 flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {stat.value}
              </h3>
            </div>
            
            {stat.change && (
              <div className="mt-2 flex items-center text-xs">
                {stat.changeType === 'positive' && <ArrowUpRight className="w-3.5 h-3.5 text-green-500 mr-1" />}
                {stat.changeType === 'negative' && <ArrowDownRight className="w-3.5 h-3.5 text-red-500 mr-1" />}
                {stat.changeType === 'neutral' && <Minus className="w-3.5 h-3.5 text-muted-foreground mr-1" />}
                
                <span className={cn(
                  'font-medium',
                  stat.changeType === 'positive' && 'text-green-600 dark:text-green-400',
                  stat.changeType === 'negative' && 'text-red-600 dark:text-red-400',
                  stat.changeType === 'neutral' && 'text-muted-foreground'
                )}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground/70 ml-1">vs last month</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Activity Table */}
          <div className="bg-card border border-border/40 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border/40 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Recent Activity</h2>
              <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                View all
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/40">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium">Activity</th>
                    <th scope="col" className="px-6 py-4 font-medium">Status</th>
                    <th scope="col" className="px-6 py-4 font-medium">Amount</th>
                    <th scope="col" className="px-6 py-4 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {recentActivities.map((activity, i) => (
                    <motion.tr 
                      key={activity.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + (i * 0.05) }}
                      className="hover:bg-muted/20 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{activity.title}</span>
                          <span className="text-xs text-muted-foreground mt-0.5">{activity.subtitle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn('px-2.5 py-1 text-[11px] font-semibold tracking-wide rounded-full', getStatusColor(activity.statusColor))}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium font-mono text-foreground/80">
                        {activity.amount || '-'}
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground/80">
                        {activity.date}
                      </td>
                    </motion.tr>
                  ))}
                  {recentActivities.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                        No recent activity found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Custom Children Slot (e.g. Charts) */}
          {children}
        </div>

        {/* Sidebar Area (1/3 width on desktop) */}
        <div className="space-y-6">
          <div className="bg-card border border-border/40 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase text-muted-foreground mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Add New Product', icon: Package },
                { label: 'Manage Users', icon: Users },
                { label: 'View Latest Orders', icon: ShoppingCart },
                { label: 'Generate P&L Report', icon: DollarSign },
              ].map((action, i) => (
                <button key={i} className="w-full flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-muted hover:border-primary/40 group transition-all text-left text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <action.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <span className="text-foreground group-hover:text-primary transition-colors">{action.label}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold tracking-tight text-primary uppercase mb-2">
              System Status
            </h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              All services are operational. Last backup was performed 2 hours ago.
            </p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Database CPU Load</span>
                  <span className="text-muted-foreground">24%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary/60 rounded-full w-[24%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Storage Usage</span>
                  <span className="text-muted-foreground">68%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500/60 rounded-full w-[68%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;