"use client";

import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CalendarDays, 
  Sparkles, 
  CheckSquare, 
  Settings,
  ChevronRight,
  LogOut,
  Upload
} from 'lucide-react';
import { currentUser } from '@/data/mockData';

interface SidebarProps {
  activeTab?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'dashboard' }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: '4' },
    { id: 'upload', label: 'Upload Meeting', icon: Upload, badge: 'New' },
    { id: 'meetings', label: 'Meetings', icon: CalendarDays, badge: '12' },
    { id: 'commitments', label: 'Commitments', icon: CheckSquare, badge: '5' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen select-none">
      {/* Upper Section */}
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>
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
              const href = 
                item.id === 'dashboard' ? '/' : 
                item.id === 'projects' ? '/projects' : 
                (item.id === 'upload' || item.id === 'meetings') ? '/meetings/upload' : '#';
              return (
                <Link
                  key={item.id}
                  href={href}
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

        {/* Hackathon Demo Highlight Card */}
        <div className="mx-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Active Demo
            </span>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/60 px-1.5 py-0.5 rounded font-mono">
              APOLLO
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Project Apollo is loaded with real-time meeting insights & commitment tracking.
          </p>
        </div>
      </div>

      {/* User / Profile Section */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shadow-inner">
                {currentUser.initials}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {currentUser.role}
              </p>
            </div>
          </div>
          <Settings className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </div>
      </div>
    </aside>
  );
};
