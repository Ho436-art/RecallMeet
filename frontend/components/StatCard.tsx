"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderKanban, CalendarDays, CheckSquare, TrendingUp, LucideIcon } from 'lucide-react';
import { apiGet } from '@/lib/api';
import { Project, Meeting, Commitment } from '@/lib/types';

interface StatItemProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  colorScheme: 'indigo' | 'emerald' | 'amber';
  accentBadge?: string;
  href: string;
}

const StatItem: React.FC<StatItemProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme,
  accentBadge,
  href
}) => {
  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      border: 'border-indigo-500/20',
      glow: 'shadow-indigo-500/5'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      glow: 'shadow-emerald-500/5'
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
      glow: 'shadow-amber-500/5'
    }
  }[colorScheme];

  return (
    <Link href={href} className={`block p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-lg ${colorClasses.glow} hover:border-slate-700 transition-all duration-200 group`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider group-hover:text-slate-200 transition-colors">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${colorClasses.bg} ${colorClasses.border} border`}>
          <Icon className={`w-4 h-4 ${colorClasses.text}`} />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-slate-100 tracking-tight">
          {value}
        </span>
        {accentBadge && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${colorClasses.bg} ${colorClasses.text} border ${colorClasses.border}`}>
            {accentBadge}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
        <TrendingUp className="w-3 h-3 text-slate-500" />
        {subtitle}
      </p>
    </Link>
  );
};

export const DashboardStatsGrid: React.FC = () => {
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalMeetings: 0,
    pendingCommitments: 0,
    primaryProject: 'Active Projects',
    firstProjectId: ''
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [projects, meetings, commitments] = await Promise.all([
          apiGet<Project[]>('/projects').catch(() => [] as Project[]),
          apiGet<Meeting[]>('/meetings').catch(() => [] as Meeting[]),
          apiGet<Commitment[]>('/commitments').catch(() => [] as Commitment[])
        ]);

        const pendingCount = commitments.filter(c => c.status === 'pending').length;
        const apollo = projects.find(p => p.name.toLowerCase().includes('apollo'));
        const primaryName = apollo ? apollo.name : (projects[0]?.name || 'Active Projects');
        const firstId = apollo ? apollo.id : (projects[0]?.id || '');

        setStats({
          activeProjects: projects.length,
          totalMeetings: meetings.length,
          pendingCommitments: pendingCount,
          primaryProject: primaryName,
          firstProjectId: firstId
        });
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
      <StatItem
        title="Active Projects"
        value={stats.activeProjects}
        subtitle={`Focus: ${stats.primaryProject}`}
        icon={FolderKanban}
        colorScheme="indigo"
        accentBadge={stats.primaryProject.includes('Apollo') ? 'Apollo Primary' : 'Active'}
        href="/projects"
      />

      <StatItem
        title="Recorded Meetings"
        value={stats.totalMeetings}
        subtitle="Ingested transcripts & AI memory"
        icon={CalendarDays}
        colorScheme="emerald"
        accentBadge={`${stats.totalMeetings} Syncs`}
        href={stats.firstProjectId ? `/prepare?project=${stats.firstProjectId}` : '/prepare'}
      />

      <StatItem
        title="Pending Commitments"
        value={stats.pendingCommitments}
        subtitle="Action items extracted from transcripts"
        icon={CheckSquare}
        colorScheme="amber"
        accentBadge={stats.pendingCommitments > 0 ? "Action Req." : "Clear"}
        href="/commitments"
      />
    </div>
  );
};
