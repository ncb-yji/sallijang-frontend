import React, { useState, useEffect } from 'react';
import { ReservationCard } from '../components/SharedComponents';

interface OrderItem {
  id: number;
  product_id: number | null;
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: number;
  order_number: string;
  buyer_id: number;
  store_id: number | null;
  store_name: string;
  status: string;
  payment_method: string;
  total_price: number;
  created_at: string;
  items: OrderItem[];
}

/**
 * 리뷰를 작성할 수 있는 내역 페이지 모음 컴포넌트입니다.
 * 완료된 주문 내역을 Order Service(8002)에서 가져와 보여줍니다.
 */
export function HistoryPage({ onNavigate, buyerId }: {
  onNavigate: (page: any) => void;
  buyerId?: number | null;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingItem, setReviewingItem] = useState<{ name: string; shop: string; quantity?: number } | null>(null);
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        if (!buyerId) {
          setOrders([]);
          return;
        }
        const res = await fetch(
          `http://localhost:8002/api/v1/orders/?buyer_id=${buyerId}&status=completed`
        );
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Failed to fetch order history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [buyerId]);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffD = Math.floor(diffMs / 86400000);
    if (diffD === 0) return '오늘';
    if (diffD === 1) return '어제';
    return `${diffD}일 전`;
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`리뷰 (별점: ${rating}점)가 성공적으로 등록되었습니다. 환경 보호에 동참해주셔서 감사합니다! 🌍`);
    setReviewingItem(null);
    setRating(5);
    onNavigate('reviews');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shadow-sm shrink-0">
        <button onClick={() => onNavigate('my')} className="w-8 h-8 flex items-center text-xl font-bold">←</button>
        <span className="font-bold text-lg flex-1 text-center pr-8">주문 내역</span>
      </header>

      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="text-4xl animate-spin">⏳</span>
            <span className="font-bold">주문 내역 불러오는 중...</span>
          </div>
        ) : orders.length > 0 ? (
          orders.map(order => (
            <ReservationCard
              key={order.id}
              status="완료"
              name={order.items.map(i => `${i.product_name} x${i.quantity}`).join(', ')}
              shop={order.store_name}
              time={formatTime(order.created_at)}
              id={`#${order.order_number}`}
              imageUrl=""
              onReview={() => setReviewingItem({
                name: order.items.map(i => i.product_name).join(', '),
                shop: order.store_name,
                quantity: order.items.reduce((s, i) => s + i.quantity, 0),
              })}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="text-4xl mb-2">📭</span>
            <span className="font-bold">주문 내역이 없어요!</span>
            <span className="text-xs">살리장에서 첫 주문을 해보세요.</span>
          </div>
        )}
      </div>

      {/* Review Modal UI */}
      {reviewingItem && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 flex flex-col gap-4 animate-slide-up pb-10 sm:pb-6 shadow-2xl max-h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-black">리뷰 쓰기</h2>
              <button onClick={() => setReviewingItem(null)} className="text-gray-400 font-bold text-2xl px-2">✕</button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-1 border border-gray-100 flex items-center gap-3">
              <div className="text-3xl">🛍️</div>
              <div>
                <div className="text-xs text-gray-500 font-bold">{reviewingItem.shop}</div>
                <div className="font-bold text-gray-900">
                  {reviewingItem.name}
                  {reviewingItem.quantity && <span className="text-sm text-blue-600 font-bold ml-1">x{reviewingItem.quantity}</span>}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitReview} className="flex flex-col gap-5">
              <div className="flex flex-col items-center gap-2 mt-2">
                <span className="text-sm font-bold text-gray-700">이 상품 어떠셨나요?</span>
                <div className="flex gap-2 text-4xl text-gray-200">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      className={`cursor-pointer active:scale-95 transition-all ${star <= rating ? 'text-[#FFE400] drop-shadow-md grayscale-0 opacity-100' : 'grayscale opacity-30 select-none'}`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>

              <textarea
                placeholder="식재료의 신선도, 맛, 양 등에 대해 자유롭게 적어주세요!"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] outline-none h-32 resize-none text-sm leading-relaxed"
                required
              ></textarea>

              <button type="submit" className="w-full bg-[#FFE400] text-black font-extrabold text-lg py-4 rounded-xl hover:bg-yellow-400 active:scale-95 transition-transform shadow-sm">
                리뷰 등록하기
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
