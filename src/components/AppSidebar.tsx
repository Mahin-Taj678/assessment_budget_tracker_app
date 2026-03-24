import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  PieChart,
  Target,
  Gamepad2,
  Moon,
  Sun,
  Menu,
  X,
} from 'lucide-react';
import { useBudgetStore } from '@/store/budgetStore';

export type Page = 'dashboard' | 'add' | 'history' | 'insights' | 'savings' | 'game';

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'add', label: 'Add Transaction', icon: PlusCircle },
  { id: 'history', label: 'History', icon: History },
  { id: 'insights', label: 'Insights', icon: PieChart },
  { id: 'savings', label: 'Savings Goal', icon: Target },
  { id: 'game', label: 'Save the Coins', icon: Gamepad2 },
];

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function AppSidebar({ currentPage, onNavigate }: Props) {
  const { darkMode, toggleDarkMode } = useBudgetStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 pb-4">
        <h1 className="text-lg font-bold text-foreground tracking-tight">
          💜 BudgetFlow
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">Your money, at peace.</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = currentPage === item.id;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                onNavigate(item.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </motion.button>
          );
        })}
      </nav>

      {/* Dark mode toggle */}
      <div className="p-4 border-t border-border">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-border bg-card h-screen sticky top-0">
        <NavContent />
      </aside>

      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-card/80 backdrop-blur-xl border-b border-border flex items-center px-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl hover:bg-secondary"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </motion.button>
        <span className="ml-3 font-bold text-foreground">💜 BudgetFlow</span>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-card z-50 border-r border-border"
            >
              <div className="absolute top-4 right-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-secondary"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border flex items-center justify-around px-1 pb-[env(safe-area-inset-bottom)] h-16">
        {navItems.slice(0, 5).map((item) => {
          const active = currentPage === item.id;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.85 }}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
                active
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon className={`w-5 h-5 ${active ? 'text-primary' : ''}`} />
              <span className="truncate max-w-[3.5rem]">{item.label.split(' ')[0]}</span>
            </motion.button>
          );
        })}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onNavigate('game')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
            currentPage === 'game' ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Gamepad2 className={`w-5 h-5 ${currentPage === 'game' ? 'text-primary' : ''}`} />
          <span>Game</span>
        </motion.button>
      </nav>
    </>
  );
}
