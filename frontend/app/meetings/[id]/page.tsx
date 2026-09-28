"use client";

import React, { useState } from 'react';
import Link from 'next/link';
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
  X,
  Share2
} from 'lucide-react';
import { apolloMeetingDetail, apolloDetailData } from '@/data/mockData';

export default function MeetingDetailPage({ params }: { params: { id: string } }) {
  const [showPrepareModal, setShowPrepareModal] = useState(false);
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(true);

  const meeting = apolloMeetingDetail; // Focus on Apollo realistic mock meeting detail

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab="meetings" />

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
            <span className="text-slate-200 font-medium">Meeting Detail</span>
          </div>

          {/* Meeting Banner Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {meeting.projectCode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {meeting.status}
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight">
                {meeting.title}
              </h1>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  {meeting.dateTime}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {meeting.duration}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  {meeting.participants.length} Participants
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Prepare Me Button */}
              <Link
                href="/prepare/apollo"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all duration-150"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Prepare Me</span>
              </Link>

              <button
                onClick={() => alert("Meeting summary exported!")}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
              >
                <Share2 className="w-4 h-4 text-slate-400" />
                <span>Export Summary</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Main Meeting Intelligence (2 cols) & Sidebar Metadata (1 col) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column (2 Cols): Discussion Points, Key Decisions & Transcript */}
            <div className="lg:col-span-2 space-y-6">

              {/* Discussion Points Section */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800/80">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-base font-bold text-slate-100">
                    Discussion Points
                  </h2>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  {meeting.discussionPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
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
                  {meeting.keyDecisions.map((decision) => (
                    <div
                      key={decision.id}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
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
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {meeting.transcript.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold flex items-center justify-center">
                              {item.initials}
                            </span>
                            {item.speaker}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed pl-6">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column (1 Col): Participants, Commitments & Unresolved Issues */}
            <div className="lg:col-span-1 space-y-6">

              {/* Participants */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-base font-bold text-slate-100">
                      Participants
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">
                    {meeting.participants.length} Present
                  </span>
                </div>

                <div className="space-y-3">
                  {meeting.participants.map((member) => (
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
                    </div>
                  ))}
                </div>
              </div>

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
                    {meeting.commitments.length} Action Items
                  </span>
                </div>

                <div className="space-y-3">
                  {meeting.commitments.map((item) => (
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
                    {meeting.unresolvedIssues.length} Flagged
                  </span>
                </div>

                <div className="space-y-3">
                  {meeting.unresolvedIssues.map((issue) => (
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
                    AI Briefing: {meeting.title}
                  </h3>
                  <p className="text-xs text-indigo-300">
                    Executive recall summary for Project Apollo
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

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-slate-200">
                <span className="font-bold text-indigo-300 block mb-1">Executive Summary:</span>
                {apolloDetailData.prepareBriefing.executiveSummary}
              </div>

              <div>
                <h4 className="font-bold text-slate-200 mb-2">Key Discussion Highlights:</h4>
                <ul className="space-y-1.5 text-slate-300">
                  {meeting.discussionPoints.slice(0, 3).map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 mb-2">Required Action Item Signoffs:</h4>
                <ul className="space-y-1.5 text-slate-300">
                  {meeting.commitments.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>{c.assignee}</strong>: {c.task} (Due {c.dueDate})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowPrepareModal(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20"
            >
              Done / Close Briefing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
