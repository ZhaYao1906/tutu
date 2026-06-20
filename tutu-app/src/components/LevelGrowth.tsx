import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { mockSkills } from '../data/mockData';

const LevelGrowth: React.FC = () => {
  const user = useGameStore(state => state.user);

  const levelTitles = [
    '新手', '初学者', '探索者', '冒险家', '征服者',
    '传奇', '大师', '宗师', '王者', '至尊'
  ];

  return (
    <section id="level" className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-game font-bold text-center mb-4 game-title">
          等级成长
        </h2>
        <p className="text-center text-gray-400 mb-12">
          不断成长，解锁更多能力
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 flex flex-col items-center"
          >
            <div className="relative w-64 h-64 mb-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-tutu-gold to-tutu-orange opacity-20 animate-pulse-glow" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 border-4 border-tutu-gold flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-game font-bold text-tutu-gold mb-2">
                    {user.level}
                  </div>
                  <div className="text-lg text-gray-300">
                    {levelTitles[Math.min(user.level - 1, levelTitles.length - 1)]}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="card-game text-center">
                <div className="text-2xl mb-2">⭐</div>
                <div className="text-xl font-bold text-tutu-gold">{user.totalXp}</div>
                <div className="text-sm text-gray-400">总经验值</div>
              </div>
              <div className="card-game text-center">
                <div className="text-2xl mb-2">✅</div>
                <div className="text-xl font-bold text-tutu-emerald">{user.questsCompleted}</div>
                <div className="text-sm text-gray-400">完成任务</div>
              </div>
              <div className="card-game text-center">
                <div className="text-2xl mb-2">🗺️</div>
                <div className="text-xl font-bold text-tutu-blue">{user.spotsVisited}</div>
                <div className="text-sm text-gray-400">探索地点</div>
              </div>
              <div className="card-game text-center">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-xl font-bold text-tutu-purple">{user.achievementsUnlocked}</div>
                <div className="text-sm text-gray-400">获得成就</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h3 className="text-2xl font-bold text-white mb-6">能力面板</h3>
            <div className="space-y-4">
              {mockSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="card-game"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{skill.icon}</span>
                      <span className="text-white font-semibold">{skill.name}</span>
                    </div>
                    <span className="text-tutu-gold font-bold">Lv.{skill.level}</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.progress}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-tutu-gold to-tutu-orange"
                    />
                  </div>
                  <div className="text-right text-sm text-gray-400 mt-1">
                    {skill.progress}% 进度
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default LevelGrowth;