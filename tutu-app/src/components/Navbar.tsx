import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const user = useGameStore(state => state.user);

  const navItems = [
    { id: 'explore', label: '城市探索' },
    { id: 'quests', label: '任务中心' },
    { id: 'level', label: '等级成长' },
    { id: 'achievements', label: '成就系统' },
    { id: 'profile', label: '个人中心' },
    { id: 'forum', label: '城市论坛' },
    { id: 'leaderboard', label: '排行榜' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section, index) => {
        if (section) {
          const offsetTop = section.offsetTop;
          const offsetHeight = section.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(navItems[index].id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const xpProgress = (user.xp / 1000) * 100;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <span className="font-game text-xl font-bold text-tutu-gold">拓图</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? 'text-tutu-gold'
                    : 'text-gray-300 hover:text-tutu-gold'
                }`}
              >
                {item.label}
              </button>
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