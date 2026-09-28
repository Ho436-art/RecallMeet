"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Users, 
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
  Compass
} from 'lucide-react';
import { apolloPreparePageData } from '@/data/mockData';

export default function PrepareMePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGeneratedResult, setHasGeneratedResult] = useState(false);

  const prepData = apolloPreparePageData;

  const handleGeneratePreparation = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGeneratedResult(true);
    }, 1100);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab="prepare" />

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
            <span className="text-slate-200 font-medium">Prepare Me</span>
          </div>

          {/* Page Banner Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {prepData.projectCode}
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
                Personalized executive briefing synthesized from 12 past <span className="text-indigo-300 font-medium">Project Apollo</span> meetings.
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/prepare/feedback"
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Prep Feedback</span>
              </Link>

              <button
                onClick={handleGeneratePreparation}
                disabled={isGenerating}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:bg-indigo-900 text-white text-xs font-bold flex items-center gap-2.5 shadow-xl shadow-indigo-500/20 transition-all duration-150"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-200" />
                    <span>Synthesizing Apollo Insights...</span>
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

          {/* Generated Preparation Result Section (Shown when generated or toggled) */}
          {hasGeneratedResult && (
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
                      Synthesized Executive Recall for Alex Morgan
                    </h2>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Confidence Score: 98%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Executive Summary */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-indigo-400" />
                    Executive Summary
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {prepData.generatedBriefing.executiveSummary}
                  </p>
                </div>

                {/* Strategic Overview */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    Strategic Alignment
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {prepData.generatedBriefing.strategicOverview}
                  </p>
                </div>
              </div>

              {/* Action Plan & Risk Mitigations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-200 block">Recommended Action Sequence:</span>
                  <ul className="space-y-1.5 text-slate-300">
                    {prepData.generatedBriefing.actionPlan.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-400 block">Risk Mitigation Strategies:</span>
                  <ul className="space-y-1.5 text-slate-300">
                    {prepData.generatedBriefing.riskMitigations.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Meeting Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Target Upcoming Meeting
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Scheduled Today
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-100">
              {prepData.upcomingMeeting.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                {prepData.upcomingMeeting.dateTime} ({prepData.upcomingMeeting.duration})
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Location: {prepData.upcomingMeeting.location}</span>
            </div>

            <p className="text-xs text-slate-300 pl-3 border-l-2 border-indigo-500/50 leading-relaxed">
              <strong>Objective:</strong> {prepData.upcomingMeeting.objective}
            </p>
          </div>

          {/* Grid Layout for Meeting Context & History */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column (2 Cols): Recommended Focus, Topics, Past History & Decisions */}
            <div className="lg:col-span-2 space-y-6">

              {/* Recommended Focus Highlight Box */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/30 shadow-lg space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <Compass className="w-4 h-4" />
                  <h3 className="text-base font-bold text-slate-100">
                    Recommended Focus for Alex Morgan
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-6 border-l-2 border-indigo-500">
                  {prepData.recommendedFocus}
                </p>
              </div>

              {/* Topics To Bring Up */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold text-slate-100">
                    Suggested Topics to Bring Up
                  </h3>
                </div>

                <div className="space-y-2">
                  {prepData.topicsToBringUp.map((topic, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

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
                    {prepData.pastMeetingHistory.length} Previous Syncs
                  </span>
                </div>

                <div className="space-y-3">
                  {prepData.pastMeetingHistory.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-200">{item.title}</h4>
                        <span className="text-[11px] text-slate-500 font-mono">{item.dateTime}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">"{item.summarySnippet}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Decisions */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-bold text-slate-100">
                    Key Past Decisions to Keep Top-of-Mind
                  </h3>
                </div>

                <div className="space-y-3">
                  {prepData.keyDecisions.map((decision) => (
                    <div key={decision.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{decision.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{decision.date}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{decision.context}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (1 Col): Important People/Context, Pending Commitments & Unresolved Issues */}
            <div className="lg:col-span-1 space-y-6">

              {/* Important People / Context */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-base font-bold text-slate-100">
                      Important Attendees & Context
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {prepData.importantPeopleContext.map((person) => (
                    <div key={person.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${person.avatarBg} flex items-center justify-center text-white font-bold text-[10px]`}>
                          {person.initials}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">{person.name}</p>
                          <p className="text-[10px] text-slate-500">{person.role}</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-indigo-300 pl-2 border-l border-indigo-500/40">
                        <strong>Priority Focus:</strong> {person.priorityFocus}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

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
                    {prepData.pendingCommitments.length} Active
                  </span>
                </div>

                <div className="space-y-2.5">
                  {prepData.pendingCommitments.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                      <p className="font-medium text-slate-200">{item.task}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                        <span className="text-indigo-300 font-mono">{item.assignee}</span>
                        <span className="text-amber-400 font-semibold">Due {item.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
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
                    {prepData.unresolvedIssues.length} Flagged
                  </span>
                </div>

                <div className="space-y-2.5">
                  {prepData.unresolvedIssues.map((issue) => (
                    <div key={issue.id} className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                          {issue.severity}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{issue.owner}</span>
                      </div>
                      <p className="font-semibold text-slate-200">{issue.issue}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
