"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { 
  FolderKanban, 
  ArrowLeft, 
  Upload, 
  Sparkles, 
  Users, 
  CalendarDays, 
  CheckSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldAlert, 
  Lightbulb, 
  Loader2,
  AlertCircle,
  Trash2,
  X
} from 'lucide-react';
import { apiGet, apiDelete } from '@/lib/api';
import { Project, Meeting, Commitment } from '@/lib/types';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';

function deriveProjectCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return clean.slice(0, 6) || 'PROJ';
}

function formatDate(dateStr: string | null | undefined): string {
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

export default function ProjectDetailPage({ params }: { params?: { id?: string } }) {
  const router = useRouter();
  const urlParams = useParams();
  const rawId = (params?.id || urlParams?.id) as string;

  const [project, setProject] = useState<Project | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Deletion and feedback states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('deleted_meeting') === 'true') {
        setSuccessBanner('Meeting and its extracted commitments were permanently removed.');
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  const handleDeleteProject = async () => {
    if (!project) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await apiDelete(`/projects/${project.id}`);
      router.push('/projects?deleted=true');
    } catch (err) {
      console.error('Failed to delete project:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete project');
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    async function loadProjectData() {
      if (!rawId) return;

      try {
        setLoading(true);
        setError(null);

        let resolvedProject: Project | null = null;

        // If route is 'apollo' or not a UUID format, resolve from project list
        const isUuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!isUuidPattern.test(rawId)) {
          const allProjects = await apiGet<Project[]>('/projects');
          resolvedProject = allProjects.find(
            p => p.name.toLowerCase() === rawId.toLowerCase() || p.id === rawId
          ) || allProjects[0] || null;

          if (!resolvedProject) {
            setError('Project not found');
            setLoading(false);
            return;
          }
        } else {
          resolvedProject = await apiGet<Project>(`/projects/${rawId}`);
        }

        setProject(resolvedProject);

        // Fetch meetings and commitments for this project
        const [allMeetings, projCommitments] = await Promise.all([
          apiGet<Meeting[]>('/meetings').catch(() => [] as Meeting[]),
          apiGet<Commitment[]>(`/commitments/project/${resolvedProject.id}`).catch(() => [] as Commitment[])
        ]);

        const projectMeetings = allMeetings.filter(m => m.project_id === resolvedProject!.id);
        setMeetings(projectMeetings);
        setCommitments(projCommitments);
      } catch (err) {
        console.error('Failed to load project details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    }

    loadProjectData();
  }, [rawId]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950 font-sans">
        <Sidebar activeTab="projects" />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading project data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen bg-slate-950 font-sans">
        <Sidebar activeTab="projects" />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h2 className="text-lg font-bold text-slate-100">Unable to load project</h2>
            <p className="text-xs text-slate-400">{error || 'Project not found.'}</p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const projectCode = deriveProjectCode(project.name);
  const pendingCommitments = commitments.filter(c => c.status === 'pending');
  const resolvedCommitments = commitments.filter(c => c.status === 'completed');
  const projectHealth = pendingCommitments.length > 0 ? 'Action Required' : 'On Track';

  // Parse decisions from meetings
  const parsedDecisions = meetings.flatMap((m) => {
    if (!m.decisions) return [];
    return m.decisions
      .split('\n')
      .map(d => d.trim())
      .filter(Boolean)
      .map((desc, idx) => ({
        id: `${m.id}-dec-${idx}`,
        title: desc,
        context: `Recorded in meeting "${m.title}"`,
        date: formatDate(m.meeting_date),
        agreedBy: 'Team consensus'
      }));
  });

  // Parse unresolved issues from meetings
  const parsedUnresolvedIssues = meetings.flatMap((m) => {
    if (!m.unresolved_issues) return [];
    return m.unresolved_issues
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean)
      .map((issue, idx) => ({
        id: `${m.id}-issue-${idx}`,
        issue,
        severity: 'High',
        owner: 'Project Lead',
        impact: `From meeting "${m.title}"`
      }));
  });

  // Unique participants derived from commitments owners
  const uniqueParticipants = Array.from(new Set(commitments.map(c => c.owner_name).filter(Boolean)))
    .map((name, idx) => {
      const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'TM';
      const assigned = commitments.filter(c => c.owner_name === name && c.status === 'pending').length;
      return {
        id: `part-${idx}`,
        name,
        role: 'Team Contributor',
        initials,
        commitmentsAssigned: assigned,
        avatarBg: 'from-indigo-600 to-violet-600'
      };
    });

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab="projects" />

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/projects" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Projects</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-medium">{project.name}</span>
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

          {/* Project Banner Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {projectCode}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  pendingCommitments.length > 0
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {pendingCommitments.length > 0 ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  {projectHealth}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
                {project.name}
              </h1>
              <p className="text-sm font-medium text-indigo-300 mt-1">
                {project.description || 'Private project memory & intelligence'}
              </p>
            </div>

            {/* Action Buttons: Upload Meeting, Prepare Me, Delete Project */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              {/* Prepare Me Button */}
              <Link
                href={`/prepare?project=${project.id}`}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all duration-150"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Prepare Me</span>
              </Link>

              {/* Upload Meeting Button */}
              <Link
                href={`/meetings/upload?project=${project.id}`}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all duration-150"
              >
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Upload Meeting</span>
              </Link>

              {/* Delete Project Button */}
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-xs font-semibold flex items-center gap-1.5 border border-slate-700/80 hover:border-red-500/30 transition-all duration-150"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Project</span>
              </button>
            </div>
          </div>

          {/* Project Overview Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-indigo-400" />
              Project Overview
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              {project.description || 'This project is actively managed under RecallMeet memory engine. Upload meeting transcripts to extract commitments and synchronize team recall.'}
            </p>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Total Meetings</span>
                <span className="text-xl font-bold text-slate-100 flex items-center gap-1.5 mt-1">
                  <CalendarDays className="w-4 h-4 text-indigo-400" />
                  {meetings.length}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Pending Commitments</span>
                <span className="text-xl font-bold text-amber-400 flex items-center gap-1.5 mt-1">
                  <CheckSquare className="w-4 h-4" />
                  {pendingCommitments.length}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Resolved Items</span>
                <span className="text-xl font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {resolvedCommitments.length}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Project Health</span>
                <span className={`text-xs font-bold flex items-center gap-1 mt-2 ${
                  pendingCommitments.length > 0 ? 'text-amber-300' : 'text-emerald-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${pendingCommitments.length > 0 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                  {projectHealth}
                </span>
              </div>
            </div>
          </div>

          {/* Two-Column Grid: Core Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column (2 Cols): Meetings & Key Decisions */}
            <div className="lg:col-span-2 space-y-6">

              {/* Recent Meetings Section */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-base font-bold text-slate-100">
                      Recent {project.name} Meetings
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400">
                    {meetings.length} Recorded Syncs
                  </span>
                </div>

                {meetings.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400">No meetings recorded for this project yet.</p>
                    <Link
                      href={`/meetings/upload?project=${project.id}`}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload First Meeting
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {meetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <Link href={`/meetings/${meeting.id}`} className="text-sm font-semibold text-slate-200 hover:text-indigo-300 transition-colors">
                            {meeting.title}
                          </Link>
                          <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              {formatDate(meeting.meeting_date)}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 mb-3 pl-3 border-l-2 border-indigo-500/40 line-clamp-2">
                          {meeting.summary ? `"${meeting.summary}"` : 'Summary pending Groq analysis.'}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                          <Link 
                            href={`/meetings/${meeting.id}`}
                            className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                          >
                            <span>Open Meeting Detail</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Key Decisions Section */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800/80">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h2 className="text-base font-bold text-slate-100">
                    Key Decisions
                  </h2>
                </div>

                {parsedDecisions.length === 0 ? (
                  <div className="p-6 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400">
                    No decisions extracted yet. Upload a transcript and run analysis to extract key decisions.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {parsedDecisions.map((decision) => (
                      <div
                        key={decision.id}
                        className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                            {decision.title}
                          </h3>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {decision.date}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed pl-4">
                          {decision.context}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column (1 Col): Participants, Commitments & Unresolved Issues */}
            <div className="lg:col-span-1 space-y-6">

              {/* Participants Section */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-base font-bold text-slate-100">
                      Team Contributors
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">
                    {uniqueParticipants.length} Members
                  </span>
                </div>

                {uniqueParticipants.length === 0 ? (
                  <p className="text-xs text-slate-500">No participants recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {uniqueParticipants.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${member.avatarBg} flex items-center justify-center text-white font-bold text-xs shadow-inner`}>
                            {member.initials}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-200">
                              {member.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {member.role}
                            </p>
                          </div>
                        </div>

                        {member.commitmentsAssigned > 0 && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {member.commitmentsAssigned} Active
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Commitments Section */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                  <Link href={`/commitments?project=${project.id}`} className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                    <h2 className="text-base font-bold text-slate-100">
                      Pending Commitments
                    </h2>
                  </Link>
                  <Link href={`/commitments?project=${project.id}`} className="text-xs font-bold text-amber-400 hover:underline">
                    {pendingCommitments.length} Pending →
                  </Link>
                </div>

                {pendingCommitments.length === 0 ? (
                  <p className="text-xs text-slate-500">No pending commitments for this project.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingCommitments.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1.5"
                      >
                        <p className="font-medium text-slate-200 leading-snug">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span className="text-indigo-300 font-mono">{item.owner_name}</span>
                          <span className="text-amber-400 font-semibold">
                            Due {formatDate(item.due_date || '')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Unresolved Issues Section */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <h2 className="text-base font-bold text-slate-100">
                      Unresolved Issues
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-red-400">
                    {parsedUnresolvedIssues.length} Flagged
                  </span>
                </div>

                {parsedUnresolvedIssues.length === 0 ? (
                  <p className="text-xs text-slate-500">No unresolved issues flagged.</p>
                ) : (
                  <div className="space-y-3">
                    {parsedUnresolvedIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                            {issue.severity}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {issue.owner}
                          </span>
                        </div>
                        <p className="font-semibold text-slate-200">
                          {issue.issue}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {issue.impact}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Delete Project Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete this project?"
        description="This will permanently remove the project and its associated meeting data and commitments."
        confirmButtonText="Delete Project"
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleDeleteProject}
        onCancel={() => {
          if (!isDeleting) {
            setShowDeleteModal(false);
            setDeleteError(null);
          }
        }}
      />
    </div>
  );
}
