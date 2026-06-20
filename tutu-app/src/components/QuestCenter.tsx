import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useXpPopup } from '../hooks/useXpPopup';
import type { Quest } from '../types';
import XpPopupDisplay from './XpPopupDisplay';

const QuestCenter: React.FC = () => {
  const { quests, updateQuestStatus } = useGameStore();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const { popups, showXpPopup } = useXpPopup();

  const filteredQuests = filterCategory === 'all'
    ? quests
    : quests.filter(q => q.category === filterCategory);

  const handleQuestAction = (quest: Quest, event: React.MouseEvent) => {
    if (quest.status === 'available') {
      updateQuestStatus(quest.id, 'inProgress');
    } else if (quest.status === 'inProgress') {
      updateQuestStatus(quest.id, 'completed');
      showXpPopup(event.clientX, event.clientY, quest.xp);
    }
  };

  const categoryButtons = [
    { category: 'all', label: '全部', icon: '📋' },
    { category: 'work', label: '工作', icon: '💼' },
    { category: 'fitness', label: '健身', icon: '💪' },
    { category: 'study', label: '学习', icon: '📚' },
    { category: 'life', label: '生活', icon: '🏠' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-tutu-emerald';
      case 'medium': return 'text-tutu-gold';
      case 'hard': return 'text-tutu-red';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work': return '💼';
      case 'fitness': return '💪';
      case 'study': return '📚';
      case 'life': return '🏠';
      default: return '📋';
    }
  };

  return (
    <section id="quests" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-game font-bold text-center mb-4 game-title">
          任务中心
        </h2>
        <p className="text-center text-gray-400 mb-12">
          完成任务，获得XP奖励，提升等级
        </p>

        <div className="flex justify-center gap-4 mb-8">
          {categoryButtons.map((btn) => (
            <motion.button
              key={btn.category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterCategory(btn.category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterCategory === btn.category
                  ? 'bg-gradient-to-r from-tutu-emerald to-tutu-cyan text-gray-900 glow-emerald'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-tutu-emerald'
              }`}
            >
              <span className="mr-2">{btn.icon}</span>
              {btn.label}
            </motion.button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuests.map((quest, index) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`card-game ${
                quest.status === 'completed' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl">{getCategoryIcon(quest.category)}</div>
                <div className={`text-sm font-semibold ${getDifficultyColor(quest.difficulty)}`}>
                  {quest.difficulty === 'easy' ? '简单' : 
                   quest.difficulty === 'medium' ? '中等' : '困难'}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{quest.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{quest.desc}</p>

              <div className="flex justify-between items-center mb-4">
                <div className="text-tutu-purple font-bold">{quest.xp} XP</div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  quest.status === 'available' ? 'bg-gray-700 text-gray-300' :
                  quest.status === 'inProgress' ? 'bg-tutu-blue/20 text-tutu-blue' :
                  'bg-tutu-emerald/20 text-tutu-emerald'
                }`}>
                  {quest.status === 'available' ? '可领取' :
                   quest.status === 'inProgress' ? '进行中' : '已完成'}
                </div>
              </div>

              {quest.status !== 'completed' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleQuestAction(quest, e)}
                  className={`w-full py-2 rounded-lg font-semibold ${
                    quest.status === 'available'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'btn-secondary'
                  }`}
                >
                  {quest.status === 'available' ? '领取任务' : '完成任务'}
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>

        <XpPopupDisplay popups={popups} />
      </motion.div>
    </section>
  );
};

export default QuestCenter;