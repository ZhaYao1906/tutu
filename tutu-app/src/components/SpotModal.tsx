import React from 'react';
import { motion } from 'framer-motion';
import type { Spot } from '../types';

interface SpotModalProps {
  spot: Spot;
  onClose: () => void;
  onVisit: (e: React.MouseEvent) => void;
}

const SpotModal: React.FC<SpotModalProps> = ({ spot, onClose, onVisit }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-4xl mb-2">{spot.icon}</div>
            <h3 className="text-2xl font-bold text-white">{spot.name}</h3>
            <p className="text-sm text-gray-400">{spot.sub}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-300 mb-4">{spot.desc}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">推荐指数</div>
            <div className="text-lg font-bold text-tutu-gold">{spot.score}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">XP奖励</div>
            <div className="text-lg font-bold text-tutu-purple">{spot.xp} XP</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">门票/人均</div>
            <div className="text-lg font-bold text-tutu-emerald">{spot.price}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">建议时长</div>
            <div className="text-lg font-bold text-tutu-blue">{spot.time}</div>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {spot.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          {spot.visited ? (
            <div className="flex-1 bg-gray-700 rounded-lg p-3 text-center">
              <span className="text-tutu-emerald">✓ 已打卡</span>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onVisit}
              className="flex-1 btn-primary"
            >
              打卡获得 {spot.xp} XP
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SpotModal;