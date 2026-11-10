import { NextRequest, NextResponse } from 'next/server';
import { CareerIntelligenceService } from '@/services/CareerIntelligenceService';
import { MOCK_CANDIDATE } from '@/lib/mockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { targetTitle } = body;

    const roadmap = CareerIntelligenceService.generateRoadmap(MOCK_CANDIDATE, targetTitle);

    return NextResponse.json(roadmap);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

