import React, { useState, useMemo } from 'react'

const ALL_KEYWORDS = [
  { tag: 'cancerwarrior',        category: 'Journey' },
  { tag: 'cancerjourney',        category: 'Journey' },
  { tag: 'cancersurvivor',       category: 'Journey' },
  { tag: 'cancerfighter',        category: 'Journey' },
  { tag: 'cancerstrong',         category: 'Journey' },
  { tag: 'cancerfree',           category: 'Journey' },
  { tag: 'cancersupport',        category: 'Journey' },
  { tag: 'cancerawareness',      category: 'Journey' },
  { tag: 'cancercommunity',      category: 'Journey' },
  { tag: 'cancerlife',           category: 'Journey' },
  { tag: 'cancerhealing',        category: 'Journey' },
  { tag: 'cancerhope',           category: 'Journey' },
  { tag: 'canceradvocate',       category: 'Journey' },
  { tag: 'cancercare',           category: 'Journey' },
  { tag: 'cancerrecovery',       category: 'Journey' },
  { tag: 'chemolife',            category: 'Treatment' },
  { tag: 'chemotherapy',         category: 'Treatment' },
  { tag: 'chemowarrior',         category: 'Treatment' },
  { tag: 'chemosucks',           category: 'Treatment' },
  { tag: 'chemobrain',           category: 'Treatment' },
  { tag: 'chemoday',             category: 'Treatment' },
  { tag: 'lastchemo',            category: 'Treatment' },
  { tag: 'finishedchemo',        category: 'Treatment' },
  { tag: 'radiation',            category: 'Treatment' },
  { tag: 'radiationtherapy',     category: 'Treatment' },
  { tag: 'immunotherapy',        category: 'Treatment' },
  { tag: 'cancertreatment',      category: 'Treatment' },
  { tag: 'cancermeds',           category: 'Treatment' },
  { tag: 'cancersurgery',        category: 'Treatment' },
  { tag: 'ringthatbell',         category: 'Milestone' },
  { tag: 'cancerversary',        category: 'Milestone' },
  { tag: 'ned',                  category: 'Milestone' },
  { tag: 'cancerfreeanniversary',category: 'Milestone' },
  { tag: 'remission',            category: 'Milestone' },
  { tag: 'inremission',          category: 'Milestone' },
  { tag: 'cancerfreelife',       category: 'Milestone' },
  { tag: 'survivorhood',         category: 'Milestone' },
  { tag: 'bellringer',           category: 'Milestone' },
  { tag: 'ringthebell',          category: 'Milestone' },
  { tag: 'treatmentcomplete',    category: 'Milestone' },
  { tag: 'donewithchemo',        category: 'Milestone' },
  { tag: 'breastcancer',         category: 'Breast Cancer' },
  { tag: 'breastcancerwarrior',  category: 'Breast Cancer' },
  { tag: 'breastcancersurvivor', category: 'Breast Cancer' },
  { tag: 'breastcancerawareness',category: 'Breast Cancer' },
  { tag: 'breastcancerlife',     category: 'Breast Cancer' },
  { tag: 'breastcancerfighter',  category: 'Breast Cancer' },
  { tag: 'breastcancercommunity',category: 'Breast Cancer' },
  { tag: 'breastcancerstrong',   category: 'Breast Cancer' },
  { tag: 'thinkpink',            category: 'Breast Cancer' },
  { tag: 'pinkribbon',           category: 'Breast Cancer' },
  { tag: 'breastcancersupport',  category: 'Breast Cancer' },
  { tag: 'lymphoma',             category: 'Blood Cancer' },
  { tag: 'hodgkinslymphoma',     category: 'Blood Cancer' },
  { tag: 'nonhodgkinslymphoma',  category: 'Blood Cancer' },
  { tag: 'leukemia',             category: 'Blood Cancer' },
  { tag: 'leukemiawarrior',      category: 'Blood Cancer' },
  { tag: 'leukemiasurvivor',     category: 'Blood Cancer' },
  { tag: 'multiplemyeloma',      category: 'Blood Cancer' },
  { tag: 'myeloma',              category: 'Blood Cancer' },
  { tag: 'bloodcancer',          category: 'Blood Cancer' },
  { tag: 'bloodcancerwarrior',   category: 'Blood Cancer' },
  { tag: 'lungcancer',           category: 'Diagnosis' },
  { tag: 'lungcancerwarrior',    category: 'Diagnosis' },
  { tag: 'coloncancer',          category: 'Diagnosis' },
  { tag: 'colonwarrior',         category: 'Diagnosis' },
  { tag: 'ovariancancer',        category: 'Diagnosis' },
  { tag: 'ovariancancerwarrior', category: 'Diagnosis' },
  { tag: 'cervicalcancer',       category: 'Diagnosis' },
  { tag: 'thyroidcancer',        category: 'Diagnosis' },
  { tag: 'thyroidcancerwarrior', category: 'Diagnosis' },
  { tag: 'melanoma',             category: 'Diagnosis' },
  { tag: 'skincancer',           category: 'Diagnosis' },
  { tag: 'braintumor',           category: 'Diagnosis' },
  { tag: 'braintumorwarrior',    category: 'Diagnosis' },
  { tag: 'pancreaticcancer',     category: 'Diagnosis' },
  { tag: 'prostatecancer',       category: 'Diagnosis' },
  { tag: 'kidneycancer',         category: 'Diagnosis' },
  { tag: 'cancermindset',        category: 'Wellness' },
  { tag: 'cancerpositive',       category: 'Wellness' },
  { tag: 'cancerfit',            category: 'Wellness' },
  { tag: 'canceryoga',           category: 'Wellness' },
  { tag: 'cancernutrition',      category: 'Wellness' },
  { tag: 'cancerwellness',       category: 'Wellness' },
  { tag: 'cancerselfcare',       category: 'Wellness' },
  { tag: 'cancermentalhealth',   category: 'Wellness' },
  { tag: 'oncology',             category: 'Wellness' },
  { tag: 'oncologylife',         category: 'Wellness' },
  { tag: 'cancerfamily',         category: 'Community' },
  { tag: 'cancermom',            category: 'Community' },
  { tag: 'cancerdad',            category: 'Community' },
  { tag: 'cancerdaughter',       category: 'Community' },
  { tag: 'cancerson',            category: 'Community' },
  { tag: 'caregiver',            category: 'Community' },
  { tag: 'cancercaregiver',      category: 'Community' },
  { tag: 'cancerspouse',         category: 'Community' },
  { tag: 'pediatriccancer',      category: 'Community' },
  { tag: 'childhoodcancer',      category: 'Community' },
  { tag: 'fightlikeagirl',       category: 'Inspiration' },
  { tag: 'fuckcancer',           category: 'Inspiration' },
  { tag: 'beatcancer',           category: 'Inspiration' },
  { tag: 'cancersucks',          category: 'Inspiration' },
  { tag: 'strongerthancancer',   category: 'Inspiration' },
  { tag: 'cancerneverquit',      category: 'Inspiration' },
]

const CATEGORIES = ['Journey', 'Treatment', 'Milestone', 'Breast Cancer', 'Blood Cancer', 'Diagnosis', 'Wellness', 'Community', 'Inspiration']

const CATEGORY_COLORS = {
  Journey:         { bg: '#FEF3C7', color: '#B45309',  dot: '#F5C518' },
  Treatment:       { bg: '#FEE2E2', color: '#B91C1C',  dot: '#EF4444' },
  Milestone:       { bg: '#EDE8FE', color: '#5B21B6',  dot: '#8B5CF6' },
  'Breast Cancer': { bg: '#FCE7F3', color: '#9D174D',  dot: '#EC4899' },
  'Blood Cancer':  { bg: '#E0F2FE', color: '#075985',  dot: '#0EA5E9' },
  Diagnosis:       { bg: '#F3F4F6', color: '#374151',  dot: '#6B7280' },
  Wellness:        { bg: '#E8F5EE', color: '#1A7A4A',  dot: '#10B981' },
  Community:       { bg: '#FFF7ED', color: '#9A3412',  dot: '#F97316' },
  Inspiration:     { bg: '#F5F3FF', color: '#4C1D95',  dot: '#7C3AED' },
}

// Pick a random subset ensuring representation from each category
function pickRandomSubset() {
  const result = []
  const perCategory = 3 // 3 from each of 9 categories = 27 total

  for (const cat of CATEGORIES) {
    const pool = ALL_KEYWORDS.filter(k => k.category === cat)
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    result.push(...shuffled.slice(0, perCategory))
  }

  // Shuffle the final result so categories aren't grouped
  return result.sort(() => Math.random() - 0.5)
}

export default function KeywordsPage() {
  const [hoveredTag, setHoveredTag] = useState(null)

  // Pick random subset once per page load — useMemo with no deps = computed once on mount
  const keywords = useMemo(() => pickRandomSubset(), [])

  function handleClick(tag) {
    window.open(`https://www.instagram.com/explore/search/keyword/?q=${tag}`, '_blank')
  }

  function handleRefresh() {
    window.location.reload()
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontFamily: 'DM Serif Display, serif', color: 'var(--ink)', marginBottom: '6px' }}>
            Keywords
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', fontFamily: 'DM Sans, sans-serif' }}>
            A fresh selection of {keywords.length} keywords — click any to open Instagram and scrape posts.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          style={{
            padding: '8px 16px',
            border: '1px solid var(--border-strong)',
            borderRadius: '8px',
            background: 'none',
            fontSize: '12px',
            color: 'var(--ink-muted)',
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          ↻ New selection
        </button>
      </div>

      {/* Category legend */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {CATEGORIES.map(cat => {
          const c = CATEGORY_COLORS[cat]
          return (
            <span key={cat} style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '3px 10px',
              background: c.bg,
              color: c.color,
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 500,
              fontFamily: 'DM Sans, sans-serif',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
              {cat}
            </span>
          )
        })}
      </div>

      {/* Keyword chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {keywords.map(({ tag, category }) => {
          const c       = CATEGORY_COLORS[category] || { bg: '#F3F4F6', color: '#374151' }
          const isHover = hoveredTag === tag
          return (
            <button
              key={tag}
              onClick={() => handleClick(tag)}
              onMouseEnter={() => setHoveredTag(tag)}
              onMouseLeave={() => setHoveredTag(null)}
              style={{
                padding: '8px 16px',
                border: '1.5px solid',
                borderColor: isHover ? c.color : 'var(--border)',
                borderRadius: '20px',
                background: isHover ? c.bg : 'white',
                color: isHover ? c.color : 'var(--ink)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.12s',
              }}
            >
              {tag}
            </button>
          )
        })}
      </div>

      <div style={{ marginTop: '28px', fontSize: '12px', color: 'var(--ink-muted)', fontFamily: 'DM Sans, sans-serif' }}>
        Showing {keywords.length} of {ALL_KEYWORDS.length} keywords · Refreshes on each page load
      </div>

    </div>
  )
}
