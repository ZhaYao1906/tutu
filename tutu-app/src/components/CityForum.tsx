import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockForumPosts } from '../data/mockData';

const CityForum: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部话题');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);

  const categories = [
    '全部话题',
    '城市攻略',
    '经验分享',
    '租房交流',
    '美食推荐',
    '求职招聘',
    '情感树洞',
  ];

  const filteredPosts = selectedCategory === '全部话题'
    ? mockForumPosts
    : mockForumPosts.filter(post => post.category === selectedCategory);

  const handleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <section id="forum" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-game font-bold text-center mb-4 game-title">
          城市论坛
        </h2>
        <p className="text-center text-gray-400 mb-12">
          分享你的城市生活经验，交流心得
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:w-1/4"
          >
            <div className="card-game">
              <h3 className="text-lg font-bold text-white mb-4">话题分类</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full py-2 px-4 rounded-lg text-left transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-tutu-blue to-tutu-cyan text-gray-900'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPostModal(true)}
                className="w-full mt-6 btn-primary"
              >
                发帖
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:w-3/4"
          >
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="card-game hover:border-tutu-gold transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tutu-blue to-tutu-cyan flex items-center justify-center text-2xl">
                      {post.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-semibold">{post.author}</span>
                        <span className="text-gray-500 text-sm">{post.time}</span>
                        <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-400">
                          {post.category}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">{post.title}</h4>
                      <p className="text-gray-400 text-sm mb-3">{post.excerpt}</p>
                      <div className="flex items-center gap-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-2 ${
                            likedPosts.includes(post.id) ? 'text-tutu-red' : 'text-gray-400'
                          }`}
                        >
                          <span>{likedPosts.includes(post.id) ? '❤️' : '🤍'}</span>
                          <span>{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                        </motion.button>
                        <div className="flex items-center gap-2 text-gray-400">
                          <span>💬</span>
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {showPostModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              onClick={() => setShowPostModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">发布帖子</h3>
                  <button
                    onClick={() => setShowPostModal(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 mb-2 block">选择分类</label>
                    <select className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white">
                      {categories.slice(1).map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 mb-2 block">标题</label>
                    <input
                      type="text"
                      placeholder="请输入标题"
                      className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 mb-2 block">内容</label>
                    <textarea
                      placeholder="请输入内容"
                      rows={4}
                      className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white resize-none"
                    />
                  </div>
                  <button className="btn-primary w-full">发布</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default CityForum;