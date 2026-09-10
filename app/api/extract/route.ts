import { NextRequest, NextResponse } from 'next/server';
import { checkPromptInjection, validateDocumentPayload, checkRateLimit } from '@/lib/security';
import { runMultiAgentPipeline } from '@/lib/agents';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // 1. Rate limiting check
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit exceeded. Please wait ${rateCheck.resetInSec} seconds before submitting more requests.`,
          threatType: 'RATE_LIMIT_EXCEEDED',
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { fileData, apiKey, userPrompt, existingDocs } = body;

    // 2. Prompt Injection Protection check
    if (userPrompt) {
      const promptCheck = checkPromptInjection(userPrompt);
      if (!promptCheck.passed) {
        return NextResponse.json(
          {
            success: false,
            error: promptCheck.reason,
            threatType: promptCheck.threatType,
          },
          { status: 400 }
        );
      }
    }

    // 3. Document Payload Integrity check
    if (fileData) {
      const payloadCheck = validateDocumentPayload(fileData.fileName || 'file.pdf', fileData.mimeType || 'application/pdf', fileData.base64 || '');
      if (!payloadCheck.passed) {
        return NextResponse.json(
          {
            success: false,
            error: payloadCheck.reason,
            threatType: payloadCheck.threatType,
          },
          { status: 400 }
        );
      }
    }

    // 4. Run Local Multi-Agent Extraction Pipeline
    const pipelineResult = await runMultiAgentPipeline(fileData, existingDocs || []);

    // 5. Supabase Production Storage & PostgreSQL Persistence
    const { uploadFileToSupabaseStorage, saveDocumentToSupabase } = await import('@/lib/supabase');

    if (fileData && fileData.base64) {
      const storageUrl = await uploadFileToSupabaseStorage(
        fileData.fileName || 'invoice.pdf',
        fileData.base64,
        fileData.mimeType || 'application/pdf'
      );
      if (storageUrl) {
        pipelineResult.document.fileUrl = storageUrl;
      }
    }

    // Persist document to Supabase PostgreSQL
    await saveDocumentToSupabase(pipelineResult.document);

    return NextResponse.json({
      success: true,
      data: pipelineResult.document,
      agentLogs: pipelineResult.agentLogs,
      overallConfidence: pipelineResult.overallConfidence,
      autoApproveEligible: pipelineResult.autoApproveEligible,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
