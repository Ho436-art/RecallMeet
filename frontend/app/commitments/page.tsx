"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { apiGet, apiPatch } from '@/lib/api';
import { Commitment, Project } from '@/lib/types';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'No due date';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

function CommitmentsPageContent() {
  const searchParams = useSearchParams();
  const initialProject = searchParams.get('project') || 'all';

  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<'All' | 'pending' | 'in_progress' | 'completed'>('All');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>(initialProject);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [loadedProjects, loadedCommitments] = await Promise.all([
        apiGet<Project[]>('/projects').catch(() => [] as Project[]),
        apiGet<Commitment[]>('/commitments').catch(() => [] as Commitment[])
      ]);

      setProjects(loadedProjects);
      setCommitments(loadedCommitments);
    } catch (err) {
      console.error('Failed to load commitments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load commitments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (commitmentId: string, newStatus: string) => {
    try {
      setUpdatingId(commitmentId);
      const updated = await apiPatch<Commitment>(`/commitments/${commitmentId}/status?new_status=${newStatus}`);
      setCommitments(prev => prev.map(c => c.id === commitmentId ? updated : c));
    } catch (err) {
      console.error('Failed to update commitment status:', err);
      alert(err instanceof Error ? err.message : 'Failed to update commitment status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter commitments based on status, project, and search query
  const filteredCommitments = useMemo(() => {
    return commitments.filter((item) => {
      // Filter by Project
      if (selectedProjectFilter !== 'all') {
        if (item.project_id !== selectedProjectFilter) {
          return false;
        }
      }

      // Filter by Status
      if (selectedStatus !== 'All' && item.status !== selectedStatus) {
        return false;
      }

      // Filter by Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          item.description.toLowerCase().includes(query) ||
          item.owner_name.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [commitments, selectedStatus, selectedProjectFilter, searchQuery]);

  // Counts breakdown for status pills
  const statusCounts = useMemo(() => {
    const list = selectedProjectFilter === 'all' 
      ? commitments 
      : commitments.filter(c => c.project_id === selectedProjectFilter);
      
    return {
      all: list.length,
      pending: list.filter(c => c.status === 'pending').length,
      inProgress: list.filter(c => c.status === 'in_progress').length,
      completed: list.filter(c => c.status === 'completed').length,
    };
  }, [commitments, selectedProjectFilter]);

  const getProjectName = (projectId: string) => {
    const found = projects.find(p => p.id === projectId);
    return found ? found.name : 'Project';
  };

  const getProjectCode = (projectId: string) => {
    const found = projects.find(p => p.id === projectId);
    if (!found) return 'PROJ';
    return found.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab="commitments" />

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/projects" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Projects</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-medium">Commitments Ledger</span>
          </div>

          {/* Page Banner Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                  Commitments Ledger
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {statusCounts.all} Total Extracted
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Action items extracted automatically from meeting transcripts across your active projects.
              </p>
            </div>

            {/* Quick Summary Pill Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {statusCounts.pending} Pending
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {statusCounts.inProgress} In Progress
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {statusCounts.completed} Completed
              </span>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button 
                onClick={loadData}
                className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-semibold"
              >
                Retry
              </button>
            </div>
          )}

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
            
            {/* Search Input & Project Selector */}
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
              {/* Project Filter Dropdown */}
              <div className="w-full sm:w-56 shrink-0">
                <select
                  value={selectedProjectFilter}
                  onChange={(e) => setSelectedProjectFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
                >
                  <option value="all">All Projects</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Field */}
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search commitments by task or owner..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Status:
              </span>
              {[
                { label: 'All', value: 'All' },
                { label: 'Pending', value: 'pending' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Completed', value: 'completed' }
              ].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setSelectedStatus(value as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedStatus === value
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Commitments List */}
          {loading ? (
            <div className="p-16 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading commitments from backend...</p>
            </div>
          ) : filteredCommitments.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
              <CheckSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">No commitments match the filter criteria</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting the status filter or project selection.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredCommitments.map((item) => {
                const isPending = item.status === 'pending';
                const isInProgress = item.status === 'in_progress';
                const isCompleted = item.status === 'completed';
                const projCode = getProjectCode(item.project_id);
                const projName = getProjectName(item.project_id);
                const isUpdating = updatingId === item.id;

                const initials = item.owner_name
                  ? item.owner_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                  : 'TM';

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl bg-slate-900 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 ${
                      isCompleted
                        ? 'border-emerald-500/20 bg-slate-900'
                        : isInProgress
                        ? 'border-indigo-500/30 bg-indigo-500/5'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Left: Task Description & Context */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Link 
                          href={`/projects/${item.project_id}`}
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400 transition-colors"
                        >
                          {projCode} • {projName}
                        </Link>

                        {/* Status Indicator Badge */}
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isInProgress
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          {isInProgress && <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                          {isPending && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                          <span className="capitalize">{item.status.replace('_', ' ')}</span>
                        </span>
                      </div>

                      {/* Commitment Task Description */}
                      <h3 className="text-base font-bold text-slate-100 leading-snug">
                        {item.description}
                      </h3>

                      {/* Status Action Buttons */}
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <span className="text-[11px] text-slate-500">Change Status:</span>
                        {['pending', 'in_progress', 'completed'].map((st) => (
                          <button
                            key={st}
                            disabled={isUpdating || item.status === st}
                            onClick={() => handleStatusChange(item.id, st)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider transition ${
                              item.status === st
                                ? 'bg-slate-800 text-slate-300 border border-slate-700'
                                : 'bg-slate-950 text-slate-500 hover:text-slate-300 hover:bg-slate-800 border border-slate-800'
                            }`}
                          >
                            {st.replace('_', ' ')}
                          </button>
                        ))}
                        {isUpdating && <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />}
                      </div>
                    </div>

                    {/* Right: Assignee Person & Due Date */}
                    <div className="flex items-center gap-6 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                      {/* Person Responsible */}
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                          {initials}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-200">
                            {item.owner_name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Owner
                          </p>
                        </div>
                      </div>

                      {/* Due Date */}
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                          Due Date
                        </span>
                        <span className="text-xs font-bold flex items-center gap-1 text-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {formatDate(item.due_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CommitmentsPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    }>
      <CommitmentsPageContent />
    </React.Suspense>
  );
}
