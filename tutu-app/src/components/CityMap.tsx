import React, { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { geoMercator, geoPath } from 'd3-geo';
import { useGameStore } from '../store/gameStore';
import { useXpPopup } from '../hooks/useXpPopup';
import type { Spot } from '../types';
import SpotModal from './SpotModal';
import XpPopupDisplay from './XpPopupDisplay';
import beijingGeo from '../data/beijing-geo.json';

// SVG 视口尺寸
const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;

// 北京中心点 [经度, 纬度]
const BEIJING_CENTER: [number, number] = [116.4, 40.15];

// 将现有 SVG 像素坐标 (x: 0-900, y: 0-600) 转换为北京经纬度范围
const pixelToLngLat = (x: number, y: number): [number, number] => {
  const lng = 115.7 + (x / 900) * 1.7;
  const lat = 41.6 - (y / 600) * 2.2;
  return [lng, lat];
};

// 各行政区填充色
const DISTRICT_FILL: Record<string, string> = {
  东城区: '#4a3a2d', 西城区: '#4a2d3a', 朝阳区: '#2d3a5a', 丰台区: '#3a4a2d',
  石景山区: '#3a2d4a', 海淀区: '#2d4a3f', 门头沟区: '#4a4a2d', 房山区: '#2d3a4a',
  通州区: '#4a3a4a', 顺义区: '#2d4a3a', 昌平区: '#3a4a3a', 大兴区: '#2d4a4a',
  怀柔区: '#3a3a4a', 平谷区: '#3a4a2d', 密云区: '#4a3a3a', 延庆区: '#4a4a4a',
};

// 各行政区边界发光色
const DISTRICT_STROKE: Record<string, string> = {
  东城区: '#fb923c', 西城区: '#f87171', 朝阳区: '#60a5fa', 丰台区: '#86efac',
  石景山区: '#a78bfa', 海淀区: '#4ade80', 门头沟区: '#fbbf24', 房山区: '#93c5fd',
  通州区: '#d8b4fe', 顺义区: '#4ade80', 昌平区: '#86efac', 大兴区: '#67e8f9',
  怀柔区: '#a5b4fc', 平谷区: '#bef264', 密云区: '#fca5a5', 延庆区: '#9ca3af',
};

const CityMap: React.FC = () => {
  const { spots, filterType, setFilterType, visitSpot } = useGameStore();
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const { popups, showXpPopup } = useXpPopup();
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  // 创建投影和路径生成器
  const { projection, pathGenerator, districtPaths } = useMemo(() => {
    const proj = geoMercator()
      .center(BEIJING_CENTER)
      .scale(20000)
      .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

    const pathGen = geoPath(proj);

    const features = (beijingGeo as { features: Array<{ properties?: { name?: string }; geometry: unknown }> }).features;
    const districts = features.map((feature) => {
      const name = feature.properties?.name ?? '';
      const d = pathGen(feature as never);
      const centroid = pathGen.centroid(feature as never);
      return { name, d, centroid, fill: DISTRICT_FILL[name] ?? '#2d3a4a', stroke: DISTRICT_STROKE[name] ?? '#4a90e2' };
    });

    return { projection: proj, pathGenerator: pathGen, districtPaths: districts };
  }, []);

  // 将经纬度转换为 SVG 坐标
  const project = useCallback(
    (lng: number, lat: number): [number, number] => {
      const point = projection([lng, lat]);
      if (!point) return [0, 0];
      return point;
    },
    [projection]
  );

  const filteredSpots =
    filterType === 'all' ? spots : spots.filter((spot) => spot.type === filterType);

  const handleSpotClick = (spot: Spot) => setSelectedSpot(spot);

  const handleVisit = (spotId: string, event: React.MouseEvent) => {
    const spot = spots.find((s) => s.id === spotId);
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

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.4, 5));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.4, 0.5));
  const handleResetZoom = () => { setZoom(1); setOffset({ x: 0, y: 0 }); };

  // 鼠标拖拽平移
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, offsetX: offset.x, offsetY: offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset({ x: dragStart.current.offsetX + dx, y: dragStart.current.offsetY + dy });
  };

  const handleMouseUp = () => setIsDragging(false);

  // 滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      setZoom((z) => Math.min(z * 1.15, 5));
    } else {
      setZoom((z) => Math.max(z / 1.15, 0.5));
    }
  };

  return (
    <section className="h-full bg-gradient-to-b from-gray-900 to-gray-800 p-4 overflow-auto">
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
              onClick={() => setFilterType(btn.type as typeof filterType)}
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
          {/* 缩放控制按钮 */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleZoomIn}
              className="w-10 h-10 rounded-lg bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700">+</motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleZoomOut}
              className="w-10 h-10 rounded-lg bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700">-</motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleResetZoom}
              className="w-10 h-10 rounded-lg bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700">⟲</motion.button>
          </div>

          <div className="absolute top-4 left-4 text-sm text-gray-400 z-10">
            缩放: {Math.round(zoom * 100)}%
          </div>

          {/* SVG 地图 */}
          <div
            className="overflow-hidden"
            style={{ background: '#1a1f2e', cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <svg
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              width="100%"
              height="auto"
              style={{ display: 'block' }}
            >
              <defs>
                <filter id="district-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.1" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="marker-glow" x="-150%" y="-150%" width="400%" height="400%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 缩放和平移变换组 */}
              <g
                transform={`translate(${MAP_WIDTH / 2 + offset.x}, ${MAP_HEIGHT / 2 + offset.y}) scale(${zoom}) translate(${-MAP_WIDTH / 2}, ${-MAP_HEIGHT / 2})`}
              >
                {/* 行政区路径 */}
                {districtPaths.map((district) => (
                  <path
                    key={district.name}
                    d={district.d || ''}
                    fill={district.fill}
                    stroke={district.stroke}
                    strokeWidth={0.6}
                    opacity={0.55}
                    filter="url(#district-glow)"
                    style={{ transition: 'all 0.25s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.setAttribute('opacity', '0.9');
                      e.currentTarget.setAttribute('stroke-width', '1.6');
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.setAttribute('opacity', '0.55');
                      e.currentTarget.setAttribute('stroke-width', '0.6');
                    }}
                  />
                ))}

                {/* 行政区名称 */}
                {districtPaths.map((district) => {
                  if (!district.centroid || Number.isNaN(district.centroid[0])) return null;
                  return (
                    <text
                      key={`label-${district.name}`}
                      x={district.centroid[0]}
                      y={district.centroid[1]}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={9}
                      fontWeight="bold"
                      style={{
                        pointerEvents: 'none',
                        fill: '#e2e8f0',
                        stroke: '#0b1020',
                        strokeWidth: 2.5,
                        paintOrder: 'stroke' as const,
                        strokeLinejoin: 'round' as const,
                      }}
                    >
                      {district.name}
                    </text>
                  );
                })}

                {/* 打卡点 */}
                {filteredSpots.map((spot) => {
                  const [lng, lat] = pixelToLngLat(spot.coordinates.x, spot.coordinates.y);
                  const [cx, cy] = project(lng, lat);
                  const color = getSpotColor(spot.type);
                  return (
                    <g key={spot.id} onClick={() => handleSpotClick(spot)} style={{ cursor: 'pointer' }}>
                      {!spot.visited && (
                        <circle cx={cx} cy={cy} r={10} fill={color} opacity={0.25} pointerEvents="none">
                          <animate attributeName="r" values="8;14;8" dur="2.4s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.35;0.05;0.35" dur="2.4s" repeatCount="indefinite" />
                        </circle>
                      )}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={spot.visited ? 5 : 7}
                        fill={color}
                        stroke={spot.visited ? '#ffffff' : color}
                        strokeWidth={spot.visited ? 1.5 : 1}
                        opacity={spot.visited ? 0.55 : 1}
                        filter="url(#marker-glow)"
                      />
                      {spot.visited && (
                        <text x={cx} y={cy + 2} textAnchor="middle" fontSize={8} fill="#ffffff" fontWeight="bold" style={{ pointerEvents: 'none' }}>✓</text>
                      )}
                      <text
                        x={cx}
                        y={cy + (spot.visited ? -12 : -14)}
                        textAnchor="middle"
                        fontSize={9}
                        fill="#f1f5f9"
                        fontWeight="bold"
                        style={{
                          pointerEvents: 'none',
                          stroke: '#0b1020',
                          strokeWidth: 2.5,
                          paintOrder: 'stroke' as const,
                          strokeLinejoin: 'round' as const,
                        }}
                      >
                        {spot.name}
                      </text>
                    </g>
                  );
                })}
              </g>
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
