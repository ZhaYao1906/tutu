import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface HeroProps {
  onEnter: () => void;
}

const Hero: React.FC<HeroProps> = ({ onEnter }) => {
  const user = useGameStore(state => state.user);

  const cities = [
    { name: '北京', active: true },
    { name: '上海', active: false },
    { name: '深圳', active: false },
    { name: '杭州', active: false },
  ];

  return (
    <section className="relative h-full star-bg flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <h1 className="game-title mb-4">拓图</h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl font-game text-tutu-gold mb-8 tracking-widest"
        >
          TUTU
        </motion.p>
        <p className="text-xl text-gray-300 mb-12">
          把城市生活变成开放世界冒险
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="flex gap-4 mb-12 z-10"
      >
        {cities.map((city, index) => (
          <motion.button
            key={city.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              city.active
                ? 'bg-gradient-to-r from-tutu-gold to-tutu-orange text-gray-900 glow-gold'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-tutu-gold hover:text-tutu-gold'
            }`}
          >
            {city.name}
          </motion.button>
        ))}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="px-6 py-3 rounded-lg font-semibold bg-gray-800 text-gray-500 border border-gray-700"
        >
          更多城市即将解锁
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 z-10"
      >
        {[
          { label: '已探索地点', value: user.spotsVisited, icon: '🗺️' },
          { label: '完成任务', value: user.questsCompleted, icon: '✅' },
          { label: '当前等级', value: user.level, icon: '⭐' },
          { label: '连续打卡', value: `${user.streakDays}天`, icon: '🔥' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 + index * 0.1, duration: 0.5 }}
            className="card-game text-center"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-tutu-gold mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        onClick={onEnter}
        className="btn-primary z-10"
      >
        开始探索
      </motion.button>
    </section>
  );
};

export default Hero;