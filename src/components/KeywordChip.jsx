import React from 'react'

export default function KeywordChip({ tag, category, onClick, isNew = false }) {
  return (
    <button
      onClick={() => onClick(tag)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        background: isNew ? 'var(--yellow-light)' : 'white',
        border: `1.5px solid ${isNew ? 'var(--yellow-dark)' : 'var(--border-strong)'}`,
        borderRadius: '100px',
        fontSize: '13px',
        fontWeight: '500',
        color: isNew ? 'var(--amber)' : 'var(--ink-soft)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
        boxShadow: '0 1px 2px rgba(26,22,16,0.06)',
        animation: 'fadeUp 0.3s ease both',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--yellow)'
        e.currentTarget.style.borderColor = 'var(--yellow-dark)'
        e.currentTarget.style.color = 'var(--ink)'
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(245,197,24,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isNew ? 'var(--yellow-light)' : 'white'
        e.currentTarget.style.borderColor = isNew ? 'var(--yellow-dark)' : 'var(--border-strong)'
        e.currentTarget.style.color = isNew ? 'var(--amber)' : 'var(--ink-soft)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(26,22,16,0.06)'
      }}
    >
      {tag}
    </button>
  )
}
