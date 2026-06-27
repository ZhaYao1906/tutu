import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onAuthClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onAuthClick }) => {
  const user = useGameStore(state => state.user);
  const isAuthenticated = useGameStore(state => state.isAuthenticated);
  const xpForNextLevel = useGameStore(state => state.xpForNextLevel);
  const logout = useGameStore(state => state.logout);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: 'explore', label: '城市探索', icon: '🗺️' },
    { id: 'quests', label: '每日记录', icon: '📋' },
    { id: 'forum', label: '城市论坛', icon: '💬' },
    { id: 'profile', label: '个人中心', icon: '👤' },
  ];

  const xpProgress = xpForNextLevel > 0 ? (user.xp / xpForNextLevel) * 100 : 0;

  const handleUserClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      onAuthClick();
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-700 relative z-50"
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

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUserClick}
              className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-gray-800 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tutu-gold to-tutu-orange flex items-center justify-center text-xl">
                  {user.avatar}
                </div>
                {isAuthenticated ? (
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-white">{user.name}</div>
                    <div className="text-xs text-gray-400">Lv.{user.level} {user.title}</div>
                  </div>
                ) : (
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-tutu-gold">登录 / 注册</div>
                    <div className="text-xs text-gray-400">点击登录账号</div>
                  </div>
                )}
              </div>
              {isAuthenticated && (
                <div className="hidden md:block w-32">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(xpProgress, 100)}%` }}
                      className="h-full bg-gradient-to-r from-tutu-gold to-tutu-orange"
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{user.xp} / {xpForNextLevel} XP</div>
                </div>
              )}
            </motion.button>

            <AnimatePresence>
              {showUserMenu && isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2"
                >
                  <button
                    onClick={() => { onTabChange('profile'); setShowUserMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    👤 个人中心
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-tutu-red hover:bg-gray-700"
                  >
                    🚪 退出登录
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
