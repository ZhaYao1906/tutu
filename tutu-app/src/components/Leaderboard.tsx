import React from 'react';
import { motion } from 'framer-motion';
import { mockLeaderboard } from '../data/mockData';

const Leaderboard: React.FC = () => {
  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'text-3xl text-tutu-gold';
    if (rank === 2) return 'text-2xl text-gray-300';
    if (rank === 3) return 'text-2xl text-tutu-orange';
    return 'text-xl text-gray-400';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  return (
    <section id="leaderboard" className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-4xl font-game font-bold text-center mb-4 game-title">
          排行榜
        </h2>
        <p className="text-center text-gray-400 mb-12">
          看看谁是城市探索的王者
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="card-game overflow-hidden"
        >
          <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-800 border-b border-gray-700">
            <div className="text-gray-400 font-semibold">排名</div>
            <div className="text-gray-400 font-semibold">拓图玩家</div>
            <div className="text-gray-400 font-semibold">称号</div>
            <div className="text-gray-400 font-semibold">积分</div>
            <div className="text-gray-400 font-semibold">等级</div>
          </div>

          <div className="divide-y divide-gray-700">
            {mockLeaderboard.map((player, index) => (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`grid grid-cols-5 gap-4 px-6 py-4 items-center ${
                  player.isCurrentUser ? 'bg-tutu-gold/10 border-l-4 border-tutu-gold' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={getRankStyle(player.rank)}>
                    {getRankIcon(player.rank) || player.rank}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tutu-blue to-tutu-cyan flex items-center justify-center text-xl">
                    {player.avatar}
                  </div>
                  <span className="text-white font-semibold">{player.name}</span>
                </div>
                <div className="text-gray-400">{player.title}</div>
                <div className="text-tutu-gold font-bold">{player.xp.toLocaleString()}</div>
                <div className="text-tutu-purple font-bold">Lv.{player.level}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Leaderboard;