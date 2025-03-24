'use client';

import { useState, useEffect } from 'react';
import { Sword, Shield, Star, Trophy, AArrowDown as XP } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Quest {
  id: string;
  title: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  exp: number;
}

export default function Home() {
  const [quests, setQuests] = useState<Quest[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quests');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [newQuest, setNewQuest] = useState('');
  const [playerLevel, setPlayerLevel] = useState(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('playerLevel')) || 1;
    }
    return 1;
  });
  const [totalExp, setTotalExp] = useState(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('totalExp')) || 0;
    }
    return 0;
  });

  useEffect(() => {
    localStorage.setItem('quests', JSON.stringify(quests));
    localStorage.setItem('playerLevel', String(playerLevel));
    localStorage.setItem('totalExp', String(totalExp));
  }, [quests, playerLevel, totalExp]);

  const addQuest = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (!newQuest.trim()) return;
    
    const expValues = {
      easy: 10,
      medium: 20,
      hard: 30
    };

    const quest: Quest = {
      id: Date.now().toString(),
      title: newQuest,
      completed: false,
      difficulty,
      exp: expValues[difficulty]
    };

    setQuests([...quests, quest]);
    setNewQuest('');
  };

  const completeQuest = (quest: Quest) => {
    const newQuests = quests.map(q => 
      q.id === quest.id ? { ...q, completed: true } : q
    );
    setQuests(newQuests);

    const newTotalExp = totalExp + quest.exp;
    setTotalExp(newTotalExp);

    const newLevel = Math.floor(newTotalExp / 100) + 1;
    if (newLevel > playerLevel) {
      setPlayerLevel(newLevel);
      // Level up animation could be added here
    }
  };

  const expToNextLevel = 100 - (totalExp % 100);
  const progress = ((totalExp % 100) / 100) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-yellow-500" />
            <div>
              <h2 className="text-xl font-bold">Level {playerLevel}</h2>
              <div className="flex items-center gap-2">
                <XP className="w-4 h-4 text-green-400" />
                <Progress value={progress} className="w-32 h-2" />
                <span className="text-sm text-gray-300">{expToNextLevel} EXP to next level</span>
              </div>
            </div>
          </div>
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>

        <Card className="bg-slate-800 border-slate-700 p-4 mb-6">
          <div className="flex gap-2">
            <Input
              value={newQuest}
              onChange={(e) => setNewQuest(e.target.value)}
              placeholder="Enter new quest..."
              className="bg-slate-900 border-slate-700 text-white"
            />
            <Button onClick={() => addQuest('easy')} variant="outline" className="bg-green-600 hover:bg-green-700 border-0">
              Easy
            </Button>
            <Button onClick={() => addQuest('medium')} variant="outline" className="bg-yellow-600 hover:bg-yellow-700 border-0">
              Medium
            </Button>
            <Button onClick={() => addQuest('hard')} variant="outline" className="bg-red-600 hover:bg-red-700 border-0">
              Hard
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          {quests.map(quest => (
            <Card
              key={quest.id}
              className={`p-4 ${
                quest.completed
                  ? 'bg-slate-700 border-slate-600'
                  : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sword className={`w-5 h-5 ${
                    quest.difficulty === 'easy' ? 'text-green-500' :
                    quest.difficulty === 'medium' ? 'text-yellow-500' :
                    'text-red-500'
                  }`} />
                  <span className={quest.completed ? 'line-through text-gray-500' : ''}>
                    {quest.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">{quest.exp} EXP</span>
                  </div>
                  {!quest.completed && (
                    <Button
                      onClick={() => completeQuest(quest)}
                      variant="outline"
                      className="bg-emerald-600 hover:bg-emerald-700 border-0"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}