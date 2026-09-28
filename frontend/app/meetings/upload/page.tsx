"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { 
  Upload, 
  FileText, 
  Calendar, 
  Users, 
  FolderKanban, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles, 
  File, 
  X, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { projectsList, apolloDetailData } from '@/data/mockData';
import { uploadMeeting } from '@/lib/mockApi';

export default function MeetingUploadPage() {
  const [selectedProjectId, setSelectedProjectId] = useState('apollo');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('2026-09-28T10:00');
  const [transcriptText, setTranscriptText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Selected participant IDs
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([
    'part-1', 'part-2', 'part-3'
  ]);

  // Form states
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [mockResult, setMockResult] = useState<{
    title: string;
    projectName: string;
    commitmentsCount: number;
    summary: string;
  } | null>(null);

  // Available participants list from Apollo detail data
  const availableParticipants = apolloDetailData.participants;

  const toggleParticipant = (id: string) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(selectedParticipants.filter(p => p !== id));
    } else {
      setSelectedParticipants([...selectedParticipants, id]);
    }
  };

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setValidationError(null);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation check
    if (!selectedProjectId) {
      setValidationError("Please select a target project for this meeting.");
      return;
    }

    if (!transcriptText.trim() && !selectedFile) {
      setValidationError("Please provide a meeting transcript by either pasting text or uploading a file (.txt, .vtt, .docx, .mp3).");
      return;
    }

    if (selectedParticipants.length === 0) {
      setValidationError("Please select at least one participant who attended the meeting.");
      return;
    }

    // Clear validation error and initiate simulated upload
    setValidationError(null);
    setIsUploading(true);

    uploadMeeting({
      projectId: selectedProjectId,
      title: meetingTitle,
      dateTime: meetingDate,
      participants: selectedParticipants,
      transcriptText,
      file: selectedFile
    }).then((res) => {
      setIsUploading(false);
      setUploadSuccess(true);
      setMockResult({
        title: res.title,
        projectName: res.projectName,
        commitmentsCount: res.commitmentsCount,
        summary: res.summary
      });
    });
  };

  const handleReset = () => {
    setMeetingTitle('');
    setTranscriptText('');
    setSelectedFile(null);
    setUploadSuccess(false);
    setMockResult(null);
    setValidationError(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans">
      {/* Sidebar Navigation with Upload active */}
      <Sidebar activeTab="upload" />

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header & Breadcrumb */}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Link href="/projects" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Projects</span>
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-slate-200 font-medium">Upload Meeting</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                  Upload Meeting Transcript
                </h1>
                <p className="text-xs text-slate-400">
                  Upload meeting audio, transcripts, or notes to extract commitments for <span className="text-indigo-300 font-medium">Project Apollo</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-red-200">Validation Required</h4>
                <p className="mt-0.5 leading-relaxed">{validationError}</p>
              </div>
              <button onClick={() => setValidationError(null)} className="text-red-400 hover:text-red-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Success Result Banner */}
          {uploadSuccess && mockResult ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-slate-100 space-y-4 animate-in fade-in shadow-xl shadow-emerald-500/5">
              <div className="flex items-center gap-3 pb-3 border-b border-emerald-500/20">
                <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    INGESTION SUCCESSFUL
                  </span>
                  <h2 className="text-lg font-bold text-slate-100 mt-0.5">
                    {mockResult.title}
                  </h2>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {mockResult.summary}
              </p>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Assigned Project</span>
                  <span className="text-indigo-300 font-bold block mt-0.5">{mockResult.projectName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Extracted Action Items</span>
                  <span className="text-emerald-400 font-bold block mt-0.5">{mockResult.commitmentsCount} Commitments Added</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  href="/meetings/m-1"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <FileText className="w-4 h-4 text-indigo-200" />
                  <span>View Meeting Detail</span>
                </Link>

                <Link
                  href="/projects/apollo"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700"
                >
                  <span>View Project Apollo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  Upload Another Meeting
                </button>
              </div>
            </div>
          ) : (

            /* Meeting Upload Form */
            <form onSubmit={handleUploadSubmit} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">

              {/* 1. Project Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-indigo-400" />
                  Select Target Project <span className="text-amber-400">*</span>
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
                >
                  {projectsList.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name} ({proj.code}) - {proj.status}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  Meeting insights and commitments will automatically link to this project.
                </p>
              </div>

              {/* 2. Optional Meeting Title & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Meeting Title */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    Meeting Title <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="e.g. Apollo Architecture & Milestone Alignment"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>

                {/* Meeting Date */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    Meeting Date & Time <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* 3. Participants Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    Meeting Participants <span className="text-amber-400">*</span>
                  </span>
                  <span className="text-[11px] text-indigo-400 font-normal">
                    {selectedParticipants.length} Selected
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  {availableParticipants.map((member) => {
                    const isSelected = selectedParticipants.includes(member.id);
                    return (
                      <button
                        type="button"
                        key={member.id}
                        onClick={() => toggleParticipant(member.id)}
                        className={`flex items-center gap-2.5 p-2 rounded-lg text-xs transition-all text-left ${
                          isSelected
                            ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${member.avatarBg} flex items-center justify-center text-white font-bold text-[10px]`}>
                          {member.initials}
                        </div>
                        <span className="truncate">{member.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Transcript Upload & Paste Area */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    Meeting Transcript / Audio File <span className="text-amber-400">*</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Supported: .vtt, .txt, .docx, .mp3, .m4a
                  </span>
                </label>

                {/* Dropzone Container */}
                <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 bg-slate-950/60 text-center transition-colors">
                  {selectedFile ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-indigo-500/30 text-xs">
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-indigo-400 shrink-0" />
                        <div className="text-left truncate">
                          <p className="font-semibold text-slate-200 truncate">{selectedFile.name}</p>
                          <p className="text-[10px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-slate-400 hover:text-red-400 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-80" />
                      <p className="text-xs font-semibold text-slate-300">
                        Drag and drop your transcript file here, or{' '}
                        <label className="text-indigo-400 hover:text-indigo-300 cursor-pointer underline">
                          browse files
                          <input
                            type="file"
                            accept=".txt,.vtt,.docx,.mp3,.m4a"
                            onChange={handleFileDrop}
                            className="hidden"
                          />
                        </label>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Max file size: 50MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Paste Transcript Textarea Option */}
                <div className="relative">
                  <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
                    Or paste raw meeting transcript text directly:
                  </span>
                  <textarea
                    rows={4}
                    value={transcriptText}
                    onChange={(e) => setTranscriptText(e.target.value)}
                    placeholder="[10:00 AM] Alex Morgan: Welcome team, today we will finalize the Project Apollo component architecture..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors font-mono leading-relaxed"
                  />
                </div>
              </div>

              {/* 5. Submit Action Button */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-3">
                <Link
                  href="/projects/apollo"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all duration-150"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-200" />
                      <span>Ingesting Transcript...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-indigo-200" />
                      <span>Upload & Extract Commitments</span>
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
