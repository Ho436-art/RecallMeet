"use client";

import React, { useState } from 'react';
import Link from 'next/link';
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
  X,
  ChevronRight
} from 'lucide-react';
import { 
  apolloDetailData, 
  recentMeetings, 
  pendingCommitments 
} from '@/data/mockData';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPrepareModal, setShowPrepareModal] = useState(false);

  const project = apolloDetailData; // Mock data focused on Project Apollo

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

          {/* Project Banner Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {project.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {project.status}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
                {project.name}
              </h1>
              <p className="text-sm font-medium text-indigo-300 mt-1">
                {project.tagline}
              </p>
            </div>

            {/* Action Buttons: Upload Meeting & Prepare Me */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Prepare Me Button */}
              <Link
                href="/prepare/apollo"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all duration-150"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Prepare Me</span>
              </Link>

              {/* Upload Meeting Button */}
              <Link
                href="/meetings/upload"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all duration-150"
              >
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Upload Meeting</span>
              </Link>
            </div>
          </div>

          {/* Project Overview Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-indigo-400" />
              Project Overview
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              {project.overview}
            </p>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Total Meetings</span>
                <span className="text-xl font-bold text-slate-100 flex items-center gap-1.5 mt-1">
                  <CalendarDays className="w-4 h-4 text-indigo-400" />
                  {project.totalMeetings}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Pending Commitments</span>
                <span className="text-xl font-bold text-amber-400 flex items-center gap-1.5 mt-1">
                  <CheckSquare className="w-4 h-4" />
                  {project.pendingCommitmentsCount}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Resolved Items</span>
                <span className="text-xl font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {project.resolvedCommitmentsCount}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Project Health</span>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1 mt-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  {project.health}
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
                      Recent Apollo Meetings
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400">
                    {recentMeetings.length} Recorded Syncs
                  </span>
                </div>

                <div className="space-y-3.5">
                  {recentMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <Link href="/meetings/m-1" className="text-sm font-semibold text-slate-200 hover:text-indigo-300 transition-colors">
                          {meeting.title}
                        </Link>
                        <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {meeting.dateTime}
                          </span>
                          <span>({meeting.duration})</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 mb-3 pl-3 border-l-2 border-indigo-500/40">
                        "{meeting.summarySnippet}"
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                        <span>{meeting.participantsCount} Team Members</span>
                        <span className="text-emerald-400 font-medium">
                          {meeting.commitmentsCount} Commitments Extracted
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Decisions Section */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800/80">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h2 className="text-base font-bold text-slate-100">
                    Key Decisions
                  </h2>
                </div>

                <div className="space-y-3">
                  {project.keyDecisions.map((decision) => (
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
                      <div className="pt-1 pl-4 text-[11px] text-indigo-400 font-medium">
                        Agreed by: {decision.agreedBy}
                      </div>
                    </div>
                  ))}
                </div>
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
                      Team Participants
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">
                    {project.participants.length} Members
                  </span>
                </div>

                <div className="space-y-3">
                  {project.participants.map((member) => (
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
              </div>

              {/* Pending Commitments Section */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                  <Link href="/commitments" className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                    <h2 className="text-base font-bold text-slate-100">
                      Pending Commitments
                    </h2>
                  </Link>
                  <Link href="/commitments" className="text-xs font-bold text-amber-400 hover:underline">
                    {pendingCommitments.length} Pending →
                  </Link>
                </div>

                <div className="space-y-3">
                  {pendingCommitments.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1.5"
                    >
                      <p className="font-medium text-slate-200 leading-snug">
                        {item.task}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="text-indigo-300 font-mono">{item.assignee}</span>
                        <span className="text-amber-400 font-semibold">Due {item.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
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
                    {project.unresolvedIssues.length} Flagged
                  </span>
                </div>

                <div className="space-y-3">
                  {project.unresolvedIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                          {issue.severity} Severity
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Owner: {issue.owner}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-200">
                        {issue.issue}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Impact: {issue.impact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Prepare Me Modal */}
      {showPrepareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    AI Executive Briefing: Project Apollo
                  </h3>
                  <p className="text-xs text-indigo-300">
                    Generated instant recall for upcoming sync
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPrepareModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Briefing Content */}
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-slate-200">
                <span className="font-bold text-indigo-300 block mb-1">Executive Summary:</span>
                {project.prepareBriefing.executiveSummary}
              </div>

              <div>
                <h4 className="font-bold text-slate-200 mb-2">Key Takeaways for Today's Sync:</h4>
                <ul className="space-y-1.5 text-slate-300">
                  {project.prepareBriefing.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 mb-2">Recommended Talking Points:</h4>
                <ul className="space-y-1.5 text-slate-300">
                  {project.prepareBriefing.recommendedActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowPrepareModal(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20"
            >
              Done / Ready for Meeting
            </button>
          </div>
        </div>
      )}

      {/* Upload Meeting Modal Info */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-indigo-400">
                <Upload className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-100">
                  Upload Meeting Audio / Transcript
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-indigo-300">
                📌 Step 3 Preview Info:
              </p>
              <p>
                The full Meeting Upload interface will be built in the next step (Step 4).
              </p>
            </div>

            <button
              onClick={() => setShowUploadModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
