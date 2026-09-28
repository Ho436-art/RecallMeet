"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  apiGet,
  clearAuthToken,
  getAuthToken,
} from "@/lib/api";
import { Sidebar } from '@/components/Sidebar';
import { WelcomeHeader } from '@/components/WelcomeHeader';
import { DashboardStatsGrid } from '@/components/StatCard';
import { RecentMeetings } from '@/components/RecentMeetings';
import { ProjectsNeedingAttention } from '@/components/ProjectsNeedingAttention';

export default function DashboardPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuthentication() {
      const token = getAuthToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        await apiGet("/auth/me");
        setCheckingAuth(false);
      } catch {
        clearAuthToken();
        router.replace("/login");
      }
    }

    checkAuthentication();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        Checking authentication...
      </div>
    );
  }
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
