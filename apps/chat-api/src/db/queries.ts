import { SrvRecord } from 'node:dns'
import prisma from './index'

export async function getAllConversations(){
    return prisma.conversation.findMany({
        orderBy: { updatedAt: 'desc'},
        select: {
            id: true,
            title: true,
            provider: true,
            model: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        }
    })
}

export async function getConversationById(id: string){
    return prisma.conversation.findUnique({
        where: {id}
    })
}

export async function createConversation(provider:string, model:string, title: string){
    return prisma.conversation.create({
        data: {
            provider,
            model, 
            title
        }
    })
}


export async function updateConversationStatus(id: string, status: string) {
  return prisma.conversation.update({
    where: { id },
    data: { status }
  })
}

export async function getMessagesByConversation(conversationId: string){
    return prisma.message.findMany({
        where: {conversationId},
        orderBy: {createdAt :'asc'}
    })
}

export async function saveMessage(conversationId: string, role: string, content: string){
    const [message] = await prisma.$transaction([
        prisma.message.create({
            data: {conversationId, role, content}
        }),
        prisma.conversation.update({
            where: {id: conversationId},
            data: {updatedAt :new Date()}
        })
    ])
    return message
}

export async function saveInferenceLog(data: {
  conversationId: string
  messageId?: string
  provider: string
  model: string
  latencyMs: number
  inputTokens: number
  outputTokens: number
  status: string
  errorMessage?: string
  inputPreview?: string
  outputPreview?: string
}) {
  return prisma.inferenceLog.create({ data })
}

export async function getMetricsSummary() {
  const result = await prisma.$queryRaw<any[]>`
    SELECT
      COUNT(*)::int                          AS total_requests,
      AVG(latency_ms)::int                   AS avg_latency_ms,
      MAX(latency_ms)::int                   AS max_latency_ms,
      SUM(input_tokens + output_tokens)::int AS total_tokens,
      COALESCE(SUM(cost_usd), 0)::float      AS total_cost_usd,
      COUNT(*) FILTER (WHERE status = 'error')::int AS error_count
    FROM inference_logs
    WHERE created_at > NOW() - INTERVAL '24 hours'
  `
  return result[0]
}

export async function getLatencyOverTime() {
  // Avg latency per hour for last 24 hours — used for the line chart
  return prisma.$queryRaw<any[]>`
    SELECT
      DATE_TRUNC('hour', created_at) AS hour,
      AVG(latency_ms)::int           AS avg_latency_ms,
      COUNT(*)::int                  AS request_count
    FROM inference_logs
    WHERE created_at > NOW() - INTERVAL '24 hours'
    GROUP BY 1
    ORDER BY 1 ASC
  `
}

export async function getErrorsByProvider() {
  return prisma.$queryRaw<any[]>`
    SELECT
      provider,
      COUNT(*) FILTER (WHERE status = 'error')::int AS errors,
      COUNT(*)::int                                  AS total
    FROM inference_logs
    WHERE created_at > NOW() - INTERVAL '24 hours'
    GROUP BY provider
  `
}
