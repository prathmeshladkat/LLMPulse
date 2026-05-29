import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import conversationsRouter from './routes/conversation'
import messagesRouter from './routes/messages'
import metricsRouter from './routes/metrics'
import { errorHandler } from './middleware/errorHandler'
import { register } from './metrics/prometheus'

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use('/conversations', conversationsRouter)
app.use('/conversations', messagesRouter)
app.use('/metrics', metricsRouter)

// Health check — useful to verify server is running
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType)
  res.send(await register.metrics())
})

// Global error handler — must be last
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`[Server] Chat API running on http://localhost:${PORT}`)
})