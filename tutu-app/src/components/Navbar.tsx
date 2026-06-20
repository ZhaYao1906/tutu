import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const user = useGameStore(state => state.user);

  const navItems = [
    { id: 'explore', label: '城市探索', icon: '🗺️' },
    { id: 'quests', label: '任务中心', icon: '📋' },
    { id: 'forum', label: '城市论坛', icon: '💬' },
    { id: 'profile', label: '个人中心', icon: '👤' },
  ];

  const xpProgress = (user.xp / 1000) * 100;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <span className="font-game text-xl font-bold text-tutu-gold">拓图</span>
          </div>

          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-tutu-gold to-tutu-orange text-gray-900 glow-gold'
                    : 'text-gray-300 hover:text-tutu-gold'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tutu-gold to-tutu-orange flex items-center justify-center text-xl">
                {user.avatar}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-semibold text-white">{user.name}</div>
                <div className="text-xs text-gray-400">Lv.{user.level} {user.title}</div>
              </div>
            </div>
            <div className="hidden md:block w-32">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  className="h-full bg-gradient-to-r from-tutu-gold to-tutu-orange"
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">{user.xp} / 1000 XP</div>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;