import { CandidateItem, CareerPlan } from '@/types';
import { MOCK_CAREER_PLAN } from '@/lib/mockData';

export class CareerIntelligenceService {
  /**
   * Generates a forward-looking 90-day to 18-month career progression roadmap
   * connecting candidate's current capabilities to market-demanded enterprise titles.
   */
  public static generateRoadmap(candidate: CandidateItem, targetTitle?: string): CareerPlan {
    const desiredTitle = targetTitle || 'Principal Cloud & AI Infrastructure Architect';

    return {
      candidateId: candidate.id,
      currentTitle: candidate.currentRole || 'Senior Distributed Systems Engineer',
      targetTitle: desiredTitle,
      projectedMonths: 14,
      marketDemandTier: 'Surging',
      salaryGrowthPotential: '+42% ($160k → $225k)',
      milestones: MOCK_CAREER_PLAN.milestones.map((m) => ({
        ...m,
        completed: m.order === 1,
      })),
      keyAdvice: [
        'Validate Raft and consensus mastery through the NexaTalent Verified Enterprise Credential.',
        'Address the GPU memory orchestration gap by completing the vLLM acceleration modules to qualify for Tier-1 AI infrastructure positions.',
        'Contribute to open-source foundation inference engines to provide cryptographic evidence of architecture competency.',
      ],
    };
  }
}

