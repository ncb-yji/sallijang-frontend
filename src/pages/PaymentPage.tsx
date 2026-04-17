import React, { useState } from 'react';
import type { Product, CartEntry, OrderResult } from '../types';

/**
 * 결제 진행 페이지
 * - 단일 상품 예약(detail → payment): product + quantity props 사용
 * - 장바구니 주문(cart → payment): cartEntries + shopName props 사용
 * 두 경우 모두 토스페이 / 현장 결제 선택 후 Order Service에 주문을 생성합니다.
 */
interface PaymentPageProps {
  // 단일 상품 예약 경로
  product?: Product;
  quantity?: number;
  // 장바구니 주문 경로
  cartEntries?: CartEntry[];
  cartShopName?: string;
  // 공통
  buyerId?: number | null;
  pickupExpectedAt?: string;
  onBack: () => void;
  onComplete: (result: OrderResult) => void;
}

export function PaymentPage({ product, quantity = 1, cartEntries, cartShopName, buyerId, pickupExpectedAt, onBack, onComplete }: PaymentPageProps) {
  const [method, setMethod] = useState<'toss' | 'onsite'>('toss');
  const [isLoading, setIsLoading] = useState(false);

  // ── 장바구니 주문 모드 판별 ──────────────────────────
  const isCartMode = !!cartEntries && cartEntries.length > 0;

  // 장바구니 상품 목록 (CartEntry에 이미 product 데이터 포함)
  const resolvedCartItems: CartEntry[] = isCartMode ? cartEntries! : [];

  const totalPrice = isCartMode
    ? resolvedCartItems.reduce((sum, e) => sum + e.product.discountPrice * e.quantity, 0)
    : (product?.discountPrice ?? 0) * quantity;

  const finalPrice = totalPrice;
  const displayShopName = isCartMode ? cartShopName : product?.shopName;

  const handlePayment = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // 주문 payload 구성
      const orderItems = isCartMode
        ? resolvedCartItems.map(e => ({
            product_id: e.product.id,
            product_name: e.product.name,
            quantity: e.quantity,
            unit_price: e.product.discountPrice,
          }))
        : product
        ? [{
            product_id: product.id,
            product_name: product.name,
            quantity: quantity,
            unit_price: product.discountPrice,
          }]
        : [];

      const orderPayload = {
        buyer_id: buyerId ?? 0,
        store_id: isCartMode ? (resolvedCartItems[0]?.product.storeId ?? null) : (product?.storeId ?? null),
        store_name: displayShopName ?? '알 수 없는 가게',
        payment_method: method,
        total_price: finalPrice,
        pickup_expected_at: isCartMode ? null : (pickupExpectedAt || null),
        items: orderItems,
      };

      const response = await fetch('http://localhost:8002/api/v1/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error('주문 생성에 실패했습니다.');
      }

      const orderData = await response.json();

      onComplete({
        orderNumber: orderData.order_number,
        storeName: orderData.store_name,
        totalPrice: orderData.total_price,
        paymentMethod: orderData.payment_method,
      });
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('주문 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-full relative">
      {/* ── 헤더 ── */}
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0 shadow-sm">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center text-xl font-bold hover:bg-gray-100 rounded-full transition-colors">←</button>
        <span className="font-bold text-lg flex-1 text-center pr-9">결제하기</span>
      </header>

      <div className="p-4 flex flex-col gap-4 flex-1 pb-32">

        {/* ── 가게 정보 ── */}
        {displayShopName && (
          <div className="bg-[#FFE400]/15 border border-[#FFE400]/50 rounded-2xl px-5 py-3 flex items-center gap-3">
            <span className="text-2xl">🏪</span>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">주문 가게</p>
              <p className="font-extrabold text-[16px] text-gray-900">{displayShopName}</p>
            </div>
          </div>
        )}

        {/* ── 주문 상품 카드 ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-50">
            <span className="font-bold text-gray-500 text-sm">주문 상품</span>
          </div>

          {/* 장바구니 다중 상품 */}
          {isCartMode ? (
            <div className="flex flex-col divide-y divide-gray-50">
              {resolvedCartItems.map((e) => (
                <div key={e.product.id} className="flex gap-3 items-center px-5 py-4">
                  <div className="w-14 h-14 bg-[#FFFBE6] rounded-xl overflow-hidden shrink-0 border border-yellow-100">
                    <img src={e.product.imageUrl} alt={e.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[15px] text-gray-900 leading-snug">
                      {e.product.name}
                      {e.product.weight && <span className="text-xs text-gray-400 font-normal ml-1">({e.product.weight})</span>}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">{e.product.discountPrice.toLocaleString()}원 × {e.quantity}개</p>
                  </div>
                  <span className="font-extrabold text-[15px] text-gray-800">
                    {(e.product.discountPrice * e.quantity).toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
          ) : (
            /* 단일 상품 (detail → payment) */
            product && (
              <div className="flex gap-4 items-center px-5 py-4">
                <div className="w-16 h-16 bg-[#FFFBE6] rounded-xl overflow-hidden shrink-0 border border-yellow-100 shadow-sm">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-extrabold text-lg leading-tight">
                    {product.name}
                    {product.weight && <span className="text-sm text-gray-400 font-bold ml-1">({product.weight})</span>}
                  </p>
                  <p className="text-gray-600 font-bold mt-1 text-sm">
                    {product.discountPrice.toLocaleString()}원 × {quantity}개
                  </p>
                </div>
              </div>
            )
          )}

          {/* 금액 요약 */}
          <div className="px-5 py-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800">총 결제금액</span>
              <span className="text-2xl font-black text-gray-900">{finalPrice.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* ── 결제 수단 선택 ── */}
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-[16px] text-gray-800 px-1">결제 수단</h3>

          <button
            onClick={() => setMethod('toss')}
            className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${method === 'toss' ? 'border-[#0050FF] bg-[#0050FF]/5' : 'border-gray-200 bg-white'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0050FF] rounded-lg flex items-center justify-center text-white font-black text-xs">toss</div>
              <div className="flex flex-col items-start">
                <span className="font-bold text-[16px]">토스페이</span>
                <span className="text-xs text-gray-400 font-normal">간편 결제</span>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === 'toss' ? 'border-[#0050FF] bg-[#0050FF]' : 'border-gray-300'}`}>
              {method === 'toss' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
            </div>
          </button>

          <button
            onClick={() => setMethod('onsite')}
            className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${method === 'onsite' ? 'border-black bg-gray-50' : 'border-gray-200 bg-white'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xl">🏪</div>
              <div className="flex flex-col items-start">
                <span className="font-bold text-[16px]">현장 결제</span>
                <span className="text-xs text-gray-500 font-normal">픽업 시 가게에서 직접 결제</span>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === 'onsite' ? 'border-black bg-black' : 'border-gray-300'}`}>
              {method === 'onsite' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
            </div>
          </button>
        </div>
      </div>

      {/* ── 하단 결제 CTA 버튼 ── */}
      <div className="sticky bottom-0 w-full bg-white p-4 pb-6 border-t border-gray-100 drop-shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className={`w-full text-black font-extrabold text-lg py-4 rounded-xl active:scale-95 transition-transform shadow-sm ${isLoading ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#FFE400] hover:bg-yellow-400'}`}
        >
          {isLoading
            ? '처리 중...'
            : method === 'toss'
            ? `${finalPrice.toLocaleString()}원 토스로 결제하기`
            : '예약하고 현장에서 결제하기'}
        </button>
      </div>
    </div>
  );
}
