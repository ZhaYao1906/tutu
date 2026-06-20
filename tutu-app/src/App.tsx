import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CityMap from './components/CityMap';
import QuestCenter from './components/QuestCenter';
import LevelGrowth from './components/LevelGrowth';
import AchievementSystem from './components/AchievementSystem';
import PersonalCenter from './components/PersonalCenter';
import CityForum from './components/CityForum';
import Leaderboard from './components/Leaderboard';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-tutu-bg">
      <Navbar />
      <Hero />
      <CityMap />
      <QuestCenter />
      <LevelGrowth />
      <AchievementSystem />
      <PersonalCenter />
      <CityForum />
      <Leaderboard />
      <Footer />
    </div>
  );
}

export default App;