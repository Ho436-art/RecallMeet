export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Meeting {
  id: string;
  project_id: string;
  title: string;
  meeting_date: string;
  transcript: string;
  summary: string | null;
  decisions: string | null;
  unresolved_issues: string | null;
  created_at: string;
}

export interface Commitment {
  id: string;
  project_id: string;
  meeting_id: string;
  description: string;
  owner_name: string;
  due_date: string | null;
  status: 'pending' | 'in_progress' | 'completed' | string;
  created_at: string;
}

export interface PreparationResponse {
  project_id: string;
  project_name: string;
  preparation: string;
}

export interface PrepFeedbackPayload {
  usefulness_rating: number;
  what_was_useful?: string;
  what_was_missing?: string;
  focus_next_time?: string;
}

export interface PrepFeedbackResponse {
  id: string;
  project_id: string;
  usefulness_rating: number;
  what_was_useful: string | null;
  what_was_missing: string | null;
  focus_next_time: string | null;
  created_at: string;
}

export interface MeetingAnalysisResponse {
  summary: string;
  decisions: string;
  unresolved_issues: string;
  commitments: string;
}
