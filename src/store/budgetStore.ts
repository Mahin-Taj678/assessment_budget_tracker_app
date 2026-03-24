import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export type TransactionType = 'income' | 'expense';
export type Category = 'food' | 'transport' | 'shopping' | 'bills' | 'entertainment' | 'salary' | 'freelance' | 'other';

export const categoryEmojis: Record<Category, string> = {
  food: '🍔',
  transport: '🚗',
  shopping: '🛍️',
  bills: '📄',
  entertainment: '🎮',
  salary: '💰',
  freelance: '💻',
  other: '📦',
};

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  type: TransactionType;
  date: string;
  notes: string;
}

interface BudgetState {
  transactions: Transaction[];
  monthlyLimit: number;
  savingsGoal: number;
  savingsProgress: number;
  gamePoints: number;
  darkMode: boolean;
  uid: string | null;
  setUid: (uid: string | null) => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setMonthlyLimit: (n: number) => Promise<void>;
  setSavingsGoal: (n: number) => Promise<void>;
  addSavingsProgress: (n: number) => Promise<void>;
  addGamePoints: (n: number) => Promise<void>;
  toggleDarkMode: () => void;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  transactions: [],
  monthlyLimit: 2000,
  savingsGoal: 1000,
  savingsProgress: 0,
  gamePoints: 0,
  darkMode: false,
  uid: null,
  setUid: (uid) => set({ uid }),

  addTransaction: async (t) => {
    const { uid } = get();
    if (!uid) return;
    const newId = crypto.randomUUID();
    const docRef = doc(db, `users/${uid}/transactions`, newId);
    await setDoc(docRef, { ...t, id: newId });
  },

  deleteTransaction: async (id) => {
    const { uid } = get();
    if (!uid) return;
    await deleteDoc(doc(db, `users/${uid}/transactions`, id));
  },

  setMonthlyLimit: async (n) => {
    const { uid } = get();
    if (!uid) return;
    await setDoc(doc(db, `users/${uid}/userData`, 'budget'), { monthlyLimit: n }, { merge: true });
  },

  setSavingsGoal: async (n) => {
    const { uid } = get();
    if (!uid) return;
    await setDoc(doc(db, `users/${uid}/userData`, 'budget'), { savingsGoal: n }, { merge: true });
  },

  addSavingsProgress: async (n) => {
    const { uid, savingsProgress } = get();
    if (!uid) return;
    await setDoc(doc(db, `users/${uid}/userData`, 'budget'), { savingsProgress: savingsProgress + n }, { merge: true });
  },

  addGamePoints: async (n) => {
    const { uid, gamePoints } = get();
    if (!uid) return;
    await setDoc(doc(db, `users/${uid}/userData`, 'budget'), { gamePoints: gamePoints + n }, { merge: true });
  },

  toggleDarkMode: () =>
    set((s) => {
      const next = !s.darkMode;
      document.documentElement.classList.toggle('dark', next);
      return { darkMode: next };
    }),
}));

export const setupStoreSync = (uid: string) => {
  // Sync User Data
  const unsubUserData = onSnapshot(doc(db, `users/${uid}/userData`, 'budget'), (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      useBudgetStore.setState({
        monthlyLimit: data.monthlyLimit ?? 2000,
        savingsGoal: data.savingsGoal ?? 1000,
        savingsProgress: data.savingsProgress ?? 0,
        gamePoints: data.gamePoints ?? 0,
      });
    } else {
      // Create initial layout
      setDoc(doc(db, `users/${uid}/userData`, 'budget'), {
        monthlyLimit: 2000,
        savingsGoal: 1000,
        savingsProgress: 0,
        gamePoints: 0,
      });
    }
  });

  // Sync Transactions
  const q = query(collection(db, `users/${uid}/transactions`), orderBy('date', 'desc'));
  const unsubTransactions = onSnapshot(q, (querySnapshot) => {
    const transactions: Transaction[] = [];
    querySnapshot.forEach((docSnap) => {
      transactions.push(docSnap.data() as Transaction);
    });
    useBudgetStore.setState({ transactions });
  });

  return () => {
    unsubUserData();
    unsubTransactions();
  };
};
