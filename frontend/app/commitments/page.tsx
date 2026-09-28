"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  FolderKanban, 
  FileText, 
  ArrowLeft
} from 'lucide-react';
import { fullCommitmentsList, CommitmentDetailItem, projectsList } from '@/data/mockData';

export default function CommitmentsPage() {
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Pending' | 'Overdue' | 'In Progress' | 'Completed'>('All');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('apollo');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter commitments based on status, project, and search query
  const filteredCommitments = useMemo(() => {
    return fullCommitmentsList.filter((item) => {
      // Filter by Project
      if (selectedProjectFilter !== 'all') {
        const targetProj = projectsList.find(p => p.id === selectedProjectFilter);
        if (targetProj && item.projectName !== targetProj.name) {
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
          item.task.toLowerCase().includes(query) ||
          item.assigneeName.toLowerCase().includes(query) ||
          item.sourceMeeting.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [selectedStatus, selectedProjectFilter, searchQuery]);

  // Counts breakdown for status pills
  const statusCounts = useMemo(() => {
    const list = selectedProjectFilter === 'all' 
      ? fullCommitmentsList 
      : fullCommitmentsList.filter(c => c.projectName === 'Project Apollo');
      
    return {
      all: list.length,
      pending: list.filter(c => c.status === 'Pending').length,
      overdue: list.filter(c => c.status === 'Overdue').length,
      inProgress: list.filter(c => c.status === 'In Progress').length,
      completed: list.filter(c => c.status === 'Completed').length,
    };
  }, [selectedProjectFilter]);

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab="commitments" />

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/projects/apollo" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Project Apollo</span>
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
                Action items extracted automatically from meeting transcripts for <span className="text-indigo-300 font-medium">Project Apollo</span>.
              </p>
            </div>

            {/* Quick Summary Pill Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {statusCounts.overdue} Overdue
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

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
            
            {/* Search Input & Project Selector */}
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
              {/* Project Filter Dropdown */}
              <div className="w-full sm:w-48 shrink-0">
                <select
                  value={selectedProjectFilter}
                  onChange={(e) => setSelectedProjectFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
                >
                  <option value="apollo">Project Apollo (Primary)</option>
                  <option value="beacon">Project Beacon</option>
                  <option value="cipher">Project Cipher</option>
                  <option value="all">All Projects</option>
                </select>
              </div>

              {/* Search Field */}
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search commitments by task, assignee, or meeting..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Status:
              </span>
              {(['All', 'Pending', 'Overdue', 'In Progress', 'Completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedStatus === status
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Commitments List Grid */}
          {filteredCommitments.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
              <CheckSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">No commitments match the filter criteria</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting the status filter or project selection.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredCommitments.map((item) => {
                const isOverdue = item.status === 'Overdue';
                const isCompleted = item.status === 'Completed';
                const isInProgress = item.status === 'In Progress';

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl bg-slate-900 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 ${
                      isOverdue
                        ? 'border-red-500/30 bg-red-500/5'
                        : isCompleted
                        ? 'border-emerald-500/20 bg-slate-900'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Left: Task Description & Context */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {item.projectCode}
                        </span>

                        {/* Status Indicator Badge */}
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                          isOverdue
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isInProgress
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {isOverdue && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          {isInProgress && <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                          {!isOverdue && !isCompleted && !isInProgress && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                          {item.status}
                        </span>

                        <span className="text-[10px] uppercase font-bold text-slate-500 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                          {item.priority} Priority
                        </span>
                      </div>

                      {/* Commitment Task Description */}
                      <h3 className="text-base font-bold text-slate-100 leading-snug">
                        {item.task}
                      </h3>

                      {/* Source Meeting */}
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        Source: <span className="text-indigo-300 font-medium">{item.sourceMeeting}</span>
                      </p>
                    </div>

                    {/* Right: Assignee Person & Due Date */}
                    <div className="flex items-center gap-6 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                      {/* Person Responsible */}
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${item.assigneeAvatarBg} flex items-center justify-center text-white font-bold text-xs shadow-inner`}>
                          {item.assigneeInitials}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-200">
                            {item.assigneeName}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {item.assigneeRole}
                          </p>
                        </div>
                      </div>

                      {/* Due Date */}
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                          Due Date
                        </span>
                        <span className={`text-xs font-bold flex items-center gap-1 ${
                          isOverdue ? 'text-red-400' : 'text-slate-200'
                        }`}>
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {item.dueDate}
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
