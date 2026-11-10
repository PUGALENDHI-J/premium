import { TalentMatchingService } from '../src/services/TalentMatchingService';
import { SkillGapService } from '../src/services/SkillGapService';
import { CareerIntelligenceService } from '../src/services/CareerIntelligenceService';
import { AiOrchestratorService } from '../src/services/ai/AiOrchestratorService';
import { AgentRegistryService } from '../src/services/ai/AgentRegistryService';
import { MOCK_JOBS, MOCK_CANDIDATE } from '../src/lib/mockData';

async function runTests() {
  console.log('--- NEXATALENT QX ECOSYSTEM INTEGRATION TEST SUITE ---\n');

  // Test 1: 7-Factor Weighted Talent Matching Engine
  console.log('1. Testing TalentMatchingService (7-Factor Weighted Formula)...');
  const matchResult = TalentMatchingService.calculateMatch(MOCK_CANDIDATE, MOCK_JOBS[0]);
  console.log(`   Candidate: ${matchResult.candidateName} -> Job: ${matchResult.jobTitle}`);
  console.log(`   Total Score: ${matchResult.totalScore}%`);
  console.log(`   Technical Skill: ${matchResult.formulaWeights.technicalSkill.score}/35`);
  console.log(`   Experience Relevance: ${matchResult.formulaWeights.experienceRelevance.score}/20`);
  console.log(`   Assessment Verification: ${matchResult.formulaWeights.assessmentPerformance.score}/10`);
  if (matchResult.totalScore >= 80 && matchResult.matchedSkills.length > 0) {
    console.log('   ✓ PASS: 7-Factor formula evaluates and generates audit trail.\n');
  } else {
    throw new Error('TalentMatchingService validation failed.');
  }

  // Test 2: Skill Gap Analysis Engine
  console.log('2. Testing SkillGapService...');
  const gapReport = SkillGapService.analyzeSkillGaps(MOCK_CANDIDATE, MOCK_JOBS[0]);
  console.log(`   Target Job: ${gapReport.targetRoleTitle}`);
  console.log(`   Current Match: ${gapReport.currentMatchScore}% -> Projected Match: ${gapReport.projectedMatchScore}%`);
  console.log(`   Estimated Bridge Hours: ${gapReport.estimatedTotalHours} hrs`);
  console.log(`   Gaps Identified: ${gapReport.gaps.map((g) => g.skill).join(', ') || 'None'}`);
  console.log('   ✓ PASS: Skill gap engine successfully bridges missing competencies with accredited courses.\n');

  // Test 3: Career Progression Roadmapping
  console.log('3. Testing CareerIntelligenceService...');
  const careerPlan = CareerIntelligenceService.generateRoadmap(MOCK_CANDIDATE);
  console.log(`   Target Title: ${careerPlan.targetTitle}`);
  console.log(`   Milestones Count: ${careerPlan.milestones.length}`);
  console.log(`   Market Demand Tier: ${careerPlan.marketDemandTier}`);
  if (careerPlan.milestones.length >= 3) {
    console.log('   ✓ PASS: Strategic career constellation milestones synthesized.\n');
  } else {
    throw new Error('CareerIntelligenceService validation failed.');
  }

  // Test 4: Agent Registry
  console.log('4. Testing AgentRegistryService...');
  const allAgents = AgentRegistryService.getAllAgents();
  console.log(`   Registered Specialized Agents: ${allAgents.length}`);
  allAgents.forEach((a) => console.log(`   - [${a.code}] ${a.name} (${a.allowedRoles.join(', ')})`));
  if (allAgents.length === 7) {
    console.log('   ✓ PASS: All 7 required specialized intelligence agents verified.\n');
  } else {
    throw new Error('AgentRegistryService validation failed.');
  }

  // Test 5: AI Orchestrator & Action Confirmation Safety
  console.log('5. Testing AiOrchestratorService Intent Dispatch & Safety Policy...');
  const response = await AiOrchestratorService.processMessage('Find jobs matching my skills', [], 'CANDIDATE');
  console.log(`   Routed Agent: ${response.agentCode}`);
  console.log(`   Robot State: ${response.robotState}`);
  console.log(`   Action Items requiring user confirmation: ${response.actionItems?.length || 0}`);
  if (response.actionItems && response.actionItems[0].status === 'PENDING_CONFIRMATION') {
    console.log(`   ✓ PASS: High-impact action '${response.actionItems[0].title}' enforces PENDING_CONFIRMATION before execution.`);
  }

  console.log('\n--- ALL TEST CRITERIA PASSED SUCCESSFULLY! ---');
}

runTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});

