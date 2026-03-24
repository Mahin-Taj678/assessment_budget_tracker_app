import { motion } from 'framer-motion';
import { useBudgetStore, categoryEmojis, Category } from '@/store/budgetStore';

const COLORS = [
  'hsl(280, 22%, 59%)',
  'hsl(152, 48%, 68%)',
  'hsl(0, 70%, 80%)',
  'hsl(40, 80%, 70%)',
  'hsl(200, 60%, 65%)',
  'hsl(320, 40%, 65%)',
  'hsl(100, 40%, 60%)',
  'hsl(260, 50%, 70%)',
];

export default function BudgetInsights() {
  const { transactions } = useBudgetStore();

  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);

  // Category breakdown
  const byCategory = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const cats = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  // Pie chart data
  let cumAngle = 0;
  const pieSlices = cats.map(([cat, amount], i) => {
    const pct = totalExpense > 0 ? amount / totalExpense : 0;
    const startAngle = cumAngle;
    cumAngle += pct * 360;
    return { cat, amount, pct, startAngle, endAngle: cumAngle, color: COLORS[i % COLORS.length] };
  });

  // SVG pie
  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
  };

  // Bar chart
  const maxAmount = Math.max(...cats.map(([, a]) => a), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-foreground">Budget Insights</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Spending by Category</h3>
          {cats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2 animate-float">📊</div>
              <p>No expenses yet</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <svg viewBox="0 0 200 200" className="w-48 h-48">
                {pieSlices.map((s, i) => (
                  <motion.path
                    key={s.cat}
                    d={describeArc(100, 100, 85, s.startAngle, s.endAngle - 0.5)}
                    fill={s.color}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, type: 'spring' }}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
                <circle cx="100" cy="100" r="45" fill="hsl(var(--card))" />
                <text x="100" y="96" textAnchor="middle" className="text-xs fill-muted-foreground">
                  Total
                </text>
                <text x="100" y="112" textAnchor="middle" className="text-sm font-bold fill-foreground">
                  ${totalExpense.toFixed(0)}
                </text>
              </svg>
              <div className="flex flex-wrap gap-2 justify-center">
                {pieSlices.map((s) => (
                  <div key={s.cat} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-muted-foreground capitalize">
                      {categoryEmojis[s.cat as Category]} {s.cat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Category Breakdown</h3>
          {cats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2 animate-float">📈</div>
              <p>Add some transactions to see insights</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cats.map(([cat, amount], i) => (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-foreground">
                      {categoryEmojis[cat as Category]} {cat}
                    </span>
                    <span className="text-muted-foreground">${amount.toFixed(2)}</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(amount / maxAmount) * 100}%` }}
                      transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
