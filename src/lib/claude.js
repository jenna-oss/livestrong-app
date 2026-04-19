const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export async function suggestKeywords(seedKeywords) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: `You suggest Instagram hashtags for finding personal cancer journey posts.
Return ONLY a JSON array of 8 hashtag strings (without the # symbol).
Focus on hashtags used by individuals sharing personal cancer experiences.
Exclude generic awareness, business, or charity hashtags.
No explanation, no markdown, just the JSON array.`,
      messages: [{
        role: 'user',
        content: `Current hashtags: ${seedKeywords.join(', ')}
Suggest 8 more specific hashtags for finding personal cancer journey posts on Instagram.
Think about specific cancer types, treatment phases, milestones, and emotional experiences.`
      }]
    })
  })

  const data = await response.json()
  const text = data.content?.[0]?.text || '[]'
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return []
  }
}
