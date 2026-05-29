import { Router, Request, Response } from 'express'
import {
  getMetricsSummary,
  getLatencyOverTime,
  getErrorsByProvider,
} from '../db/queries'
import prisma from '../db/index'

const router = Router()

// GET /metrics/summary — overall stats for last 24 hours
router.get('/summary', async (req: Request, res: Response) => {
  const summary = await getMetricsSummary()
  res.json(summary)
})

// GET /metrics/latency — latency per hour for line chart
router.get('/latency', async (req: Request, res: Response) => {
  const data = await getLatencyOverTime()
  res.json(data)
})

// GET /metrics/errors — error rate per provider for bar chart
router.get('/errors', async (req: Request, res: Response) => {
  const data = await getErrorsByProvider()
  res.json(data)
})

router.get('/logs', async (req: Request, res: Response) => {
  const page  = parseInt(req.query.page as string)  || 1
  const limit = parseInt(req.query.limit as string) || 20
  const offset = (page - 1) * limit

  const logs = await prisma.inferenceLog.findMany({
    orderBy: { createdAt: 'desc' },
    take:    limit,
    skip:    offset,
    include: { piiAudit: true }
  })

  const total = await prisma.inferenceLog.count()

  res.json({ logs, total, page, limit })
})

export default router