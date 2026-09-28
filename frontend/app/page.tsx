"use client";

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { WelcomeHeader } from '@/components/WelcomeHeader';
import { DashboardStatsGrid } from '@/components/StatCard';
import { RecentMeetings } from '@/components/RecentMeetings';
import { ProjectsNeedingAttention } from '@/components/ProjectsNeedingAttention';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab="dashboard" />

      {/* Main Dashboard Area */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Header */}
          <WelcomeHeader />

          {/* Metric Counts Grid */}
          <DashboardStatsGrid />

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Meetings (2 columns on large screens) */}
            <div className="lg:col-span-2">
              <RecentMeetings />
            </div>

            {/* Projects Needing Attention (1 column on large screens) */}
            <div className="lg:col-span-1">
              <ProjectsNeedingAttention />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
