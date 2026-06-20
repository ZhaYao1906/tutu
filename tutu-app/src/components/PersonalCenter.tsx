import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { mockAccountItems } from '../data/mockData';

const PersonalCenter: React.FC = () => {
  const user = useGameStore(state => state.user);
  const [activeTab, setActiveTab] = useState('home');
  const [accountType, setAccountType] = useState<'expense' | 'income'>('expense');

  const tabs = [
    { id: 'home', label: '我的家园', icon: '🏠' },
    { id: 'account', label: '记账本', icon: '💰' },
    { id: 'stats', label: '数据统计', icon: '📊' },
    { id: 'settings', label: '设置', icon: '⚙️' },
  ];

  return (
    <section id="profile" className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-game font-bold text-center mb-4 game-title">
          个人中心
        </h2>
        <p className="text-center text-gray-400 mb-12">
          管理你的个人信息和生活数据
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:w-1/3"
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
                    onClick={() => setActiveTab(tab.id)}
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
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:w-2/3"
          >
            {activeTab === 'home' && (
              <div className="card-game">
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
              </div>
            )}

            {activeTab === 'account' && (
              <div className="card-game">
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
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="card-game">
                <h3 className="text-2xl font-bold text-white mb-6">数据统计</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-white mb-4">探索分布</h4>
                    <div className="space-y-3">
                      {['景点', '美食', '文化', '个人'].map((type) => (
                        <div key={type} className="flex justify-between items-center">
                          <span className="text-gray-400">{type}</span>
                          <span className="text-tutu-gold font-bold">
                            {type === '景点' ? 7 : type === '美食' ? 5 : type === '文化' ? 3 : 2}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-white mb-4">任务完成情况</h4>
                    <div className="space-y-3">
                      {['工作', '健身', '学习', '生活'].map((type) => (
                        <div key={type} className="flex justify-between items-center">
                          <span className="text-gray-400">{type}</span>
                          <span className="text-tutu-emerald font-bold">
                            {type === '工作' ? 12 : type === '健身' ? 8 : type === '学习' ? 15 : 10}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="card-game">
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
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default PersonalCenter;