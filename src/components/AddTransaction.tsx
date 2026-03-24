import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBudgetStore, Category, TransactionType } from '@/store/budgetStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const categories: Category[] = ['food', 'transport', 'shopping', 'bills', 'entertainment', 'salary', 'freelance', 'other'];

export default function AddTransaction() {
  const { addTransaction } = useBudgetStore();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    addTransaction({
      amount: parseFloat(amount),
      category,
      type,
      date,
      notes,
    });
    toast({
      title: "Got it! That's logged. ✅",
      description: `${type === 'income' ? '💰' : '💸'} $${parseFloat(amount).toFixed(2)} for ${category}`,
    });
    setAmount('');
    setNotes('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold text-foreground">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Amount ($)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-2">
              {(['expense', 'income'] as TransactionType[]).map((t) => (
                <motion.button
                  key={t}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                    type === t
                      ? t === 'income'
                        ? 'bg-income/20 text-income border border-income/30'
                        : 'bg-expense/20 text-expense border border-expense/30'
                      : 'bg-secondary text-muted-foreground border border-border'
                  }`}
                >
                  {t === 'income' ? '💰' : '💸'} {t}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Input
            placeholder="What's this for?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="rounded-xl"
          />
        </div>
        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
          <Button type="submit" className="w-full rounded-xl h-12 text-base font-semibold">
            Add Transaction ✨
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
