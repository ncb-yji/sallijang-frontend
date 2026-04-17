import React from 'react';
import type { Page } from '../types';

// ==========================================
// 하단 탭 바 컴포넌트
// ==========================================
export function BottomTabBar({ currentPage, onNavigate, userRole, isPcVersion }: { currentPage: Page, onNavigate: (page: Page) => void, userRole: 'USER' | 'SELLER', isPcVersion?: boolean }) {
  return (
    <nav className={`absolute bottom-0 w-full ${isPcVersion ? 'max-w-[1200px]' : 'max-w-[390px]'} bg-white border-t border-gray-100 flex items-center justify-around h-16 px-2 drop-shadow-[0_-4px_10px_rgba(0,0,0,0.05)] transition-all duration-300`}>
      <TabButton icon="🏠" label="홈" isActive={currentPage === 'home' || currentPage === 'seller_home'} onClick={() => onNavigate(userRole === 'SELLER' ? 'seller_home' : 'home')} />
      {userRole === 'SELLER' ? (
        <TabButton icon="🛍️" label="판매" isActive={currentPage === 'sales'} onClick={() => onNavigate('sales')} />
      ) : (
        <TabButton icon="🗺️" label="근처 지도" isActive={currentPage === 'map'} onClick={() => onNavigate('map')} />
      )}
      
      {/* 중앙 플로팅 버튼 (판매자: 등록, 일반: 찜) */}
      {userRole === 'SELLER' ? (
        <div className="relative -top-5 flex flex-col items-center justify-center">
          <button onClick={() => onNavigate('register')} className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-white ${currentPage === 'register' ? 'bg-black text-[#FFE400]' : 'bg-[#FFE400] text-black'}`}>
            ➕
          </button>
          <span className={`text-[10px] font-bold mt-1 ${currentPage === 'register' ? 'text-black' : 'text-gray-500'}`}>등록</span>
        </div>
      ) : (
        <TabButton icon="❤️" label="찜" isActive={currentPage === 'wishlist'} onClick={() => onNavigate('wishlist')} />
      )}

      <TabButton icon="🧾" label="예약" isActive={currentPage === 'reservations' || currentPage === 'complete'} onClick={() => onNavigate('reservations')} />
      <TabButton icon="👤" label="마이" isActive={currentPage === 'my' || currentPage === 'customer_center'} onClick={() => onNavigate('my')} />
    </nav>
  )
}

// 탭 버튼 단위 컴포넌트
export function TabButton({ icon, label, isActive, onClick }: { icon: string, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 w-16 h-full ${isActive ? 'text-black' : 'text-gray-400'}`}>
      <span className={`text-xl ${isActive ? 'opacity-100' : 'opacity-60 grayscale'}`}>{icon}</span>
      <span className={`text-[10px] font-bold ${isActive ? 'text-black' : 'text-gray-500'}`}>{label}</span>
    </button>
  )
}

// ==========================================
// 예약 아이템 카드 컴포넌트
// ==========================================
export function ReservationCard({status, name, shop, time, id, imageUrl, onCancel, onReview}: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
      <div className="w-20 h-20 bg-[#FFFBE6] rounded-xl shrink-0 overflow-hidden border border-yellow-100">
        {imageUrl && <img src={imageUrl} alt={name} className="w-full h-full object-cover" />}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <div className="font-bold line-clamp-1">{name}</div>
          <div className={`text-xs px-2 py-0.5 rounded-full font-bold shrink-0 ${status === '대기' ? 'bg-[#FFE400] text-black' : 'bg-gray-200 text-gray-600'}`}>
            {status === '대기' ? '픽업 대기중' : '픽업 완료'}
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-1">{shop}</div>
        <div className="text-sm font-bold text-blue-600 mb-2">{time} </div>
        <div className="text-gray-400 font-normal ml-1">주문 번호: {id}</div>
        <div className="mt-auto">
          {status === '대기' ? (
            <button onClick={onCancel} className="w-full py-1.5 border border-red-200 text-red-500 font-bold rounded-lg text-xs hover:bg-red-50 transition-colors">예약 취소</button>
          ) : (
            <button onClick={onReview} className="w-full py-1.5 border border-gray-200 font-bold rounded-lg text-xs hover:bg-gray-50 transition-colors">리뷰 쓰기</button>
          )}
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 마이페이지 메뉴 리스트 컴포넌트
// ==========================================
export function MenuList({ title, items }: { title: string, items: Array<{label: string, icon: string, value?: string, textClass?: string, onClick?: () => void}> }) {
  return (
    <div className="flex flex-col">
      <h2 className="px-5 py-3 font-bold text-gray-500 text-xs">{title}</h2>
      <ul className="flex flex-col">
        {items.map((item, i) => (
          <li key={i} onClick={item.onClick} className="flex justify-between items-center px-5 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors border-t border-gray-50 first:border-t-0">
            <div className="flex flex-row items-center justify-start gap-4">
              <span className="text-xl w-6 flex justify-center items-center">{item.icon}</span>
              <span className={`font-semibold ${item.textClass || 'text-gray-800'}`}>{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.value && <span className="text-xs font-bold text-[#FFE400] bg-black px-2 py-0.5 rounded-full">{item.value}</span>}
              {!item.value && <span className="text-gray-300 font-bold">❯</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ==========================================
// PC 환경 글로벌 네비게이션(GNB) 컴포넌트
// ==========================================
export function PcGnb({ currentPage, onNavigate, userRole, onSetPcVersion }: { currentPage: Page, onNavigate: (page: Page) => void, userRole: 'USER' | 'SELLER', onSetPcVersion: (v: boolean) => void }) {
  return (
    <header className="fixed top-0 w-full bg-white border-b border-gray-200 z-50 shadow-sm h-16">
      <div className="max-w-[1200px] w-full mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(userRole === 'SELLER' ? 'seller_home' : 'home')}>
           <span className="text-2xl">🛍️</span>
           <span className="font-black text-2xl text-gray-900 tracking-tight">살리장</span>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="flex gap-8 items-center h-full font-bold text-gray-700">
          <button onClick={() => onNavigate(userRole === 'SELLER' ? 'seller_home' : 'home')} className={`h-full border-b-4 ${currentPage === 'home' || currentPage === 'seller_home' ? 'border-[#FFE400] text-black' : 'border-transparent hover:text-black hover:border-gray-200'} transition-all`}>홈</button>
          
          {userRole === 'SELLER' ? (
            <>
              <button onClick={() => onNavigate('sales')} className={`h-full border-b-4 ${currentPage === 'sales' ? 'border-[#FFE400] text-black' : 'border-transparent hover:text-black hover:border-gray-200'} transition-all`}>판매</button>
              <button onClick={() => onNavigate('register')} className={`h-full border-b-4 ${currentPage === 'register' ? 'border-[#FFE400] text-black' : 'border-transparent hover:text-black hover:border-gray-200'} transition-all`}>등록</button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('map')} className={`h-full border-b-4 ${currentPage === 'map' ? 'border-[#FFE400] text-black' : 'border-transparent hover:text-black hover:border-gray-200'} transition-all`}>지도</button>
              <button onClick={() => onNavigate('wishlist')} className={`h-full border-b-4 ${currentPage === 'wishlist' ? 'border-[#FFE400] text-black' : 'border-transparent hover:text-black hover:border-gray-200'} transition-all`}>찜</button>
            </>
          )}

          <button onClick={() => onNavigate('reservations')} className={`h-full border-b-4 ${currentPage === 'reservations' ? 'border-[#FFE400] text-black' : 'border-transparent hover:text-black hover:border-gray-200'} transition-all`}>예약</button>
          <button onClick={() => onNavigate('my')} className={`h-full border-b-4 ${currentPage === 'my' || currentPage === 'customer_center' ? 'border-[#FFE400] text-black' : 'border-transparent hover:text-black hover:border-gray-200'} transition-all`}>마이</button>
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-4">
           {currentPage !== 'login' && userRole !== 'SELLER' && (
             <button onClick={() => onNavigate('cart')} className="relative p-2 text-xl hover:scale-110 transition-transform">
               <span>🛒</span>
               <div className="absolute top-1 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
             </button>
           )}
           {currentPage !== 'login' && (
             <button onClick={() => onSetPcVersion(false)} className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
               📱 모바일 전환
             </button>
           )}
           <div className="font-bold text-sm text-gray-800 cursor-pointer hover:text-black transition-colors" onClick={() => onNavigate('my')}>
             {userRole === 'SELLER' ? '👨‍🍳 김살리 사장님' : '😎 마포구 식객님'}
           </div>
        </div>
      </div>
    </header>
  );
}
