import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AccountItem {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  note: string;
  time: string;
}

const AccountSystem: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [accountType, setAccountType] = useState<'expense' | 'income'>('expense');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    amount: '',
    category: '餐饮',
    note: ''
  });

  // Mock数据
  const [accountItems, setAccountItems] = useState<AccountItem[]>([
    { id: '1', type: 'expense', amount: 35, category: '餐饮', note: '午餐', time: '2024-06-15 12:30' },
    { id: '2', type: 'expense', amount: 200, category: '交通', note: '地铁充值', time: '2024-06-15 18:00' },
    { id: '3', type: 'income', amount: 15000, category: '工资', note: '6月工资', time: '2024-06-10 09:00' },
    { id: '4', type: 'expense', amount: 500, category: '购物', note: '购买日用品', time: '2024-06-14 15:20' },
    { id: '5', type: 'expense', amount: 80, category: '娱乐', note: '看电影', time: '2024-06-13 20:00' },
    { id: '6', type: 'expense', amount: 120, category: '餐饮', note: '晚餐', time: '2024-06-12 19:30' },
    { id: '7', type: 'expense', amount: 50, category: '交通', note: '打车', time: '2024-06-11 08:00' },
    { id: '8', type: 'income', amount: 500, category: '兼职', note: '周末兼职', time: '2024-06-09 18:00' },
    { id: '9', type: 'expense', amount: 300, category: '购物', note: '买衣服', time: '2024-06-08 14:00' },
    { id: '10', type: 'expense', amount: 40, category: '餐饮', note: '早餐', time: '2024-06-07 07:30' },
  ]);

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // 过滤当月数据
  const monthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const filteredAccounts = accountItems.filter(item => item.time.startsWith(monthStr));

  // 计算统计数据
  const income = filteredAccounts
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const expense = filteredAccounts
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = income - expense;

  // 分类统计
  const categoryStats = filteredAccounts
    .filter(item => item.type === accountType)
    .reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);

  const handleAddAccount = () => {
    if (!newAccount.amount || parseFloat(newAccount.amount) <= 0) return;

    const account: AccountItem = {
      id: `account-${Date.now()}`,
      type: accountType,
      amount: parseFloat(newAccount.amount),
      category: newAccount.category,
      note: newAccount.note || `${newAccount.category}`,
      time: `${monthStr}-${String(new Date().getDate()).padStart(2, '0')} ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
    };

    setAccountItems([...accountItems, account]);
    setShowAddModal(false);
    setNewAccount({ amount: '', category: '餐饮', note: '' });
  };

  const expenseCategories = ['餐饮', '交通', '购物', '娱乐', '房租', '水电', '通讯', '医疗', '教育', '其他'];
  const incomeCategories = ['工资', '兼职', '投资', '红包', '退款', '其他'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="card-game"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">记账本</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-sm"
        >
          + 记一笔
        </motion.button>
      </div>

      {/* 月度切换 */}
      <div className="flex justify-between items-center mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevMonth}
          className="btn-secondary"
        >
          ← 上月
        </motion.button>
        <div className="text-xl font-bold text-white">
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

      {/* 统计概览 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-400 mb-2">收入</div>
          <div className="text-2xl font-bold text-tutu-emerald">¥{income.toFixed(2)}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-400 mb-2">支出</div>
          <div className="text-2xl font-bold text-tutu-red">¥{expense.toFixed(2)}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-400 mb-2">结余</div>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-tutu-gold' : 'text-tutu-red'}`}>
            ¥{balance.toFixed(2)}
          </div>
        </div>
      </div>

      {/* 类型切换 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setAccountType('expense')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            accountType === 'expense'
              ? 'bg-tutu-red text-white glow-gold'
              : 'bg-gray-800 text-gray-300'
          }`}
        >
          支出明细
        </button>
        <button
          onClick={() => setAccountType('income')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            accountType === 'income'
              ? 'bg-tutu-emerald text-white glow-emerald'
              : 'bg-gray-800 text-gray-300'
          }`}
        >
          收入明细
        </button>
      </div>

      {/* 分类统计 */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h4 className="text-lg font-bold text-white mb-3">分类统计</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(categoryStats).map(([category, amount]) => (
            <div key={category} className="bg-gray-700 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-400">{category}</div>
              <div className={`text-sm font-bold ${
                accountType === 'expense' ? 'text-tutu-red' : 'text-tutu-emerald'
              }`}>
                ¥{amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 明细列表 */}
      <div className="space-y-3">
        {filteredAccounts
          .filter(item => item.type === accountType)
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
          .map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {item.type === 'expense' ? '💸' : '💰'}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{item.category}</div>
                    <div className="text-sm text-gray-400">{item.note}</div>
                    <div className="text-xs text-gray-500">{item.time}</div>
                  </div>
                </div>
              </div>
              <div className={`text-xl font-bold ${
                item.type === 'expense' ? 'text-tutu-red' : 'text-tutu-emerald'
              }`}>
                {item.type === 'expense' ? '-' : '+'}¥{item.amount.toFixed(2)}
              </div>
            </motion.div>
          ))}
      </div>

      {filteredAccounts.filter(item => item.type === accountType).length === 0 && (
        <div className="text-center text-gray-400 py-8">
          当月暂无{accountType === 'expense' ? '支出' : '收入'}记录
        </div>
      )}

      {/* 添加记账弹窗 */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-800 rounded-xl p-6 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">
              记一笔{accountType === 'expense' ? '支出' : '收入'}
            </h3>

            {/* 类型切换 */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setAccountType('expense')}
                className={`flex-1 py-2 rounded-lg font-medium ${
                  accountType === 'expense'
                    ? 'bg-tutu-red text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                支出
              </button>
              <button
                onClick={() => setAccountType('income')}
                className={`flex-1 py-2 rounded-lg font-medium ${
                  accountType === 'income'
                    ? 'bg-tutu-emerald text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                收入
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">金额</label>
                <input
                  type="number"
                  value={newAccount.amount}
                  onChange={(e) => setNewAccount({ ...newAccount, amount: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white text-lg"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">类别</label>
                <select
                  value={newAccount.category}
                  onChange={(e) => setNewAccount({ ...newAccount, category: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                >
                  {(accountType === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">备注</label>
                <input
                  type="text"
                  value={newAccount.note}
                  onChange={(e) => setNewAccount({ ...newAccount, note: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="添加备注（可选）"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-lg bg-gray-700 text-gray-300 font-medium"
              >
                取消
              </button>
              <button
                onClick={handleAddAccount}
                className={`flex-1 py-2 rounded-lg font-medium ${
                  accountType === 'expense'
                    ? 'bg-tutu-red text-white'
                    : 'bg-tutu-emerald text-white'
                }`}
              >
                保存
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AccountSystem;