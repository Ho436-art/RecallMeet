"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CalendarDays, 
  Sparkles, 
  CheckSquare, 
  LogOut,
  Upload
} from 'lucide-react';
import { apiGet, clearAuthToken } from '@/lib/api';
import { User, Project, Commitment } from '@/lib/types';

interface SidebarProps {
  activeTab?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'dashboard' }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [counts, setCounts] = useState<{
    projects: number;
    commitments: number;
  }>({ projects: 0, commitments: 0 });

  useEffect(() => {
    async function loadSidebarData() {
      try {
        const [me, projects, commitments] = await Promise.all([
          apiGet<User>('/auth/me').catch(() => null),
          apiGet<Project[]>('/projects').catch(() => [] as Project[]),
          apiGet<Commitment[]>('/commitments').catch(() => [] as Commitment[])
        ]);

        if (me) setUser(me);
        const pending = commitments.filter(c => c.status === 'pending').length;
        setCounts({
          projects: projects.length,
          commitments: pending
        });
      } catch (err) {
        console.error('Failed to load user info in sidebar:', err);
      }
    }

    loadSidebarData();
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    router.replace('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null, href: '/' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: counts.projects > 0 ? String(counts.projects) : null, href: '/projects' },
    { id: 'prepare', label: 'Prepare Me', icon: Sparkles, badge: 'AI', href: '/prepare' },
    { id: 'upload', label: 'Upload Meeting', icon: Upload, badge: 'New', href: '/meetings/upload' },
    { id: 'commitments', label: 'Commitments', icon: CheckSquare, badge: counts.commitments > 0 ? String(counts.commitments) : null, href: '/commitments' },
  ];

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'RM';

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen select-none">
      {/* Upper Section */}
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-lg tracking-tight leading-none flex items-center gap-1.5">
                RecallMeet
              </h1>
              <span className="text-[10px] font-medium text-indigo-400 uppercase tracking-widest">
                AI Sync Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="px-3 py-6">
          <p className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeTab;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                      isActive 
                        ? 'bg-indigo-500/30 text-indigo-300' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System Memory Status Card */}
        <div className="mx-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Memory Loop
            </span>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/60 px-1.5 py-0.5 rounded font-mono">
              ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Connected to Hindsight long-term memory engine.
          </p>
        </div>
      </div>

      {/* User / Profile Section */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shadow-inner">
                {initials}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-sm font-semibold text-slate-200 truncate">
                {user?.name || 'Logged in user'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || 'User'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
