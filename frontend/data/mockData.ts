export interface UserProfile {
  name: string;
  role: string;
  email: string;
  avatarUrl: string;
  initials: string;
}

export interface Meeting {
  id: string;
  title: string;
  projectName: string;
  dateTime: string;
  duration: string;
  participantsCount: number;
  participants: string[];
  summarySnippet: string;
  commitmentsCount: number;
  status: 'Completed' | 'Processing' | 'Upcoming';
}

export interface ProjectAttention {
  id: string;
  name: string;
  code: string;
  reason: string;
  pendingCommitments: number;
  nextMeeting: string;
  priority: 'High' | 'Medium' | 'Low';
  status: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  code: string;
  description: string;
  meetingsCount: number;
  pendingCommitmentsCount: number;
  lastActivity: string;
  status: 'Active' | 'Needs Attention' | 'Completed' | 'In Setup';
  tags: string[];
}

export interface Commitment {
  id: string;
  task: string;
  projectName: string;
  assignee: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface CommitmentDetailItem {
  id: string;
  projectName: string;
  projectCode: string;
  task: string;
  assigneeName: string;
  assigneeRole: string;
  assigneeInitials: string;
  assigneeAvatarBg: string;
  dueDate: string;
  status: 'Pending' | 'Completed' | 'Overdue' | 'In Progress';
  priority: 'High' | 'Medium' | 'Low';
  sourceMeeting: string;
}

export interface ProjectParticipant {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarBg: string;
  commitmentsAssigned: number;
}

export interface KeyDecision {
  id: string;
  title: string;
  date: string;
  context: string;
  agreedBy: string;
}

export interface UnresolvedIssue {
  id: string;
  issue: string;
  severity: 'High' | 'Medium' | 'Low';
  reportedDate: string;
  owner: string;
  impact: string;
}

export interface TranscriptUtterance {
  timestamp: string;
  speaker: string;
  initials: string;
  text: string;
}

export interface PersonContext {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarBg: string;
  priorityFocus: string;
}

export interface PreparePageData {
  projectName: string;
  projectCode: string;
  upcomingMeeting: {
    title: string;
    dateTime: string;
    duration: string;
    location: string;
    objective: string;
  };
  pastMeetingHistory: {
    id: string;
    title: string;
    dateTime: string;
    summarySnippet: string;
  }[];
  keyDecisions: KeyDecision[];
  pendingCommitments: Commitment[];
  unresolvedIssues: UnresolvedIssue[];
  importantPeopleContext: PersonContext[];
  topicsToBringUp: string[];
  recommendedFocus: string;
  generatedBriefing: {
    executiveSummary: string;
    strategicOverview: string;
    actionPlan: string[];
    riskMitigations: string[];
  };
}

export interface MeetingDetailData {
  id: string;
  title: string;
  projectName: string;
  projectCode: string;
  dateTime: string;
  duration: string;
  status: string;
  participants: ProjectParticipant[];
  discussionPoints: string[];
  keyDecisions: KeyDecision[];
  commitments: Commitment[];
  unresolvedIssues: UnresolvedIssue[];
  transcript: TranscriptUtterance[];
}

export interface ApolloDetailData {
  id: string;
  name: string;
  code: string;
  tagline: string;
  overview: string;
  status: string;
  health: string;
  totalMeetings: number;
  pendingCommitmentsCount: number;
  resolvedCommitmentsCount: number;
  participants: ProjectParticipant[];
  keyDecisions: KeyDecision[];
  unresolvedIssues: UnresolvedIssue[];
  prepareBriefing: {
    executiveSummary: string;
    keyTakeaways: string[];
    recommendedActions: string[];
  };
}

export interface DashboardStats {
  activeProjectsCount: number;
  upcomingMeetingsCount: number;
  pendingCommitmentsCount: number;
}

export const currentUser: UserProfile = {
  name: "Alex Morgan",
  role: "Lead Product Designer",
  email: "alex.morgan@recallmeet.io",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  initials: "AM"
};

export const dashboardStats: DashboardStats = {
  activeProjectsCount: 4,
  upcomingMeetingsCount: 3,
  pendingCommitmentsCount: 5,
};

export const projectsList: ProjectItem[] = [
  {
    id: "apollo",
    name: "Project Apollo",
    code: "APOLLO",
    description: "AI-Powered Meeting Memory & Commitment Tracker for High-Performing Product Teams.",
    meetingsCount: 12,
    pendingCommitmentsCount: 3,
    lastActivity: "20 mins ago",
    status: "Needs Attention",
    tags: ["Primary", "AI Core", "Hackathon"]
  },
  {
    id: "beacon",
    name: "Project Beacon",
    code: "BEACON",
    description: "Automated real-time client sync analyzer and action item dispatcher for account managers.",
    meetingsCount: 8,
    pendingCommitmentsCount: 2,
    lastActivity: "Yesterday, 4:15 PM",
    status: "Active",
    tags: ["Client Ops", "Automation"]
  },
  {
    id: "cipher",
    name: "Project Cipher",
    code: "CIPHER",
    description: "End-to-end encrypted meeting transcript vault and compliance audit logger.",
    meetingsCount: 15,
    pendingCommitmentsCount: 0,
    lastActivity: "3 days ago",
    status: "Completed",
    tags: ["Security", "Encryption"]
  },
  {
    id: "zenith",
    name: "Project Zenith",
    code: "ZENITH",
    description: "Executive team quarterly strategy tracking & commitment ledger.",
    meetingsCount: 5,
    pendingCommitmentsCount: 1,
    lastActivity: "Sep 24, 2026",
    status: "Active",
    tags: ["Executive", "Strategy"]
  }
];

export const fullCommitmentsList: CommitmentDetailItem[] = [
  {
    id: "com-1",
    projectName: "Project Apollo",
    projectCode: "APOLLO",
    task: "Finalize Apollo dashboard UI components & stat cards layout",
    assigneeName: "Alex Morgan",
    assigneeRole: "Lead Product Designer",
    assigneeInitials: "AM",
    assigneeAvatarBg: "from-indigo-500 to-purple-600",
    dueDate: "Today",
    status: "In Progress",
    priority: "High",
    sourceMeeting: "Apollo Architecture & Core Feature Alignment"
  },
  {
    id: "com-2",
    projectName: "Project Apollo",
    projectCode: "APOLLO",
    task: "Verify API endpoints for Apollo meeting summary feed",
    assigneeName: "Sarah Chen",
    assigneeRole: "Senior Frontend Engineer",
    assigneeInitials: "SC",
    assigneeAvatarBg: "from-emerald-500 to-teal-600",
    dueDate: "Tomorrow",
    status: "Pending",
    priority: "High",
    sourceMeeting: "Apollo Sprint Sync & Action Item Review"
  },
  {
    id: "com-3",
    projectName: "Project Apollo",
    projectCode: "APOLLO",
    task: "Prepare hackathon demo script focusing on Apollo project",
    assigneeName: "David Kim",
    assigneeRole: "AI Lead Specialist",
    assigneeInitials: "DK",
    assigneeAvatarBg: "from-violet-500 to-indigo-600",
    dueDate: "Sep 30",
    status: "Pending",
    priority: "Medium",
    sourceMeeting: "Apollo Client Feedback & UX Walkthrough"
  },
  {
    id: "com-4",
    projectName: "Project Apollo",
    projectCode: "APOLLO",
    task: "DB Schema Signoff & API Rate Limit Assessment",
    assigneeName: "Sarah Chen",
    assigneeRole: "Senior Frontend Engineer",
    assigneeInitials: "SC",
    assigneeAvatarBg: "from-emerald-500 to-teal-600",
    dueDate: "Sep 24 (Overdue)",
    status: "Overdue",
    priority: "High",
    sourceMeeting: "Apollo Architecture & Core Feature Alignment"
  },
  {
    id: "com-5",
    projectName: "Project Apollo",
    projectCode: "APOLLO",
    task: "Implement Dark Slate Tailwind CSS theme tokens",
    assigneeName: "Alex Morgan",
    assigneeRole: "Lead Product Designer",
    assigneeInitials: "AM",
    assigneeAvatarBg: "from-indigo-500 to-purple-600",
    dueDate: "Sep 25",
    status: "Completed",
    priority: "Medium",
    sourceMeeting: "Apollo Sprint Sync & Action Item Review"
  },
  {
    id: "com-6",
    projectName: "Project Apollo",
    projectCode: "APOLLO",
    task: "Configure speech-to-text mock stream pipeline",
    assigneeName: "David Kim",
    assigneeRole: "AI Lead Specialist",
    assigneeInitials: "DK",
    assigneeAvatarBg: "from-violet-500 to-indigo-600",
    dueDate: "Sep 26",
    status: "Completed",
    priority: "High",
    sourceMeeting: "Apollo Architecture & Core Feature Alignment"
  },
  {
    id: "com-7",
    projectName: "Project Beacon",
    projectCode: "BEACON",
    task: "Validate client document verification workflow",
    assigneeName: "Elena Rostova",
    assigneeRole: "Product Manager",
    assigneeInitials: "ER",
    assigneeAvatarBg: "from-amber-500 to-orange-600",
    dueDate: "Sep 23 (Overdue)",
    status: "Overdue",
    priority: "High",
    sourceMeeting: "Beacon Account Sync"
  },
  {
    id: "com-8",
    projectName: "Project Cipher",
    projectCode: "CIPHER",
    task: "Complete security audit logger encryption specs",
    assigneeName: "Marcus Vance",
    assigneeRole: "QA & Security Engineer",
    assigneeInitials: "MV",
    assigneeAvatarBg: "from-blue-500 to-cyan-600",
    dueDate: "Sep 22",
    status: "Completed",
    priority: "Medium",
    sourceMeeting: "Cipher Compliance Review"
  }
];

export const recentMeetings: Meeting[] = [
  {
    id: "m-1",
    title: "Apollo Architecture & Core Feature Alignment",
    projectName: "Apollo",
    dateTime: "Today, 10:00 AM",
    duration: "45 mins",
    participantsCount: 4,
    participants: ["Alex Morgan", "Sarah Chen", "David Kim", "Elena Rostova"],
    summarySnippet: "Finalized dashboard scope and confirmed component layout for project Apollo. Agreed on high-priority commitments tracker UI.",
    commitmentsCount: 3,
    status: "Completed"
  },
  {
    id: "m-2",
    title: "Apollo Sprint Sync & Action Item Review",
    projectName: "Apollo",
    dateTime: "Yesterday, 3:30 PM",
    duration: "30 mins",
    participantsCount: 3,
    participants: ["Alex Morgan", "Sarah Chen", "Marcus Vance"],
    summarySnippet: "Reviewed initial mockups for RecallMeet sidebar and metric count widgets. Flagged 2 overdue commitments needing immediate follow-up.",
    commitmentsCount: 2,
    status: "Completed"
  },
  {
    id: "m-3",
    title: "Apollo Client Feedback & UX Walkthrough",
    projectName: "Apollo",
    dateTime: "Sep 25, 2026, 2:00 PM",
    duration: "60 mins",
    participantsCount: 5,
    participants: ["Alex Morgan", "Elena Rostova", "Client Rep", "David Kim", "Sarah Chen"],
    summarySnippet: "Client approved clean modern aesthetic for project Apollo dashboard. Emphasized clean typography and simple navigation.",
    commitmentsCount: 1,
    status: "Completed"
  }
];

export const projectsNeedingAttention: ProjectAttention[] = [
  {
    id: "p-1",
    name: "Project Apollo",
    code: "APOLLO",
    reason: "3 pending commitments requiring immediate team signoff before next sprint.",
    pendingCommitments: 3,
    nextMeeting: "Today at 4:30 PM",
    priority: "High",
    status: "Needs Action"
  },
  {
    id: "p-2",
    name: "Project Beacon",
    code: "BEACON",
    reason: "Meeting transcript synthesis pending client document verification.",
    pendingCommitments: 2,
    nextMeeting: "Tomorrow at 11:00 AM",
    priority: "Medium",
    status: "Pending Sync"
  }
];

export const pendingCommitments: Commitment[] = [
  {
    id: "c-1",
    task: "Finalize Apollo dashboard UI components",
    projectName: "Apollo",
    assignee: "Alex Morgan",
    dueDate: "Today",
    status: "In Progress"
  },
  {
    id: "c-2",
    task: "Verify API endpoints for Apollo meeting summary feed",
    projectName: "Apollo",
    assignee: "Sarah Chen",
    dueDate: "Tomorrow",
    status: "Pending"
  },
  {
    id: "c-3",
    task: "Prepare hackathon demo script focusing on Apollo project",
    projectName: "Apollo",
    assignee: "David Kim",
    dueDate: "Sep 30",
    status: "Pending"
  }
];

export const apolloDetailData: ApolloDetailData = {
  id: "apollo",
  name: "Project Apollo",
  code: "APOLLO",
  tagline: "AI Meeting Memory & Action Item Intelligence Engine",
  overview: "Project Apollo automatically ingests audio/transcript streams from team syncs, synthesizes executive summaries, extracts assigned commitments, and alerts leads to overdue action items before sprint reviews.",
  status: "Needs Attention",
  health: "Action Required (3 Pending)",
  totalMeetings: 12,
  pendingCommitmentsCount: 3,
  resolvedCommitmentsCount: 18,
  participants: [
    {
      id: "part-1",
      name: "Alex Morgan",
      role: "Lead Product Designer",
      initials: "AM",
      avatarBg: "from-indigo-500 to-purple-600",
      commitmentsAssigned: 1
    },
    {
      id: "part-2",
      name: "Sarah Chen",
      role: "Senior Frontend Engineer",
      initials: "SC",
      avatarBg: "from-emerald-500 to-teal-600",
      commitmentsAssigned: 1
    },
    {
      id: "part-3",
      name: "David Kim",
      role: "AI Lead Specialist",
      initials: "DK",
      avatarBg: "from-violet-500 to-indigo-600",
      commitmentsAssigned: 1
    },
    {
      id: "part-4",
      name: "Elena Rostova",
      role: "Product Manager",
      initials: "ER",
      avatarBg: "from-amber-500 to-orange-600",
      commitmentsAssigned: 0
    },
    {
      id: "part-5",
      name: "Marcus Vance",
      role: "QA & Security Engineer",
      initials: "MV",
      avatarBg: "from-blue-500 to-cyan-600",
      commitmentsAssigned: 0
    }
  ],
  keyDecisions: [
    {
      id: "dec-1",
      title: "Adopt Next.js 14 App Router & Tailwind CSS",
      date: "Today, 10:30 AM",
      context: "Confirmed UI stack to ensure rapid component development and instant server-side rendering for hackathon presentation.",
      agreedBy: "Alex Morgan & Sarah Chen"
    },
    {
      id: "dec-2",
      title: "Isolate Mock Data into Central Dataset Layer",
      date: "Yesterday, 3:45 PM",
      context: "Ensures 100% deterministic demo responses without backend dependency failures during live judging.",
      agreedBy: "David Kim & Alex Morgan"
    },
    {
      id: "dec-3",
      title: "Enforce High-Contrast Dark Slate Palette for Commitments",
      date: "Sep 25, 2026",
      context: "Selected indigo and amber badging to emphasize actionable commitments vs completed meeting logs.",
      agreedBy: "Elena Rostova & Alex Morgan"
    }
  ],
  unresolvedIssues: [
    {
      id: "iss-1",
      issue: "Speech-to-text transcript processing latency spikes on large MP3 uploads",
      severity: "High",
      reportedDate: "Yesterday",
      owner: "David Kim",
      impact: "Delays summary generation by 15-20 seconds."
    },
    {
      id: "iss-2",
      issue: "Need explicit team signoff on GraphQL schema export format",
      severity: "Medium",
      reportedDate: "Sep 25, 2026",
      owner: "Sarah Chen",
      impact: "Blocks automated commitment sync with external JIRA workflow."
    }
  ],
  prepareBriefing: {
    executiveSummary: "Project Apollo is on track for hackathon demo completion. 3 pending commitments require immediate assignment verification before the upcoming 4:30 PM sync.",
    keyTakeaways: [
      "Frontend dashboard architecture is fully implemented with Next.js & Tailwind CSS.",
      "Meeting transcripts synthesis achieved 94% key decision extraction accuracy in recent tests.",
      "Overdue action items are flagged for Sarah Chen and David Kim."
    ],
    recommendedActions: [
      "Review and approve final component styling for Project Apollo detail view.",
      "Confirm API endpoint specifications for meeting audio ingest stream.",
      "Conduct dry-run presentation focusing on Apollo commitment tracking."
    ]
  }
};

export const apolloMeetingDetail: MeetingDetailData = {
  id: "m-1",
  title: "Apollo Architecture & Core Feature Alignment",
  projectName: "Project Apollo",
  projectCode: "APOLLO",
  dateTime: "Today, 10:00 AM",
  duration: "45 mins",
  status: "Completed & Processed",
  participants: apolloDetailData.participants.slice(0, 4),
  discussionPoints: [
    "Reviewed frontend layout requirements for RecallMeet hackathon presentation.",
    "Confirmed component tree for Project Apollo metrics grid, meeting feed, and attention cards.",
    "Defined commitment extraction schema for automated transcript parsing.",
    "Evaluated speech-to-text processing speed and mock environment boundaries."
  ],
  keyDecisions: [
    {
      id: "md-1",
      title: "Adopt Next.js 14 App Router, TypeScript & Tailwind CSS",
      date: "10:15 AM",
      context: "Chosen to guarantee clean responsive layout and robust client-side rendering.",
      agreedBy: "Alex Morgan & Sarah Chen"
    },
    {
      id: "md-2",
      title: "Mandate Assignee Signoff for Extracted Action Items",
      date: "10:35 AM",
      context: "Every commitment extracted from transcript must be assigned to an active team participant with a due date.",
      agreedBy: "Elena Rostova & David Kim"
    }
  ],
  commitments: pendingCommitments,
  unresolvedIssues: apolloDetailData.unresolvedIssues,
  transcript: [
    {
      timestamp: "10:00 AM",
      speaker: "Alex Morgan",
      initials: "AM",
      text: "Welcome team! Today we are aligning on the architecture for RecallMeet's primary project: Apollo."
    },
    {
      timestamp: "10:05 AM",
      speaker: "Sarah Chen",
      initials: "SC",
      text: "I recommend using Next.js 14 App Router with Tailwind CSS and Lucide React icons. This will allow us to build a modern, high-contrast dark dashboard."
    },
    {
      timestamp: "10:15 AM",
      speaker: "David Kim",
      initials: "DK",
      text: "I've verified the mock dataset structure. We can cleanly model projects, meetings, key decisions, and commitments deterministically."
    },
    {
      timestamp: "10:28 AM",
      speaker: "Elena Rostova",
      initials: "ER",
      text: "Great! Let's ensure that commitments extracted from meeting transcripts are explicitly flagged when overdue."
    },
    {
      timestamp: "10:40 AM",
      speaker: "Alex Morgan",
      initials: "AM",
      text: "Excellent alignment. Let's finalize the implementation steps and start building."
    }
  ]
};

export const apolloPreparePageData: PreparePageData = {
  projectName: "Project Apollo",
  projectCode: "APOLLO",
  upcomingMeeting: {
    title: "Apollo Sprint Sync & Sprint 2 Milestone Signoff",
    dateTime: "Today at 4:30 PM",
    duration: "30 mins",
    location: "RecallMeet Virtual Room",
    objective: "Resolve 3 pending commitments, review David's STT latency patch, and sign off on hackathon presentation flow."
  },
  pastMeetingHistory: [
    {
      id: "m-1",
      title: "Apollo Architecture & Core Feature Alignment",
      dateTime: "Today, 10:00 AM",
      summarySnippet: "Finalized dashboard scope and confirmed Next.js component layout for project Apollo."
    },
    {
      id: "m-2",
      title: "Apollo Sprint Sync & Action Item Review",
      dateTime: "Yesterday, 3:30 PM",
      summarySnippet: "Reviewed initial mockups for sidebar navigation and metric count cards."
    },
    {
      id: "m-3",
      title: "Apollo Client Feedback & UX Walkthrough",
      dateTime: "Sep 25, 2026, 2:00 PM",
      summarySnippet: "Client approved clean modern aesthetic for project Apollo dashboard."
    }
  ],
  keyDecisions: apolloDetailData.keyDecisions,
  pendingCommitments: pendingCommitments,
  unresolvedIssues: apolloDetailData.unresolvedIssues,
  importantPeopleContext: [
    {
      id: "part-2",
      name: "Sarah Chen",
      role: "Senior Frontend Engineer",
      initials: "SC",
      avatarBg: "from-emerald-500 to-teal-600",
      priorityFocus: "Needs approval on GraphQL schema export format and API feed endpoint specs."
    },
    {
      id: "part-3",
      name: "David Kim",
      role: "AI Lead Specialist",
      initials: "DK",
      avatarBg: "from-violet-500 to-indigo-600",
      priorityFocus: "Addressing speech-to-text transcript processing latency on large audio uploads."
    },
    {
      id: "part-4",
      name: "Elena Rostova",
      role: "Product Manager",
      initials: "ER",
      avatarBg: "from-amber-500 to-orange-600",
      priorityFocus: "Ensuring presentation script aligns with hackathon judging criteria."
    }
  ],
  topicsToBringUp: [
    "Confirm David Kim's progress on STT processing latency optimization.",
    "Review Sarah Chen's commitment status for API feed endpoints.",
    "Validate the 3 pending commitments assigned for Project Apollo.",
    "Rehearse hackathon presentation script sequence with Elena Rostova."
  ],
  recommendedFocus: "Lead with the resolution of David Kim and Sarah Chen's pending commitments, then walk through the completed RecallMeet UI flow to ensure 100% demo alignment.",
  generatedBriefing: {
    executiveSummary: "Personalized Executive Briefing for Alex Morgan: Project Apollo is entering its final pre-demo sync. 3 active commitments require quick signoff from Sarah Chen and David Kim.",
    strategicOverview: "Based on 12 previous Apollo meeting transcripts, team alignment is strong around the Next.js frontend architecture. Main focus for today's 4:30 PM meeting is closing remaining technical blockers.",
    actionPlan: [
      "Open meeting by acknowledging Sarah Chen's frontend schema progress.",
      "Ask David Kim for a quick update on STT latency optimizations.",
      "Confirm Alex Morgan's UI dashboard component completion."
    ],
    riskMitigations: [
      "If STT latency remains elevated, fallback to deterministic mock transcript synthesis for live demo.",
      "Ensure all commitment due dates are set before closing the 4:30 PM sync."
    ]
  }
};
