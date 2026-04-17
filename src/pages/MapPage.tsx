import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Product } from '../types';

// Leaflet 기본 마커 아이콘 경로 버그 수동 패치
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// 내 위치 마커 (파란 동그라미)
const userIcon = L.divIcon({
  html: `<div style="width:18px;height:18px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// 상점 마커 (노란 핀)
const shopIcon = L.divIcon({
  html: `<div style="width:32px;height:32px;background:#FFE400;border:2px solid #FF6B00;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.3);">
  </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [10, 32],
});

// 지도 중심 이동 컴포넌트
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

type ProductWithCoords = Product & { latitude?: number; longitude?: number };

// 가게별로 상품 그룹핑
type StoreGroup = {
  shopName: string;
  latitude: number;
  longitude: number;
  distance: string;
  products: ProductWithCoords[];
};

function groupByStore(products: ProductWithCoords[]): StoreGroup[] {
  const map = new Map<string, StoreGroup>();
  for (const p of products) {
    if (!p.latitude || !p.longitude) continue;
    const key = `${p.latitude},${p.longitude}`;
    if (!map.has(key)) {
      map.set(key, {
        shopName: p.shopName,
        latitude: p.latitude,
        longitude: p.longitude,
        distance: p.distance,
        products: [],
      });
    }
    map.get(key)!.products.push(p);
  }
  return Array.from(map.values());
}

export function MapPage({ onNavigate }: { onNavigate: (page: string, id?: number) => void }) {
  const [userLoc, setUserLoc] = useState<[number, number]>([37.556, 126.903]);
  const [products, setProducts] = useState<ProductWithCoords[]>([]);
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    const fetchProducts = (lat: number, lng: number) => {
      fetch(`http://localhost:8001/api/v1/products/?user_lat=${lat}&user_lng=${lng}`)
        .then(res => res.json())
        .then(data => {
          const mapped: ProductWithCoords[] = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            originalPrice: d.original_price,
            discountPrice: d.discount_price,
            remaining: d.remaining,
            totalQuantity: d.total_quantity,
            expiryMinutes: d.expiry_minutes,
            category: d.category,
            imageUrl: d.image_url || '',
            weight: d.weight,
            description: d.description,
            shopName: d.shop_name || '알 수 없는 가게',
            distance: d.distance || '거리 알 수 없음',
            latitude: d.latitude,
            longitude: d.longitude,
          }));
          setProducts(mapped);
        })
        .catch(console.error);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLoc([latitude, longitude]);
          fetchProducts(latitude, longitude);
          setIsLocating(false);
        },
        () => {
          fetchProducts(37.556, 126.903);
          setIsLocating(false);
        }
      );
    } else {
      fetchProducts(37.556, 126.903);
      setIsLocating(false);
    }
  }, []);

  const storeGroups = groupByStore(products);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '600px' }}>
      {/* 헤더 */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'white', padding: '14px 16px',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontWeight: 800, fontSize: '17px' }}>📍 근처 지도</span>
        {isLocating && <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>위치 확인 중...</span>}
      </div>

      {/* Leaflet 지도 */}
      <MapContainer
        center={userLoc}
        zoom={15}
        style={{ width: '100%', height: '100%', minHeight: '600px', paddingTop: '56px' }}
        scrollWheelZoom={true}
      >
        <RecenterMap center={userLoc} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 내 위치 마커 */}
        <Marker position={userLoc} icon={userIcon}>
          <Popup>
            <div style={{ fontWeight: 700, textAlign: 'center' }}>📱 현재 내 위치</div>
          </Popup>
        </Marker>

        {/* 가게별 마커 (상품 여러개를 하나의 핀으로 묶음) */}
        {storeGroups.map((store, idx) => (
          <Marker
            key={idx}
            position={[store.latitude, store.longitude]}
            icon={shopIcon}
          >
            <Popup minWidth={200} maxWidth={260}>
              <div style={{ fontFamily: 'sans-serif' }}>
                {/* 가게 헤더 */}
                <div style={{
                  fontWeight: 800, fontSize: '15px', color: '#FF6B00',
                  marginBottom: '4px', borderBottom: '1px solid #f0f0f0', paddingBottom: '6px'
                }}>
                  🏪 {store.shopName}
                </div>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>
                  📍 {store.distance} · 판매 중 {store.products.length}개
                </div>

                {/* 상품 목록 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                  {store.products.map((p) => {
                    const discountRate = Math.round((p.originalPrice - p.discountPrice) / p.originalPrice * 100);
                    return (
                      <div
                        key={p.id}
                        onClick={() => onNavigate('detail', p.id)}
                        style={{
                          border: '1px solid #f0f0f0', borderRadius: '10px',
                          padding: '8px 10px', cursor: 'pointer',
                          transition: 'background 0.15s',
                          background: '#fafafa',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#FFF9E6')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#fafafa')}
                      >
                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#222', marginBottom: '3px' }}>
                          {p.name} {p.weight ? `(${p.weight})` : ''}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11px', color: '#aaa', textDecoration: 'line-through' }}>
                            {p.originalPrice.toLocaleString()}원
                          </span>
                          <span style={{ fontSize: '11px', color: '#FF4500', fontWeight: 700 }}>
                            -{discountRate}%
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: '#111' }}>
                            {p.discountPrice.toLocaleString()}원
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                          잔여 {p.remaining}개 · 상세보기 →
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
