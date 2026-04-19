import React, { useState, useEffect } from 'react'
import KeywordChip from './components/KeywordChip.jsx'
import StatsBar from './components/StatsBar.jsx'
import RecentActivity from './components/RecentActivity.jsx'
import ActivityPage from './components/ActivityPage.jsx'
import { supabase } from './lib/supabase.js'

const CORE_KEYWORDS = [
  // Journey
  { tag: 'cancerwarrior',         category: 'Journey' },
  { tag: 'cancerjourney',         category: 'Journey' },
  { tag: 'cancerfighter',         category: 'Journey' },
  { tag: 'cancerstrong',          category: 'Journey' },
  { tag: 'cancersupport',         category: 'Journey' },
  { tag: 'cancerawareness',       category: 'Journey' },
  { tag: 'cancercommunity',       category: 'Journey' },
  { tag: 'cancerlife',            category: 'Journey' },
  { tag: 'cancerhealing',         category: 'Journey' },
  { tag: 'cancerhope',            category: 'Journey' },
  { tag: 'canceradvocate',        category: 'Journey' },
  { tag: 'cancercare',            category: 'Journey' },
  { tag: 'cancerrecovery',        category: 'Journey' },
  { tag: 'fightlikeagirl',        category: 'Journey' },
  { tag: 'strongerthancancer',    category: 'Journey' },
  { tag: 'cancerneverquit',       category: 'Journey' },
  { tag: 'beatcancer',            category: 'Journey' },
  { tag: 'fuckcancer',            category: 'Journey' },
  { tag: 'cancersucks',           category: 'Journey' },
  // Milestone
  { tag: 'cancersurvivor',        category: 'Milestone' },
  { tag: 'cancerfree',            category: 'Milestone' },
  { tag: 'ringthatbell',          category: 'Milestone' },
  { tag: 'ned',                   category: 'Milestone' },
  { tag: 'lastchemo',             category: 'Milestone' },
  { tag: 'cancerversary',         category: 'Milestone' },
  { tag: 'cancerfreeanniversary', category: 'Milestone' },
  { tag: 'remission',             category: 'Milestone' },
  { tag: 'inremission',           category: 'Milestone' },
  { tag: 'cancerfreelife',        category: 'Milestone' },
  { tag: 'survivorhood',          category: 'Milestone' },
  { tag: 'bellringer',            category: 'Milestone' },
  { tag: 'ringthebell',           category: 'Milestone' },
  { tag: 'treatmentcomplete',     category: 'Milestone' },
  { tag: 'donewithchemo',         category: 'Milestone' },
  { tag: 'finishedchemo',         category: 'Milestone' },
  // Treatment
  { tag: 'chemolife',             category: 'Treatment' },
  { tag: 'chemotherapy',          category: 'Treatment' },
  { tag: 'chemowarrior',          category: 'Treatment' },
  { tag: 'chemosucks',            category: 'Treatment' },
  { tag: 'chemobrain',            category: 'Treatment' },
  { tag: 'chemoday',              category: 'Treatment' },
  { tag: 'radiation',             category: 'Treatment' },
  { tag: 'radiationtherapy',      category: 'Treatment' },
  { tag: 'immunotherapy',         category: 'Treatment' },
  { tag: 'cancertreatment',       category: 'Treatment' },
  { tag: 'cancermeds',            category: 'Treatment' },
  { tag: 'cancersurgery',         category: 'Treatment' },
  { tag: 'cancermindset',         category: 'Treatment' },
  { tag: 'cancerpositive',        category: 'Treatment' },
  { tag: 'cancerfit',             category: 'Treatment' },
  { tag: 'canceryoga',            category: 'Treatment' },
  { tag: 'cancernutrition',       category: 'Treatment' },
  { tag: 'cancerwellness',        category: 'Treatment' },
  { tag: 'cancerselfcare',        category: 'Treatment' },
  { tag: 'cancermentalhealth',    category: 'Treatment' },
  { tag: 'oncology',              category: 'Treatment' },
  { tag: 'oncologylife',          category: 'Treatment' },
  // Diagnosis — Breast
  { tag: 'breastcancer',          category: 'Diagnosis' },
  { tag: 'breastcancerwarrior',   category: 'Diagnosis' },
  { tag: 'breastcancersurvivor',  category: 'Diagnosis' },
  { tag: 'breastcancerawareness', category: 'Diagnosis' },
  { tag: 'breastcancerlife',      category: 'Diagnosis' },
  { tag: 'breastcancerfighter',   category: 'Diagnosis' },
  { tag: 'breastcancercommunity', category: 'Diagnosis' },
  { tag: 'breastcancerstrong',    category: 'Diagnosis' },
  { tag: 'thinkpink',             category: 'Diagnosis' },
  { tag: 'pinkribbon',            category: 'Diagnosis' },
  { tag: 'breastcancersupport',   category: 'Diagnosis' },
  // Diagnosis — Blood
  { tag: 'lymphoma',              category: 'Diagnosis' },
  { tag: 'hodgkinslymphoma',      category: 'Diagnosis' },
  { tag: 'nonhodgkinslymphoma',   category: 'Diagnosis' },
  { tag: 'leukemia',              category: 'Diagnosis' },
  { tag: 'leukemiawarrior',       category: 'Diagnosis' },
  { tag: 'leukemiasurvivor',      category: 'Diagnosis' },
  { tag: 'multiplemyeloma',       category: 'Diagnosis' },
  { tag: 'myeloma',               category: 'Diagnosis' },
  { tag: 'bloodcancer',           category: 'Diagnosis' },
  { tag: 'bloodcancerwarrior',    category: 'Diagnosis' },
  // Diagnosis — Other
  { tag: 'lungcancer',            category: 'Diagnosis' },
  { tag: 'lungcancerwarrior',     category: 'Diagnosis' },
  { tag: 'coloncancer',           category: 'Diagnosis' },
  { tag: 'colonwarrior',          category: 'Diagnosis' },
  { tag: 'ovariancancer',         category: 'Diagnosis' },
  { tag: 'ovariancancerwarrior',  category: 'Diagnosis' },
  { tag: 'cervicalcancer',        category: 'Diagnosis' },
  { tag: 'thyroidcancer',         category: 'Diagnosis' },
  { tag: 'thyroidcancerwarrior',  category: 'Diagnosis' },
  { tag: 'melanoma',              category: 'Diagnosis' },
  { tag: 'skincancer',            category: 'Diagnosis' },
  { tag: 'braintumor',            category: 'Diagnosis' },
  { tag: 'braintumorwarrior',     category: 'Diagnosis' },
  { tag: 'pancreaticcancer',      category: 'Diagnosis' },
  { tag: 'prostatecancer',        category: 'Diagnosis' },
  { tag: 'kidneycancer',          category: 'Diagnosis' },
  { tag: 'pediatriccancer',       category: 'Diagnosis' },
  { tag: 'childhoodcancer',       category: 'Diagnosis' },
  // Community
  { tag: 'cancerfamily',          category: 'Community' },
  { tag: 'cancermom',             category: 'Community' },
  { tag: 'cancerdad',             category: 'Community' },
  { tag: 'cancerdaughter',        category: 'Community' },
  { tag: 'cancerson',             category: 'Community' },
  { tag: 'caregiver',             category: 'Community' },
  { tag: 'cancercaregiver',       category: 'Community' },
  { tag: 'cancerspouse',          category: 'Community' },
]

// ── Pick a random subset of keywords each day ────────────────────────────
// Uses today's date as a seed so the same set shows all day, changes tomorrow

function getRandomKeywords(keywords, count = 24) {
  // Always include at least 2 from each category for balance
  const byCategory = {}
  for (const k of keywords) {
    if (!byCategory[k.category]) byCategory[k.category] = []
    byCategory[k.category].push(k)
  }
  const guaranteed = []
  for (const cat of Object.keys(byCategory)) {
    const shuffled = [...byCategory[cat]].sort(() => Math.random() - 0.5)
    guaranteed.push(...shuffled.slice(0, 2))
  }
  const guaranteedTags = new Set(guaranteed.map(k => k.tag))
  const rest = [...keywords]
    .filter(k => !guaranteedTags.has(k.tag))
    .sort(() => Math.random() - 0.5)
  const remaining = count - guaranteed.length
  return [...guaranteed, ...rest.slice(0, remaining)]
    .sort((a, b) => a.category.localeCompare(b.category))
}

const CATEGORY_COLORS = {
  Milestone: { bg: '#E8F5EE', color: '#1A7A4A', dot: '#10B981' },
  Treatment: { bg: '#EDE8FE', color: '#5B21B6', dot: '#8B5CF6' },
  Diagnosis: { bg: '#FEE2E2', color: '#B91C1C', dot: '#EF4444' },
  Community: { bg: '#E0F2FE', color: '#0369A1', dot: '#0EA5E9' },
}

function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFAF5' }}>
      <div style={{ width: '380px', background: 'white', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 24px rgba(26,22,16,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '44px', height: '44px', background: '#F5C518', borderRadius: '10px', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L9 5.5H13.5L9.5 8.5L11 13L7 10L3 13L4.5 8.5L0.5 5.5H5L7 1Z" fill="#1A1610"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '20px', color: '#1A1610', marginBottom: '4px' }}>
            LiveStrong Engagement Platform
          </h1>
          <p style={{ fontSize: '13px', color: '#7A7268', fontFamily: 'DM Sans, sans-serif' }}>Sign in to your account</p>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#3D3830', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #E8E2D8', borderRadius: '8px', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', color: '#1A1610', background: 'white', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#1A1610'}
              onBlur={e => e.target.style.borderColor = '#E8E2D8'}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#3D3830', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #E8E2D8', borderRadius: '8px', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', color: '#1A1610', background: 'white', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#1A1610'}
              onBlur={e => e.target.style.borderColor = '#E8E2D8'}
            />
          </div>
          {error && (
            <div style={{ marginBottom: '16px', padding: '10px 14px', background: '#FDECEA', border: '1px solid #F5C6C2', borderRadius: '8px', fontSize: '12px', color: '#C0392B', fontFamily: 'DM Sans, sans-serif' }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '11px', background: loading ? '#E8E2D8' : '#1A1610', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: loading ? '#7A7268' : 'white', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'background 0.15s' }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', color: '#AAA49C', fontFamily: 'DM Sans, sans-serif' }}>
          Contact AIKO Group if you need access.
        </p>
      </div>
    </div>
  )
}

function InactivePage({ onSignOut }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFAF5' }}>
      <div style={{ textAlign: 'center', padding: '40px', maxWidth: '400px' }}>
        <div style={{ width: '56px', height: '56px', background: '#F0EBE0', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🔒</div>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', color: '#1A1610', marginBottom: '10px' }}>Subscription inactive</h2>
        <p style={{ fontSize: '14px', color: '#7A7268', lineHeight: 1.6, marginBottom: '28px', fontFamily: 'DM Sans, sans-serif' }}>
          Your access to the LiveStrong Engagement Platform is currently inactive. Please contact AIKO Group to renew your subscription.
        </p>
        <button onClick={onSignOut} style={{ padding: '9px 24px', background: 'none', border: '1px solid #E8E2D8', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', color: '#7A7268', fontFamily: 'DM Sans, sans-serif' }}>
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [session, setSession]     = useState(null)
  const [license, setLicense]     = useState(null)
  const [checking, setChecking]   = useState(true)
  const [displayedKeywords, setDisplayedKeywords] = useState(() => getRandomKeywords(CORE_KEYWORDS, 24))
  const [activeCategory, setActiveCategory]       = useState('All')
  const [lastOpened, setLastOpened]           = useState(null)
  const [activePage, setActivePage]           = useState('keywords')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) checkLicense()
      else setChecking(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) checkLicense()
      else { setLicense(null); setChecking(false) }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function checkLicense() {
    const { data } = await supabase.from('licenses').select('is_active, expires_at, client_name').single()
    setLicense(data)
    setChecking(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFAF5' }}>
      <div style={{ fontSize: '13px', color: '#AAA49C', fontFamily: 'DM Sans, sans-serif' }}>Loading…</div>
    </div>
  )

  if (!session) return <LoginPage />

  const isExpired = license?.expires_at && new Date(license.expires_at) < new Date()
  if (!license?.is_active || isExpired) return <InactivePage onSignOut={handleSignOut} />

  const categories   = ['All', 'Journey', 'Milestone', 'Treatment', 'Diagnosis', 'Community']
  const filteredCore = activeCategory === 'All' ? displayedKeywords : displayedKeywords.filter(k => k.category === activeCategory)

  function openKeyword(tag) {
    setLastOpened(tag)
    window.open(`https://www.instagram.com/explore/tags/${tag}/`, '_blank')
  }

  function handleRefresh() {
    setActiveCategory('All')
    setDisplayedKeywords(getRandomKeywords(CORE_KEYWORDS, 24))
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)' }}>

      <header style={{ borderBottom: '1px solid var(--border)', background: 'white', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: '16px', height: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', background: 'var(--yellow)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L9 5.5H13.5L9.5 8.5L11 13L7 10L3 13L4.5 8.5L0.5 5.5H5L7 1Z" fill="var(--ink)" />
              </svg>
            </div>
            <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '17px', color: 'var(--ink)' }}>
              LiveStrong Engagement Platform
            </span>
          </div>
          <nav style={{ display: 'flex', gap: '4px', marginLeft: 'auto', alignItems: 'center' }}>
            {[['keywords', 'Keywords'], ['activity', 'Activity']].map(([page, label]) => (
              <button key={page} onClick={() => setActivePage(page)} style={{
                padding: '6px 14px', border: 'none', borderRadius: '8px',
                background: activePage === page ? 'var(--surface-2)' : 'transparent',
                color: activePage === page ? 'var(--ink)' : 'var(--ink-muted)',
                fontSize: '13px', fontWeight: activePage === page ? 500 : 400,
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}>
                {label}
              </button>
            ))}
            <button onClick={handleSignOut} style={{ marginLeft: '8px', padding: '6px 12px', border: '1px solid var(--border-strong)', borderRadius: '8px', background: 'transparent', fontSize: '12px', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              Sign out
            </button>
          </nav>
        </div>
      </header>

      {activePage === 'activity' ? <ActivityPage /> : (
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 32px' }}>

          <div style={{ marginBottom: '40px', animation: 'fadeUp 0.4s ease both' }}>
            <h1 style={{ fontSize: '42px', color: 'var(--ink)', marginBottom: '10px', letterSpacing: '-0.5px' }}>
              Find people to{' '}
              <span style={{ background: 'var(--yellow)', padding: '0 6px', borderRadius: '4px', fontStyle: 'italic' }}>engage with</span>
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-muted)', maxWidth: '520px' }}>
              Click a keyword to open Instagram. The extension will activate automatically and help you post thoughtful, AI-drafted comments on personal cancer journey posts.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', animation: 'fadeUp 0.4s ease 0.1s both' }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                    padding: '5px 14px', border: '1.5px solid',
                    borderColor: activeCategory === cat ? 'var(--ink)' : 'var(--border-strong)',
                    borderRadius: '100px',
                    background: activeCategory === cat ? 'var(--ink)' : 'transparent',
                    color: activeCategory === cat ? 'white' : 'var(--ink-muted)',
                    fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                    {cat !== 'All' && <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: CATEGORY_COLORS[cat]?.dot || '#888', marginRight: '6px', verticalAlign: 'middle', marginBottom: '1px' }} />}
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px', animation: 'fadeUp 0.4s ease 0.15s both' }}>
                {filteredCore.map(({ tag, category }, i) => (
                  <div key={tag} style={{ animationDelay: `${i * 0.03}s` }}>
                    <KeywordChip tag={tag} category={category} onClick={openKeyword} />
                  </div>
                ))}
              </div>

              {lastOpened && (
                <div style={{ marginTop: '24px', padding: '12px 16px', background: 'var(--green-light)', border: '1px solid #A7F3D0', borderRadius: 'var(--radius)', fontSize: '13px', color: 'var(--green)', animation: 'fadeUp 0.3s ease both' }}>
                  Opened <strong>#{lastOpened}</strong> on Instagram. The extension should appear automatically on the right side of the page.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow)', animation: 'fadeUp 0.4s ease 0.1s both' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-muted)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Comments posted</h3>
                <StatsBar />
              </div>
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow)', animation: 'fadeUp 0.4s ease 0.15s both' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>How it works</h3>
                {[
                  { step: '1', text: 'Click a keyword to open the Instagram keyword page' },
                  { step: '2', text: 'Click any post thumbnail — it opens in a modal' },
                  { step: '3', text: 'Extension checks: recent? personal? not already commented?' },
                  { step: '4', text: 'If all pass, an AI draft appears in the sidebar' },
                  { step: '5', text: 'Review, edit if needed, and click Post Comment' },
                ].map(({ step, text }) => (
                  <div key={step} style={{ display: 'flex', gap: '12px', marginBottom: step === '5' ? 0 : '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '22px', height: '22px', background: step === '3' ? 'var(--yellow)' : 'var(--surface-2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', flexShrink: 0, marginTop: '1px' }}>{step}</div>
                    <span style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '48px', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', overflow: 'hidden', animation: 'fadeUp 0.4s ease 0.3s both' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent activity</h3>
              <button onClick={() => setActivePage('activity')} style={{ fontSize: '12px', color: 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
            </div>
            <RecentActivity />
          </div>

        </main>
      )}
    </div>
  )
}
