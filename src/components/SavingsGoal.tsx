import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBudgetStore } from '@/store/budgetStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function SavingsGoal() {
  const { savingsGoal, savingsProgress, setSavingsGoal, addSavingsProgress } = useBudgetStore();
  const { toast } = useToast();
  const [goalInput, setGoalInput] = useState(savingsGoal.toString());
  const [addAmount, setAddAmount] = useState('');
  const pct = savingsGoal > 0 ? Math.min((savingsProgress / savingsGoal) * 100, 100) : 0;
  const reached = pct >= 100;

  const handleSetGoal = () => {
    const val = parseFloat(goalInput);
    if (val > 0) setSavingsGoal(val);
  };

  const handleAdd = () => {
    const val = parseFloat(addAmount);
    if (val > 0) {
      addSavingsProgress(val);
      setAddAmount('');
      const newPct = savingsGoal > 0 ? ((savingsProgress + val) / savingsGoal) * 100 : 0;
      if (newPct >= 100 && pct < 100) {
        toast({
          title: '🎉 Goal Reached!',
          description: "Congratulations! You've hit your savings goal! 🥳",
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-foreground">Savings Goal 🎯</h2>

      <div className="glass-card rounded-2xl p-6 space-y-6">
        {/* Progress ring */}
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="65" fill="none" stroke="hsl(var(--lavender-100))" strokeWidth="12" />
              <motion.circle
                cx="80"
                cy="80"
                r="65"
                fill="none"
                stroke={reached ? 'hsl(var(--income))' : 'hsl(var(--primary))'}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 65}
                initial={{ strokeDashoffset: 2 * Math.PI * 65 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 65 * (1 - pct / 100) }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{Math.round(pct)}%</span>
              <span className="text-xs text-muted-foreground">${savingsProgress.toFixed(0)} / ${savingsGoal.toFixed(0)}</span>
            </div>
          </div>
          {reached && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-4 text-center"
            >
              <span className="text-4xl">🎉</span>
              <p className="text-income font-semibold mt-1">Goal Reached!</p>
            </motion.div>
          )}
        </div>

        {/* Set goal */}
        <div className="space-y-2">
          <Label>Set Goal Amount</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              className="rounded-xl"
              placeholder="1000"
            />
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button onClick={handleSetGoal} variant="outline" className="rounded-xl">
                Set
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Add savings */}
        <div className="space-y-2">
          <Label>Add to Savings</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              className="rounded-xl"
              placeholder="50"
            />
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button onClick={handleAdd} className="rounded-xl">
                Add 💰
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
