const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

export const groqAI = async (prompt, systemPrompt = '') => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: systemPrompt || 'You are an expert resume writer and career coach.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Groq error:', err)
      return ''
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''

  } catch (err) {
    console.error('groqAI error:', err)
    return ''
  }
}