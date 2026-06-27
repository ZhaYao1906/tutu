import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGameStore } from '../store/gameStore';
import { useXpPopup } from '../hooks/useXpPopup';
import type { Spot } from '../types';
import SpotModal from './SpotModal';
import XpPopupDisplay from './XpPopupDisplay';
import beijingGeo from '../data/beijing-geo.json';

// 将现有 SVG 像素坐标转换为经纬度 [lng, lat]
const pixelToLngLat = (x: number, y: number): [number, number] => {
  const lng = 115.7 + (x / 900) * 1.7;
  const lat = 41.6 - (y / 600) * 2.2;
  return [lng, lat];
};

const getSpotColor = (type: string): string => {
  switch (type) {
    case 'scenic': return '#fbbf24';
    case 'food': return '#fb923c';
    case 'culture': return '#a78bfa';
    case 'personal': return '#34d399';
    default: return '#60a5fa';
  }
};

const getSpotEmoji = (type: string): string => {
  switch (type) {
    case 'scenic': return '🏛️';
    case 'food': return '🍜';
    case 'culture': return '🎨';
    case 'personal': return '🏠';
    default: return '📍';
  }
};

const CityMap: React.FC = () => {
  const { spots, filterType, setFilterType, visitSpot } = useGameStore();
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const { popups, showXpPopup } = useXpPopup();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const labelLayerRef = useRef<L.LayerGroup | null>(null);
  const districtLayerRef = useRef<L.GeoJSON | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const filteredSpots = useMemo(
    () => (filterType === 'all' ? spots : spots.filter((s) => s.type === filterType)),
    [spots, filterType]
  );

  // 初始化地图
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // 北京市中心和边界
    const beijingCenter: L.LatLngTuple = [39.9042, 116.4074];
    const southWest: L.LatLngTuple = [39.4, 115.4];
    const northEast: L.LatLngTuple = [41.1, 117.8];
    const bounds = L.latLngBounds(southWest, northEast);

    const map = L.map(mapContainerRef.current, {
      center: beijingCenter,
      zoom: 10,
      minZoom: 9,
      maxZoom: 18,
      maxBounds: bounds,
      maxBoundsViscosity: 0.8,
      zoomControl: true,
      attributionControl: false,
    });

    mapRef.current = map;

    // 高德地图中文瓦片层（暗色滤镜处理）
    L.tileLayer(
      'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      {
        subdomains: ['1', '2', '3', '4'],
        maxZoom: 18,
        className: 'map-tiles-gaode-dark',
      }
    ).addTo(map);

    // 行政区边界 overlay
    const districtStyle = (feature: GeoJSON.Feature | undefined): L.PathOptions => {
      const name = feature?.properties?.name as string ?? '';
      const colors: Record<string, string> = {
        东城区: '#fb923c', 西城区: '#f87171', 朝阳区: '#60a5fa', 丰台区: '#86efac',
        石景山区: '#a78bfa', 海淀区: '#4ade80', 门头沟区: '#fbbf24', 房山区: '#93c5fd',
        通州区: '#d8b4fe', 顺义区: '#4ade80', 昌平区: '#86efac', 大兴区: '#67e8f9',
        怀柔区: '#a5b4fc', 平谷区: '#bef264', 密云区: '#fca5a5', 延庆区: '#9ca3af',
      };
      return {
        fillColor: colors[name] ?? '#334155',
        weight: 1.5,
        opacity: 0.8,
        color: colors[name] ?? '#4a90e2',
        fillOpacity: 0.08,
        dashArray: '4 2',
      };
    };

    const districtLayer = L.geoJSON(beijingGeo as GeoJSON.GeoJsonObject, {
      style: districtStyle,
      onEachFeature: (feature, layer) => {
        const name = feature.properties?.name ?? '';
        layer.bindTooltip(name, {
          permanent: false,
          direction: 'center',
          className: 'district-tooltip',
        });
      },
    }).addTo(map);

    districtLayerRef.current = districtLayer;

    // 标签图层（用于显示地名）
    const labelLayer = L.layerGroup().addTo(map);
    labelLayerRef.current = labelLayer;

    // 缩放时更新标签可见性
    const updateLabels = () => {
      const zoom = map.getZoom();
      labelLayer.clearLayers();

      // 缩放 >= 12 时显示行政区名称
      if (zoom >= 12) {
        (beijingGeo as { features: GeoJSON.Feature[] }).features.forEach((feature) => {
          const name = feature.properties?.name ?? '';
          const centroid = (feature.properties as { centroid?: [number, number] })?.centroid;
          if (centroid) {
            const label = L.marker([centroid[1], centroid[0]], {
              icon: L.divIcon({
                className: 'district-label',
                html: `<div class="district-label-text">${name}</div>`,
                iconSize: [80, 20],
                iconAnchor: [40, 10],
              }),
              interactive: false,
            });
            labelLayer.addLayer(label);
          }
        });
      }
    };

    map.on('zoomend', updateLabels);
    updateLabels();
    setMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  // 更新标记点
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) {
      return;
    }

    // 清除旧标记
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    filteredSpots.forEach((spot) => {
      const [lng, lat] = pixelToLngLat(spot.coordinates.x, spot.coordinates.y);
      const color = getSpotColor(spot.type);
      const emoji = getSpotEmoji(spot.type);
      const visited = spot.visited;

      const html = visited
        ? `<div class="spot-marker visited" style="--color: ${color}">
             <div class="spot-marker-dot">✓</div>
           </div>`
        : `<div class="spot-marker" style="--color: ${color}">
             <div class="spot-marker-pulse"></div>
             <div class="spot-marker-dot">${emoji}</div>
           </div>`;

      const icon = L.divIcon({
        className: 'custom-spot-marker',
        html,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      marker.on('click', () => {
        setSelectedSpot(spot);
      });

      // 缩放 >= 13 时显示 tooltip
      const updateTooltip = () => {
        const zoom = map.getZoom();
        if (zoom >= 13) {
          if (!marker.getTooltip()) {
            marker.bindTooltip(spot.name, {
              permanent: true,
              direction: 'top',
              className: 'spot-tooltip',
              offset: [0, -16],
            });
          }
        } else {
          if (marker.getTooltip()) {
            marker.unbindTooltip();
          }
        }
      };

      map.on('zoomend', updateTooltip);
      updateTooltip();

      markersRef.current.push(marker);
    });
  }, [filteredSpots, mapReady]);

  const handleVisit = (spotId: string, event: React.MouseEvent, visitTime?: string) => {
    const spot = spots.find((s) => s.id === spotId);
    if (spot && !spot.visited) {
      visitSpot(spotId, visitTime);
      showXpPopup(event.clientX, event.clientY, spot.xp);
    }
    setSelectedSpot(null);
  };

  const filterButtons = [
    { type: 'all', label: '全部', icon: '🗺️' },
    { type: 'scenic', label: '景点', icon: '🏛️' },
    { type: 'food', label: '美食', icon: '🍜' },
    { type: 'culture', label: '文化', icon: '🎨' },
    { type: 'personal', label: '我的', icon: '🏠' },
  ];

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
        <p className="text-center text-gray-400 mb-6">
          探索北京的每一个角落 · 滚轮缩放查看更多细节
        </p>

        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {filterButtons.map((btn) => (
            <motion.button
              key={btn.type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterType(btn.type as typeof filterType)}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                filterType === btn.type
                  ? 'bg-gradient-to-r from-tutu-gold to-tutu-orange text-gray-900 glow-gold'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-tutu-gold'
              }`}
            >
              <span className="mr-1">{btn.icon}</span>
              {btn.label}
            </motion.button>
          ))}
        </div>

        <div className="card-game overflow-hidden relative">
          <div className="absolute top-3 left-3 z-[1000] bg-gray-900/80 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-gray-300 border border-gray-700">
            💡 滚轮缩放 · 拖拽平移 · 越放大越精细
          </div>

          {/* Leaflet 地图容器 */}
          <div
            ref={mapContainerRef}
            className="w-full"
            style={{ height: '600px', background: '#1a1f2e' }}
          />
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
