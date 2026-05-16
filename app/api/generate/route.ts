// app/api/generate/route.ts — javari-card-vault
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'; export const runtime = 'nodejs'; export const maxDuration = 60
const GROQ = process.env.GROQ_API_KEY ?? ''; const OR = process.env.OPENROUTER_API_KEY ?? ''
const SYSTEM = `You are a trading card expert for CR AudioViz AI. Help collectors value cards, identify rare finds, build collections, and make smart trades across Pokemon, MTG, sports cards, and more.`; const ACTIONS = ["card_valuation", "collection_analysis", "trade_evaluation", "grading_guide", "investment_advice", "rarity_lookup"]; const COST = 3
async function gen(p: string): Promise<string> {
  if (OR) { try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', { method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${OR}`,'HTTP-Referer':'https://craudiovizai.com'}, body:JSON.stringify({model:'deepseek/deepseek-v4-flash:free',max_tokens:2048,temperature:0.7,messages:[{role:'system',content:SYSTEM},{role:'user',content:p}]}) })
    if (r.ok) { const d = await r.json() as {choices?:Array<{message?:{content?:string}}> }; const t = d.choices?.[0]?.message?.content ?? ''; if (t.length > 50) return t }
  } catch {} }
  if (!GROQ) throw new Error('no AI key')
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', { method:'POST', headers:{'Content-Type':'application/json',Authorization:`Bearer ${GROQ}`}, body:JSON.stringify({model:'llama-3.3-70b-versatile',max_tokens:2048,temperature:0.7,messages:[{role:'system',content:SYSTEM},{role:'user',content:p}]}) })
  if (!r.ok) throw new Error(`Groq ${r.status}`); const d = await r.json() as {choices?:Array<{message?:{content?:string}}> }; return d.choices?.[0]?.message?.content ?? ''
}
export async function GET() { return NextResponse.json({actions:ACTIONS,cost:COST+' credits',cost_usd:'$0.00'}) }
export async function POST(req: NextRequest) {
  try {
    const b = await req.json() as {action:string;input:string}
    if (!b.input?.trim()) return NextResponse.json({error:'input required'},{status:400})
    if (!ACTIONS.includes(b.action)) return NextResponse.json({error:'invalid action',available:ACTIONS},{status:400})
    const result = await gen(`${b.action.replace(/_/g,' ')}: ${b.input}`)
    return NextResponse.json({result,action:b.action,cost_usd:'$0.00',credits_used:COST})
  } catch(err) { return NextResponse.json({error:String(err)},{status:500}) }
}