"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Clock, ArrowRight, CheckSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { apiGet } from '@/lib/api';
import { Project, Commitment, Meeting } from '@/lib/types';

interface ProjectAttentionItem {
  id: string;
  name: string;
  code: string;
  priority: 'High' | 'Medium';
  reason: string;
  pendingCommitments: number;
  topCommitments: Commitment[];
  latestMeetingDate: string;
}

export const ProjectsNeedingAttention: React.FC = () => {
  const [attentionProjects, setAttentionProjects] = useState<ProjectAttentionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [projects, commitments, meetings] = await Promise.all([
          apiGet<Project[]>('/projects').catch(() => [] as Project[]),
          apiGet<Commitment[]>('/commitments').catch(() => [] as Commitment[]),
          apiGet<Meeting[]>('/meetings').catch(() => [] as Meeting[])
        ]);

        const items: ProjectAttentionItem[] = [];

        for (const proj of projects) {
          const projCommitments = commitments.filter(c => c.project_id === proj.id && c.status === 'pending');
          const projMeetings = meetings.filter(m => m.project_id === proj.id);
          const hasUnresolvedIssues = projMeetings.some(m => Boolean(m.unresolved_issues && m.unresolved_issues.trim()));

          if (projCommitments.length > 0 || hasUnresolvedIssues) {
            const code = proj.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase() || 'PROJ';
            let reason = '';
            if (projCommitments.length > 0 && hasUnresolvedIssues) {
              reason = `${projCommitments.length} pending commitments and unresolved meeting issues flagged.`;
            } else if (projCommitments.length > 0) {
              reason = `${projCommitments.length} action item${projCommitments.length > 1 ? 's' : ''} awaiting completion.`;
            } else {
              reason = 'Open issues flagged in recent meeting discussions.';
            }

            const latestMeeting = projMeetings[0];
            const dateStr = latestMeeting 
              ? new Date(latestMeeting.meeting_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'Recent';

            items.push({
              id: proj.id,
              name: proj.name,
              code,
              priority: projCommitments.length >= 2 || hasUnresolvedIssues ? 'High' : 'Medium',
              reason,
              pendingCommitments: projCommitments.length,
              topCommitments: projCommitments.slice(0, 2),
              latestMeetingDate: dateStr
            });
          }
        }

        setAttentionProjects(items);
      } catch (err) {
        console.error('Failed to load attention projects:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Projects Needing Attention
              </h2>
              <p className="text-xs text-slate-400">
                Active alerts & commitment blockers
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {attentionProjects.length} Flagged
          </span>
        </div>

        {/* Project Attention Cards */}
        {loading ? (
          <div className="p-8 text-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
            <p className="text-xs text-slate-500">Checking project health...</p>
          </div>
        ) : attentionProjects.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-slate-800/60 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-200">All clear!</p>
            <p className="text-xs text-slate-500">No projects currently require immediate attention.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attentionProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl border transition-all duration-200 bg-amber-500/5 border-amber-500/30 shadow-md shadow-amber-500/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/projects/${project.id}`} 
                      className="text-sm font-bold text-slate-100 hover:text-indigo-400 transition-colors"
                    >
                      {project.name}
                    </Link>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {project.code}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    project.priority === 'High'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {project.priority} Priority
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {project.reason}
                </p>

                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400 mb-3">
                  <Link href={`/commitments?project=${project.id}`} className="hover:text-amber-300 transition-colors">
                    <span className="text-[10px] uppercase text-slate-500 block font-semibold">
                      Pending Commitments
                    </span>
                    <span className="text-slate-200 font-bold flex items-center gap-1 mt-0.5">
                      <CheckSquare className="w-3 h-3 text-amber-400" />
                      {project.pendingCommitments} Action Items
                    </span>
                  </Link>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block font-semibold">
                      Last Recorded Sync
                    </span>
                    <span className="text-slate-200 font-bold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      {project.latestMeetingDate}
                    </span>
                  </div>
                </div>

                {/* Top outstanding commitments sub-list */}
                {project.topCommitments.length > 0 && (
                  <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Top Pending Commitments:
                    </span>
                    {project.topCommitments.map((item) => (
                      <Link 
                        key={item.id} 
                        href={`/commitments?project=${project.id}`} 
                        className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-800/60 hover:border-indigo-500/40 transition-colors"
                      >
                        <span className="truncate pr-2">• {item.description}</span>
                        <span className="text-[10px] text-indigo-300 font-mono shrink-0">{item.owner_name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="pt-4 mt-4 border-t border-slate-800/80">
        <Link 
          href="/commitments" 
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all duration-150"
        >
          <span>Resolve Pending Commitments</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
