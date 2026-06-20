import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const navLinks = [
    '城市探索',
    '任务中心',
    '等级成长',
    '成就系统',
    '个人中心',
    '城市论坛',
    '排行榜',
  ];

  return (
    <footer className="py-12 px-4 bg-gradient-to-b from-gray-900 to-gray-800 border-t border-gray-700">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🗺️</span>
              <span className="font-game text-xl font-bold text-tutu-gold">拓图</span>
            </div>
            <p className="text-gray-400 text-sm">
              把城市生活变成开放世界冒险
            </p>
            <p className="text-gray-500 text-xs mt-2">
              探索城市，完成任务，提升等级，获得成就感
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">快速导航</h3>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link}
                  className="text-gray-400 hover:text-tutu-gold transition-colors text-sm"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">联系我们</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>邮箱: contact@tutu.app</p>
              <p>微信: TuTuApp</p>
              <p>微博: @拓图TuTu</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 拓图 TuTu. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Made with ❤️ for city explorers
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;