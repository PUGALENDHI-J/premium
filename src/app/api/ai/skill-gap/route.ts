import { NextRequest, NextResponse } from 'next/server';
import { SkillGapService } from '@/services/SkillGapService';
import { MOCK_JOBS, MOCK_CANDIDATE } from '@/lib/mockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId } = body;

    const job = MOCK_JOBS.find((j) => j.id === jobId) || MOCK_JOBS[0];
    const report = SkillGapService.analyzeSkillGaps(MOCK_CANDIDATE, job);

    return NextResponse.json(report);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

