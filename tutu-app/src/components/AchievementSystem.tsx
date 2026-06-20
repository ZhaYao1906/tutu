import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const AchievementSystem: React.FC = () => {
  const achievements = useGameStore(state => state.achievements);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredAchievements = filterCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === filterCategory);

  const categoryButtons = [
    { category: 'all', label: '全部', icon: '🏆' },
    { category: 'explore', label: '探索', icon: '🗺️' },
    { category: 'life', label: '生活', icon: '🏠' },
    { category: 'challenge', label: '挑战', icon: '💪' },
    { category: 'social', label: '社交', icon: '💬' },
  ];

  return (
    <div className="card-game">
      <h3 className="text-2xl font-bold text-white mb-6">成就系统</h3>
      
      <div className="flex justify-center gap-4 mb-6">
        {categoryButtons.map((btn) => (
          <motion.button
            key={btn.category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterCategory(btn.category)}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterCategory === btn.category
                ? 'bg-gradient-to-r from-tutu-purple to-tutu-blue text-white glow-purple'
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-tutu-purple'
            }`}
          >
            <span className="mr-1">{btn.icon}</span>
            {btn.label}
          </motion.button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`bg-gray-800 rounded-lg p-4 ${
              achievement.unlocked ? 'border-tutu-gold' : 'opacity-70'
            }`}
          >
            <div className="text-center mb-3">
              <div className={`text-4xl mb-1 ${
                achievement.unlocked ? '' : 'grayscale opacity-50'
              }`}>
                {achievement.icon}
              </div>
              <h4 className="text-base font-bold text-white">{achievement.name}</h4>
              <p className="text-sm text-gray-400 mt-1">{achievement.desc}</p>
            </div>

            <div className="mb-3">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  className={`h-full ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-tutu-gold to-tutu-orange'
                      : 'bg-gradient-to-r from-tutu-blue to-tutu-cyan'
                  }`}
                />
              </div>
              <div className="text-center text-sm text-gray-400">
                {achievement.progress} / {achievement.total}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-tutu-purple font-bold">{achievement.xp} XP</div>
              {achievement.unlocked ? (
                <div className="px-2 py-1 bg-tutu-gold/20 rounded text-sm text-tutu-gold">
                  ✓ 已解锁
                </div>
              ) : (
                <div className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-400">
                  未解锁
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AchievementSystem;