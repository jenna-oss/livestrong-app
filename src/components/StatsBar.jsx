import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

export default function StatsBar() {
  const [stats, setStats] = useState({ today: 0, week: 0, total: 0 })

  useEffect(() => {
    async function fetchStats() {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      const weekStart  = new Date(now - 7 * 86400000).toISOString()

      const [{ count: total }, { count: week }, { count: today }] = await Promise.all([
        supabase.from('engagement_log').select('*', { count: 'exact', head: true }),
        supabase.from('engagement_log').select('*', { count: 'exact', head: true }).gte('posted_at', weekStart),
        supabase.from('engagement_log').select('*', { count: 'exact', head: true }).gte('posted_at', todayStart),
      ])

      setStats({ today: today || 0, week: week || 0, total: total || 0 })
    }

    fetchStats()
  }, [])

  const items = [
    { label: 'Today', value: stats.today },
    { label: 'This week', value: stats.week },
    { label: 'All time', value: stats.total },
  ]

  return (
    <div style={{
      display: 'flex',
      gap: '1px',
      background: 'var(--border)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
    }}>
      {items.map(({ label, value }) => (
        <div key={label} style={{
          flex: 1,
          padding: '12px 16px',
          background: 'white',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '22px', fontFamily: 'DM Serif Display, serif', color: 'var(--ink)' }}>
            {value}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginTop: '2px', fontWeight: 500 }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}
