import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useXpPopup } from '../hooks/useXpPopup';
import type { Spot } from '../types';
import SpotModal from './SpotModal';
import XpPopupDisplay from './XpPopupDisplay';

const CityMap: React.FC = () => {
  const { spots, filterType, setFilterType, visitSpot } = useGameStore();
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const { popups, showXpPopup } = useXpPopup();

  const filteredSpots = filterType === 'all' 
    ? spots 
    : spots.filter(spot => spot.type === filterType);

  const handleSpotClick = (spot: Spot) => {
    setSelectedSpot(spot);
  };

  const handleVisit = (spotId: string, event: React.MouseEvent) => {
    const spot = spots.find(s => s.id === spotId);
    if (spot && !spot.visited) {
      visitSpot(spotId);
      showXpPopup(event.clientX, event.clientY, spot.xp);
    }
    setSelectedSpot(null);
  };

  const getSpotColor = (type: string) => {
    switch (type) {
      case 'scenic': return '#fbbf24';
      case 'food': return '#fb923c';
      case 'culture': return '#a78bfa';
      case 'personal': return '#34d399';
      default: return '#60a5fa';
    }
  };

  const filterButtons = [
    { type: 'all', label: '全部', icon: '🗺️' },
    { type: 'scenic', label: '景点', icon: '🏛️' },
    { type: 'food', label: '美食', icon: '🍜' },
    { type: 'culture', label: '文化', icon: '🎨' },
    { type: 'personal', label: '我的', icon: '🏠' },
  ];

  return (
    <section id="explore" className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-game font-bold text-center mb-4 game-title">
          城市探索
        </h2>
        <p className="text-center text-gray-400 mb-12">
          探索北京的每一个角落，发现城市的魅力
        </p>

        <div className="flex justify-center gap-4 mb-8">
          {filterButtons.map((btn) => (
            <motion.button
              key={btn.type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterType(btn.type as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === btn.type
                  ? 'bg-gradient-to-r from-tutu-gold to-tutu-orange text-gray-900 glow-gold'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-tutu-gold'
              }`}
            >
              <span className="mr-2">{btn.icon}</span>
              {btn.label}
            </motion.button>
          ))}
        </div>

        <div className="card-game overflow-hidden">
          <svg
            viewBox="0 0 800 500"
            className="w-full h-auto"
            style={{ minHeight: '400px' }}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <rect width="800" height="500" fill="#1a1f2e" />

            <g opacity="0.3">
              <path
                d="M300,100 L350,80 L400,90 L450,70 L500,85 L550,75 L600,90 L650,80"
                stroke="#2a3040"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M280,150 L330,140 L380,155 L430,135 L480,150 L530,140 L580,155 L630,145"
                stroke="#2a3040"
                strokeWidth="2"
                fill="none"
              />
            </g>

            <g>
              <polygon
                points="350,150 400,120 450,140 480,180 460,220 400,230 360,200"
                fill="#1e3a5f"
                stroke="#2a4a6f"
                strokeWidth="2"
                opacity="0.6"
              />
              <polygon
                points="450,140 500,110 550,130 580,170 560,210 500,220 460,180"
                fill="#1e4a6f"
                stroke="#2a5a7f"
                strokeWidth="2"
                opacity="0.6"
              />
              <polygon
                points="500,220 550,200 600,220 620,260 600,300 550,290 510,260"
                fill="#1e5a7f"
                stroke="#2a6a8f"
                strokeWidth="2"
                opacity="0.6"
              />
              <polygon
                points="400,230 450,210 500,220 510,260 480,300 430,290 400,260"
                fill="#1e6a8f"
                stroke="#2a7a9f"
                strokeWidth="2"
                opacity="0.6"
              />
              <polygon
                points="360,200 400,230 430,290 420,330 380,320 350,280"
                fill="#1e7a9f"
                stroke="#2a8aaf"
                strokeWidth="2"
                opacity="0.6"
              />
              <polygon
                points="280,180 350,150 360,200 350,280 300,260 280,220"
                fill="#1e8aaf"
                stroke="#2a9abf"
                strokeWidth="2"
                opacity="0.6"
              />
              <polygon
                points="200,160 280,180 280,220 260,260 200,240 180,200"
                fill="#1e9abf"
                stroke="#2aabcf"
                strokeWidth="2"
                opacity="0.6"
              />
              <polygon
                points="150,120 200,160 180,200 160,240 120,220 100,180"
                fill="#1eabcf"
                stroke="#2abcdf"
                strokeWidth="2"
                opacity="0.6"
              />
              <polygon
                points="100,80 150,120 100,180 80,160 60,120"
                fill="#1ebcdf"
                stroke="#2acdef"
                strokeWidth="2"
                opacity="0.6"
              />
              <polygon
                points="350,280 380,320 420,330 410,370 370,360 340,320"
                fill="#1ecdef"
                stroke="#2adeef"
                strokeWidth="2"
                opacity="0.6"
              />
              <polygon
                points="420,330 480,300 510,260 550,290 540,330 500,360 450,370"
                fill="#1edef0"
                stroke="#2aeff0"
                strokeWidth="2"
                opacity="0.6"
              />
              <polygon
                points="540,330 600,300 620,260 650,280 640,320 600,350"
                fill="#1eef0f"
                stroke="#2af0f0"
                strokeWidth="2"
                opacity="0.6"
              />
              <polygon
                points="370,360 410,370 450,370 440,400 400,390 360,380"
                fill="#1ef0f1"
                stroke="#2af1f1"
                strokeWidth="2"
                opacity="0.6"
              />
              <polygon
                points="440,400 500,360 540,330 560,350 550,380 510,400"
                fill="#1ef1f2"
                stroke="#2af2f2"
                strokeWidth="2"
                opacity="0.6"
              />
              <polygon
                points="360,380 400,390 440,400 430,430 390,420 350,410"
                fill="#1ef2f3"
                stroke="#2af3f3"
                strokeWidth="2"
                opacity="0.6"
              />
              <polygon
                points="430,430 510,400 550,380 570,400 560,430 520,450"
                fill="#1ef3f4"
                stroke="#2af4f4"
                strokeWidth="2"
                opacity="0.6"
              />
              <polygon
                points="560,430 640,320 650,280 670,300 660,340 620,450"
                fill="#1ef4f5"
                stroke="#2af5f5"
                strokeWidth="2"
                opacity="0.6"
              />
            </g>

            <AnimatePresence>
              {filteredSpots.map((spot) => (
                <motion.g
                  key={spot.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleSpotClick(spot)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={spot.coordinates.x}
                    cy={spot.coordinates.y}
                    r={spot.visited ? 8 : 12}
                    fill={getSpotColor(spot.type)}
                    filter="url(#glow)"
                    opacity={spot.visited ? 0.6 : 1}
                    stroke={spot.visited ? '#fff' : 'transparent'}
                    strokeWidth={spot.visited ? 2 : 0}
                  />
                  <text
                    x={spot.coordinates.x}
                    y={spot.coordinates.y + 25}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="12"
                    opacity={0.8}
                  >
                    {spot.name}
                  </text>
                  {spot.visited && (
                    <text
                      x={spot.coordinates.x}
                      y={spot.coordinates.y - 5}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="10"
                    >
                      ✓
                    </text>
                  )}
                </motion.g>
              ))}
            </AnimatePresence>
          </svg>
        </div>

        <AnimatePresence>
          {selectedSpot && (
            <SpotModal
              spot={selectedSpot}
              onClose={() => setSelectedSpot(null)}
              onVisit={(e) => handleVisit(selectedSpot.id, e)}
            />
          )}
        </AnimatePresence>

        <XpPopupDisplay popups={popups} />
      </motion.div>
    </section>
  );
};

export default CityMap;