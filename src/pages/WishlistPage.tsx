import React from 'react';

/**
 * 찜한 가게 리스트를 보여주는 페이지.
 */
export function WishlistPage() {
  return (
    <div className="flex flex-col bg-gray-50 min-h-full">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0 shadow-sm">
        <h1 className="font-bold text-lg text-center w-full">찜한 가게</h1>
      </header>
      <div className="flex-1 p-4 flex flex-col gap-3">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-[#FFE400] transition-colors">
            <div className="w-14 h-14 bg-[#FFFBE6] rounded-full flex items-center justify-center text-3xl border border-yellow-100">🥩</div>
            <div className="flex-1">
                <div className="font-bold text-lg">망원 정육점</div>
                <div className="text-gray-500 text-xs mt-0.5">서울 마포구 망원동 123</div>
            </div>
            <button className="text-red-500 text-2xl font-bold p-2 active:scale-95 transition-transform drop-shadow-sm">❤️</button>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-[#FFE400] transition-colors">
            <div className="w-14 h-14 bg-[#FFFBE6] rounded-full flex items-center justify-center text-3xl border border-yellow-100">🥐</div>
            <div className="flex-1">
                <div className="font-bold text-lg">동네 베이커리</div>
                <div className="text-gray-500 text-xs mt-0.5">서울 마포구 망원동 456</div>
            </div>
            <button className="text-red-500 text-2xl font-bold p-2 active:scale-95 transition-transform drop-shadow-sm">❤️</button>
        </div>
      </div>
    </div>
  );
}
