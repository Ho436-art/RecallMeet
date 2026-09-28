"use client";

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, CheckCircle2, ChevronRight, FileText, Sparkles } from 'lucide-react';
import { recentMeetings } from '@/data/mockData';

export const RecentMeetings: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Recent Meetings
            </h2>
            <p className="text-xs text-slate-400">
              Transcripts & AI insights for <span className="text-indigo-300 font-medium">Project Apollo</span>
            </p>
          </div>
        </div>
        <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
          View All Meetings
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3.5">
        {recentMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="group p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                  {meeting.projectName}
                </span>
                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                  {meeting.title}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {meeting.dateTime}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {meeting.duration}
                </span>
              </div>
            </div>

            {/* Summary Snippet */}
            <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed pl-3 border-l-2 border-indigo-500/40">
              "{meeting.summarySnippet}"
            </p>

            {/* Footer row: Participants & Commitments tag */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 text-xs">
              <div className="flex items-center gap-3 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>{meeting.participantsCount} Participants</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{meeting.commitmentsCount} Commitments Extracted</span>
                </span>
              </div>

              <Link 
                href="/meetings/m-1"
                className="text-xs font-medium text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg hover:border-slate-700 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                View Recall Summary
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
