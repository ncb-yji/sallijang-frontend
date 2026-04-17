import React, { useState } from 'react';
import type { Page } from '../types';

export function NotificationSettingsPage({ onNavigate, userRole }: { onNavigate: (page: Page) => void, userRole?: 'USER' | 'SELLER' }) {
  const isSeller = userRole === 'SELLER';
  
  // States for notifications
  const [slackEnabled, setSlackEnabled] = useState(true);
  const [orderEnabled, setOrderEnabled] = useState(true);
  const [reviewEnabled, setReviewEnabled] = useState(true);
  const [settlementEnabled, setSettlementEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  const Toggle = ({ enabled, setEnabled }: { enabled: boolean, setEnabled: (v: boolean) => void }) => (
    <button 
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${enabled ? 'bg-[#FFE400]' : 'bg-gray-200'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );

  return (
    <div className="flex flex-col bg-white min-h-full">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0">
        <button onClick={() => onNavigate('my')} className="p-1 mr-2 text-xl">←</button>
        <h1 className="font-bold text-lg text-center flex-1 pr-8">{isSeller ? '가게 알림 설정' : '알림 설정'}</h1>
      </header>

      <div className="flex-1 p-5 space-y-8">
        <section>
          <h2 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">채널 연동 알림</h2>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-bold text-sm">슬랙(Slack) 알림</div>
              <p className="text-xs text-gray-500 mt-1">{isSeller ? '신규 주문 및 정산 내역을 슬랙으로 받아보세요.' : '주문 및 공지사항을 슬랙으로 받아보세요.'}</p>
            </div>
            <Toggle enabled={slackEnabled} setEnabled={setSlackEnabled} />
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">서비스 알림</h2>
          <div className="space-y-6">
            {isSeller ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm">신규 주문 알림</div>
                    <p className="text-xs text-gray-500 mt-1">새로운 주문이 접수되면 즉시 알려드립니다.</p>
                  </div>
                  <Toggle enabled={orderEnabled} setEnabled={setOrderEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm">리뷰 등록 알림</div>
                    <p className="text-xs text-gray-500 mt-1">고객님이 소중한 리뷰를 남기면 알려드립니다.</p>
                  </div>
                  <Toggle enabled={reviewEnabled} setEnabled={setReviewEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm">정산 완료 알림</div>
                    <p className="text-xs text-gray-500 mt-1">대금 정산이 완료되면 내역을 전송해드립니다.</p>
                  </div>
                  <Toggle enabled={settlementEnabled} setEnabled={setSettlementEnabled} />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm">주문 및 쇼핑 알림</div>
                    <p className="text-xs text-gray-500 mt-1">결제, 취소, 배송 등 쇼핑 필수 정보를 알립니다.</p>
                  </div>
                  <Toggle enabled={orderEnabled} setEnabled={setOrderEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm">이벤트 및 혜택 알림</div>
                    <p className="text-xs text-gray-500 mt-1">다양한 이벤트와 쿠폰 소식을 알려드립니다.</p>
                  </div>
                  <Toggle enabled={marketingEnabled} setEnabled={setMarketingEnabled} />
                </div>
              </>
            )}
          </div>
        </section>

        <div className="pt-10 border-t border-gray-50 text-center">
          <p className="text-[10px] text-gray-400">
            {isSeller ? '신규 주문 알림은 가게 운영 시간에만 발송됩니다.' : '알림 설정 시 야간(21시~08시)에는 발송되지 않습니다.'}
          </p>
        </div>
      </div>
    </div>
  );
}
