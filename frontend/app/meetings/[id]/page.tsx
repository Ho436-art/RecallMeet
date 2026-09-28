"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Lightbulb, 
  CheckSquare, 
  ShieldAlert, 
  Sparkles, 
  ArrowLeft, 
  MessageSquare, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Loader2,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { apiGet, apiPost, apiDelete } from '@/lib/api';
import { Meeting, Project, Commitment, MeetingAnalysisResponse } from '@/lib/types';
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

export default function MeetingDetailPage({ params }: { params?: { id?: string } }) {
  const router = useRouter();
  const urlParams = useParams();
  const rawId = (params?.id || urlParams?.id) as string;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(true);

  // Deletion states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteMeeting = async () => {
    if (!meeting) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await apiDelete(`/meetings/${meeting.id}`);
      router.push(`/projects/${meeting.project_id}?deleted_meeting=true`);
    } catch (err) {
      console.error('Failed to delete meeting:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete meeting');
      setIsDeleting(false);
    }
  };

  const loadMeetingData = async () => {
    if (!rawId) return;

    try {
      setLoading(true);
      setError(null);

      let resolvedMeeting: Meeting | null = null;
      const isUuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (!isUuidPattern.test(rawId)) {
        const allMeetings = await apiGet<Meeting[]>('/meetings');
        resolvedMeeting = allMeetings[0] || null;
        if (!resolvedMeeting) {
          setError('No meetings found');
          setLoading(false);
          return;
        }
      } else {
        resolvedMeeting = await apiGet<Meeting>(`/meetings/${rawId}`);
      }

      setMeeting(resolvedMeeting);

      // Load related project and commitments
      const [projData, projCommitments] = await Promise.all([
        apiGet<Project>(`/projects/${resolvedMeeting.project_id}`).catch(() => null),
        apiGet<Commitment[]>(`/commitments/project/${resolvedMeeting.project_id}`).catch(() => [] as Commitment[])
      ]);

      setProject(projData);
      const meetingCommitments = projCommitments.filter(c => c.meeting_id === resolvedMeeting!.id);
      setCommitments(meetingCommitments.length > 0 ? meetingCommitments : projCommitments);
    } catch (err) {
      console.error('Failed to load meeting:', err);
      setError(err instanceof Error ? err.message : 'Failed to load meeting details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetingData();
  }, [rawId]);

  const handleAnalyzeMeeting = async () => {
    if (!meeting) return;
    try {
      setAnalyzing(true);
      const analysis = await apiPost<MeetingAnalysisResponse>(`/meetings/${meeting.id}/analyze`);
      
      // Update meeting fields
      setMeeting(prev => prev ? {
        ...prev,
        summary: analysis.summary,
        decisions: analysis.decisions,
        unresolved_issues: analysis.unresolved_issues
      } : null);

      // Refresh commitments
      const updatedCommitments = await apiGet<Commitment[]>(`/commitments/project/${meeting.project_id}`).catch(() => []);
      const meetingCommitments = updatedCommitments.filter(c => c.meeting_id === meeting.id);
      setCommitments(meetingCommitments.length > 0 ? meetingCommitments : updatedCommitments);
    } catch (err) {
      console.error('Failed to analyze meeting:', err);
      alert(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950 font-sans">
        <Sidebar activeTab="meetings" />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading meeting details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="flex min-h-screen bg-slate-950 font-sans">
        <Sidebar activeTab="meetings" />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h2 className="text-lg font-bold text-slate-100">Unable to load meeting</h2>
            <p className="text-xs text-slate-400">{error || 'Meeting not found.'}</p>
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

  const projectCode = project ? deriveProjectCode(project.name) : 'PROJ';
  const projectName = project ? project.name : 'Project';

  // Parse decisions
  const decisionsList = (meeting.decisions || '')
    .split('\n')
    .map(d => d.trim())
    .filter(Boolean);

  // Parse unresolved issues
  const unresolvedIssuesList = (meeting.unresolved_issues || '')
    .split('\n')
    .map(i => i.trim())
    .filter(Boolean);

  // Parse transcript lines
  const transcriptLines = (meeting.transcript || '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab="meetings" />

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href={`/projects/${meeting.project_id}`} className="hover:text-indigo-400 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{projectName}</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-medium">Meeting Detail</span>
          </div>

          {/* Meeting Banner Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {projectCode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {meeting.summary ? 'Analysis Ingested' : 'Ingested'}
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight">
                {meeting.title}
              </h1>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  {formatDate(meeting.meeting_date)}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Recorded Sync
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
                  {commitments.length} Commitments
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                onClick={handleAnalyzeMeeting}
                disabled={analyzing}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>Analyzing with Groq...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>{meeting.summary ? 'Re-analyze with Groq' : 'Analyze Meeting'}</span>
                  </>
                )}
              </button>

              <Link
                href={`/prepare?project=${meeting.project_id}`}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all duration-150"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Prepare Me</span>
              </Link>

              {/* Delete Meeting Button */}
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-xs font-semibold flex items-center gap-1.5 border border-slate-700/80 hover:border-red-500/30 transition-all duration-150"
                title="Delete Meeting"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Meeting</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Main Meeting Intelligence (2 cols) & Sidebar Metadata (1 col) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column (2 Cols): Discussion / Summary, Key Decisions & Transcript */}
            <div className="lg:col-span-2 space-y-6">

              {/* Executive Summary Section */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800/80">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-base font-bold text-slate-100">
                    Meeting Summary & Key Points
                  </h2>
                </div>

                {meeting.summary ? (
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                    {meeting.summary}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
                    No summary generated yet. Click "Analyze Meeting" above to trigger Groq LLM extraction.
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

                {decisionsList.length === 0 ? (
                  <p className="text-xs text-slate-400">No decisions recorded for this meeting.</p>
                ) : (
                  <div className="space-y-3">
                    {decisionsList.map((decision, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5"
                      >
                        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          {decision}
                        </h3>
                        <p className="text-[11px] text-slate-500 pl-4">
                          Extracted from meeting sync
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Meeting Transcript Section */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-base font-bold text-slate-100">
                      Meeting Transcript
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    {isTranscriptExpanded ? (
                      <>Collapse Transcript <ChevronUp className="w-3.5 h-3.5" /></>
                    ) : (
                      <>Expand Transcript <ChevronDown className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                </div>

                {isTranscriptExpanded && (
                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-2">
                    {transcriptLines.length === 0 ? (
                      <p className="text-xs text-slate-500">No transcript text available.</p>
                    ) : (
                      transcriptLines.map((line, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 font-mono leading-relaxed">
                          {line}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column (1 Col): Extracted Commitments & Unresolved Issues */}
            <div className="lg:col-span-1 space-y-6">

              {/* Extracted Commitments */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                    <h2 className="text-base font-bold text-slate-100">
                      Extracted Commitments
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-amber-400">
                    {commitments.length} Action Items
                  </span>
                </div>

                {commitments.length === 0 ? (
                  <p className="text-xs text-slate-500">No commitments extracted yet.</p>
                ) : (
                  <div className="space-y-3">
                    {commitments.map((item) => (
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
                            Due {formatDate(item.due_date)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Unresolved Issues */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <h2 className="text-base font-bold text-slate-100">
                      Unresolved Issues
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-red-400">
                    {unresolvedIssuesList.length} Flagged
                  </span>
                </div>

                {unresolvedIssuesList.length === 0 ? (
                  <p className="text-xs text-slate-500">No unresolved issues flagged.</p>
                ) : (
                  <div className="space-y-3">
                    {unresolvedIssuesList.map((issue, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                            Flagged Issue
                          </span>
                        </div>
                        <p className="font-semibold text-slate-200">
                          {issue}
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

      {/* Delete Meeting Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete this meeting?"
        description="This will permanently remove this meeting and its extracted commitments."
        confirmButtonText="Delete Meeting"
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleDeleteMeeting}
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
