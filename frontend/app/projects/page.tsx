"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { 
  FolderKanban, 
  Search, 
  CalendarDays, 
  CheckSquare, 
  Clock, 
  ArrowUpRight, 
  Plus, 
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { projectsList, ProjectItem } from '@/data/mockData';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Active' | 'Needs Attention' | 'Completed'>('All');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  // Filter projects by search query and selected status filter
  const filteredProjects = useMemo(() => {
    return projectsList.filter((project) => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = selectedFilter === 'All' || project.status === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter]);

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans">
      {/* Sidebar Navigation with Projects active */}
      <Sidebar activeTab="projects" />

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                  Projects
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {projectsList.length} Total
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Manage your active hackathon projects, track meeting frequencies, and monitor pending commitments.
              </p>
            </div>

            {/* Quick Action */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => alert("Project creation is disabled in Step 2 preview.")}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all duration-150"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by name, code, or keyword..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {(['All', 'Active', 'Needs Attention', 'Completed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedFilter === filter
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
              <FolderKanban className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">No projects found</h3>
              <p className="text-xs text-slate-500 mt-1">Try matching your query with a different keyword or reset filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredProjects.map((project) => {
                const isApollo = project.code === 'APOLLO';

                return (
                  <div
                    key={project.id}
                    className={`group relative p-6 rounded-2xl bg-slate-900 border flex flex-col justify-between transition-all duration-200 ${
                      isApollo
                        ? 'border-indigo-500/40 shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-500/20'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Card Header: Code Badge & Status */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold tracking-wide ${
                            isApollo
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {project.code}
                          </span>
                          {isApollo && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <Sparkles className="w-3 h-3" /> PRIMARY DEMO
                            </span>
                          )}
                        </div>

                        {/* Status Badge */}
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                          project.status === 'Needs Attention'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : project.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {project.status === 'Needs Attention' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                          {project.status === 'Completed' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          {project.status}
                        </span>
                      </div>

                      {/* Project Name & Description */}
                      <h2 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors mb-2">
                        {project.name}
                      </h2>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      {/* Metrics Footer */}
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4 text-xs">
                        <div>
                          <span className="text-[10px] uppercase text-slate-500 block font-semibold">
                            Meetings
                          </span>
                          <span className="text-slate-200 font-bold flex items-center gap-1 mt-0.5">
                            <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
                            {project.meetingsCount}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase text-slate-500 block font-semibold">
                            Commitments
                          </span>
                          <span className={`font-bold flex items-center gap-1 mt-0.5 ${
                            project.pendingCommitmentsCount > 0 ? 'text-amber-400' : 'text-slate-200'
                          }`}>
                            <CheckSquare className="w-3.5 h-3.5" />
                            {project.pendingCommitmentsCount} Pending
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase text-slate-500 block font-semibold">
                            Last Activity
                          </span>
                          <span className="text-slate-300 text-[11px] flex items-center gap-1 mt-0.5 truncate">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {project.lastActivity}
                          </span>
                        </div>
                      </div>

                      {/* View Project Button */}
                      <Link
                        href={`/projects/${project.id}`}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-150 ${
                          isApollo
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        <span>View Project</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Lightweight Project Overview Modal for "View Project" action */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                  {activeModalProject.code}
                </span>
                <h3 className="text-lg font-bold text-slate-100">
                  {activeModalProject.name}
                </h3>
              </div>
              <button 
                onClick={() => setActiveModalProject(null)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeModalProject.description}
            </p>

            <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total Meetings Recorded:</span>
                <span className="font-bold text-slate-200">{activeModalProject.meetingsCount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Pending Commitments:</span>
                <span className="font-bold text-amber-400">{activeModalProject.pendingCommitmentsCount} action items</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Last Synced Activity:</span>
                <span className="font-bold text-slate-200">{activeModalProject.lastActivity}</span>
              </div>
            </div>

            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
              📌 <strong>Step 2 Demo:</strong> Project Detail view will be unlocked in the next step.
            </div>

            <button
              onClick={() => setActiveModalProject(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              Close Quick View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
