import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

type Mode = 'login' | 'register';

const AVATAR_OPTIONS = ['🧭', '🎯', '🍜', '💪', '🎨', '👨‍💻', '🦊', '🐱'];

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const login = useGameStore(state => state.login);
  const register = useGameStore(state => state.register);
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState<string>(AVATAR_OPTIONS[0]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setAvatar(AVATAR_OPTIONS[0]);
    setError('');
  };

  const switchMode = (next: Mode) => {
    resetForm();
    setMode(next);
  };

  const validate = (): string | null => {
    if (mode === 'register' && !username.trim()) {
      return '请输入用户名';
    }
    if (!email.trim()) {
      return '请输入邮箱';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return '邮箱格式不正确';
    }
    if (!password) {
      return '请输入密码';
    }
    if (password.length < 6) {
      return '密码长度至少 6 位';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(username, email, password, avatar);
      }
      onAuthSuccess();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-tutu-gold focus:ring-1 focus:ring-tutu-gold transition';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-game font-bold game-title">
                {mode === 'login' ? '登录' : '注册'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl"
                aria-label="关闭"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div
                    key="username"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm text-gray-400 mb-1">用户名</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="请输入用户名"
                      className={inputClass}
                      maxLength={20}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm text-gray-400 mb-1">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  className={inputClass}
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 6 位"
                  className={inputClass}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </div>

              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div
                    key="avatar"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm text-gray-400 mb-2">选择头像</label>
                    <div className="grid grid-cols-8 gap-2">
                      {AVATAR_OPTIONS.map((emoji) => (
                        <motion.button
                          key={emoji}
                          type="button"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setAvatar(emoji)}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-xl transition ${
                            avatar === emoji
                              ? 'bg-tutu-gold/20 border-2 border-tutu-gold glow-gold'
                              : 'bg-gray-800 border border-gray-700 hover:border-gray-500'
                          }`}
                        >
                          {emoji}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-tutu-red/10 border border-tutu-red/40 text-tutu-red text-sm rounded-lg px-4 py-2"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              {mode === 'login' ? '还没有账号？' : '已有账号？'}
              <button
                type="button"
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="ml-1 text-tutu-gold hover:underline font-semibold"
              >
                {mode === 'login' ? '立即注册' : '去登录'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
