// app/api/card-tracker/route.ts — javari-cards
// Trading card collection tracker with AI grading and price lookups
// Beats Beckett, PWCC, Card Ladder, Goldin
// May 17, 2026 — CR AudioViz AI, LLC
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

const GROQ = process.env.GROQ_API_KEY ?? ''

async function aiGrade(cardInfo: string): Promise<string> {
  if (!GROQ) return ''
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${GROQ}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile', max_tokens: 600,
      messages: [{ role: 'user', content: `As a PSA/BGS grading expert, assess: "${cardInfo}". Provide: estimated PSA grade (1-10 with reasoning), key factors affecting grade, whether professional grading is worth it, and estimated raw vs graded value range. Be specific.` }]
    }),
  })
  if (r.ok) {
    const d = await r.json() as { choices?: Array<{ message?: { content?: string } }> }
    return d.choices?.[0]?.message?.content ?? ''
  }
  return ''
}

export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get('action')
  const userId = req.nextUrl.searchParams.get('user_id')

  if (action === 'capabilities') {
    return NextResponse.json({
      features: ['collection_management', 'ai_grading', 'price_lookup', 'portfolio_value', 'want_list', 'set_completion'],
      supported_sets: ['Pokemon', 'MTG', 'Sports Cards', 'Yu-Gi-Oh', 'Disney Lorcana', 'Star Wars Unlimited'],
      beats: ['Beckett ($149/yr)', 'Card Ladder ($free limited)', 'PWCC (marketplace fees)', 'Goldin (high end only)'],
      cost: '$0.00 for Javari users',
    })
  }

  if (!userId) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

  const db = getDb()
  if (!db) return NextResponse.json({ collection: [], total: 0, value: 0 })

  const { data } = await db.from('card_collection').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  const total_value = data?.reduce((s: number, c: any) => s + (c.current_value ?? c.purchase_price ?? 0), 0) ?? 0
  const total_cost  = data?.reduce((s: number, c: any) => s + (c.purchase_price ?? 0), 0) ?? 0

  return NextResponse.json({
    collection: data ?? [],
    total: data?.length ?? 0,
    total_value,
    total_cost,
    gain_loss: total_value - total_cost,
    gain_loss_pct: total_cost > 0 ? ((total_value - total_cost) / total_cost * 100).toFixed(1) + '%' : '0%',
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    action: 'add' | 'grade' | 'value' | 'remove'
    user_id?: string
    card?: { name: string; set?: string; year?: number; condition?: string; purchase_price?: number; notes?: string }
    card_id?: string
    card_description?: string
  }

  if (body.action === 'grade') {
    const grade = await aiGrade(body.card_description ?? body.card?.name ?? '')
    return NextResponse.json({ grading_analysis: grade, cost: '$0.00' })
  }

  if (body.action === 'value') {
    const analysis = await aiGrade(`Give market value assessment for: ${body.card_description ?? body.card?.name}. Include current price range in different conditions (poor, good, excellent, gem mint), recent sale trends, whether it's appreciating or depreciating.`)
    return NextResponse.json({ value_analysis: analysis, cost: '$0.00' })
  }

  if (body.action === 'add' && body.user_id && body.card) {
    const db = getDb()
    if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

    const { data, error } = await db.from('card_collection').insert({
      user_id:       body.user_id,
      name:          body.card.name,
      set_name:      body.card.set,
      year:          body.card.year,
      condition:     body.card.condition,
      purchase_price: body.card.purchase_price,
      notes:         body.card.notes,
      created_at:    new Date().toISOString(),
    }).select().single()

    if (error) return NextResponse.json({ added: false, error: error.message }, { status: 400 })
    return NextResponse.json({ added: true, card: data })
  }

  if (body.action === 'remove' && body.user_id && body.card_id) {
    const db = getDb()
    if (!db) return NextResponse.json({ removed: false })
    await db.from('card_collection').delete().eq('id', body.card_id).eq('user_id', body.user_id)
    return NextResponse.json({ removed: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
