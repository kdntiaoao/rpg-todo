"use client";

import { useState, useEffect } from "react";
import {
  Sword,
  Shield,
  Star,
  Trophy,
  AArrowDown as XP,
  Scroll,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Quest {
  id: string;
  title: string;
  completed: boolean;
  difficulty: "easy" | "medium" | "hard";
  exp: number;
}

const QuestCard = ({
  quest,
  completeQuest,
}: {
  quest: Quest;
  completeQuest: (quest: Quest) => void;
}) => (
  <Card
    key={quest.id}
    className={`p-4 ${
      quest.completed
        ? "bg-slate-700/50 border-slate-600 text-white"
        : "bg-slate-800 border-slate-700 text-white"
    }`}
  >
    <div className="flex items-start flex-col gap-2 justify-between">
      <div className="flex items-center gap-3">
        <Sword
          className={`w-5 h-5 shrink-0 ${
            quest.difficulty === "easy"
              ? "text-green-500"
              : quest.difficulty === "medium"
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        />
        <span className={quest.completed ? "line-through text-gray-500" : ""}>
          {quest.title}
        </span>
      </div>
      <div className="flex items-center gap-3 self-end">
        <div className="flex items-center gap-1 shrink-0">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm">{quest.exp} XP</span>
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
);

export default function Home() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [newQuest, setNewQuest] = useState<string>("");
  const [playerLevel, setPlayerLevel] = useState<number>(1);
  const [totalExp, setTotalExp] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const activeQuests = quests.filter((quest) => !quest.completed);
  const completedQuests = quests.filter((quest) => quest.completed);
  const expToNextLevel = 100 - (totalExp % 100);
  const progress = ((totalExp % 100) / 100) * 100;

  // 初回のみローカルストレージからデータを読み込む
  useEffect(() => {
    const savedQuests = localStorage.getItem("quests");
    const savedPlayerLevel = localStorage.getItem("playerLevel");
    const savedTotalExp = localStorage.getItem("totalExp");

    setQuests(savedQuests ? JSON.parse(savedQuests) : []);
    setPlayerLevel(savedPlayerLevel ? Number(savedPlayerLevel) : 1);
    setTotalExp(savedTotalExp ? Number(savedTotalExp) : 0);
    setIsLoaded(true);
  }, []);

  // データ更新時に保存
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("quests", JSON.stringify(quests));
    localStorage.setItem("playerLevel", String(playerLevel));
    localStorage.setItem("totalExp", String(totalExp));
  }, [quests, playerLevel, totalExp, isLoaded]);

  const addQuest = (difficulty: "easy" | "medium" | "hard") => {
    if (!newQuest.trim()) return;

    const expValues = {
      easy: 10,
      medium: 20,
      hard: 30,
    };

    const quest: Quest = {
      id: Date.now().toString(),
      title: newQuest,
      completed: false,
      difficulty,
      exp: expValues[difficulty],
    };

    setQuests([...quests, quest]);
    setNewQuest("");
  };

  const completeQuest = (quest: Quest) => {
    const newQuests = quests.map((q) =>
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
                <span className="text-sm text-gray-300">
                  次のレベルまで {expToNextLevel} XP
                </span>
              </div>
            </div>
          </div>
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>

        <Card className="bg-slate-800 border-slate-700 p-4 mb-6">
          <div className="flex flex-col gap-2 items-end">
            <Input
              value={newQuest}
              onChange={(e) => setNewQuest(e.target.value)}
              placeholder="Enter new quest..."
              className="bg-slate-900 border-slate-700 text-white"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => addQuest("easy")}
                variant="outline"
                className="bg-green-600 hover:bg-green-700 border-0"
              >
                Easy
              </Button>
              <Button
                onClick={() => addQuest("medium")}
                variant="outline"
                className="bg-yellow-600 hover:bg-yellow-700 border-0"
              >
                Medium
              </Button>
              <Button
                onClick={() => addQuest("hard")}
                variant="outline"
                className="bg-red-600 hover:bg-red-700 border-0"
              >
                Hard
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {/* 進行中のタスク Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scroll className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold">
                進行中のタスク ({activeQuests.length})
              </h3>
            </div>
            <div className="space-y-3">
              {activeQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  completeQuest={completeQuest}
                />
              ))}
              {activeQuests.length === 0 && (
                <p className="text-gray-400 text-center py-4">
                  進行中のタスクはありません！
                </p>
              )}
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* 完了したタスク Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold">
                完了したタスク ({completedQuests.length})
              </h3>
            </div>
            <div className="space-y-3">
              {completedQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  completeQuest={completeQuest}
                />
              ))}
              {completedQuests.length === 0 && (
                <p className="text-gray-400 text-center py-4">
                  完了したタスクはありません！
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
