import { useState, useEffect } from 'react';
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
  pickup_expected_at: string | null;
  created_at: string;
  items: OrderItem[];
}

/**
 * 픽업 예약 리스트를 볼 수 있는 페이지.
 * 유저 역할과 판매자 역할에 따라 들어온 주문 스택을 보여줍니다.
 * Order Service(8002)에서 실제 주문 데이터를 가져옵니다.
 */
export function ReservationsPage({
  userRole,
  buyerId,
  storeId,
}: {
  userRole?: 'USER' | 'SELLER';
  buyerId?: number | null;
  storeId?: number | null;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let url = 'http://localhost:8002/api/v1/orders/?status=pending';
      if (userRole === 'SELLER' && storeId) {
        url += `&store_id=${storeId}`;
      } else if (buyerId) {
        url += `&buyer_id=${buyerId}`;
      } else {
        // 로그인 정보 없으면 빈 목록
        setOrders([]);
        return;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userRole, buyerId, storeId]);

  const handleCancel = async (orderId: number) => {
    if (!window.confirm('정말 취소하겠습니까?')) return;
    try {
      const res = await fetch(`http://localhost:8002/api/v1/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        alert('예약이 취소되었습니다.');
      }
    } catch (error) {
      console.error('Cancel failed:', error);
      alert('취소 중 오류가 발생했습니다.');
    }
  };

  const handleComplete = async (orderId: number) => {
    try {
      const res = await fetch(`http://localhost:8002/api/v1/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      if (res.ok) {
        alert('픽업 완료 처리되었습니다.');
        setSelectedOrder(null);
        setOrders(prev => prev.filter(o => o.id !== orderId));
      }
    } catch (error) {
      console.error('Complete failed:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  /** "HH:MM" → "오전/오후 H시 M분" */
  const formatPickupExpected = (hhMM: string): string => {
    const [h, m] = hhMM.split(':').map(Number);
    const period = h < 12 ? '오전' : '오후';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${period} ${hour12}시${m > 0 ? ` ${m}분` : ''}`;
  };

  /** ISO datetime → "오전/오후 H시 M분" (오늘) or "M월 D일 오전/오후 H시" (다른 날) */
  const formatAbsoluteTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const h = date.getHours();
    const m = date.getMinutes();
    const period = h < 12 ? '오전' : '오후';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const timeStr = `${period} ${hour12}시${m > 0 ? ` ${m}분` : ''}`;
    return isToday ? timeStr : `${date.getMonth() + 1}월 ${date.getDate()}일 ${timeStr}`;
  };

  // ── 판매자 주문 상세 뷰 ──
  if (userRole === 'SELLER' && selectedOrder) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0 shadow-sm">
          <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 flex items-center text-xl font-bold">←</button>
          <span className="font-bold text-lg flex-1 text-center pr-8">주문 상세 내역</span>
        </header>
        <div className="p-4 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm pb-2 border-b border-gray-50">
              <span className="font-bold text-gray-500">주문 번호 #{selectedOrder.order_number}</span>
              <span className="font-bold text-blue-600">픽업 대기중</span>
            </div>

            {selectedOrder.items.map(item => (
              <div key={item.id} className="flex gap-4 items-center py-2">
                <div className="flex-1 flex flex-col justify-center">
                  <div className="font-extrabold text-[17px] flex items-center gap-1 leading-tight text-gray-900">
                    {item.product_name}
                  </div>
                  <div className="text-gray-500 font-bold mt-1 text-[15px]">
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-[13px] mr-1">{item.quantity}개</span>
                    <span className="text-gray-900">{(item.unit_price * item.quantity).toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
            <h3 className="font-bold text-gray-800">주문 정보</h3>
            <div className="flex justify-between text-sm items-center">
              <span className="font-bold text-gray-500">결제 방법</span>
              <span className="font-bold text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                {selectedOrder.payment_method === 'toss' ? '토스페이' : '현장 결제'}
              </span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="font-bold text-gray-500">총 금액</span>
              <span className="font-bold text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                {selectedOrder.total_price.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="font-bold text-gray-500">주문 시각</span>
              <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                {formatAbsoluteTime(selectedOrder.created_at)}
              </span>
            </div>
            {selectedOrder.pickup_expected_at && (
              <div className="flex justify-between text-sm items-center">
                <span className="font-bold text-gray-500">고객 픽업 예정</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                  {formatPickupExpected(selectedOrder.pickup_expected_at)}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={() => handleComplete(selectedOrder.id)}
              className="w-full bg-[#FFE400] text-black font-extrabold text-lg py-4 rounded-xl hover:bg-yellow-400 active:scale-95 transition-transform shadow-sm"
            >
              픽업 완료 처리하기
            </button>
            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-xl active:scale-95 transition-transform shadow-sm"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 판매자 주문 목록 뷰 ──
  if (userRole === 'SELLER') {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <header className="bg-white p-4 border-b border-gray-100 sticky top-0 z-10 flex justify-center shadow-sm">
          <h1 className="text-lg font-bold text-gray-900">새로 들어온 주문</h1>
        </header>

        <div className="p-4 flex flex-col gap-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
              <span className="text-4xl animate-spin">⏳</span>
              <span className="font-bold">주문 목록 불러오는 중...</span>
            </div>
          ) : orders.length > 0 ? (
            orders.map(order => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:border-[#FFE400] hover:shadow-md transition-all relative overflow-hidden group"
              >
                <div className="w-12 h-12 bg-[#FFFBE6] rounded-xl shrink-0 flex items-center justify-center text-2xl border border-yellow-100">
                  🛍️
                </div>
                <div className="flex-1 flex flex-col justify-center gap-1">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-[15px] line-clamp-1 leading-snug text-gray-900 pr-2">
                      {order.items.map(i => `${i.product_name} x${i.quantity}`).join(', ')}
                    </div>
                    <div className="text-[11px] px-2 py-0.5 rounded-full font-bold shrink-0 bg-[#FFE400] text-black shadow-sm tracking-tight">
                      대기중
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-700 flex items-center justify-between">
                    <span>{order.total_price.toLocaleString()}원</span>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md text-xs">
                        주문 {formatAbsoluteTime(order.created_at)}
                      </span>
                      {order.pickup_expected_at && (
                        <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md text-xs">
                          픽업 예정 {formatPickupExpected(order.pickup_expected_at)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">#{order.order_number}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
              <span className="text-4xl mb-2 grayscale opacity-50">🛍️</span>
              <span className="font-bold">아직 들어온 주문이 없어요!</span>
              <span className="text-xs">특가 상품을 등록해 주문을 받아보세요.</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── 구매자 예약 목록 뷰 ──
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="bg-white p-4 border-b border-gray-100 sticky top-0 z-10 flex justify-center shadow-sm">
        <h1 className="text-lg font-bold">픽업 대기</h1>
      </header>

      <div className="p-4 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="text-4xl animate-spin">⏳</span>
            <span className="font-bold">예약 목록 불러오는 중...</span>
          </div>
        ) : orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} className="flex flex-col gap-1">
              <ReservationCard
                status="대기"
                name={order.items.map(i => `${i.product_name} x${i.quantity}`).join(', ')}
                shop={order.store_name}
                time={order.pickup_expected_at ? `픽업 예정: ${formatPickupExpected(order.pickup_expected_at)}` : '-'}
                id={`#${order.order_number}`}
                imageUrl=""
                onCancel={() => handleCancel(order.id)}
              />
              <div className="text-xs text-gray-400 font-bold px-2">
                주문 시각: {formatAbsoluteTime(order.created_at)}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="text-4xl mb-2">텅</span>
            <span className="font-bold">당연함, 이미 다 구출함!</span>
            <span className="text-xs">대기 중인 픽업 예약이 없습니다.</span>
          </div>
        )}
      </div>
    </div>
  );
}
