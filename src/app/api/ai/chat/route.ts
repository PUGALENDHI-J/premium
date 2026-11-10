import { NextRequest, NextResponse } from 'next/server';
import { AiOrchestratorService } from '@/services/ai/AiOrchestratorService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, role, fileName } = body;

    if (!message && !fileName) {
      return NextResponse.json(
        { error: 'Message or attached document is required.' },
        { status: 400 }
      );
    }

    const response = await AiOrchestratorService.processMessage(
      message || '',
      history || [],
      role || 'CANDIDATE',
      fileName
    );

    return NextResponse.json(response);
  } catch (err: any) {
    console.error('API Error in /api/ai/chat:', err);
    return NextResponse.json(
      { error: err.message || 'Internal AI Orchestrator Error' },
      { status: 500 }
    );
  }
}

