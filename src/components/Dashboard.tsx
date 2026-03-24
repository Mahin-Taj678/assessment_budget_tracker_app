import { motion } from 'framer-motion';
import { useBudgetStore } from '@/store/budgetStore';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  delay,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 300, damping: 20 }}
    className="glass-card rounded-2xl p-6 hover-scale"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
    <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
  </motion.div>
);

const CircularProgress = ({ percent }: { percent: number }) => {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(percent, 100) / 100) * circ;
  const overBudget = percent > 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center"
    >
      <span className="text-sm font-medium text-muted-foreground mb-4">Monthly Spending</span>
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={r}
            fill="none"
            stroke="hsl(var(--lavender-100))"
            strokeWidth="10"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={r}
            fill="none"
            stroke={overBudget ? 'hsl(var(--expense))' : 'hsl(var(--primary))'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">{Math.round(percent)}%</span>
          <span className="text-xs text-muted-foreground">of limit</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const { transactions, monthlyLimit } = useBudgetStore();

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const spendPercent = monthlyLimit > 0 ? (totalExpense / monthlyLimit) * 100 : 0;

  const fmt = (n: number) =>
    '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      {/* Balance hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-gradient-to-br from-lavender-100 to-card border border-border card-shadow"
      >
        <div className="relative z-10">
          <span className="text-primary font-medium text-sm uppercase tracking-widest">
            Total Balance
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground mt-2 tracking-tight">
            {fmt(balance)}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Your money, at peace. ✨</p>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-lavender-200 rounded-full blur-3xl opacity-50" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-lavender-100 rounded-full blur-3xl opacity-40" />
      </motion.div>

      {/* Stat cards + progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Total Income"
          value={fmt(totalIncome)}
          icon={TrendingUp}
          color="bg-income/20 text-income"
          delay={0.1}
        />
        <StatCard
          label="Total Expenses"
          value={fmt(totalExpense)}
          icon={TrendingDown}
          color="bg-expense/20 text-expense"
          delay={0.15}
        />
        <StatCard
          label="Monthly Limit"
          value={fmt(monthlyLimit)}
          icon={Wallet}
          color="bg-primary/20 text-primary"
          delay={0.2}
        />
      </div>

      <CircularProgress percent={spendPercent} />

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass-card rounded-2xl p-5"
      >
        <p className="text-sm text-muted-foreground">
          💡 <span className="font-medium text-foreground">Tip:</span> Try the "Save the Coins" game to earn virtual savings points and build your saving habit!
        </p>
      </motion.div>
    </div>
  );
}
