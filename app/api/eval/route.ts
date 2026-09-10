import { NextResponse } from 'next/server';
import { getEvalHistory, computeSummaryStats } from '@/lib/evaluation';

export const dynamic = 'force-dynamic';

export async function GET() {
  const history = getEvalHistory();
  const summary = computeSummaryStats(history);

  return NextResponse.json({
    success: true,
    summary,
    history,
  });
}
