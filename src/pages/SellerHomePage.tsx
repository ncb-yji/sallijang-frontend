import React, { useState } from 'react';

/**
 * 판매자 전용 홈 데시보드.
 * 매출액, 요약 등 판매자의 전반적 활동을 요약합니다.
 */
export function SellerHomePage({ isPcVersion, userName }: { isPcVersion?: boolean; userName?: string }) {
  const [noticeExpanded, setNoticeExpanded] = useState(false);

  const notices = [
    { title: "[안내] 2024년 11월 정산 주기 및 대금 지급일 안내", date: "2024. 11. 15", content: "이번 달 정산은 25일에 일괄 진행될 예정입니다. 계좌 정보를 다시 한번 확인해주세요." },
    { title: "[꿀팁] 단골 손님을 늘리는 리뷰 답글 작성 가이드", date: "2024. 11. 10", content: "정성스러운 답글은 재구매율을 20% 이상 높여줍니다. 지금 바로 확인해보세요!" },
    { title: "[공지] 살리장 셀프서비스 시스템 점검 안내 (11/20)", date: "2024. 11. 05", content: "새벽 2시부터 4시까지 서비스 점검이 예정되어 있습니다. 이용에 참고 부탁드립니다." }
  ];

  return (
    <div className="flex flex-col min-h-full bg-gray-50 relative pb-20">
      <header className="bg-gray-50 p-4 flex justify-between items-center sticky top-0 z-20 shrink-0 min-h-[64px]">
        {!isPcVersion && (
          <button className="text-2xl text-gray-800 focus:outline-none flex items-center justify-center p-1 relative -left-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="miter"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
          </button>
        )}
        <div className={`flex items-center gap-1 font-black text-xl tracking-tight text-gray-900 absolute left-1/2 -translate-x-1/2 ${isPcVersion ? 'static translate-x-0 mx-auto' : ''}`}>
          살리장셀프서비스 <span className="text-[22px] ml-0.5">🥜</span>
        </div>
        {!isPcVersion && <div className="w-8"></div>}
      </header>

      <div className="px-5 py-2 flex flex-col gap-5">
        <div className="mt-1">
          <div className="text-gray-500 font-bold mb-1 flex items-center gap-1.5 text-[13px]">
            <span>2024. 11. 19 (화)</span>
            <span>·</span>
            <span>☀️ 20.2°</span>
          </div>
          <h2 className="text-[21px] font-black text-gray-900 tracking-tight leading-snug">{userName || '사장'}님을 언제나 응원해요!</h2>
        </div>

        {/* ... (Existing sales stats and pause toggle remain unchanged) ... */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100/80 cursor-pointer transition-shadow">
            <div className="text-gray-600 font-bold mb-2.5 text-sm">오늘 판매금액</div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-[19px] text-gray-900">120,500원</span>
              <span className="text-gray-400 font-light text-xl -mt-1">›</span>
            </div>
            <div className="text-emerald-500 font-extrabold text-[13px] tracking-tight">어제보다 + 14,000원</div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100/80 cursor-pointer transition-shadow">
            <div className="text-gray-600 font-bold mb-2.5 text-sm">오늘 판매수</div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-[19px] text-gray-900">8건</span>
              <span className="text-gray-400 font-light text-xl -mt-1">›</span>
            </div>
            <div className="text-emerald-500 font-extrabold text-[13px] tracking-tight">어제보다 + 2건</div>
          </div>
        </div>

        {/* Smart Insight Section */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-indigo-100/50 mt-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-indigo-50 p-1.5 rounded-lg">
              <span className="text-[14px]">💡</span>
            </div>
            <span className="text-indigo-600 font-black text-[13.5px] tracking-tight">살리장 AI 인사이트</span>
          </div>
          <div className="text-gray-800 font-bold text-[14.5px] leading-relaxed tracking-tight">
            정육점에서 <span className="text-indigo-600">삼겹살</span>이 평소보다 많이 남았어요. <br/>
            다음 발주 시에는 <span className="bg-indigo-50 px-1 rounded text-indigo-700">50kg 이하</span>로 조절해 보시는 건 어떨까요?
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-gray-400 text-[11px] font-bold">
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            최근 3일 판매 데이터 분석 결과
          </div>
        </div>

        <div className="h-px bg-gray-200/60 w-full mt-4 mb-1"></div>

        {/* Updated Notices */}
        <div>
          <div 
            className="flex justify-between items-center mb-4 cursor-pointer pt-2"
            onClick={() => setNoticeExpanded(!noticeExpanded)}
          >
            <h3 className="font-extrabold text-[17px] flex items-center gap-1 text-gray-900">공지사항 <span className="text-gray-400 font-light text-[22px] ml-0.5 -mt-1">›</span></h3>
            <span className="text-gray-500 font-bold text-[13px] flex items-center gap-1 pr-1">{noticeExpanded ? '접기' : '전체보기'} <span className={`transition-transform duration-300 inline-block font-normal text-[10px] ${noticeExpanded ? 'rotate-180' : ''}`}>▼</span></span>
          </div>
          
          <div className="flex flex-col gap-4 px-1">
            {notices.slice(0, noticeExpanded ? undefined : 1).map((notice, i) => (
              <div key={i} className={`flex flex-col gap-1 ${i > 0 ? 'pt-4 border-t border-gray-100' : ''}`}>
                <div className="flex items-start gap-1.5 group">
                   <span className="text-[#FFE400] font-black mt-1 text-[22px] leading-[10px]">·</span>
                   <p className="text-gray-700 font-bold text-[14.5px] leading-snug tracking-tight group-hover:text-black transition-colors">
                     {notice.title}
                   </p>
                </div>
                <span className="text-gray-400 text-[12px] font-bold mt-1 ml-3.5 flex justify-between items-center">
                  {notice.date}
                  {noticeExpanded && <span className="text-gray-300 font-normal">자세히 보기 ❯</span>}
                </span>
                {noticeExpanded && (
                  <p className="ml-3.5 mt-2 text-[13px] text-gray-500 leading-relaxed bg-white p-3 rounded-xl border border-gray-50">
                    {notice.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-200/60 w-full mt-5 mb-1"></div>

        <div className="pb-10">
          <div className="flex items-center gap-3 mb-5 pt-2">
            <h3 className="font-extrabold text-[17px] flex items-center gap-1 text-gray-900 cursor-pointer">리뷰 <span className="text-gray-400 font-light text-[22px] ml-0.5 -mt-1">›</span></h3>
            <div className="flex gap-2 text-[12px] font-extrabold tracking-tight">
              <div className="bg-gray-800 text-white px-2.5 py-1 rounded-full leading-none">신규 3</div>
              <div className="text-gray-500 flex items-center px-1">미답변 7</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5 px-1">
            <div className="flex items-center gap-2">
              <div className="flex text-[#FFC400] text-[15px] tracking-tighter">
                ★★★★<span className="text-gray-200">★</span>
              </div>
              <span className="text-gray-400 font-bold text-[13px] ml-0.5">오늘</span>
            </div>
            <p className="font-bold text-[15px] text-gray-800 mt-1 tracking-tight">서비스로 주신 음료 잘 먹었습니다!</p>
          </div>
          
          <div className="h-px bg-gray-100/80 w-full mt-6 mb-5"></div>

          <div className="flex flex-col gap-1.5 px-1 relative">
            <div className="flex items-center gap-2">
              <div className="flex text-[#FFC400] text-[15px] tracking-tighter">
                ★★★★★
              </div>
              <span className="text-gray-400 font-bold text-[13px] ml-0.5">어제</span>
            </div>
            <p className="font-bold text-[15px] text-gray-800 mt-1 tracking-tight">고기가 너무 신선해요. 다음에 또 주문할게요!</p>
            <div className="absolute -bottom-8 w-full h-16 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
