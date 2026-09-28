/**
 * RecallMeet Mock API & Data Service Layer
 * ----------------------------------------
 * This service provides a centralized, type-safe interface for fetching and 
 * mutating RecallMeet application data.
 * 
 * DEVELOPER NOTE FOR BACKEND INTEGRATION:
 * To connect to a real backend / database / Hindsight API, replace the implementation
 * of these functions with standard `fetch()` or Axios requests to your backend endpoints.
 * The data interfaces (User, Project, Meeting, Commitment, PreparationResult, PrepFeedback)
 * match the required schema for production API payloads.
 */

import { 
  currentUser, 
  UserProfile, 
  projectsList, 
  ProjectItem, 
  apolloDetailData, 
  ApolloDetailData, 
  recentMeetings, 
  Meeting, 
  apolloMeetingDetail, 
  MeetingDetailData, 
  fullCommitmentsList, 
  CommitmentDetailItem, 
  apolloPreparePageData, 
  PreparePageData, 
  projectsNeedingAttention, 
  ProjectAttention 
} from '@/data/mockData';

// ---------------------------------------------------------------------------
// 1. User Service
// ---------------------------------------------------------------------------
export async function fetchCurrentUser(): Promise<UserProfile> {
  // Replace with: return fetch('/api/user/me').then(res => res.json());
  return currentUser;
}

// ---------------------------------------------------------------------------
// 2. Projects Service
// ---------------------------------------------------------------------------
export async function fetchProjects(): Promise<ProjectItem[]> {
  // Replace with: return fetch('/api/projects').then(res => res.json());
  return projectsList;
}

export async function fetchProjectById(id: string): Promise<ApolloDetailData> {
  // Replace with: return fetch(`/api/projects/${id}`).then(res => res.json());
  return apolloDetailData;
}

export async function fetchProjectsNeedingAttention(): Promise<ProjectAttention[]> {
  // Replace with: return fetch('/api/projects/attention').then(res => res.json());
  return projectsNeedingAttention;
}

// ---------------------------------------------------------------------------
// 3. Meetings Service
// ---------------------------------------------------------------------------
export async function fetchRecentMeetings(): Promise<Meeting[]> {
  // Replace with: return fetch('/api/meetings/recent').then(res => res.json());
  return recentMeetings;
}

export async function fetchMeetingById(id: string): Promise<MeetingDetailData> {
  // Replace with: return fetch(`/api/meetings/${id}`).then(res => res.json());
  return apolloMeetingDetail;
}

export interface UploadMeetingPayload {
  projectId: string;
  title?: string;
  dateTime: string;
  participants: string[];
  transcriptText?: string;
  file?: File | null;
}

export interface UploadMeetingResponse {
  success: boolean;
  meetingId: string;
  title: string;
  projectName: string;
  commitmentsCount: number;
  summary: string;
}

export async function uploadMeeting(payload: UploadMeetingPayload): Promise<UploadMeetingResponse> {
  // Replace with: return fetch('/api/meetings/upload', { method: 'POST', body: formData }).then(res => res.json());
  const project = projectsList.find(p => p.id === payload.projectId) || projectsList[0];
  const finalTitle = payload.title?.trim() || `${project.name} Sync & Action Item Extraction`;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        meetingId: 'm-1',
        title: finalTitle,
        projectName: project.name,
        commitmentsCount: 3,
        summary: `RecallMeet AI successfully ingested transcript for ${project.name}. Extracted 3 high-priority commitments.`
      });
    }, 1000);
  });
}

// ---------------------------------------------------------------------------
// 4. Commitments Service
// ---------------------------------------------------------------------------
export async function fetchCommitments(projectId?: string): Promise<CommitmentDetailItem[]> {
  // Replace with: return fetch(`/api/commitments?project=${projectId}`).then(res => res.json());
  if (!projectId || projectId === 'all') {
    return fullCommitmentsList;
  }
  return fullCommitmentsList.filter(c => c.projectName.toLowerCase().includes(projectId.toLowerCase()));
}

// ---------------------------------------------------------------------------
// 5. Preparation Service
// ---------------------------------------------------------------------------
export async function fetchPrepareData(projectId: string = 'apollo'): Promise<PreparePageData> {
  // Replace with: return fetch(`/api/prepare/${projectId}`).then(res => res.json());
  return apolloPreparePageData;
}

export async function generatePreparationBriefing(projectId: string = 'apollo'): Promise<PreparePageData['generatedBriefing']> {
  // Replace with: return fetch(`/api/prepare/${projectId}/generate`, { method: 'POST' }).then(res => res.json());
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(apolloPreparePageData.generatedBriefing);
    }, 1000);
  });
}

// ---------------------------------------------------------------------------
// 6. Prep Feedback Service
// ---------------------------------------------------------------------------
export interface PrepFeedbackPayload {
  projectId?: string;
  rating: number;
  usefulAspects: string[];
  whatWasMissing?: string;
  nextTimeFocus?: string;
}

export interface PrepFeedbackResponse {
  success: boolean;
  message: string;
  savedAt: string;
}

export async function submitPrepFeedback(payload: PrepFeedbackPayload): Promise<PrepFeedbackResponse> {
  // Replace with: return fetch('/api/prepare/feedback', { method: 'POST', body: JSON.stringify(payload) }).then(res => res.json());
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Feedback (${payload.rating}/5 rating) saved successfully for future Project Apollo briefings.`,
        savedAt: new Date().toISOString()
      });
    }, 800);
  });
}
