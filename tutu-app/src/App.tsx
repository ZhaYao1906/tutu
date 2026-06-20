import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CityMap from './components/CityMap';
import QuestCenter from './components/QuestCenter';
import CityForum from './components/CityForum';
import PersonalCenter from './components/PersonalCenter';

type TabType = 'hero' | 'explore' | 'quests' | 'forum' | 'profile';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabType);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-tutu-bg flex flex-col">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Hero onEnter={() => setActiveTab('explore')} />
            </motion.div>
          )}
          
          {activeTab === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 overflow-auto"
            >
              <CityMap />
            </motion.div>
          )}
          
          {activeTab === 'quests' && (
            <motion.div
              key="quests"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 overflow-auto"
            >
              <QuestCenter />
            </motion.div>
          )}
          
          {activeTab === 'forum' && (
            <motion.div
              key="forum"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 overflow-auto"
            >
              <CityForum />
            </motion.div>
          )}
          
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 overflow-auto"
            >
              <PersonalCenter />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;