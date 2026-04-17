import React, { useState } from 'react';
import type { Page } from '../types';

/**
 * 마감 재고(특가 상품)를 새로 등록하는 폼 컴포넌트.
 * 모든 정보를 입력받고, 할인율 스크롤바를 통해 최종 가격을 계산합니다.
 */
export function RegisterPage({ onNavigate, storeId }: { onNavigate?: (page: Page) => void, storeId?: number | null }) {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState<number | "">(15000);
  const [quantity, setQuantity] = useState<number | "">(5);
  const [discount, setDiscount] = useState(60);
  const [time, setTime] = useState(() => {
    // 현재 시간 이후 첫 30분 경계, 기본값은 20:00 (아직 안 지났으면)
    const now = new Date();
    const nowM = now.getMinutes();
    let h = nowM > 30 ? now.getHours() + 1 : now.getHours();
    let m = nowM <= 0 ? 0 : nowM <= 30 ? 30 : 0;
    if (h > 23) { h = 23; m = 30; }
    if (h < 20) { h = 20; m = 0; }
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  });
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("🥩 정육");

  const [attempted, setAttempted] = useState(false);

  // 10원 단위를 버리고 100원 단위로 맞춤 (예: 5850원 -> 5800원)
  const discountedPrice = Math.floor(((Number(price) || 0) * (1 - discount / 100)) / 100) * 100;

  // 현재 시간 이후 30분 간격 슬롯 (오늘 23:30까지)
  const now = new Date();
  const nowH = now.getHours();
  const nowM = now.getMinutes();
  const timeSlots: string[] = (() => {
    const slots: string[] = [];
    let h = nowM > 30 ? nowH + 1 : nowH;
    let m = nowM <= 0 ? 0 : nowM <= 30 ? 30 : 0;
    while (h <= 23) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      m += 30;
      if (m >= 60) { m = 0; h++; }
    }
    return slots;
  })();

  const formatSlotLabel = (hhMM: string): string => {
    const [h, m] = hhMM.split(':').map(Number);
    const period = h < 12 ? '오전' : '오후';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${period} ${hour12}시${m > 0 ? ` ${m}분` : ''}`;
  };

  /** "HH:MM" 기준으로 오늘 날짜의 픽업 마감 전체 datetime 문자열 반환 */
  const buildDeadline = (hhMM: string): string => {
    const d = new Date();
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${mo}-${day}T${hhMM}`;
  };

  /** 픽업 마감 시각(HH:MM)을 지금부터의 남은 분으로 환산합니다. */
  const calcExpiryMinutes = (hhMM: string): number => {
    const [h, m] = hhMM.split(':').map(Number);
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
    const diff = Math.floor((target.getTime() - now.getTime()) / 60000);
    return Math.max(1, diff);
  };

  const handleSubmit = async () => {
    setAttempted(true);
    if (!name || !weight || !price || !quantity || !time || !description) {
      return;
    }
    if (!storeId) {
      alert("가게 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }
    if (window.confirm("이대로 등록하시겠습니까?")) {
      try {
        const res = await fetch(`http://localhost:8001/api/v1/products/?store_id=${storeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            original_price: Number(price) || 0,
            discount_price: discountedPrice,
            remaining: Number(quantity) || 0,
            total_quantity: Number(quantity) || 0,
            expiry_minutes: calcExpiryMinutes(time),
            pickup_deadline: buildDeadline(time),
            category,
            image_url: "https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=600",
            weight,
            description
          })
        });
        if (res.ok) {
          alert("성공적으로 상품이 등록되었습니다!");
          if (onNavigate) onNavigate('my');
        } else {
          alert("상품 등록에 실패했습니다.");
        }
      } catch (e) {
        console.error(e);
        alert("원활한 연결이 어렵습니다.");
      }
    }
  };

  const getBorderClass = (val: any) => {
    if (attempted && !val) return "border-red-500 focus:border-red-500 bg-red-50";
    return "border-gray-200 focus:border-[#FFE400] bg-gray-50";
  };

  return (
    <div className="flex flex-col bg-white">
      <header className="bg-white p-4 border-b border-gray-100 sticky top-0 z-10 flex items-center shadow-sm">
        <button onClick={() => onNavigate?.('my')} className="p-1 mr-2 text-xl absolute left-4">←</button>
        <h1 className="text-lg font-bold mx-auto">마감 재고 등록</h1>
      </header>

      <div className="p-4 flex flex-col gap-6">
        {/* Image Upload Component */}
        <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl h-32 flex flex-col items-center justify-center text-gray-400 gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <span className="text-2xl">📷</span>
          <span className="font-bold text-sm">상품 사진 등록</span>
        </div>

        {/* Input Form Groups */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">상품명 <span className="text-red-500">*</span></label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="예) 국내산 삼겹살" className={`w-full p-3 rounded-lg font-bold outline-none transition-colors border ${getBorderClass(name)}`} />
              {attempted && !name && <p className="text-red-500 text-xs font-bold mt-1">상품명을 입력해주세요.</p>}
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-1 whitespace-nowrap">중량 <span className="text-red-500">*</span></label>
              <input type="text" value={weight} onChange={e => setWeight(e.target.value)} placeholder="300g" className={`w-full p-3 rounded-lg font-bold outline-none text-center px-1 text-sm border transition-colors ${getBorderClass(weight)}`} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">카테고리 <span className="text-red-500">*</span></label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-bold focus:border-[#FFE400] outline-none appearance-none">
              <option>🥩 정육</option>
              <option>🥬 채소</option>
              <option>🐟 수산</option>
              <option>🍱 반찬</option>
              <option>🥐 베이커리</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">원래 가격 <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="number" value={price} onChange={e => setPrice(Number(e.target.value) || "")} className={`w-full p-3 rounded-lg font-bold outline-none text-right pr-8 border transition-colors ${getBorderClass(price)}`} />
                <span className="absolute right-3 top-3 font-bold text-gray-500">원</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">수량 <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value) || "")} className={`w-full p-3 rounded-lg font-bold outline-none text-right pr-8 border transition-colors ${getBorderClass(quantity)}`} />
                <span className="absolute right-3 top-3 font-bold text-gray-500">개</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-bold text-gray-700">할인율 (50% ~ 80%) <span className="text-red-500">*</span></label>
              <span className="text-red-500 border border-red-200 bg-red-50 px-2 py-0.5 rounded font-black text-sm">{discount}% 할인</span>
            </div>
            <input type="range" min="50" max="80" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-full accent-[#FFE400]" />
            <div className="flex justify-between mt-2 font-bold px-1">
              <span className="text-gray-400 line-through text-sm">{(Number(price) || 0).toLocaleString()}원</span>
              <span className="text-xl">👉 <span className="font-extrabold text-red-500">{discountedPrice.toLocaleString()}원</span></span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">픽업 마감 시간 (오후 11:30까지) <span className="text-red-500">*</span></label>
            {timeSlots.length > 0 ? (
              <select
                value={time}
                onChange={e => setTime(e.target.value)}
                className={`w-full p-3 rounded-lg font-bold outline-none border transition-colors ${getBorderClass(time)}`}
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{formatSlotLabel(slot)}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-red-500 font-bold py-2">오늘은 더 이상 등록 가능한 시간이 없습니다.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">추가 설명 <span className="text-red-500">*</span></label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="신선도 등 상품 상태를 적어주세요!" className={`w-full p-3 rounded-lg font-bold outline-none h-24 resize-none border transition-colors ${getBorderClass(description)}`}></textarea>
            {attempted && !description && <p className="text-red-500 text-xs font-bold mt-1">상품의 상태나 추가 설명을 입력해주세요.</p>}
          </div>
        </div>

        {/* Submit Action */}
        <button onClick={handleSubmit} className="w-full bg-[#FFE400] text-black font-extrabold text-lg py-4 rounded-xl hover:bg-yellow-400 active:scale-95 transition-transform mt-4 mb-20 shadow-sm">
          마감 특가로 등록하기
        </button>

      </div>
    </div>
  )
}
