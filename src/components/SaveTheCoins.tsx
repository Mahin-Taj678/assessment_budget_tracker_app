import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudgetStore } from '@/store/budgetStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface Coin {
  id: number;
  x: number;
  y: number;
}

const messages = [
  "Saving is fun! 🎉",
  "You're building a strong financial future! 💪",
  "Every coin counts! 🪙",
  "Great catch! Keep going! 🚀",
  "Financial champion! 🏆",
];

export default function SaveTheCoins() {
  const { addGamePoints, gamePoints } = useBudgetStore();
  const { toast } = useToast();
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [basketPos, setBasketPos] = useState(50);
  const areaRef = useRef<HTMLDivElement>(null);
  const coinIdRef = useRef(0);

  const startGame = () => {
    setPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setCoins([]);
  };

  const endGame = useCallback(() => {
    setPlaying(false);
    addGamePoints(score);
    toast({
      title: messages[Math.floor(Math.random() * messages.length)],
      description: `You earned ${score} savings points! Total: ${gamePoints + score}`,
    });
  }, [score, addGamePoints, gamePoints, toast]);

  // Timer
  useEffect(() => {
    if (!playing) return;
    if (timeLeft <= 0) {
      endGame();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [playing, timeLeft, endGame]);

  // Spawn coins
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setCoins((prev) => [
        ...prev,
        { id: coinIdRef.current++, x: Math.random() * 85 + 5, y: 0 },
      ]);
    }, 800);
    return () => clearInterval(interval);
  }, [playing]);

  // Move coins down & collision
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setCoins((prev) => {
        const next: Coin[] = [];
        for (const coin of prev) {
          const newY = coin.y + 4;
          if (newY > 85 && Math.abs(coin.x - basketPos) < 12) {
            setScore((s) => s + 1);
            continue; // caught
          }
          if (newY > 100) continue; // missed
          next.push({ ...coin, y: newY });
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [playing, basketPos]);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setBasketPos(((clientX - rect.left) / rect.width) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-foreground">Save the Coins 🪙</h2>

      <div className="glass-card rounded-2xl p-6 space-y-4">
        {!playing ? (
          <div className="text-center space-y-4">
            <div className="text-6xl animate-float">🪙</div>
            <p className="text-muted-foreground">
              Collect falling coins to earn savings points!
            </p>
            <p className="text-sm text-muted-foreground">
              Total points earned: <span className="font-bold text-primary">{gamePoints}</span>
            </p>
            <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
              <Button onClick={startGame} className="rounded-xl px-8">
                Start Game 🎮
              </Button>
            </motion.div>
          </div>
        ) : (
          <>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-primary">Score: {score}</span>
              <span className="text-muted-foreground">⏱ {timeLeft}s</span>
            </div>
            <div
              ref={areaRef}
              onMouseMove={handleMove}
              onTouchMove={handleMove}
              className="relative h-56 sm:h-64 bg-lavender-50 rounded-2xl overflow-hidden cursor-none select-none border border-border touch-none"
            >
              <AnimatePresence>
                {coins.map((coin) => (
                  <motion.div
                    key={coin.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute text-2xl"
                    style={{ left: `${coin.x}%`, top: `${coin.y}%` }}
                  >
                    🪙
                  </motion.div>
                ))}
              </AnimatePresence>
              {/* Basket */}
              <div
                className="absolute bottom-2 h-4 w-16 bg-primary rounded-full transition-all duration-75"
                style={{ left: `${basketPos}%`, transform: 'translateX(-50%)' }}
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
