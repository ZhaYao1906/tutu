import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useXpPopup } from '../hooks/useXpPopup';
import { dailyRecordApi } from '../services/api';
import type { Quest } from '../types';
import XpPopupDisplay from './XpPopupDisplay';

const QuestCenter: React.FC = () => {
  const { quests, updateQuestStatus, addQuest } = useGameStore();
  const dailyRecords = useGameStore(state => state.dailyRecords);
  const saveDailyRecord = useGameStore(state => state.saveDailyRecord);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    desc: '',
    category: 'work' as Quest['category'],
    difficulty: 'easy' as Quest['difficulty'],
    xp: 100
  });
  const { popups, showXpPopup } = useXpPopup();

  // 每日记录状态
  const [dailyMood, setDailyMood] = useState('😊');
  const [dailyScore, setDailyScore] = useState(3);
  const [dailyDiary, setDailyDiary] = useState('');
  const [dailyWeather, setDailyWeather] = useState('');
  const [savingRecord, setSavingRecord] = useState(false);
  const [recordMode, setRecordMode] = useState<'view' | 'edit'>('edit');
  const [currentRecordId, setCurrentRecordId] = useState<number | undefined>(undefined);

  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (selectedDate) {
      const dateStr = formatDate(selectedDate);
      const existing = dailyRecords.find(r => r.date === dateStr);
      if (existing) {
        setDailyMood(existing.mood || '😊');
        setDailyScore(existing.moodScore || 3);
        setDailyDiary(existing.diary || '');
        setDailyWeather(existing.weather || '');
        setCurrentRecordId(existing.id);
        setRecordMode('view');  // 有记录时进入查看模式
      } else {
        setDailyMood('😊');
        setDailyScore(3);
        setDailyDiary('');
        setDailyWeather('');
        setCurrentRecordId(undefined);
        setRecordMode('edit');  // 无记录时进入编辑模式
      }
    }
  }, [selectedDate, dailyRecords]);

  const handleSaveDailyRecord = async () => {
    if (!selectedDate) return;
    setSavingRecord(true);
    try {
      await saveDailyRecord({
        date: formatDate(selectedDate),
        mood: dailyMood,
        moodScore: dailyScore,
        diary: dailyDiary,
        weather: dailyWeather,
      });
      setRecordMode('view');
    } catch (error) {
      console.error('保存每日记录失败:', error);
    } finally {
      setSavingRecord(false);
    }
  };

  const handleDeleteRecord = async () => {
    if (!currentRecordId) return;
    try {
      await dailyRecordApi.delete(currentRecordId);
      // 从store中移除该记录
      useGameStore.setState(state => ({
        dailyRecords: state.dailyRecords.filter(r => r.id !== currentRecordId)
      }));
      // 重置表单
      setDailyMood('😊');
      setDailyScore(3);
      setDailyDiary('');
      setDailyWeather('');
      setCurrentRecordId(undefined);
      setRecordMode('edit');
    } catch (error) {
      console.error('删除每日记录失败:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);

  const getQuestsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return quests.filter(q => q.date === dateStr || q.date === null);
  };

  const handleQuestAction = (quest: Quest, event: React.MouseEvent) => {
    if (quest.status === 'available') {
      updateQuestStatus(quest.id, 'inProgress');
    } else if (quest.status === 'inProgress') {
      updateQuestStatus(quest.id, 'completed');
      showXpPopup(event.clientX, event.clientY, quest.xp);
    }
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const dateStr = selectedDate 
      ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
      : undefined;
    
    const quest: Quest = {
      id: `custom-${Date.now()}`,
      title: newTask.title,
      desc: newTask.desc || '自定义任务',
      category: newTask.category,
      difficulty: newTask.difficulty,
      xp: newTask.xp,
      status: 'available',
      date: dateStr
    };
    
    addQuest(quest);
    setShowAddTaskModal(false);
    setNewTask({ title: '', desc: '', category: 'work', difficulty: 'easy', xp: 100 });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'bg-tutu-blue';
      case 'fitness': return 'bg-tutu-emerald';
      case 'study': return 'bg-tutu-purple';
      case 'life': return 'bg-tutu-orange';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work': return '💼';
      case 'fitness': return '💪';
      case 'study': return '📚';
      case 'life': return '🏠';
      default: return '📋';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-tutu-emerald';
      case 'medium': return 'text-tutu-gold';
      case 'hard': return 'text-tutu-red';
      default: return 'text-gray-400';
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <section className="h-full bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto flex gap-6"
      >
        <div className="flex-1">
          <h2 className="text-4xl font-game font-bold text-center mb-4 game-title">
            每日记录
          </h2>
          <p className="text-center text-gray-400 mb-8">
            记录每天的任务、心情与生活
          </p>

          <div className="card-game mb-6">
            <div className="flex justify-between items-center mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevMonth}
                className="btn-secondary"
              >
                ← 上月
              </motion.button>
              <div className="text-2xl font-bold text-white">
                {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextMonth}
                className="btn-secondary"
              >
                下月 →
              </motion.button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-gray-400 font-semibold py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: startingDay }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dayQuests = getQuestsForDay(day);
                const isSelected = selectedDate?.getDate() === day && 
                                  selectedDate?.getMonth() === currentDate.getMonth();
                
                return (
                  <motion.button
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all relative ${
                      isSelected
                        ? 'bg-gradient-to-br from-tutu-gold to-tutu-orange text-gray-900'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    {dailyRecords.some(r => r.date === formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))) && (
                      <div className="w-2 h-2 rounded-full bg-tutu-blue absolute top-1 right-1" />
                    )}
                    <div className="text-lg font-bold">{day}</div>
                    {dayQuests.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {dayQuests.slice(0, 4).map((quest) => (
                          <div
                            key={quest.id}
                            className={`w-2 h-2 rounded-full ${getCategoryColor(quest.category)}`}
                          />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-tutu-blue" />
              <span className="text-sm text-gray-400">工作</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-tutu-emerald" />
              <span className="text-sm text-gray-400">健身</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-tutu-purple" />
              <span className="text-sm text-gray-400">学习</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-tutu-orange" />
              <span className="text-sm text-gray-400">生活</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-96"
        >
          <AnimatePresence mode="wait">
            {selectedDate && (
              <motion.div
                key="day-tasks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card-game h-full flex flex-col"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xl font-bold text-white">
                    {selectedDate?.getFullYear()}年{selectedDate?.getMonth() + 1}月{selectedDate?.getDate()}日
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddTaskModal(true)}
                    className="btn-primary text-sm"
                  >
                    + 添加任务
                  </motion.button>
                </div>

                <div className="flex-1 overflow-auto space-y-3">
                  {getQuestsForDay(selectedDate.getDate()).map((quest) => (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`bg-gray-800 rounded-lg p-4 ${
                        quest.status === 'completed' ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getCategoryIcon(quest.category)}</span>
                          <div className={`w-3 h-3 rounded-full ${getCategoryColor(quest.category)}`} />
                        </div>
                        <div className={`text-sm font-semibold ${getDifficultyColor(quest.difficulty)}`}>
                          {quest.difficulty === 'easy' ? '简单' : 
                           quest.difficulty === 'medium' ? '中等' : '困难'}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-1">{quest.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{quest.desc}</p>

                      <div className="flex justify-between items-center">
                        <div className="text-tutu-purple font-bold">{quest.xp} XP</div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          quest.status === 'available' ? 'bg-gray-700 text-gray-300' :
                          quest.status === 'inProgress' ? 'bg-tutu-blue/20 text-tutu-blue' :
                          'bg-tutu-emerald/20 text-tutu-emerald'
                        }`}>
                          {quest.status === 'available' ? '可领取' :
                           quest.status === 'inProgress' ? '进行中' : '已完成'}
                        </div>
                      </div>

                      {quest.status !== 'completed' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleQuestAction(quest, e)}
                          className={`w-full mt-3 py-2 rounded font-semibold ${
                            quest.status === 'available'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'btn-secondary'
                          }`}
                        >
                          {quest.status === 'available' ? '领取任务' : '完成任务'}
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </div>

                {getQuestsForDay(selectedDate.getDate()).length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    当天暂无任务
                  </div>
                )}

                {/* 每日记录区域 */}
                <div className="border-t border-gray-700 mt-4 pt-4">
                  <h4 className="text-lg font-bold text-white mb-3">📝 每日记录</h4>

                  {recordMode === 'view' ? (
                    <>
                      {/* 心情与评分（只读） */}
                      <div className="mb-3">
                        <label className="text-gray-400 text-sm mb-2 block">今日心情</label>
                        <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-3">
                          <span className="text-3xl">{dailyMood}</span>
                          <span className="text-gray-300 text-sm">心情评分：{dailyScore} / 5</span>
                        </div>
                      </div>

                      {/* 天气（只读） */}
                      <div className="mb-3">
                        <label className="text-gray-400 text-sm mb-2 block">天气</label>
                        <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-3">
                          <span className="text-2xl">{dailyWeather || '—'}</span>
                        </div>
                      </div>

                      {/* 日记内容（只读） */}
                      <div className="mb-3">
                        <label className="text-gray-400 text-sm mb-2 block">今日日记</label>
                        <div className="bg-gray-800 rounded-lg px-4 py-2 text-white text-sm whitespace-pre-wrap min-h-[3rem]">
                          {dailyDiary || '（暂无日记内容）'}
                        </div>
                      </div>

                      {/* 编辑与删除按钮 */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => setRecordMode('edit')}
                          className="flex-1 btn-primary"
                        >
                          编辑
                        </button>
                        <button
                          onClick={handleDeleteRecord}
                          className="flex-1 py-2 rounded-lg bg-tutu-red/20 text-tutu-red border border-tutu-red/40 hover:bg-tutu-red/30 transition font-semibold"
                        >
                          删除
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* 心情选择 */}
                      <div className="mb-3">
                        <label className="text-gray-400 text-sm mb-2 block">今日心情</label>
                        <div className="flex gap-2">
                          {['😄', '😊', '😐', '😔', '😢'].map((emoji, i) => (
                            <button
                              key={emoji}
                              onClick={() => { setDailyMood(emoji); setDailyScore(5 - i); }}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition ${
                                dailyMood === emoji ? 'bg-tutu-gold/20 border-2 border-tutu-gold' : 'bg-gray-700 border border-gray-600'
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 天气 */}
                      <div className="mb-3">
                        <label className="text-gray-400 text-sm mb-1 block">天气</label>
                        <div className="flex gap-2">
                          {['☀️', '⛅', '☁️', '🌧️', '❄️'].map((w) => (
                            <button
                              key={w}
                              onClick={() => setDailyWeather(w)}
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${
                                dailyWeather === w ? 'bg-tutu-blue/20 border border-tutu-blue' : 'bg-gray-700 border border-gray-600'
                              }`}
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 日记 */}
                      <div className="mb-3">
                        <label className="text-gray-400 text-sm mb-1 block">今日日记</label>
                        <textarea
                          value={dailyDiary}
                          onChange={(e) => setDailyDiary(e.target.value)}
                          placeholder="记录今天的故事..."
                          className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white text-sm"
                          rows={3}
                        />
                      </div>

                      {/* 保存按钮 */}
                      <button
                        onClick={handleSaveDailyRecord}
                        disabled={savingRecord}
                        className="w-full btn-primary disabled:opacity-50"
                      >
                        {savingRecord ? '保存中...' : '保存记录'}
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {!selectedDate && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-game h-full flex flex-col items-center justify-center text-gray-400"
              >
                <div className="text-6xl mb-4">📅</div>
                <p className="text-lg">点击日历上的日期</p>
                <p className="text-sm">查看当天任务</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {showAddTaskModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowAddTaskModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-800 rounded-xl p-6 w-96"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">添加自定义任务</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">任务名称</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                      placeholder="输入任务名称"
                    />
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">任务描述</label>
                    <textarea
                      value={newTask.desc}
                      onChange={(e) => setNewTask({ ...newTask, desc: e.target.value })}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                      placeholder="输入任务描述"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">任务类别</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value as Quest['category'] })}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="work">💼 工作</option>
                      <option value="fitness">💪 健身</option>
                      <option value="study">📚 学习</option>
                      <option value="life">🏠 生活</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">难度</label>
                    <select
                      value={newTask.difficulty}
                      onChange={(e) => setNewTask({ ...newTask, difficulty: e.target.value as Quest['difficulty'] })}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="easy">简单 (50 XP)</option>
                      <option value="medium">中等 (100 XP)</option>
                      <option value="hard">困难 (200 XP)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">经验值奖励</label>
                    <input
                      type="number"
                      value={newTask.xp}
                      onChange={(e) => setNewTask({ ...newTask, xp: parseInt(e.target.value) || 100 })}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                      min="10"
                      max="500"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddTaskModal(false)}
                    className="flex-1 py-2 rounded-lg bg-gray-700 text-gray-300 font-medium"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAddTask}
                    className="flex-1 py-2 rounded-lg btn-primary"
                  >
                    添加
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <XpPopupDisplay popups={popups} />
      </motion.div>
    </section>
  );
};

export default QuestCenter;