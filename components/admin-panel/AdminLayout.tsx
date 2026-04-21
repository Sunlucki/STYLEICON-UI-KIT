import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Settings, Bell, Search, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavigationItem, UserProfile } from './types';

export interface AdminLayoutProps {
  /** The brand name or logo to display in the sidebar header */
  brandName?: React.ReactNode;
  /** Main navigation items */
  navigation: NavigationItem[];
  /** Current active path to highlight the active menu item */
  currentPath?: string;
  /** User profile info for the top-right corner or sidebar footer */
  user?: UserProfile;
  /** Content of the admin page */
  children: React.ReactNode;
  /** Callback for when a nav item is clicked */
  onNavigate: (href: string) => void;
  /** Callback for logout action */
  onLogout?: () => void;
  /** Callback for notifications click */
  onNotificationsClick?: () => void;
  /** Pass a custom right-header component (e.g. for language switcher, theme toggle) */
  headerActions?: React.ReactNode;
}

export function AdminLayout({
  brandName = "Admin Dashboard",
  navigation,
  currentPath = "/admin/dashboard",
  user,
  children,
  onNavigate,
  onLogout,
  onNotificationsClick,
  headerActions,
}: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Lock body scroll on mobile when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const NavContent = () => (
    <div className="flex flex-col h-full py-4 overflow-y-auto w-full">
      <div className="px-6 mb-8 text-xl font-bold tracking-tight text-foreground truncate min-h-[32px] flex items-center">
        {brandName}
      </div>

      <nav className="flex-1 px-4 space-y-1.5 w-full">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath.startsWith(item.href);

          return (
            <button
              key={item.name}
              onClick={() => {
                onNavigate(item.href);
                setIsSidebarOpen(false);
              }}
              className={cn(
                'flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('w-5 h-5 transition-transform group-hover:scale-110', isActive ? 'text-primary-foreground' : '')} strokeWidth={2} />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={cn(
                  'px-2 py-0.5 text-xs font-bold rounded-full min-w-[24px] text-center',
                  isActive ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'
                )}>
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {user && (
        <div className="mt-auto px-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-muted/30">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0 uppercase font-bold text-primary border border-primary/30">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.role || user.email}</p>
            </div>
            {onLogout && (
              <button onClick={onLogout} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/20 font-sans text-foreground flex">
      {/* Mobile Top Header */}
      <header className="lg:hidden fixed top-0 w-full z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="font-bold tracking-tight text-foreground truncate max-w-[60%] text-lg">
            {brandName}
          </div>
          <div className="flex items-center gap-2">
            {headerActions}
            <button
              onClick={toggleSidebar}
              className="p-2 -mr-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-border/40 shadow-2xl lg:hidden flex flex-col"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-background border-r border-border/40 shadow-sm shrink-0">
        <NavContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header */}
        <header className="hidden lg:flex sticky top-0 z-30 h-16 items-center justify-between px-8 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="flex-1 flex items-center">
            {/* Optional Search Bar */}
            <div className="max-w-md w-full relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border-transparent rounded-full text-sm focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {headerActions}
            {onNotificationsClick && (
              <button 
                onClick={onNotificationsClick}
                className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive border-2 border-background" />
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 w-full max-w-[1600px] mx-auto overflow-x-hidden">
          <div className="w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;