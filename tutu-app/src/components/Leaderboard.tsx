import React from 'react';
import { motion } from 'framer-motion';
import { mockLeaderboard } from '../data/mockData';

const Leaderboard: React.FC = () => {
  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'text-2xl text-tutu-gold';
    if (rank === 2) return 'text-xl text-gray-300';
    if (rank === 3) return 'text-xl text-tutu-orange';
    return 'text-lg text-gray-400';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  return (
    <div className="card-game">
      <h3 className="text-2xl font-bold text-white mb-6">排行榜</h3>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-gray-800 border-b border-gray-700 rounded-t-lg">
          <div className="text-gray-400 font-semibold text-sm">排名</div>
          <div className="text-gray-400 font-semibold text-sm">拓图玩家</div>
          <div className="text-gray-400 font-semibold text-sm">称号</div>
          <div className="text-gray-400 font-semibold text-sm">积分</div>
          <div className="text-gray-400 font-semibold text-sm">等级</div>
        </div>

        <div className="divide-y divide-gray-700">
          {mockLeaderboard.map((player, index) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`grid grid-cols-5 gap-4 px-4 py-3 items-center ${
                player.isCurrentUser ? 'bg-tutu-gold/10 border-l-4 border-tutu-gold' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={getRankStyle(player.rank)}>
                  {getRankIcon(player.rank) || player.rank}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-tutu-blue to-tutu-cyan flex items-center justify-center text-lg">
                  {player.avatar}
                </div>
                <span className="text-white font-semibold text-sm">{player.name}</span>
              </div>
              <div className="text-gray-400 text-sm">{player.title}</div>
              <div className="text-tutu-gold font-bold text-sm">{player.xp.toLocaleString()}</div>
              <div className="text-tutu-purple font-bold text-sm">Lv.{player.level}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;