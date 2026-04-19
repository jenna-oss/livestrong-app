import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'


function timeAgo(iso) {
  const diff = Date.now() - new Date(iso)
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7)  return `${d}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid #E8E2D8',
      borderRadius: '10px',
      padding: '16px 20px',
    }}>
      <div style={{ fontSize: '11px', fontWeight: 500, color: '#AAA49C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '26px', fontFamily: 'Georgia, serif', color: '#1A1610', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: '#AAA49C', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

export default function ActivityPage() {
  const [logs, setLogs]               = useState([])
  const [loading, setLoading]         = useState(true)
  const [expanded, setExpanded]       = useState(null)
  const [search, setSearch]           = useState('')
  const [dateFilter, setDateFilter]   = useState('all')
  const [followerFilter, setFollowerFilter] = useState('any')
  const [stats, setStats] = useState({ today: 0, week: 0, total: 0 })

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    setLoading(true)
    const { data } = await supabase
      .from('engagement_log')
      .select('*')
      .order('posted_at', { ascending: false })
      .limit(200)

    const rows = data || []
    setLogs(rows)
    computeStats(rows)
    setLoading(false)
  }

  function computeStats(rows) {
    const now   = Date.now()
    const today = rows.filter(r => now - new Date(r.posted_at) < 86400000).length
    const week  = rows.filter(r => now - new Date(r.posted_at) < 7 * 86400000).length
    setStats({ today, week, total: rows.length })
  }

  const FOLLOWER_BRACKETS = {
    any:    { label: 'Any followers',   min: 0,      max: Infinity },
    micro:  { label: 'Under 1K',        min: 0,      max: 999 },
    small:  { label: '1K – 10K',        min: 1000,   max: 9999 },
    mid:    { label: '10K – 100K',      min: 10000,  max: 99999 },
    large:  { label: '100K+',           min: 100000, max: Infinity },
  }

  const filtered = logs.filter(log => {
    const now = Date.now()
    const age = now - new Date(log.posted_at)

    if (dateFilter === 'today' && age > 86400000) return false
    if (dateFilter === 'week'  && age > 7 * 86400000) return false
    if (dateFilter === 'month' && age > 30 * 86400000) return false

    if (followerFilter !== 'any') {
      const { min, max } = FOLLOWER_BRACKETS[followerFilter]
      const fc = log.follower_count
      if (fc == null) return false  // hide rows with no follower data when filtering
      if (fc < min || fc > max) return false
    }

    const q = search.toLowerCase()
    if (q) {
      const handle  = (log.instagram_handle || '').toLowerCase()
      const comment = (log.comment_posted   || '').toLowerCase()
      const caption = (log.post_caption     || '').toLowerCase()
      if (!handle.includes(q) && !comment.includes(q) && !caption.includes(q)) return false
    }

    return true
  })

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 32px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontFamily: 'Georgia, serif', color: '#1A1610', marginBottom: '6px' }}>
          Activity
        </h1>
        <p style={{ fontSize: '14px', color: '#7A7268', fontFamily: 'sans-serif' }}>
          All comments posted by LiveStrong on Instagram
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
        <StatCard label="Today"       value={stats.today}    />
        <StatCard label="This week"   value={stats.week}     />
        <StatCard label="All time"    value={stats.total}    />
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: '12px', alignItems: 'center',
        marginBottom: '20px', flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <span style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: '#AAA49C', fontSize: '14px', pointerEvents: 'none',
          }}>⌕</span>
          <input
            type="text"
            placeholder="Search by handle, comment…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 32px',
              border: '1px solid #E8E2D8', borderRadius: '8px',
              fontFamily: 'sans-serif', fontSize: '13px',
              color: '#1A1610', background: 'white',
              outline: 'none',
            }}
          />
        </div>

        {/* Date filter */}
        <select
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          style={{
            padding: '9px 12px', border: '1px solid #E8E2D8',
            borderRadius: '8px', fontFamily: 'sans-serif',
            fontSize: '13px', color: '#1A1610', background: 'white',
            cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="all">All time</option>
          <option value="today">Today</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
        </select>

        {/* Follower filter */}
        <select
          value={followerFilter}
          onChange={e => setFollowerFilter(e.target.value)}
          style={{
            padding: '9px 12px', border: '1px solid #E8E2D8',
            borderRadius: '8px', fontFamily: 'sans-serif',
            fontSize: '13px', color: '#1A1610', background: 'white',
            cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="any">Any followers</option>
          <option value="micro">Under 1K</option>
          <option value="small">1K – 10K</option>
          <option value="mid">10K – 100K</option>
          <option value="large">100K+</option>
        </select>

        <span style={{ fontSize: '12px', color: '#AAA49C', fontFamily: 'sans-serif', marginLeft: 'auto' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div style={{
        background: 'white',
        border: '1px solid #E8E2D8',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '160px 1fr 90px 70px',
          padding: '10px 18px',
          background: '#FDFAF5',
          borderBottom: '1px solid #E8E2D8',
          fontFamily: 'sans-serif', fontSize: '11px', fontWeight: 500,
          color: '#AAA49C', textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          <span>Handle</span>
          <span>Comment</span>
          <span>Followers</span>
          <span>When</span>
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', fontSize: '13px', color: '#AAA49C' }}>
            Loading activity…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', fontSize: '13px', color: '#AAA49C' }}>
            No results found. Try adjusting your filters.
          </div>
        ) : (
          filtered.map((log, i) => {
            const isExpanded = expanded === log.id

            return (
              <div key={log.id}>
                <div
                  onClick={() => setExpanded(isExpanded ? null : log.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '160px 1fr 90px 70px',
                    padding: '14px 18px',
                    borderBottom: isExpanded ? 'none' : (i < filtered.length - 1 ? '1px solid #F5F0E8' : 'none'),
                    cursor: 'pointer',
                    background: isExpanded ? '#FDFAF5' : 'white',
                    transition: 'background 0.1s',
                    alignItems: 'center',
                  }}
                  onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = '#FDFAF5' }}
                  onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = 'white' }}
                >
                  {/* Handle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: '#F0EBE0', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '10px', fontWeight: 500,
                      color: '#7A7268', flexShrink: 0, fontFamily: 'sans-serif',
                    }}>
                      {(log.instagram_handle || '?').replace('@','').slice(0,2).toUpperCase()}
                    </div>
                    <span style={{
                      fontFamily: 'sans-serif', fontSize: '12px', fontWeight: 500,
                      color: '#1A1610', overflow: 'hidden', textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {log.instagram_handle || '—'}
                    </span>
                  </div>

                  {/* Comment preview */}
                  <span style={{
                    fontFamily: 'sans-serif', fontSize: '12px', color: '#7A7268',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    paddingRight: '16px',
                  }}>
                    {log.comment_posted || '—'}
                  </span>

                  {/* Followers */}
                  <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#7A7268' }}>
                    {log.follower_count != null
                      ? log.follower_count >= 1000000
                        ? `${(log.follower_count / 1000000).toFixed(1)}M`
                        : log.follower_count >= 1000
                          ? `${(log.follower_count / 1000).toFixed(1)}K`
                          : log.follower_count.toLocaleString()
                      : '—'}
                  </span>

                  {/* When */}
                  <span style={{ fontFamily: 'sans-serif', fontSize: '11px', color: '#AAA49C' }}>
                    {timeAgo(log.posted_at)}
                  </span>
                </div>

                {/* Expanded row */}
                {isExpanded && (
                  <div style={{
                    padding: '16px 20px 20px',
                    borderBottom: i < filtered.length - 1 ? '1px solid #F5F0E8' : 'none',
                    background: '#FDFAF5',
                    borderTop: '1px solid #F0EBE0',
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                      {/* Comment */}
                      <div>
                        <div style={{ fontFamily: 'sans-serif', fontSize: '10px', fontWeight: 500, color: '#AAA49C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                          Comment posted
                        </div>
                        <div style={{
                          background: 'white', border: '1px solid #E8E2D8',
                          borderRadius: '8px', padding: '12px 14px',
                          fontFamily: 'sans-serif', fontSize: '13px', color: '#1A1610',
                          lineHeight: 1.6,
                        }}>
                          {log.comment_posted || '—'}
                        </div>
                      </div>

                      {/* Caption */}
                      <div>
                        <div style={{ fontFamily: 'sans-serif', fontSize: '10px', fontWeight: 500, color: '#AAA49C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                          Original caption
                        </div>
                        <div style={{
                          background: 'white', border: '1px solid #E8E2D8',
                          borderRadius: '8px', padding: '12px 14px',
                          fontFamily: 'sans-serif', fontSize: '13px', color: '#7A7268',
                          lineHeight: 1.6,
                          maxHeight: '80px', overflow: 'hidden',
                        }}>
                          {log.post_caption || 'No caption recorded'}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      marginTop: '14px',
                    }}>
                      {log.post_url && (
                        <a
                          href={log.post_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            padding: '7px 14px',
                            background: '#1A1610', color: 'white',
                            borderRadius: '7px', fontFamily: 'sans-serif',
                            fontSize: '12px', fontWeight: 500,
                            textDecoration: 'none',
                          }}
                        >
                          View on Instagram ↗
                        </a>
                      )}
                      <span style={{ fontFamily: 'sans-serif', fontSize: '11px', color: '#AAA49C' }}>
                        Posted {new Date(log.posted_at).toLocaleString('en-US', {
                          month: 'short', day: 'numeric',
                          hour: 'numeric', minute: '2-digit',
                        })}
                        {log.posted_by ? ` by ${log.posted_by}` : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
