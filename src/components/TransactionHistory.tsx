import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudgetStore, categoryEmojis } from '@/store/budgetStore';
import { Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TransactionHistory() {
  const { transactions, deleteTransaction } = useBudgetStore();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.notes.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || t.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-foreground">Transaction History</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-full sm:w-40 rounded-xl">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Object.keys(categoryEmojis).map((c) => (
              <SelectItem key={c} value={c} className="capitalize">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 max-h-[60vh] sm:max-h-[400px] overflow-y-auto pr-1">
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <div className="text-4xl mb-2 animate-float">☁️</div>
              <p>No transactions found</p>
            </motion.div>
          )}
          {filtered.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-lg">
                {categoryEmojis[t.category]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate capitalize">
                  {t.category}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {t.notes || 'No notes'} · {t.date}
                </p>
              </div>
              <span
                className={`font-semibold text-sm ${
                  t.type === 'income' ? 'text-income' : 'text-expense'
                }`}
              >
                {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteTransaction(t.id)}
                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
