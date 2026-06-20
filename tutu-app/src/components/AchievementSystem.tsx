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
    <section id="achievements" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-game font-bold text-center mb-4 game-title">
          成就系统
        </h2>
        <p className="text-center text-gray-400 mb-12">
          完成成就，解锁荣耀徽章
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
                  ? 'bg-gradient-to-r from-tutu-purple to-tutu-blue text-white glow-purple'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-tutu-purple'
              }`}
            >
              <span className="mr-2">{btn.icon}</span>
              {btn.label}
            </motion.button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`card-game ${
                achievement.unlocked ? 'border-tutu-gold' : 'opacity-70'
              }`}
            >
              <div className="text-center mb-4">
                <div className={`text-5xl mb-2 ${
                  achievement.unlocked ? '' : 'grayscale opacity-50'
                }`}>
                  {achievement.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{achievement.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{achievement.desc}</p>
              </div>

              <div className="mb-4">
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
                  <div className="px-3 py-1 bg-tutu-gold/20 rounded-full text-sm text-tutu-gold">
                    ✓ 已解锁
                  </div>
                ) : (
                  <div className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-400">
                    未解锁
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AchievementSystem;