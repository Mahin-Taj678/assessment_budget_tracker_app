"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppSidebar, { type Page } from '@/components/AppSidebar';
import Dashboard from '@/components/Dashboard';
import AddTransaction from '@/components/AddTransaction';
import TransactionHistory from '@/components/TransactionHistory';
import BudgetInsights from '@/components/BudgetInsights';
import SavingsGoal from '@/components/SavingsGoal';
import SaveTheCoins from '@/components/SaveTheCoins';
import { useAuth } from '@/components/providers/AuthProvider';

const pages: Record<Page, React.ComponentType> = {
  dashboard: Dashboard,
  add: AddTransaction,
  history: TransactionHistory,
  insights: BudgetInsights,
  savings: SavingsGoal,
  game: SaveTheCoins,
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const ActivePage = pages[currentPage];
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Loading amazing things...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 pt-[4.5rem] lg:pt-8 pb-24 lg:pb-8 max-w-4xl mx-auto w-full">
        <ActivePage />
      </main>
    </div>
  );
}
