import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CustomCheckInModalProps {
  position: { lat: number; lng: number };
  onClose: () => void;
  onConfirm: (name: string, description: string) => void;
}

const CustomCheckInModal: React.FC<CustomCheckInModalProps> = ({ position, onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim(), description.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
        >
          ✕
        </button>

        <div className="mb-4">
          <div className="text-4xl mb-2">📍</div>
          <h3 className="text-2xl font-bold text-white">自定义打卡</h3>
          <p className="text-sm text-gray-400">
            位置: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">打卡名称 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="给这个地方起个名字"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-tutu-gold"
              autoFocus
              maxLength={50}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述一下这个地方..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-tutu-gold resize-none"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="bg-gray-800 rounded-lg p-3 mb-4">
            <div className="text-sm text-gray-400 mb-1">XP奖励</div>
            <div className="text-lg font-bold text-tutu-purple">+10 XP</div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg p-3 text-gray-300 transition-colors"
            >
              取消
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!name.trim()}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认打卡
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CustomCheckInModal;
