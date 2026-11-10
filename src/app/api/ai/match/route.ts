import { NextRequest, NextResponse } from 'next/server';
import { TalentMatchingService } from '@/services/TalentMatchingService';
import { MOCK_JOBS, MOCK_CANDIDATE } from '@/lib/mockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId } = body;

    const job = MOCK_JOBS.find((j) => j.id === jobId) || MOCK_JOBS[0];
    const match = TalentMatchingService.calculateMatch(MOCK_CANDIDATE, job);

    return NextResponse.json(match);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

