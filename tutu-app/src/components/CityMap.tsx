import React, { useState, useRef } from 'react';
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
  const [zoom, setZoom] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

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

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setMapOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (svgRef.current) {
      const startX = e.clientX - mapOffset.x;
      const startY = e.clientY - mapOffset.y;
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
        setMapOffset({
          x: moveEvent.clientX - startX,
          y: moveEvent.clientY - startY
        });
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  return (
    <section className="h-full bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-game font-bold text-center mb-4 game-title">
          城市探索
        </h2>
        <p className="text-center text-gray-400 mb-8">
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

        <div className="card-game overflow-hidden relative">
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleZoomIn}
              className="w-10 h-10 rounded-lg bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700"
            >
              +
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleZoomOut}
              className="w-10 h-10 rounded-lg bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700"
            >
              -
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleResetZoom}
              className="w-10 h-10 rounded-lg bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700"
            >
              ⟲
            </motion.button>
          </div>

          <div className="absolute top-4 left-4 text-sm text-gray-400 z-10">
            缩放: {Math.round(zoom * 100)}%
          </div>

          <div
            className="overflow-hidden"
            style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
            onMouseDown={zoom > 1 ? handleMouseDown : undefined}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 900 600"
              className="w-full h-auto"
              style={{
                minHeight: '450px',
                transform: `scale(${zoom}) translate(${mapOffset.x / zoom}px, ${mapOffset.y / zoom}px)`,
                transformOrigin: 'center',
                transition: 'transform 0.3s ease'
              }}
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8"/>
                </linearGradient>
              </defs>

              <rect width="900" height="600" fill="#1a1f2e" />

              <ellipse cx="450" cy="400" rx="200" ry="150" fill="#1e3a5f" opacity="0.3"/>

              <g opacity="0.2">
                <path d="M100,50 L120,40 L140,55 L160,35 L180,50" stroke="#4a5568" strokeWidth="1" fill="none"/>
                <path d="M700,80 L720,70 L740,85 L760,65 L780,80" stroke="#4a5568" strokeWidth="1" fill="none"/>
                <path d="M800,200 L820,190 L840,205 L860,185 L880,200" stroke="#4a5568" strokeWidth="1" fill="none"/>
              </g>

              <g className="mountains">
                <path d="M50,500 L70,450 L90,480 L110,430 L130,470 L150,440 L170,490" fill="#374151" opacity="0.8"/>
                <path d="M60,460 L80,430 L100,450 L120,420 L140,450" fill="#4b5563" opacity="0.6"/>
                <path d="M70,440 L90,410 L110,430" fill="#6b7280" opacity="0.4"/>
                <path d="M180,520 L200,470 L220,500 L240,450 L260,490" fill="#374151" opacity="0.8"/>
                <path d="M650,540 L670,490 L690,520 L710,470 L730,510" fill="#374151" opacity="0.8"/>
                <path d="M660,500 L680,470 L700,490" fill="#4b5563" opacity="0.6"/>
                <path d="M800,350 L820,300 L840,330 L860,280 L880,320" fill="#374151" opacity="0.8"/>
              </g>

              <path d="M550,350 Q600,330 650,350 Q700,370 750,350" stroke="url(#riverGradient)" strokeWidth="8" fill="none"/>
              <path d="M400,450 Q450,430 500,450 Q550,470 600,450" stroke="url(#riverGradient)" strokeWidth="6" fill="none"/>
              <path d="M300,300 Q350,280 400,300" stroke="url(#riverGradient)" strokeWidth="4" fill="none"/>
              <path d="M600,200 Q650,180 700,200" stroke="url(#riverGradient)" strokeWidth="4" fill="none"/>

              <g>
                <path d="M380,250 L420,230 L460,250 L480,290 L460,330 L420,350 L380,330 L360,290 Z" fill="#2d4a3f" stroke="#4ade80" strokeWidth="2" opacity="0.8"/>
                <text x="420" y="295" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="bold">海淀区</text>
                
                <path d="M460,250 L500,230 L540,250 L560,290 L540,330 L500,350 L460,330 Z" fill="#2d3a5a" stroke="#60a5fa" strokeWidth="2" opacity="0.8"/>
                <text x="500" y="295" textAnchor="middle" fill="#60a5fa" fontSize="12" fontWeight="bold">朝阳区</text>
                
                <path d="M420,350 L460,330 L500,350 L520,390 L500,430 L460,450 L420,430 L400,390 Z" fill="#4a3a2d" stroke="#fb923c" strokeWidth="2" opacity="0.8"/>
                <text x="460" y="400" textAnchor="middle" fill="#fb923c" fontSize="12" fontWeight="bold">东城区</text>
                
                <path d="M380,330 L420,350 L400,390 L360,410 L340,370 Z" fill="#4a2d3a" stroke="#f87171" strokeWidth="2" opacity="0.8"/>
                <text x="390" y="375" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="bold">西城区</text>
                
                <path d="M460,450 L500,430 L520,390 L560,410 L580,450 L540,490 L500,470 Z" fill="#3a4a2d" stroke="#86efac" strokeWidth="2" opacity="0.8"/>
                <text x="520" y="445" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="bold">丰台区</text>
                
                <path d="M340,370 L380,330 L360,410 L320,430 L300,390 Z" fill="#3a2d4a" stroke="#a78bfa" strokeWidth="2" opacity="0.8"/>
                <text x="330" y="405" textAnchor="middle" fill="#a78bfa" fontSize="12" fontWeight="bold">石景山区</text>
                
                <path d="M500,470 L540,490 L560,450 L600,470 L620,510 L580,550 L540,530 Z" fill="#2d4a4a" stroke="#67e8f9" strokeWidth="2" opacity="0.8"/>
                <text x="560" y="505" textAnchor="middle" fill="#67e8f9" fontSize="12" fontWeight="bold">大兴区</text>
                
                <path d="M400,430 L420,450 L400,490 L360,510 L340,470 Z" fill="#4a4a2d" stroke="#fbbf24" strokeWidth="2" opacity="0.8"/>
                <text x="375" y="475" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">门头沟区</text>
                
                <path d="M340,470 L360,510 L320,550 L280,530 L260,490 Z" fill="#2d3a4a" stroke="#93c5fd" strokeWidth="2" opacity="0.8"/>
                <text x="300" y="510" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="bold">房山区</text>
                
                <path d="M540,530 L580,550 L620,510 L660,530 L680,570 L640,600 L600,580 Z" fill="#4a3a4a" stroke="#d8b4fe" strokeWidth="2" opacity="0.8"/>
                <text x="620" y="565" textAnchor="middle" fill="#d8b4fe" fontSize="12" fontWeight="bold">通州区</text>
                
                <path d="M460,330 L500,350 L480,290 L520,270 L540,310 Z" fill="#2d4a3a" stroke="#4ade80" strokeWidth="2" opacity="0.8"/>
                <text x="490" y="305" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="bold">顺义区</text>
                
                <path d="M380,250 L420,230 L380,190 L340,210 L360,250 Z" fill="#3a4a3a" stroke="#86efac" strokeWidth="2" opacity="0.8"/>
                <text x="375" y="235" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="bold">昌平区</text>
                
                <path d="M300,200 L340,210 L380,190 L360,150 L320,160 Z" fill="#4a4a4a" stroke="#9ca3af" strokeWidth="2" opacity="0.8"/>
                <text x="330" y="185" textAnchor="middle" fill="#9ca3af" fontSize="12" fontWeight="bold">延庆区</text>
                
                <path d="M420,180 L460,160 L500,180 L480,220 L440,200 Z" fill="#3a3a4a" stroke="#a5b4fc" strokeWidth="2" opacity="0.8"/>
                <text x="450" y="200" textAnchor="middle" fill="#a5b4fc" fontSize="12" fontWeight="bold">怀柔区</text>
                
                <path d="M500,180 L540,160 L580,180 L560,220 L520,200 Z" fill="#4a3a3a" stroke="#fca5a5" strokeWidth="2" opacity="0.8"/>
                <text x="535" y="200" textAnchor="middle" fill="#fca5a5" fontSize="12" fontWeight="bold">密云区</text>
                
                <path d="M560,250 L600,230 L640,250 L620,290 L580,270 Z" fill="#3a4a2d" stroke="#bef264" strokeWidth="2" opacity="0.8"/>
                <text x="595" y="275" textAnchor="middle" fill="#bef264" fontSize="12" fontWeight="bold">平谷区</text>
              </g>

              <g>
                <rect x="45" y="480" width="80" height="60" fill="#1f2937" opacity="0.8" rx="8"/>
                <text x="85" y="500" textAnchor="middle" fill="#9ca3af" fontSize="10">西山山脉</text>
                <circle cx="60" cy="520" r="10" fill="#6b7280" opacity="0.6"/>
                <circle cx="90" cy="530" r="8" fill="#6b7280" opacity="0.6"/>
                
                <rect x="630" y="510" width="80" height="60" fill="#1f2937" opacity="0.8" rx="8"/>
                <text x="670" y="530" textAnchor="middle" fill="#9ca3af" fontSize="10">军都山脉</text>
                <circle cx="645" cy="550" r="10" fill="#6b7280" opacity="0.6"/>
                <circle cx="675" cy="560" r="8" fill="#6b7280" opacity="0.6"/>
                
                <rect x="780" y="330" width="80" height="60" fill="#1f2937" opacity="0.8" rx="8"/>
                <text x="820" y="350" textAnchor="middle" fill="#9ca3af" fontSize="10">燕山山脉</text>
                <circle cx="795" cy="370" r="10" fill="#6b7280" opacity="0.6"/>
                <circle cx="825" cy="380" r="8" fill="#6b7280" opacity="0.6"/>
              </g>

              <g>
                <circle cx="450" cy="320" r="30" fill="#fbbf24" opacity="0.2"/>
                <circle cx="450" cy="320" r="20" fill="#fbbf24" opacity="0.1"/>
                <text x="450" y="315" textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="bold">紫禁城</text>
                <text x="450" y="335" textAnchor="middle" fill="#fbbf24" fontSize="10">故宫博物院</text>
                
                <circle cx="400" cy="280" r="25" fill="#60a5fa" opacity="0.2"/>
                <text x="400" y="275" textAnchor="middle" fill="#60a5fa" fontSize="14" fontWeight="bold">圆明园</text>
                
                <circle cx="480" cy="280" r="25" fill="#34d399" opacity="0.2"/>
                <text x="480" y="275" textAnchor="middle" fill="#34d399" fontSize="14" fontWeight="bold">颐和园</text>
                
                <circle cx="520" cy="380" r="25" fill="#a78bfa" opacity="0.2"/>
                <text x="520" y="375" textAnchor="middle" fill="#a78bfa" fontSize="14" fontWeight="bold">三里屯</text>
                
                <circle cx="420" cy="380" r="25" fill="#fb923c" opacity="0.2"/>
                <text x="420" y="375" textAnchor="middle" fill="#fb923c" fontSize="14" fontWeight="bold">王府井</text>
                
                <circle cx="360" cy="350" r="25" fill="#f87171" opacity="0.2"/>
                <text x="360" y="345" textAnchor="middle" fill="#f87171" fontSize="14" fontWeight="bold">天安门</text>
                
                <circle cx="560" cy="340" r="25" fill="#67e8f9" opacity="0.2"/>
                <text x="560" y="335" textAnchor="middle" fill="#67e8f9" fontSize="14" fontWeight="bold">鸟巢</text>
                
                <circle cx="320" cy="420" r="25" fill="#fbbf24" opacity="0.2"/>
                <text x="320" y="415" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">首钢园</text>
                
                <circle cx="600" cy="480" r="25" fill="#34d399" opacity="0.2"/>
                <text x="600" y="475" textAnchor="middle" fill="#34d399" fontSize="14" fontWeight="bold">大兴机场</text>
                
                <circle cx="300" cy="520" r="25" fill="#a78bfa" opacity="0.2"/>
                <text x="300" y="515" textAnchor="middle" fill="#a78bfa" fontSize="14" fontWeight="bold">十渡</text>
                
                <circle cx="480" cy="520" r="25" fill="#60a5fa" opacity="0.2"/>
                <text x="480" y="515" textAnchor="middle" fill="#60a5fa" fontSize="14" fontWeight="bold">亦庄</text>
                
                <circle cx="640" cy="560" r="25" fill="#fb923c" opacity="0.2"/>
                <text x="640" y="555" textAnchor="middle" fill="#fb923c" fontSize="14" fontWeight="bold">环球影城</text>
                
                <circle cx="450" cy="180" r="25" fill="#67e8f9" opacity="0.2"/>
                <text x="450" y="175" textAnchor="middle" fill="#67e8f9" fontSize="14" fontWeight="bold">雁栖湖</text>
                
                <circle cx="330" cy="180" r="25" fill="#f87171" opacity="0.2"/>
                <text x="330" y="175" textAnchor="middle" fill="#f87171" fontSize="14" fontWeight="bold">八达岭</text>
                
                <circle cx="530" cy="180" r="25" fill="#fbbf24" opacity="0.2"/>
                <text x="530" y="175" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">密云水库</text>
                
                <circle cx="600" cy="280" r="25" fill="#34d399" opacity="0.2"/>
                <text x="600" y="275" textAnchor="middle" fill="#34d399" fontSize="14" fontWeight="bold">金海湖</text>
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