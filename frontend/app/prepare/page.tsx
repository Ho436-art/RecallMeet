"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  FileText, 
  Lightbulb, 
  CheckSquare, 
  ShieldAlert, 
  ArrowLeft, 
  CheckCircle2, 
  Target, 
  MessageSquare, 
  Loader2, 
  Zap, 
  Compass,
  AlertCircle
} from 'lucide-react';
import { apiGet, apiPost } from '@/lib/api';
import { Project, Meeting, Commitment, PreparationResponse } from '@/lib/types';

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

function PrepareMeContent() {
  const searchParams = useSearchParams();
  const queryProjectId = searchParams.get('project');

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);

  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load all projects on initial mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError(null);

        const projectList = await apiGet<Project[]>('/projects');
        setProjects(projectList);

        if (projectList.length > 0) {
          const matched = queryProjectId 
            ? projectList.find(p => p.id === queryProjectId || p.name.toLowerCase() === queryProjectId.toLowerCase())
            : projectList[0];

          const activeId = matched ? matched.id : projectList[0].id;
          setSelectedProjectId(activeId);
        }
      } catch (err) {
        console.error('Failed to load projects for Prepare Me:', err);
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, [queryProjectId]);

  // Load details, meetings, and commitments whenever selectedProjectId changes
  useEffect(() => {
    async function loadProjectDetails() {
      if (!selectedProjectId) return;

      try {
        setError(null);
        const [proj, allMeetings, projCommitments] = await Promise.all([
          apiGet<Project>(`/projects/${selectedProjectId}`).catch(() => null),
          apiGet<Meeting[]>('/meetings').catch(() => [] as Meeting[]),
          apiGet<Commitment[]>(`/commitments/project/${selectedProjectId}`).catch(() => [] as Commitment[])
        ]);

        setSelectedProject(proj);
        setMeetings(allMeetings.filter(m => m.project_id === selectedProjectId));
        setCommitments(projCommitments);
      } catch (err) {
        console.error('Failed to load project context for preparation:', err);
      }
    }

    loadProjectDetails();
  }, [selectedProjectId]);

  const handleGeneratePreparation = async () => {
    if (!selectedProjectId) return;

    try {
      setIsGenerating(true);
      setError(null);

      const response = await apiPost<PreparationResponse>(
        `/projects/${selectedProjectId}/prepare`
      );

      setGeneratedResult(response.preparation);
    } catch (err) {
      console.error('Failed to generate preparation briefing:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate preparation briefing');
    } finally {
      setIsGenerating(false);
    }
  };

  const projectCode = selectedProject ? deriveProjectCode(selectedProject.name) : 'PROJ';
  const projectName = selectedProject ? selectedProject.name : 'Project';
  const pendingCommitments = commitments.filter(c => c.status === 'pending');

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
        date: formatDate(m.meeting_date)
      }));
  });

  // Parse unresolved issues from meetings
  const parsedUnresolvedIssues = meetings.flatMap((m) => {
    if (!m.unresolved_issues) return [];
    return m.unresolved_issues
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean);
  });

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab="prepare" />

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link 
              href={selectedProjectId ? `/projects/${selectedProjectId}` : '/projects'} 
              className="hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{projectName}</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-medium">Prepare Me</span>
          </div>

          {/* Page Banner Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {projectCode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  AI Meeting Preparation
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                Prepare Me
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Personalized executive briefing synthesized from past meetings, commitments, and Hindsight memory for <span className="text-indigo-300 font-medium">{projectName}</span>.
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              {/* Project Picker if user has multiple projects */}
              {projects.length > 1 && (
                <select
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    setGeneratedResult(null);
                  }}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              )}

              <Link
                href={`/prepare/feedback?project=${selectedProjectId}`}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Prep Feedback</span>
              </Link>

              <button
                onClick={handleGeneratePreparation}
                disabled={isGenerating || !selectedProjectId}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2.5 shadow-xl shadow-indigo-500/20 transition-all duration-150"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-200" />
                    <span>Synthesizing Memory & Context...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-indigo-200" />
                    <span>Generate Preparation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Generated Preparation Result Section */}
          {generatedResult && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/30 border border-indigo-500/30 shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500 text-slate-950 font-bold">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                      PERSONALIZED BRIEFING READY
                    </span>
                    <h2 className="text-base font-bold text-slate-100 mt-0.5">
                      Synthesized Executive Recall for {projectName}
                    </h2>
                  </div>
                </div>
                <Link
                  href={`/prepare/feedback?project=${selectedProjectId}`}
                  className="text-xs text-indigo-300 hover:text-indigo-200 flex items-center gap-1 font-semibold"
                >
                  Rate this briefing →
                </Link>
              </div>

              {/* Render formatted preparation content */}
              <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 space-y-4 leading-relaxed font-sans whitespace-pre-wrap">
                {generatedResult}
              </div>
            </div>
          )}

          {/* Grid Layout for Meeting Context & History */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column (2 Cols): Project Overview, Past Meetings & Decisions */}
            <div className="lg:col-span-2 space-y-6">

              {/* Relevant Past Meeting History */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-base font-bold text-slate-100">
                      Relevant Past Meeting History
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    {meetings.length} Previous Syncs
                  </span>
                </div>

                {meetings.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800">
                    No past meetings recorded for this project yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {meetings.map((item) => (
                      <div key={item.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <Link href={`/meetings/${item.id}`} className="font-bold text-slate-200 hover:text-indigo-300">
                            {item.title}
                          </Link>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {formatDate(item.meeting_date)}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] line-clamp-2">
                          "{item.summary || 'Summary pending Groq analysis.'}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Key Decisions */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-bold text-slate-100">
                    Key Past Decisions to Keep Top-of-Mind
                  </h3>
                </div>

                {parsedDecisions.length === 0 ? (
                  <p className="text-xs text-slate-500">No decisions recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {parsedDecisions.map((decision) => (
                      <div key={decision.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{decision.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{decision.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column (1 Col): Pending Commitments & Unresolved Issues */}
            <div className="lg:col-span-1 space-y-6">

              {/* Pending Commitments */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                    <h3 className="text-base font-bold text-slate-100">
                      Pending Commitments
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-amber-400">
                    {pendingCommitments.length} Active
                  </span>
                </div>

                {pendingCommitments.length === 0 ? (
                  <p className="text-xs text-slate-500">No pending commitments.</p>
                ) : (
                  <div className="space-y-2.5">
                    {pendingCommitments.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                        <p className="font-medium text-slate-200">{item.description}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                          <span className="text-indigo-300 font-mono">{item.owner_name}</span>
                          <span className="text-amber-400 font-semibold">
                            Due {formatDate(item.due_date)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Unresolved Issues */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <h3 className="text-base font-bold text-slate-100">
                      Unresolved Issues
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-red-400">
                    {parsedUnresolvedIssues.length} Flagged
                  </span>
                </div>

                {parsedUnresolvedIssues.length === 0 ? (
                  <p className="text-xs text-slate-500">No unresolved issues flagged.</p>
                ) : (
                  <div className="space-y-2.5">
                    {parsedUnresolvedIssues.map((issue, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                            Flagged Issue
                          </span>
                        </div>
                        <p className="font-semibold text-slate-200">{issue}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default function PrepareMePage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    }>
      <PrepareMeContent />
    </React.Suspense>
  );
}
