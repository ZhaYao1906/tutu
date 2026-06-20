import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { mockAccountItems, mockSkills } from '../data/mockData';
import LevelGrowth from './LevelGrowth';
import AchievementSystem from './AchievementSystem';
import Leaderboard from './Leaderboard';

type ProfileTab = 'home' | 'level' | 'achievements' | 'leaderboard' | 'account' | 'settings';

const PersonalCenter: React.FC = () => {
  const user = useGameStore(state => state.user);
  const [activeTab, setActiveTab] = useState<ProfileTab>('home');
  const [accountType, setAccountType] = useState<'expense' | 'income'>('expense');

  const tabs = [
    { id: 'home', label: '我的家园', icon: '🏠' },
    { id: 'level', label: '等级成长', icon: '⭐' },
    { id: 'achievements', label: '成就系统', icon: '🏆' },
    { id: 'leaderboard', label: '排行榜', icon: '📊' },
    { id: 'account', label: '记账本', icon: '💰' },
    { id: 'settings', label: '设置', icon: '⚙️' },
  ];

  return (
    <section className="h-full bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-game font-bold text-center mb-4 game-title">
          个人中心
        </h2>
        <p className="text-center text-gray-400 mb-8">
          管理你的个人信息和生活数据
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/4"
          >
            <div className="card-game mb-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-tutu-gold to-tutu-orange flex items-center justify-center text-4xl mx-auto mb-4">
                  {user.avatar}
                </div>
                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                <p className="text-sm text-gray-400">Lv.{user.level} {user.title}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-tutu-gold">{user.xp}</div>
                  <div className="text-xs text-gray-400">XP</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-tutu-emerald">{user.questsCompleted}</div>
                  <div className="text-xs text-gray-400">任务</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-tutu-purple">{user.achievementsUnlocked}</div>
                  <div className="text-xs text-gray-400">成就</div>
                </div>
              </div>

              <div className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveTab(tab.id as ProfileTab)}
                    className={`w-full py-3 px-4 rounded-lg flex items-center gap-3 transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-tutu-gold to-tutu-orange text-gray-900'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-3/4"
          >
            <AnimatePresence mode="wait">
              {activeTab === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card-game"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">我的家园</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-lg p-6">
                      <div className="text-3xl mb-2">🏠</div>
                      <h4 className="text-lg font-bold text-white mb-2">{user.home?.name}</h4>
                      <p className="text-gray-400">{user.home?.location}</p>
                      <button className="mt-4 text-sm text-tutu-gold hover:underline">
                        编辑位置
                      </button>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6">
                      <div className="text-3xl mb-2">🏢</div>
                      <h4 className="text-lg font-bold text-white mb-2">{user.company?.name}</h4>
                      <p className="text-gray-400">{user.company?.location}</p>
                      <button className="mt-4 text-sm text-tutu-gold hover:underline">
                        编辑位置
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-xl font-bold text-white mb-4">能力概览</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {mockSkills.map((skill) => (
                        <div key={skill.name} className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{skill.icon}</span>
                              <span className="text-white font-semibold">{skill.name}</span>
                            </div>
                            <span className="text-tutu-gold font-bold">Lv.{skill.level}</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-tutu-gold to-tutu-orange"
                              style={{ width: `${skill.progress}%` }}
                            />
                          </div>
                          <div className="text-right text-sm text-gray-400 mt-1">
                            {skill.progress}% 进度
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'level' && (
                <motion.div
                  key="level"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <LevelGrowth />
                </motion.div>
              )}

              {activeTab === 'achievements' && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <AchievementSystem />
                </motion.div>
              )}

              {activeTab === 'leaderboard' && (
                <motion.div
                  key="leaderboard"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Leaderboard />
                </motion.div>
              )}

              {activeTab === 'account' && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card-game"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">记账本</h3>
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => setAccountType('expense')}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        accountType === 'expense'
                          ? 'bg-tutu-red text-white'
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      支出
                    </button>
                    <button
                      onClick={() => setAccountType('income')}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        accountType === 'income'
                          ? 'bg-tutu-emerald text-white'
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      收入
                    </button>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <input
                        type="number"
                        placeholder="金额"
                        className="bg-gray-700 rounded-lg px-4 py-2 text-white"
                      />
                      <select className="bg-gray-700 rounded-lg px-4 py-2 text-white">
                        <option>餐饮</option>
                        <option>交通</option>
                        <option>购物</option>
                        <option>娱乐</option>
                      </select>
                      <input
                        type="text"
                        placeholder="备注"
                        className="bg-gray-700 rounded-lg px-4 py-2 text-white"
                      />
                      <button className="btn-primary">添加</button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {mockAccountItems.filter(item => item.type === accountType).map((item) => (
                      <div key={item.id} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <div className="text-white font-semibold">{item.category}</div>
                          <div className="text-sm text-gray-400">{item.note}</div>
                          <div className="text-xs text-gray-500">{item.time}</div>
                        </div>
                        <div className={`text-xl font-bold ${
                          item.type === 'expense' ? 'text-tutu-red' : 'text-tutu-emerald'
                        }`}>
                          {item.type === 'expense' ? '-' : '+'}{item.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card-game"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">设置</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-gray-400 mb-2 block">昵称</label>
                      <input
                        type="text"
                        defaultValue={user.name}
                        className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 mb-2 block">所在城市</label>
                      <select className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white">
                        <option>北京</option>
                        <option>上海</option>
                        <option>深圳</option>
                        <option>杭州</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 mb-2 block">职业</label>
                      <input
                        type="text"
                        placeholder="请输入职业"
                        className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white"
                      />
                    </div>
                    <button className="btn-primary w-full">保存设置</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default PersonalCenter;