import React from 'react';
import type { Page } from '../types';

/**
 * 리뷰 목록 컴포넌트 페이지.
 * 유저와 판매자 역할에 따라 내가 쓴 리뷰인지 상점에 달린 리뷰인지 분기 처리합니다.
 */
export function ReviewsPage({ onNavigate, userRole }: { onNavigate: (page: Page) => void, userRole?: 'USER' | 'SELLER' }) {
  if (userRole === 'SELLER') {
    return (
      <div className="flex flex-col bg-gray-50 min-h-full pb-20">
        <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0 shadow-sm">
          <button onClick={() => onNavigate('my')} className="w-8 h-8 flex items-center text-xl font-bold">←</button>
          <h1 className="font-bold text-lg text-center flex-1 pr-8">고객 리뷰 관리</h1>
        </header>
        <div className="p-4 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="font-extrabold">마포구 식객님</div>
                   <div className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded font-bold">단골</div>
                </div>
                <div className="text-yellow-500 font-bold text-sm">⭐⭐⭐⭐⭐ 5.0</div>
             </div>
             <div className="text-xs text-gray-400 font-bold">국내산 삼겹살 (수량: 2개) 외 2건 · 오늘</div>
             <p className="text-[14px] text-gray-700 leading-relaxed font-semibold mt-1">
                항상 고기가 너무 신선하고 맛있어요! 마감 할인으로 저렴하게 구매해서 더 좋습니다. 사장님도 친절하세요ㅎㅎ 번창하세요!
             </p>
             <button className="mt-2 w-full py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-600 text-sm hover:bg-gray-100 active:scale-95 transition-all">답글 달기</button>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="font-extrabold">지구방위대님</div>
                </div>
                <div className="text-yellow-500 font-bold text-sm">⭐⭐⭐⭐ 4.0</div>
             </div>
             <div className="text-xs text-gray-400 font-bold">한우 불고기용 (수량: 1개) · 어제</div>
             <p className="text-[14px] text-gray-700 leading-relaxed font-semibold mt-1">
                고기는 맛있었는데 양념을 따로 팔지 않아서 조금 아쉬웠습니다. 그래도 고기 질 자체는 아주 좋아요.
             </p>
             <button className="mt-2 w-full py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-600 text-sm hover:bg-gray-100 active:scale-95 transition-all">답글 달기</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50 min-h-full pb-20">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0 shadow-sm">
        <button onClick={() => onNavigate('my')} className="w-8 h-8 flex items-center text-xl font-bold">←</button>
        <h1 className="font-bold text-lg text-center flex-1 pr-8">내가 작성한 리뷰</h1>
      </header>
      <div className="p-4 flex flex-col gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
           <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
              <div className="w-10 h-10 bg-[#FFFBE6] rounded-full flex items-center justify-center text-xl border border-yellow-100">🥩</div>
              <div className="flex flex-col">
                 <div className="font-extrabold text-[15px]">망원 정육점 ❯</div>
                 <div className="text-gray-400 text-xs font-bold mt-0.5">국내산 삼겹살 (수량: 2개) 외 2건</div>
              </div>
           </div>
           <div className="flex items-center justify-between mt-1">
              <div className="text-yellow-500 font-bold text-lg tracking-widest">⭐⭐⭐⭐⭐</div>
              <div className="text-gray-400 text-xs font-bold">오늘</div>
           </div>
           <p className="text-[14px] text-gray-700 leading-relaxed font-bold">
              항상 고기가 너무 신선하고 맛있어요! 마감 할인으로 저렴하게 구매해서 더 좋습니다. 사장님도 친절하세요ㅎㅎ 번창하세요!
           </p>
           <button className="mt-1 flex items-center gap-1.5 text-red-500 text-sm font-bold w-fit bg-red-50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform">
             <span>🗑️</span> 삭제
           </button>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
           <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
              <div className="w-10 h-10 bg-[#FFFBE6] rounded-full flex items-center justify-center text-xl border border-yellow-100">🥐</div>
              <div className="flex flex-col">
                 <div className="font-extrabold text-[15px]">동네 베이커리 ❯</div>
                 <div className="text-gray-400 text-xs font-bold mt-0.5">오늘 구운 크루아상 (수량: 5개)</div>
              </div>
           </div>
           <div className="flex items-center justify-between mt-1">
              <div className="text-yellow-500 font-bold text-lg tracking-widest">⭐⭐⭐⭐<span className="text-gray-200">⭐</span></div>
              <div className="text-gray-400 text-xs font-bold">3일 전</div>
           </div>
           <p className="text-[14px] text-gray-700 leading-relaxed font-bold">
              아침에 구운건데 밤에 먹어도 바삭바삭해요! 다만 오늘 마감 할인이 제가 원하던 빵이 아니라서 조금 아쉬웠습니다.
           </p>
           <button className="mt-1 flex items-center gap-1.5 text-red-500 text-sm font-bold w-fit bg-red-50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform">
             <span>🗑️</span> 삭제
           </button>
        </div>
      </div>
    </div>
  );
}
