"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ChevronRight, FileText, Sparkles, Loader2 } from 'lucide-react';
import { apiGet } from '@/lib/api';
import { Meeting, Project } from '@/lib/types';

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

export const RecentMeetings: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeetings() {
      try {
        setLoading(true);
        const [loadedMeetings, loadedProjects] = await Promise.all([
          apiGet<Meeting[]>('/meetings').catch(() => [] as Meeting[]),
          apiGet<Project[]>('/projects').catch(() => [] as Project[])
        ]);

        setMeetings(loadedMeetings);
        setProjects(loadedProjects);
      } catch (err) {
        console.error('Failed to load recent meetings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMeetings();
  }, []);

  const getProjectName = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    return proj ? proj.name : 'Project';
  };

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
              Transcripts & AI insights from recent syncs
            </p>
          </div>
        </div>
        <Link 
          href="/projects" 
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          View All Projects
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="p-8 text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto" />
          <p className="text-xs text-slate-500">Loading recent meetings...</p>
        </div>
      ) : meetings.length === 0 ? (
        <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-slate-800/60 space-y-2">
          <p className="text-xs text-slate-400">No meetings uploaded yet.</p>
          <Link
            href="/meetings/upload"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
          >
            <span>Upload Meeting</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {meetings.slice(0, 5).map((meeting) => {
            const projName = getProjectName(meeting.project_id);

            return (
              <div
                key={meeting.id}
                className="group p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                      {projName}
                    </span>
                    <Link
                      href={`/meetings/${meeting.id}`}
                      className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors"
                    >
                      {meeting.title}
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {formatDate(meeting.meeting_date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Sync
                    </span>
                  </div>
                </div>

                {/* Summary Snippet */}
                <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed pl-3 border-l-2 border-indigo-500/40">
                  {meeting.summary ? `"${meeting.summary}"` : 'Summary pending Groq analysis.'}
                </p>

                {/* Footer row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 text-xs">
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="text-indigo-300 font-medium">
                      Project: {projName}
                    </span>
                  </div>

                  <Link 
                    href={`/meetings/${meeting.id}`}
                    className="text-xs font-medium text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg hover:border-slate-700 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    View Meeting Detail
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
