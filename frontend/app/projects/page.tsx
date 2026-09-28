"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Filter,
  Loader2,
  AlertCircle,
  X,
  Trash2
} from 'lucide-react';
import { apiGet, apiPost, apiDelete } from '@/lib/api';
import { Project, Meeting, Commitment } from '@/lib/types';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';

interface DisplayProject {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Needs Attention' | 'Completed';
  tags: string[];
  meetingsCount: number;
  pendingCommitmentsCount: number;
  lastActivity: string;
  created_at: string;
}

function deriveProjectCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return clean.slice(0, 6) || 'PROJ';
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'Recently';
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

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<DisplayProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Active' | 'Needs Attention' | 'Completed'>('All');
  const [activeModalProject, setActiveModalProject] = useState<DisplayProject | null>(null);

  // New Project Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [creatingProject, setCreatingProject] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Delete Project State
  const [projectToDelete, setProjectToDelete] = useState<DisplayProject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const loadProjectsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch projects, meetings, and commitments in parallel
      const [backendProjects, backendMeetings, backendCommitments] = await Promise.all([
        apiGet<Project[]>('/projects'),
        apiGet<Meeting[]>('/meetings').catch(() => [] as Meeting[]),
        apiGet<Commitment[]>('/commitments').catch(() => [] as Commitment[])
      ]);

      const mapped: DisplayProject[] = backendProjects.map((proj) => {
        const projMeetings = backendMeetings.filter(m => m.project_id === proj.id);
        const projCommitments = backendCommitments.filter(c => c.project_id === proj.id);
        const pendingCount = projCommitments.filter(c => c.status === 'pending').length;

        const status: 'Active' | 'Needs Attention' | 'Completed' = 
          pendingCount > 0 ? 'Needs Attention' : 'Active';

        return {
          id: proj.id,
          name: proj.name,
          code: deriveProjectCode(proj.name),
          description: proj.description || 'No description provided.',
          status,
          tags: [deriveProjectCode(proj.name).toLowerCase()],
          meetingsCount: projMeetings.length,
          pendingCommitmentsCount: pendingCount,
          lastActivity: formatDate(proj.created_at),
          created_at: proj.created_at
        };
      });

      setProjects(mapped);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to load projects from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectsData();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('deleted') === 'true') {
        setSuccessBanner('Project was permanently removed.');
        window.history.replaceState({}, '', '/projects');
      }
    }
  }, []);

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await apiDelete(`/projects/${projectToDelete.id}`);
      setSuccessBanner(`Project "${projectToDelete.name}" was permanently removed.`);
      setProjectToDelete(null);
      await loadProjectsData();
    } catch (err) {
      console.error('Failed to delete project:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      setCreateError('Project name is required');
      return;
    }

    try {
      setCreatingProject(true);
      setCreateError(null);
      await apiPost<Project>('/projects', {
        name: newProjectName.trim(),
        description: newProjectDesc.trim() || undefined
      });
      setNewProjectName('');
      setNewProjectDesc('');
      setShowCreateModal(false);
      await loadProjectsData();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setCreatingProject(false);
    }
  };

  // Filter projects by search query and selected status filter
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = selectedFilter === 'All' || project.status === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [projects, searchQuery, selectedFilter]);

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
                  {projects.length} Total
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Manage your active hackathon projects, track meeting frequencies, and monitor pending commitments.
              </p>
            </div>

            {/* Quick Action */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all duration-150"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {successBanner && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successBanner}</span>
              </div>
              <button 
                onClick={() => setSuccessBanner(null)}
                className="text-emerald-400 hover:text-emerald-200 p-1"
                aria-label="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button 
                onClick={loadProjectsData}
                className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-semibold"
              >
                Retry
              </button>
            </div>
          )}

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

          {/* Loading State */}
          {loading ? (
            <div className="p-16 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading projects from backend...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
              <FolderKanban className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">No projects found</h3>
              <p className="text-xs text-slate-500 mt-1">
                {projects.length === 0 
                  ? "Get started by creating your first project."
                  : "Try matching your query with a different keyword or reset filters."}
              </p>
              {projects.length === 0 && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Project
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredProjects.map((project) => {
                const isApollo = project.name.toLowerCase().includes('apollo');

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

                      {/* View & Delete Project Buttons */}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/projects/${project.id}`}
                          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-150 ${
                            isApollo
                              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          }`}
                        >
                          <span>View Project</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(project)}
                          className="px-3 py-2.5 rounded-xl bg-slate-950 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all duration-150"
                          title="Delete Project"
                          aria-label={`Delete ${project.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* New Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">
                  Create New Project
                </h3>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Project Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Project Beacon"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Briefly describe the project goals, architecture, or scope..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingProject}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  {creatingProject ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Project</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Project Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!projectToDelete}
        title="Delete this project?"
        description="This will permanently remove the project and its associated meeting data and commitments."
        confirmButtonText="Delete Project"
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleDeleteProject}
        onCancel={() => {
          if (!isDeleting) {
            setProjectToDelete(null);
            setDeleteError(null);
          }
        }}
      />
    </div>
  );
}
