"use client";

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Clock, ArrowRight, CheckSquare, Layers } from 'lucide-react';
import { projectsNeedingAttention, pendingCommitments } from '@/data/mockData';

export const ProjectsNeedingAttention: React.FC = () => {
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
            {projectsNeedingAttention.length} Flagged
          </span>
        </div>

        {/* Project Attention Cards */}
        <div className="space-y-4">
          {projectsNeedingAttention.map((project) => (
            <div
              key={project.id}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                project.code === 'APOLLO'
                  ? 'bg-amber-500/5 border-amber-500/30 shadow-md shadow-amber-500/5'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Link href={project.code === 'APOLLO' ? '/projects/apollo' : '/projects'} className="text-sm font-bold text-slate-100 hover:text-indigo-400 transition-colors">
                    {project.name}
                  </Link>
                  {project.code === 'APOLLO' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      PRIMARY
                    </span>
                  )}
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
                <Link href="/commitments" className="hover:text-amber-300 transition-colors">
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
                    Next Scheduled Sync
                  </span>
                  <span className="text-slate-200 font-bold flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    {project.nextMeeting}
                  </span>
                </div>
              </div>

              {/* Outstanding commitments sub-list for Apollo */}
              {project.code === 'APOLLO' && (
                <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Top Pending Commitments for Apollo:
                  </span>
                  {pendingCommitments.slice(0, 2).map((item) => (
                    <Link key={item.id} href="/commitments" className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-800/60 hover:border-indigo-500/40 transition-colors">
                      <span className="truncate pr-2">• {item.task}</span>
                      <span className="text-[10px] text-indigo-300 font-mono shrink-0">{item.assignee}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-4 mt-4 border-t border-slate-800/80">
        <Link href="/commitments" className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all duration-150">
          <span>Resolve Apollo Commitments</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
