import { useState, useRef, useEffect, type MouseEvent } from 'react';
import { formatCountdown } from '../utils/timeUtils';
import type { Product } from '../types';

/**
 * 앱의 메인 홈 피드 페이지입니다.
 * 고객이 구매 가능한 마감 임박 상품들을 카테고리별로 볼 수 있습니다.
 * 상단 알림 벨 클릭 시 픽업 알림 드로어가 슬라이드됩니다.
 */

// 픽업 알림 더미 데이터
const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    type: 'urgent' as const,
    shopName: '망원 정육점',
    productName: '국내산 삼겹살',
    message: '픽업까지 15분 남았어요! 🔥',
    sub: '오늘 오후 6시까지 픽업 완료 필요',
    time: '방금 전',
    isRead: false,
  },
  {
    id: 2,
    type: 'warning' as const,
    shopName: '동네 베이커리',
    productName: '오늘 구운 크루아상',
    message: '픽업까지 30분 남았어요!',
    sub: '오늘 오후 6시 30분까지 픽업',
    time: '5분 전',
    isRead: false,
  },
  {
    id: 3,
    type: 'normal' as const,
    shopName: '초록 채소가게',
    productName: '유기농 시금치',
    message: '픽업까지 50분 남았어요',
    sub: '오늘 오후 7시까지 픽업 가능',
    time: '10분 전',
    isRead: true,
  },
  {
    id: 4,
    type: 'info' as const,
    shopName: '수산 시장',
    productName: '갈치 2마리',
    message: '예약이 확정되었어요 ✅',
    sub: '오늘 오후 8시까지 픽업 가능',
    time: '1시간 전',
    isRead: true,
  },
];

type NotifType = 'urgent' | 'warning' | 'normal' | 'info';

const NOTIF_STYLES: Record<NotifType, { bg: string; icon: string; badge: string }> = {
  urgent: { bg: 'bg-red-50 border-red-100',   icon: '🚨', badge: 'bg-red-500 text-white' },
  warning:{ bg: 'bg-[#FFF8E1] border-yellow-100', icon: '⏰', badge: 'bg-[#FFE400] text-black' },
  normal: { bg: 'bg-gray-50 border-gray-100',  icon: '🔔', badge: 'bg-gray-200 text-gray-600' },
  info:   { bg: 'bg-blue-50 border-blue-100',  icon: '✅', badge: 'bg-blue-500 text-white' },
};

export function HomePage({ onNavigate, onNavigateToCart, cartCount, now, isPcVersion }: {
  onNavigate: (id: number) => void;
  onNavigateToCart?: () => void;
  cartCount?: number;
  now: Date;
  isPcVersion?: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const categories = ["전체", "🥩 정육", "🥬 채소", "🐟 수산", "🍱 반찬", "🥐 베이커리"];

  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = (e: MouseEvent) => {
    dragState.current.isDown = true;
    if (scrollRef.current) {
      dragState.current.startX = e.pageX - scrollRef.current.offsetLeft;
      dragState.current.scrollLeft = scrollRef.current.scrollLeft;
    }
  };
  const onMouseLeaveOrUp = () => { dragState.current.isDown = false; };
  const onMouseMove = (e: MouseEvent) => {
    if (!dragState.current.isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));

  const [products, setProducts] = useState<Product[]>([]);
  const [_userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    // 1. 위치 정보 획득 시도 (거부 시 기본 위치인 '망원역' 주변 지정)
    const fetchWithLocation = (lat?: number, lng?: number) => {
       const url = (lat !== undefined && lng !== undefined) 
           ? `http://localhost:8001/api/v1/products/?user_lat=${lat}&user_lng=${lng}`
           : `http://localhost:8001/api/v1/products/`;

       fetch(url)
         .then(res => res.json())
         .then(data => {
               const mapped: Product[] = data
                 .filter((d: any) => d.remaining > 0)
                 .map((d: any) => ({
                   id: d.id,
                   name: d.name,
                   originalPrice: d.original_price,
                   discountPrice: d.discount_price,
                   remaining: d.remaining,
                   totalQuantity: d.total_quantity,
                   expiryMinutes: d.expiry_minutes,
                   category: d.category,
                   imageUrl: d.image_url || "https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=600",
                   weight: d.weight,
                   description: d.description,
                   shopName: d.shop_name || "알 수 없는 가게",
                   distance: d.distance || "500m",
                   storeId: d.store_id,
                   pickupDeadline: d.pickup_deadline,
                 }));
               setProducts(mapped);
         })
         .catch(console.error);
    };

    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
         (pos) => {
            setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            fetchWithLocation(pos.coords.latitude, pos.coords.longitude);
         },
         (err) => {
            console.warn("Geolocation API Error:", err);
            // 권한 거부 시 임의의 망원동 좌표로 폴백
            fetchWithLocation(37.556, 126.903);
         }
       );
    } else {
       fetchWithLocation();
    }
  }, []);

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === "전체" || selectedCategory.includes(p.category) || p.category.includes(selectedCategory.replace(/[^가-힣]/g, ''));
    const matchSearch = p.name.includes(searchQuery) || p.shopName.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  return (
    <div className={`flex flex-col min-h-full ${isPcVersion ? 'bg-transparent' : 'bg-white'} relative pb-6`}>

      {/* ── 모바일 헤더 ── */}
      {!isPcVersion && (
        <header className="bg-[#FFE400]/90 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-20 shrink-0 border-b border-yellow-300/50 min-h-[64px]">
          {!isSearching ? (
            <>
              <div className="flex items-center gap-2 font-bold text-lg w-full">
                <span>📍</span> 서울 마포구 망원동 ▾
              </div>
              <div className="flex items-center gap-4 text-xl shrink-0">
                <button onClick={() => setIsSearching(true)} className="active:scale-95 transition-transform hover:scale-110">🔍</button>
                {/* 장바구니 */}
                <div className="relative cursor-pointer" onClick={onNavigateToCart}>
                  <span>🛒</span>
                  {(cartCount ?? 0) > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 rounded-full border border-[#FFFBE6] flex items-center justify-center">
                      <span className="text-[9px] font-black text-white leading-none px-0.5">{cartCount}</span>
                    </div>
                  )}
                </div>
                {/* 알림 벨 */}
                <div className="relative cursor-pointer" onClick={() => setShowNotif(true)}>
                  <span>🔔</span>
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 rounded-full border border-[#FFE400] flex items-center justify-center">
                      <span className="text-[9px] font-black text-white leading-none px-0.5">{unreadCount}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 w-full">
              <button onClick={() => { setIsSearching(false); setSearchQuery(""); }} className="font-bold text-xl active:scale-95 transition-transform">←</button>
              <input
                type="text"
                placeholder="상품명 또는 가게명 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-white border border-yellow-500/50 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:ring-4 focus:ring-yellow-500/30 transition-all placeholder-gray-400 shadow-inner"
                autoFocus
              />
            </div>
          )}
        </header>
      )}

      {/* ── 알림 드로어 (오버레이) ── */}
      {showNotif && (
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* 반투명 배경 */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowNotif(false)}
          />
          {/* 드로어 패널 (아래에서 슬라이드) */}
          <div className="absolute bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh]"
            style={{ animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)' }}
          >
            {/* 드로어 핸들 */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* 드로어 헤더 */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-[18px] text-gray-900">알림</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[13px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    모두 읽음
                  </button>
                )}
                <button
                  onClick={() => setShowNotif(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 알림 목록 */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5 pb-8">
              {notifications.map(notif => {
                const style = NOTIF_STYLES[notif.type];
                return (
                  <button
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={`w-full text-left border rounded-2xl px-4 py-3.5 flex gap-3 items-start transition-all hover:opacity-90 active:scale-[0.98] ${style.bg} ${notif.isRead ? 'opacity-60' : ''}`}
                  >
                    {/* 아이콘 */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${style.badge}`}>
                      {style.icon}
                    </div>
                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5 gap-2">
                        <span className="font-extrabold text-[14px] text-gray-900 leading-snug">{notif.message}</span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[12px] text-gray-600 font-semibold truncate">
                        {notif.shopName} · {notif.productName}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{notif.sub}</p>
                    </div>
                  </button>
                );
              })}

              {notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
                  <span className="text-5xl">🔔</span>
                  <p className="font-bold">아직 알림이 없어요</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 특가 배너 ── */}
      {isPcVersion ? (
        <div className="bg-gradient-to-r from-[#FFE400] to-[#FFD500] rounded-3xl p-10 flex justify-between items-center mb-8 shadow-sm relative overflow-hidden border border-yellow-300/50 mt-4">
           <div className="absolute right-0 top-0 w-80 h-80 bg-white/30 rounded-full blur-[50px] -translate-y-20 translate-x-20"></div>
           <div className="relative z-10">
             <h2 className="text-4xl font-black mb-4 tracking-tight">🔥 지금 이 순간 특가!</h2>
             <div className="text-xl font-bold flex items-center gap-4">
                마감까지 남은 시간
                <span className="bg-black text-[#FFE400] px-4 py-2 rounded-xl shadow-lg shadow-black/10 text-2xl tracking-wider font-mono animate-pulse-soft">
                  {formatCountdown(new Date(now.getTime() + 60 * 60 * 1000 - (now.getTime() % (60 * 60 * 1000))), now)}
                </span>
             </div>
           </div>
           <div className="text-8xl relative z-10 animate-float drop-shadow-xl select-none hidden md:block">🏃‍♂️💨</div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#FFE400] to-[#FFD500] px-4 py-4 shrink-0 relative overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/30 rounded-full blur-[30px] -translate-y-10 translate-x-10"></div>
          <h2 className="text-[26px] font-black mb-1.5 relative z-10 tracking-tight">🔥 지금 이 순간만!</h2>
          <div className="flex items-center gap-2 font-bold relative z-10">
            <span className="opacity-90">마감까지 남은 시간</span>
            <span className="bg-black text-[#FFE400] px-3 py-1 rounded shadow-lg shadow-black/10 text-lg tracking-wider font-mono animate-pulse-soft">
              {formatCountdown(new Date(now.getTime() + 60 * 60 * 1000 - (now.getTime() % (60 * 60 * 1000))), now)}
            </span>
          </div>
        </div>
      )}

      {/* ── 카테고리 탭 ── */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeaveOrUp}
        onMouseUp={onMouseLeaveOrUp}
        onMouseMove={onMouseMove}
        className={isPcVersion ? "flex gap-4 mb-4 select-none" : "flex overflow-x-auto gap-2 pl-4 py-4 border-b border-gray-100 shrink-0 hide-scrollbar cursor-grab active:cursor-grabbing select-none"}
      >
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(cat)}
            className={
              isPcVersion
                ? `shrink-0 whitespace-nowrap px-6 py-3 rounded-full font-bold text-lg transition-colors shadow-sm ${selectedCategory === cat ? 'bg-black text-[#FFE400]' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`
                : `shrink-0 whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-colors ${selectedCategory === cat ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
            }
          >
            {cat}
          </button>
        ))}
        {!isPcVersion && <div className="w-4 shrink-0"></div>}
      </div>

      {/* ── 상품 그리드 ── */}
      <div className={`p-4 grid ${isPcVersion ? 'grid-cols-4 md:grid-cols-5 lg:grid-cols-6' : 'grid-cols-2'} gap-x-4 gap-y-6`}>
        {filteredProducts.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="text-4xl mb-2">😢</span>
            <span className="font-bold">검색 결과가 없어요!</span>
            <span className="text-sm">다른 키워드로 검색해보세요.</span>
          </div>
        )}
        {filteredProducts.map((product, i) => {
          const discountRate = Math.round((product.originalPrice - product.discountPrice) / product.originalPrice * 100);
          const isUrgent = product.expiryMinutes <= 30;
          const stockRatio = product.remaining / product.totalQuantity;

          return (
            <div
              key={product.id}
              style={{ animationDelay: `${i * 50}ms` }}
              className={`cursor-pointer group flex flex-col gap-2 animate-slide-up opacity-0 ${isPcVersion ? 'bg-white p-4 rounded-3xl shadow-sm border border-gray-100' : ''}`}
              onClick={() => onNavigate(product.id)}
            >
              <div className={`relative aspect-square bg-[#FFFBE6] rounded-[1.25rem] overflow-hidden shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 border border-yellow-100 ${isPcVersion ? 'mb-2' : ''}`}>
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-2 left-2 bg-red-500 text-white font-black text-xs px-2 py-1 rounded-md shadow">
                  -{discountRate}%
                </div>
                <div className={`absolute top-2 right-2 font-bold text-xs px-2 py-1 rounded-md shadow ${isUrgent ? 'bg-red-500 text-white' : 'bg-white text-gray-800'}`}>
                  ⏰ {product.expiryMinutes <= 60 ? `${product.expiryMinutes}분` : `${Math.floor(product.expiryMinutes/60)}시간+`}
                </div>
              </div>
              <div>
                <div className="flex items-center text-xs text-gray-500 font-semibold mb-1 truncate">
                  {product.shopName} · {product.distance}
                  {product.rating && <span className="ml-1 text-yellow-500">⭐<span className="text-gray-500">{product.rating}</span></span>}
                </div>
                <div className="font-bold text-sm mb-1 leading-tight line-clamp-2">
                  {product.name}
                  {product.weight && <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded ml-1 truncate">{product.weight}</span>}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-gray-400 line-through text-xs">{product.originalPrice.toLocaleString()}원</span>
                  <span className="font-extrabold text-lg">{product.discountPrice.toLocaleString()}원</span>
                </div>
                {/* 재고 바 */}
                <div className="w-full bg-gray-200 h-1.5 rounded-full mb-1">
                  <div className={`h-full rounded-full ${stockRatio <= 0.3 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${stockRatio * 100}%`}}></div>
                </div>
                <div className="text-[10px] text-gray-500 font-bold">{product.remaining}개 남음</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 드로어 슬라이드업 애니메이션 */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
