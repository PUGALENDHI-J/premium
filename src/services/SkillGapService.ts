import { CandidateItem, JobItem, SkillGapReport, SkillGapItem, CourseItem } from '@/types';
import { MOCK_COURSES } from '@/lib/mockData';
import { TalentMatchingService } from './TalentMatchingService';

export class SkillGapService {
  /**
   * Analyzes skill gaps between a candidate and a target job,
   * maps accredited courses to bridge those gaps, and projects the match score delta.
   */
  public static analyzeSkillGaps(candidate: CandidateItem, job: JobItem): SkillGapReport {
    const candidateSkillNames = new Set(candidate.skills.map((s) => s.name.toLowerCase()));
    const initialMatch = TalentMatchingService.calculateMatch(candidate, job);

    const gaps: SkillGapItem[] = [];
    let totalBridgeHours = 0;

    job.requiredSkills.forEach((skill, index) => {
      const isMissing = !candidateSkillNames.has(skill.toLowerCase());
      if (isMissing) {
        // Find matching course in catalog
        const matchingCourse = MOCK_COURSES.find((c) =>
          c.skillsTaught.some((st) => st.toLowerCase() === skill.toLowerCase())
        );

        const importance: SkillGapItem['importance'] = index === 0 ? 'CRITICAL' : index < 3 ? 'HIGH' : 'MEDIUM';
        const hours = matchingCourse ? matchingCourse.durationHours : 24;
        totalBridgeHours += hours;

        gaps.push({
          skill,
          importance,
          requiredProficiency: 'Advanced',
          currentStatus: 'Missing',
          bridgeCourseId: matchingCourse?.id,
          bridgeCourseTitle: matchingCourse?.title || `Foundations of ${skill}`,
          bridgeDurationHours: hours,
          potentialMatchDelta: index === 0 ? 6 : 4,
        });
      }
    });

    const potentialGain = gaps.reduce((acc, curr) => acc + curr.potentialMatchDelta, 0);
    const projectedScore = Math.min(99, initialMatch.totalScore + potentialGain);

    return {
      targetJobId: job.id,
      targetRoleTitle: job.title,
      targetCompany: job.companyName,
      candidateId: candidate.id,
      currentMatchScore: initialMatch.totalScore,
      projectedMatchScore: projectedScore,
      gaps,
      estimatedTotalHours: totalBridgeHours,
      recommendedAction:
        gaps.length > 0
          ? `Complete ${gaps.length} targeted course modules (~${totalBridgeHours} hrs) to elevate qualification match from ${initialMatch.totalScore}% to ${projectedScore}%.`
          : `Candidate possesses 100% of required technical competencies for this requisition. Proceed to instant interview scheduling.`,
    };
  }
}

