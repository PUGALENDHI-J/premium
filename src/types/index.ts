// NexaTalent QX — Enterprise Type System

export type UserRole = 
  | 'CANDIDATE' 
  | 'STUDENT' 
  | 'INSTRUCTOR' 
  | 'RECRUITER' 
  | 'EMPLOYER' 
  | 'ADMIN';

export type RobotState = 
  | 'IDLE'
  | 'LISTENING'
  | 'THINKING'
  | 'ANALYSING'
  | 'RESPONDING'
  | 'SUCCESS'
  | 'WARNING'
  | 'ERROR'
  | 'SLEEP';

export type AgentCode = 
  | 'NEXA_CORE'
  | 'NEXA_CAREER'
  | 'NEXA_TALENT'
  | 'NEXA_RECRUIT'
  | 'NEXA_LEARN'
  | 'NEXA_MENTOR'
  | 'NEXA_ANALYTICS';

export interface AIAgentMetadata {
  code: AgentCode;
  name: string;
  tagline: string;
  avatarColor: string;
  description: string;
  capabilities: string[];
  allowedRoles: UserRole[];
}

export type ActionStatus = 
  | 'PENDING_CONFIRMATION' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'EXECUTED' 
  | 'FAILED';

export interface AIActionPayload {
  actionType: 'APPLY_JOB' | 'ENROLL_COURSE' | 'ADD_SKILL' | 'SCHEDULE_INTERVIEW' | 'GENERATE_STUDY_PLAN' | 'SHORTLIST_CANDIDATE' | 'EXPORT_AUDIT';
  targetId?: string;
  title: string;
  summary: string;
  details: Record<string, any>;
  impactTier: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AIActionItem {
  id: string;
  conversationId?: string;
  targetId?: string;
  actionType: AIActionPayload['actionType'];
  title: string;
  description: string;
  payload: AIActionPayload;
  status: ActionStatus;
  requiresApproval: boolean;
  createdAt: string;
  executedAt?: string;
}

export interface AIMessageItem {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  agentCode?: AgentCode;
  robotState?: RobotState;
  thoughtProcess?: string;
  actionItems?: AIActionItem[];
  metadata?: {
    matchCard?: MatchScoreBreakdown;
    gapAnalysis?: SkillGapReport;
    careerPlan?: CareerPlan;
    suggestedPrompts?: string[];
    courseRecommendations?: CourseItem[];
    jobMatches?: JobItem[];
    candidateMatches?: CandidateItem[];
    visualizationType?: 'neural-network' | 'skill-universe' | 'career-constellation' | 'ats-pipeline';
  };
  createdAt: string;
}

export interface MatchScoreBreakdown {
  jobId: string;
  jobTitle: string;
  companyName: string;
  candidateId: string;
  candidateName: string;
  totalScore: number; // 0 - 100
  formulaWeights: {
    technicalSkill: { score: number; maxWeight: 35 };
    experienceRelevance: { score: number; maxWeight: 20 };
    educationQualifications: { score: number; maxWeight: 10 };
    domainRelevance: { score: number; maxWeight: 10 };
    assessmentPerformance: { score: number; maxWeight: 10 };
    locationPreferences: { score: number; maxWeight: 5 };
    roleRequirements: { score: number; maxWeight: 10 };
  };
  matchedSkills: string[];
  missingSkills: string[];
  experienceCompatibility: string;
  qualificationCompatibility: string;
  salaryCompatibility: string;
  explainableSummary: string;
  auditTrail: string;
}

export interface SkillGapItem {
  skill: string;
  importance: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'OPTIONAL';
  requiredProficiency: 'Intermediate' | 'Advanced' | 'Expert';
  currentStatus: 'Missing' | 'Emerging' | 'Verified';
  bridgeCourseId?: string;
  bridgeCourseTitle?: string;
  bridgeDurationHours?: number;
  potentialMatchDelta: number; // e.g. +12%
}

export interface SkillGapReport {
  targetJobId: string;
  targetRoleTitle: string;
  targetCompany: string;
  candidateId: string;
  currentMatchScore: number;
  projectedMatchScore: number;
  gaps: SkillGapItem[];
  estimatedTotalHours: number;
  recommendedAction: string;
}

export interface CareerMilestoneItem {
  order: number;
  title: string;
  roleTarget: string;
  timeframe: string;
  salaryBenchmark: string;
  requiredSkills: string[];
  recommendedCourses: string[];
  completed: boolean;
}

export interface CareerPlan {
  candidateId: string;
  currentTitle: string;
  targetTitle: string;
  projectedMonths: number;
  marketDemandTier: 'Surging' | 'High' | 'Steady';
  salaryGrowthPotential: string;
  milestones: CareerMilestoneItem[];
  keyAdvice: string[];
}

export interface JobItem {
  id: string;
  employerId: string;
  companyName: string;
  companyLogo?: string;
  isVerifiedEnterprise: boolean;
  title: string;
  department: string;
  location: string;
  isRemote: boolean;
  type: 'Full-time' | 'Contract' | 'Hybrid' | 'Remote';
  experienceYears: string;
  salaryRange: string;
  currency: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  postedDaysAgo: number;
  applicantCount: number;
  matchScore?: number;
}

export interface CourseItem {
  id: string;
  title: string;
  instructorName: string;
  instructorRole: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Executive';
  durationHours: number;
  lessonsCount: number;
  rating: number;
  reviewsCount: number;
  price: number;
  thumbnailUrl: string;
  skillsTaught: string[];
  tags: string[];
  enrolledStudents: number;
  certificateOffered: boolean;
  description: string;
}

export interface LessonItem {
  id: string;
  courseId: string;
  title: string;
  order: number;
  durationMinutes: number;
  videoUrl: string;
  transcript: string;
  summary: string;
  quizQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface CandidateItem {
  id: string;
  userId: string;
  name: string;
  headline: string;
  avatarUrl: string;
  location: string;
  currentRole: string;
  yearsExperience: number;
  verifiedCredentials: boolean;
  verifiedGSTorCIN?: boolean;
  skills: { name: string; tier: string; verified: boolean }[];
  matchScore?: number;
  pipelineStage?: 'SUBMITTED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'OFFER_EXTENDED';
  notes?: string;
}
