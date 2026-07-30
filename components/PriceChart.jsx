'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts'

export default function PriceChart({ data }) {
  const min = Math.min(...data.map(d => d.price))
  const max = Math.max(...data.map(d => d.price))
  const first = data[0].price, last = data[data.length - 1].price
  const change = ((last - first) / first) * 100

  return (
    <div className="bg-panel rounded-xl border border-white/5 p-4">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">60-Day Price</div>
          <div className="text-2xl font-black text-rift">${last.toFixed(2)}</div>
        </div>
        <div className={`text-sm font-bold ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6B00" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#FF6B00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 10 }} tickFormatter={(d) => d.slice(5)} interval={9} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#666', fontSize: 10 }} domain={[min * 0.9, max * 1.05]} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0a0a0a', border: '1px solid #FF6B00', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#999' }}
              formatter={(v) => [`$${v}`, 'Price']}
            />
            <Area type="monotone" dataKey="price" stroke="#FF6B00" strokeWidth={2} fill="url(#g)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-white/5 text-center">
        <div><div className="text-[10px] uppercase text-muted-foreground">Low</div><div className="text-sm font-bold">${min.toFixed(2)}</div></div>
        <div><div className="text-[10px] uppercase text-muted-foreground">Avg</div><div className="text-sm font-bold">${(data.reduce((a, d) => a + d.price, 0) / data.length).toFixed(2)}</div></div>
        <div><div className="text-[10px] uppercase text-muted-foreground">High</div><div className="text-sm font-bold">${max.toFixed(2)}</div></div>
      </div>
    </div>
  )
}
