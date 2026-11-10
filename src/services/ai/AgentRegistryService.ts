import { AgentCode, AIAgentMetadata, UserRole } from '@/types';

export class AgentRegistryService {
  private static agents: Record<AgentCode, AIAgentMetadata> = {
    NEXA_CORE: {
      code: 'NEXA_CORE',
      name: 'NEXA Core Intelligence',
      tagline: 'Quantum Central Orchestrator & Multi-Agent Dispatcher',
      avatarColor: '#00f0ff',
      description: 'Central executive router analyzing cross-platform intents, managing authorization, and orchestrating specialized agents.',
      capabilities: ['Intent Classification', 'Ecosystem Navigation', 'Multi-Agent Routing', 'Action Security Governance'],
      allowedRoles: ['CANDIDATE', 'STUDENT', 'INSTRUCTOR', 'RECRUITER', 'EMPLOYER', 'ADMIN'],
    },
    NEXA_CAREER: {
      code: 'NEXA_CAREER',
      name: 'NEXA Career Navigator',
      tagline: 'Strategic Career Roadmapping & Resume Intelligence',
      avatarColor: '#a855f7',
      description: 'Generates explainable 90-day to 18-month career progression pathways, extracts verifiable skills from resumes, and computes compensation trajectories.',
      capabilities: ['Resume Parsing & Auditing', 'Career Path Forecasting', 'Compensation Benchmarking', 'Skill Evidence Logging'],
      allowedRoles: ['CANDIDATE', 'STUDENT', 'ADMIN'],
    },
    NEXA_TALENT: {
      code: 'NEXA_TALENT',
      name: 'NEXA Talent Matcher',
      tagline: 'Deterministic Candidate-Job Algorithmic Matching',
      avatarColor: '#38bdf8',
      description: 'Calculates explainable 7-factor talent-to-job compatibility, breaks down exact score derivations, and exposes skill gap deficits.',
      capabilities: ['7-Factor Weighted Matching', 'Skill Deficit Analysis', 'Profile-Job Comparison', 'Audit Trail Generation'],
      allowedRoles: ['CANDIDATE', 'RECRUITER', 'EMPLOYER', 'ADMIN'],
    },
    NEXA_RECRUIT: {
      code: 'NEXA_RECRUIT',
      name: 'NEXA Recruit Operations',
      tagline: 'Enterprise ATS & Recruitment Operational Copilot',
      avatarColor: '#10b981',
      description: 'Accelerates recruiter pipelines, evaluates application batches, flags bottlenecks, and synthesizes structured behavioral and technical interview questions.',
      capabilities: ['Pipeline Screening', 'Candidate Comparative Scoring', 'Interview Rubric Synthesis', 'Hiring Funnel Analytics'],
      allowedRoles: ['RECRUITER', 'EMPLOYER', 'ADMIN'],
    },
    NEXA_LEARN: {
      code: 'NEXA_LEARN',
      name: 'NEXA Curriculum Advisor',
      tagline: 'Course Discovery & Skill Bridge Planning',
      avatarColor: '#f59e0b',
      description: 'Discovers verified educational programs matching career goals and synthesizes personalized skill-bridging schedules.',
      capabilities: ['Course Recommendation', 'Syllabus Mapping', 'Study Schedule Generation', 'Certification Tracking'],
      allowedRoles: ['STUDENT', 'CANDIDATE', 'INSTRUCTOR', 'ADMIN'],
    },
    NEXA_MENTOR: {
      code: 'NEXA_MENTOR',
      name: 'NEXA Pedagogical Mentor',
      tagline: 'In-Lesson Tutoring & Adaptive Assessment Generator',
      avatarColor: '#ec4899',
      description: 'Embedded directly beside secure DRM video players to clarify complex concepts, summarize timestamped lectures, and generate interactive quizzes.',
      capabilities: ['In-Player Concept Explanation', 'Timestamp QA', 'Practice Quiz Synthesis', 'Weakness Diagnostic'],
      allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
    },
    NEXA_ANALYTICS: {
      code: 'NEXA_ANALYTICS',
      name: 'NEXA Executive Analytics',
      tagline: 'Market Intelligence & Workforce Data Insights',
      avatarColor: '#6366f1',
      description: 'Synthesizes high-level enterprise metrics, DPDP compliance logs, recruitment velocity, and institutional skill demand indexes.',
      capabilities: ['Talent Velocity Reports', 'Skill Demand Indexing', 'Compliance Audit Trails', 'Budget & ROI Projections'],
      allowedRoles: ['EMPLOYER', 'INSTRUCTOR', 'ADMIN'],
    },
  };

  public static getAgent(code: AgentCode): AIAgentMetadata {
    return this.agents[code] || this.agents.NEXA_CORE;
  }

  public static getAllAgents(): AIAgentMetadata[] {
    return Object.values(this.agents);
  }

  public static getAgentsForRole(role: UserRole): AIAgentMetadata[] {
    return Object.values(this.agents).filter((agent) => agent.allowedRoles.includes(role));
  }
}

