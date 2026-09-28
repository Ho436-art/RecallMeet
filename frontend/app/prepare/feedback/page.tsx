"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { 
  Sparkles, 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  ArrowLeft, 
  Send, 
  AlertCircle, 
  Loader2, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { apiGet, apiPost } from '@/lib/api';
import { Project, PrepFeedbackResponse } from '@/lib/types';

function deriveProjectCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return clean.slice(0, 6) || 'PROJ';
}

function PrepFeedbackContent() {
  const searchParams = useSearchParams();
  const queryProjectId = searchParams.get('project');

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [rating, setRating] = useState<number>(5);
  const [usefulAspects, setUsefulAspects] = useState<string[]>([
    'Key Decisions Recall',
    'Pending Commitments Summary',
    'Attendee Priority Focus'
  ]);
  const [whatWasMissing, setWhatWasMissing] = useState('');
  const [nextTimeFocus, setNextTimeFocus] = useState('');
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const availableUsefulOptions = [
    'Key Decisions Recall',
    'Pending Commitments Summary',
    'Attendee Priority Focus',
    'Suggested Talking Points',
    'Recommended Action Sequence',
    'Unresolved Issues Warning'
  ];

  useEffect(() => {
    async function loadProjects() {
      try {
        const list = await apiGet<Project[]>('/projects');
        setProjects(list);

        if (list.length > 0) {
          const matched = queryProjectId
            ? list.find(p => p.id === queryProjectId || p.name.toLowerCase() === queryProjectId.toLowerCase())
            : list[0];

          const activeId = matched ? matched.id : list[0].id;
          setSelectedProjectId(activeId);
          setSelectedProject(matched || list[0]);
        }
      } catch (err) {
        console.error('Failed to load projects for feedback:', err);
      }
    }

    loadProjects();
  }, [queryProjectId]);

  useEffect(() => {
    if (selectedProjectId && projects.length > 0) {
      const found = projects.find(p => p.id === selectedProjectId) || null;
      setSelectedProject(found);
    }
  }, [selectedProjectId, projects]);

  const toggleUsefulOption = (option: string) => {
    if (usefulAspects.includes(option)) {
      setUsefulAspects(usefulAspects.filter(o => o !== option));
    } else {
      setUsefulAspects([...usefulAspects, option]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProjectId) {
      setValidationError("Please select a project for this feedback.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setValidationError("Please select a preparation rating between 1 and 5 stars.");
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      await apiPost<PrepFeedbackResponse>(
        `/projects/${selectedProjectId}/feedback`,
        {
          usefulness_rating: rating,
          what_was_useful: usefulAspects.length > 0 ? usefulAspects.join(', ') : undefined,
          what_was_missing: whatWasMissing.trim() || undefined,
          focus_next_time: nextTimeFocus.trim() || undefined
        }
      );

      setSubmittedSuccess(true);
    } catch (err) {
      console.error('Failed to submit prep feedback:', err);
      setValidationError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRating(5);
    setUsefulAspects(['Key Decisions Recall', 'Pending Commitments Summary']);
    setWhatWasMissing('');
    setNextTimeFocus('');
    setSubmittedSuccess(false);
    setValidationError(null);
  };

  const projectName = selectedProject ? selectedProject.name : 'Project';
  const projectCode = selectedProject ? deriveProjectCode(selectedProject.name) : 'PROJ';

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab="prepare" />

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link 
              href={selectedProjectId ? `/prepare?project=${selectedProjectId}` : '/prepare'} 
              className="hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Prepare Me</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-medium">Preparation Feedback</span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  {projectCode}
                </span>
                <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight mt-0.5">
                  How was this preparation?
                </h1>
                <p className="text-xs text-slate-400">
                  Help refine future AI recall briefings for <span className="text-indigo-300 font-medium">{projectName}</span>. Feedback is ingested into long-term memory.
                </p>
              </div>
            </div>

            {/* Project Picker */}
            {projects.length > 1 && (
              <div className="shrink-0">
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Submission Success State */}
          {submittedSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-slate-100 space-y-4 shadow-xl shadow-emerald-500/5 animate-in fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-emerald-500/20">
                <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    FEEDBACK INGESTED INTO LONG-TERM MEMORY
                  </span>
                  <h2 className="text-lg font-bold text-slate-100 mt-0.5">
                    Thank you for rating {projectName}'s meeting preparation!
                  </h2>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Your evaluation ({rating}/5 rating) has been saved in PostgreSQL and committed into Hindsight long-term memory. The next time you trigger "Prepare Me" for this project, the briefing will adapt to your feedback.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  href={`/prepare?project=${selectedProjectId}`}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Prepare Me Again (See Updated Learning)</span>
                </Link>

                <Link
                  href={`/projects/${selectedProjectId}`}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700"
                >
                  <span>Return to {projectName}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
                >
                  Submit Additional Feedback
                </button>
              </div>
            </div>
          ) : (

            /* Feedback Form */
            <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">

              {/* 1. Rating / Usefulness Options */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-200 block">
                  1. Rating & Overall Preparation Usefulness <span className="text-amber-400">*</span>
                </label>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-2.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                        rating >= star
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                          : 'bg-slate-950 text-slate-600 border-slate-800 hover:text-slate-400'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-slate-300 ml-2 font-mono">
                    {rating === 5 && "⭐ Extremely Useful (5/5)"}
                    {rating === 4 && "⭐ Very Useful (4/5)"}
                    {rating === 3 && "⭐ Somewhat Useful (3/5)"}
                    {rating === 2 && "⭐ Slightly Useful (2/5)"}
                    {rating === 1 && "⭐ Not Useful (1/5)"}
                  </span>
                </div>
              </div>

              {/* 2. What was useful? */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-200 block">
                  2. What was useful in this preparation briefing?
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableUsefulOptions.map((option) => {
                    const isChecked = usefulAspects.includes(option);
                    return (
                      <button
                        type="button"
                        key={option}
                        onClick={() => toggleUsefulOption(option)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-medium text-left transition-all ${
                          isChecked
                            ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                            : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. What was missing? */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 block">
                  3. What details or context were missing from the preparation?
                </label>
                <textarea
                  rows={3}
                  value={whatWasMissing}
                  onChange={(e) => setWhatWasMissing(e.target.value)}
                  placeholder="e.g. The client concern about the project timeline needed more attention..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors leading-relaxed"
                />
              </div>

              {/* 4. What should I focus on next time? */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 block">
                  4. What should the preparation focus on for future {projectName} meetings?
                </label>
                <textarea
                  rows={3}
                  value={nextTimeFocus}
                  onChange={(e) => setNextTimeFocus(e.target.value)}
                  placeholder="e.g. Prioritize client concerns about project timeline and unblock authentication flow..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors leading-relaxed"
                />
              </div>

              {/* Submit Action Button */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-3">
                <Link
                  href={selectedProjectId ? `/prepare?project=${selectedProjectId}` : '/prepare'}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all duration-150"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-200" />
                      <span>Saving Feedback to Hindsight...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-indigo-200" />
                      <span>Submit Preparation Feedback</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function PrepFeedbackPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    }>
      <PrepFeedbackContent />
    </React.Suspense>
  );
}
