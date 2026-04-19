import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

export default function RecentActivity() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('engagement_log')
        .select('*')
        .order('posted_at', { ascending: false })
        .limit(8)
      setLogs(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  const toneColors = {
    Warm:        { bg: '#FEF3C7', color: '#B45309' },
    Encouraging: { bg: '#E8F5EE', color: '#1A7A4A' },
    Celebratory: { bg: '#EDE8FE', color: '#5B21B6' },
    Supportive:  { bg: '#FEE2E2', color: '#B91C1C' },
  }

  function timeAgo(iso) {
    const diff = Date.now() - new Date(iso)
    const m = Math.floor(diff / 60000)
    if (m < 1)  return 'just now'
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  if (loading) return (
    <div style={{ padding: '24px', color: 'var(--ink-muted)', fontSize: '13px', textAlign: 'center' }}>
      Loading activity…
    </div>
  )

  if (!logs.length) return (
    <div style={{ padding: '24px', color: 'var(--ink-muted)', fontSize: '13px', textAlign: 'center' }}>
      No comments posted yet. Click a keyword above to get started.
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {logs.map((log, i) => {
        const tc = toneColors[log.tone] || toneColors.Warm
        return (
          <div key={log.id} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '14px 20px',
            borderBottom: i < logs.length - 1 ? '1px solid var(--border)' : 'none',
            animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
          }}>
            <div style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              background: 'var(--surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 500,
              color: 'var(--ink-muted)',
              flexShrink: 0,
            }}>
              {(log.instagram_handle || '?').replace('@', '').slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>
                  {log.instagram_handle || 'unknown'}
                </span>
                <span style={{
                  fontSize: '10px', padding: '2px 7px',
                  background: tc.bg, color: tc.color,
                  borderRadius: '20px', fontWeight: 500,
                }}>
                  {log.tone}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--ink-muted)', marginLeft: 'auto' }}>
                  {timeAgo(log.posted_at)}
                </span>
              </div>
              <p style={{
                fontSize: '12px', color: 'var(--ink-muted)',
                overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {log.comment_posted}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
