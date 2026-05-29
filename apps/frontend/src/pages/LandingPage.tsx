import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-blue-500/30 antialiased font-sans">

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#030303]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div 
          className="flex items-center justify-between h-16"
          style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 64px' }}
        >

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] bg-gradient-to-br from-blue-500 to-indigo-500 rounded-[9px] flex items-center justify-center flex-shrink-0">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h3l3-7 3 14 3-10 2 3h6"/>
              </svg>
            </div>
            <span className="text-[17px] font-semibold tracking-[-0.3px] text-zinc-100">
              LLM<span className="text-blue-500">Pulse</span>
            </span>
          </div>

          {/* CTA */}
          <Link to="/chat">
            <Button
              variant="outline"
              className="bg-transparent border-white/15 text-zinc-300 hover:bg-white/5 hover:text-white hover:border-white/25 rounded-lg text-[13.5px] font-medium px-[18px] h-9 w-36 transition-all"
            >
              Launch App
            </Button>
          </Link>

        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: '120px', paddingBottom: '120px', textAlign: 'center' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Heading */}
          <h1 style={{ fontSize: 'clamp(52px, 6vw, 80px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-1.5px', color: '#ffffff', marginBottom: '28px' }}>
            Monitor, Track
            <br />
            &amp; Optimize Your
            <br />
            <span style={{ color: '#3b82f6' }}>LLM Applications</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: '18px', color: '#9ca3af', maxWidth: '620px', lineHeight: 1.65, marginBottom: '40px', textAlign: 'center' }}>
            Real-time inference logging, conversation management, and comprehensive analytics for every AI interaction. Build smarter, debug faster, optimize better.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <Link to="/chat">
              <button style={{ backgroundColor: '#3b82f6', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '0 32px', height: '48px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#2563eb')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#3b82f6')}
              >
                Start Building
              </button>
            </Link>
            <button style={{ backgroundColor: 'transparent', color: '#e4e4e7', fontSize: '15px', fontWeight: 600, padding: '0 32px', height: '48px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              View Documentation
            </button>
          </div>

          {/* Footnote */}
          <p style={{ fontSize: '13px', color: '#6b7280', letterSpacing: '0.3px', fontFamily: 'monospace' }}>
            No credit card required &bull; Free tier available &bull; Deploy in minutes
          </p>

        </div>
      </section>

      {/* ── Complete LLM Observability ──────────────────────────────── */}
      <section style={{ padding: '100px 0 100px', textAlign: 'center' }}>

        {/* Header */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 32px', marginBottom: '64px' }}>
          <h2 style={{ fontSize: 'clamp(36px, 4vw, 54px)', fontWeight: 800, color: '#ffffff', letterSpacing: '-1px', marginBottom: '16px' }}>
            Complete LLM Observability
          </h2>
          <p style={{ fontSize: '18px', color: '#9ca3af', lineHeight: 1.6 }}>
            Everything you need to build, monitor, and scale production LLM applications
          </p>
        </div>

        {/* 2×2 Cards Grid */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>

          {/* Multi-Turn Chatbot */}
          <div style={{ backgroundColor: '#131315', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '36px', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#1e2a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '22px' }}>
              💬
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>Multi-Turn Chatbot</h3>
              <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.65, marginBottom: '20px' }}>
                Foundation model support for GPT-4, Claude, Gemini, DeepSeek, Grok and more. Multi-turn conversations with maintained context.
              </p>
              {['Multiple foundation models', 'Conversation continuity', 'Context management'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6', flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', color: '#9ca3af' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
            
          {/* Lightweight SDK */}
          <div style={{ backgroundColor: '#131315', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '36px', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#1e2a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '22px' }}>
              ⚙️
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>Lightweight SDK</h3>
              <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.65, marginBottom: '20px' }}>
                Minimal overhead wrapper capturing comprehensive inference metadata with real-time logging to your ingestion pipeline.
              </p>
              {['Latency tracking', 'Token counting', 'Error capture'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6', flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', color: '#9ca3af' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
            
          {/* Ingestion Pipeline */}
          <div style={{ backgroundColor: '#131315', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '36px', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#2a1e3a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '22px' }}>
              📥
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>Ingestion Pipeline</h3>
              <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.65, marginBottom: '20px' }}>
                Robust API endpoint that validates, parses, and processes logs in near real-time with automatic metadata extraction.
              </p>
              {['Schema validation', 'Automatic parsing', 'Real-time processing'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6', flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', color: '#9ca3af' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
            
          {/* Database Storage */}
          <div style={{ backgroundColor: '#131315', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '36px', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#1e3a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '22px' }}>
              🗄️
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>Database Storage</h3>
              <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.65, marginBottom: '20px' }}>
                Optimized schema for messages, logs, and metadata with practical tradeoffs for performance and scalability.
              </p>
              {['Message history', 'Inference logs', 'Metadata extraction'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6', flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', color: '#9ca3af' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
            
        </div>
      </section>
          
      {/* ── Powerful Frontend Interface ─────────────────────────────── */}
      <section style={{ padding: '0 32px 100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: '#131315', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '56px 64px' }}>

          <h3 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', marginBottom: '48px' }}>
            Powerful Frontend Interface
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>

            {/* Cancel Anytime */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#1e2a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                ✕
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: 0 }}>Cancel Anytime</h4>
              <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.65, margin: 0 }}>
                Stop conversations mid-stream without losing conversation history or logs.
              </p>
            </div>

            {/* List Conversations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#3a2e1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                📋
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: 0 }}>List Conversations</h4>
              <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.65, margin: 0 }}>
                Browse and search through all past conversations with full metadata visibility.
              </p>
            </div>

            {/* Resume Sessions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#1a2a3a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                ▶
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: 0 }}>Resume Sessions</h4>
              <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.65, margin: 0 }}>
                Pick up where you left off with complete conversation context restoration.
              </p>
            </div>

          </div>
        </div>
      </section>

            {/* ── How It Works ────────────────────────────────────────────── */}
      <section style={{ padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 800, color: '#ffffff', letterSpacing: '-1px', marginBottom: '16px' }}>
            How It Works
          </h2>
          <p style={{ fontSize: '18px', color: '#9ca3af', lineHeight: 1.6 }}>
            A complete stack for building production-grade LLM applications
          </p>
        </div>

        {/* Pipeline Flow Bar */}
        <div style={{ backgroundColor: '#131315', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px 32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            {['Chatbot', 'SDK Wrapper', 'Ingestion API', 'Database'].map((step, i, arr) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div style={{ flex: 1, backgroundColor: '#1e2a3a', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '15px', color: '#ffffff' }}>{step}</span>
                </div>
                {i < arr.length - 1 && (
                  <span style={{ color: '#4b5563', fontSize: '18px', flexShrink: 0 }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>
          
        {/* Step Cards 2×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          
          {/* Step 1 */}
          <div style={{ backgroundColor: '#131315', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '36px' }}>
            <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>1. Initialize Chatbot</h4>
            <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.65, marginBottom: '24px' }}>
              Start with any foundation model API (GPT-4, Claude, Gemini, etc.)
            </p>
            <div style={{ backgroundColor: '#0d0d0f', borderRadius: '10px', padding: '16px 20px', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'monospace', fontSize: '13px', color: '#9ca3af' }}>
              const chat = new InferenceLog(&#123;model: "gpt-4"&#125;)
            </div>
          </div>
          
          {/* Step 2 */}
          <div style={{ backgroundColor: '#131315', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '36px' }}>
            <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>2. Wrap With SDK</h4>
            <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.65, marginBottom: '24px' }}>
              Capture latency, tokens, errors, and metadata automatically
            </p>
            <div style={{ backgroundColor: '#0d0d0f', borderRadius: '10px', padding: '16px 20px', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'monospace', fontSize: '13px', color: '#9ca3af' }}>
              const logged = wrap(chat)
            </div>
          </div>
          
          {/* Step 3 */}
          <div style={{ backgroundColor: '#131315', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '36px' }}>
            <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>3. Send to Ingestion</h4>
            <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.65, marginBottom: '24px' }}>
              Logs flow automatically to your ingestion pipeline endpoint
            </p>
            <div style={{ backgroundColor: '#0d0d0f', borderRadius: '10px', padding: '16px 20px', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'monospace', fontSize: '13px', color: '#9ca3af' }}>
              await logged.send(&#123;endpoint: "/api/ingest"&#125;)
            </div>
          </div>
          
          {/* Step 4 */}
          <div style={{ backgroundColor: '#131315', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '36px' }}>
            <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>4. Query &amp; Analyze</h4>
            <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.65, marginBottom: '24px' }}>
              Query stored logs, build dashboards, and optimize performance
            </p>
            <div style={{ backgroundColor: '#0d0d0f', borderRadius: '10px', padding: '16px 20px', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'monospace', fontSize: '13px', color: '#9ca3af' }}>
              const stats = await db.query(&#123;model: "gpt-4"&#125;)
            </div>
          </div>
          
        </div>
      </div>
    </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      {/* ── CTA ─────────────────────────────────────────────────────── */}
<section style={{ padding: '120px 32px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
  <div style={{ maxWidth: '640px', margin: '0 auto' }}>
    <h2 style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 800, color: '#ffffff', letterSpacing: '-1px', marginBottom: '20px' }}>
      Ready to Build?
    </h2>
    <p style={{ fontSize: '18px', color: '#9ca3af', lineHeight: 1.65, marginBottom: '40px' }}>
      Start monitoring your LLM applications today. Get insights into every inference,
      track performance, and optimize your AI stack.
    </p>
    <Link to="/chat">
      <button
        style={{ backgroundColor: '#3b82f6', color: '#ffffff', fontSize: '16px', fontWeight: 600, padding: '0 48px', height: '52px', borderRadius: '10px', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#2563eb')}
        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#3b82f6')}
      >
        Launch Chatbot
      </button>
    </Link>
  </div>
</section>

{/* ── Footer ──────────────────────────────────────────────────── */}
<footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px', }}>
  <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
    
    {/* Logo */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h3l3-7 3 14 3-10 2 3h6"/>
        </svg>
      </div>
      <span style={{ fontSize: '15px', fontWeight: 600, color: '#f1f1f1' }}>
        LLM<span style={{ color: '#3b82f6' }}>Pulse</span>
      </span>
    </div>

    {/* Copyright */}
    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
      © 2026 LLMPulse. All rights reserved.
    </p>

    {/* Links */}
    <div style={{ display: 'flex', gap: '28px' }}>
      {['Docs', 'GitHub', 'Status'].map(link => (
        <a key={link} href="#" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseOver={e => (e.currentTarget.style.color = '#ffffff')}
          onMouseOut={e => (e.currentTarget.style.color = '#6b7280')}
        >
          {link}
        </a>
      ))}
    </div>

  </div>
</footer>

    </div>
  )
}