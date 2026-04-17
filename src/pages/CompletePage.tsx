import React, { useState, useEffect } from 'react';
import type { Page, Product, OrderResult } from '../types';

/**
 * 결제 혹은 예약 완료 후 표시되는 축하 및 안내 페이지입니다.
 * orderResult가 있으면 실제 주문 데이터를, 없으면 product 정보를 fallback으로 사용합니다.
 */
export function CompletePage({ onNavigate, product, orderResult }: {
  onNavigate: (page: Page) => void;
  product: Product;
  orderResult?: OrderResult | null;
}) {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowCheck(true), 100);
  }, []);

  const displayOrderNumber = orderResult?.orderNumber ?? '#PK-00000000-0000';
  const displayStoreName = orderResult?.storeName ?? product?.shopName ?? '가게';

  return (
    <div className="flex flex-col items-center p-6 h-full bg-white pt-20">
      {/* Animated Check */}
      <div className={`w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-6 transition-all duration-700 ${showCheck ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <span className="text-white text-5xl">✓</span>
      </div>

      <h1 className="text-3xl font-black mb-8">예약 완료!</h1>

      {/* Info Card */}
      <div className="w-full bg-[#FFE400]/20 border border-[#FFE400] rounded-2xl p-5 flex flex-col gap-3 mb-8">
        <div className="font-extrabold text-lg mb-2 flex items-center justify-between">
          <span>
            {product?.name}
            {product?.weight && <span className="text-sm font-bold text-yellow-800 ml-1">({product.weight})</span>}
          </span>
          {product?.rating && <span className="text-sm font-bold text-yellow-700 bg-yellow-100/50 px-2 py-0.5 rounded-full">⭐ {product.rating}</span>}
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-bold text-gray-600">픽업 장소</span>
          <span className="font-bold">{displayStoreName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-bold text-gray-600">주소</span>
          <span className="font-bold">서울 마포구 망원동 123-45</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-bold text-gray-600">픽업 가능 시간</span>
          <span className="font-bold text-blue-600">오늘 오후 6시 ~ 8시</span>
        </div>
        <div className="border-t border-[#FFE400]/50 my-2"></div>
        <div className="flex justify-between text-xs">
          <span className="font-bold text-gray-600">예약 번호</span>
          <span className="font-mono font-bold">#{displayOrderNumber}</span>
        </div>
        {orderResult && (
          <div className="flex justify-between text-xs">
            <span className="font-bold text-gray-600">결제 방법</span>
            <span className="font-bold">{orderResult.paymentMethod === 'toss' ? '토스페이' : '현장 결제'}</span>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col gap-3">
        <button className="w-full bg-[#FFE400] text-black font-bold py-4 rounded-xl flex justify-center items-center gap-2">
          <span className="text-xl">💬</span> 카카오톡으로 공유
        </button>
        <button onClick={() => onNavigate('reservations')} className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-xl">
          예약 목록 보기
        </button>
      </div>
    </div>
  )
}
