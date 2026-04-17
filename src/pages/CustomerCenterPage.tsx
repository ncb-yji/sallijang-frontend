import { useState } from 'react';
import type { Page } from '../types';

type Tab = 'notice' | 'faq' | 'inquiry';

export function CustomerCenterPage({ onNavigate, userRole }: { onNavigate: (page: Page) => void, userRole?: 'USER' | 'SELLER' }) {
  const [activeTab, setActiveTab] = useState<Tab>('notice');
  const isSeller = userRole === 'SELLER';

  const userNotices = [
    { id: 1, title: '살리장 서비스 정식 런칭 안내', date: '2024.03.20' },
    { id: 2, title: '개인정보처리방침 개정 안내', date: '2024.03.15' },
    { id: 3, title: '봄맞이 신선식품 할인 이벤트 안내', date: '2024.03.10' },
  ];

  const sellerNotices = [
    { id: 1, title: '[사장님 전용] 정산 주기 및 대금 지급 프로세스 안내', date: '2024.03.18' },
    { id: 2, title: '[공지] 상품 등록 시 이미지 최적화 가이드', date: '2024.03.12' },
    { id: 3, title: '[안내] 판매자 운영 정책 위반 사례 공유', date: '2024.03.05' },
  ];

  const userFaqs = [
    { question: '주문 취소는 어떻게 하나요?', answer: '마이 살리장 > 주문 내역에서 결제완료 상태 시에만 직접 취소 가능합니다.' },
    { question: '포인트는 언제 적립되나요?', answer: '상품 수령 후 [구매 확정] 버튼을 누르시면 즉시 적립됩니다.' },
  ];

  const sellerFaqs = [
    { question: '정산 대금은 언제 입금되나요?', answer: '매월 10일, 25일 두 번에 걸쳐 정산 대금이 지급됩니다.' },
    { question: '가게 영업을 일시 중지하고 싶어요.', answer: '셀프서비스 홈 > 영업임시중지 토글을 통해 즉시 노출 차단이 가능합니다.' },
    { question: '리뷰 답글은 필수로 달아야 하나요?', answer: '필수는 아니지만, 답글 작성 시 단골 확보에 매우 유리합니다.' },
  ];

  const notices = isSeller ? sellerNotices : userNotices;
  const faqs = isSeller ? sellerFaqs : userFaqs;
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col bg-white min-h-full">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0">
        <button onClick={() => onNavigate('my')} className="p-1 mr-2 text-xl">←</button>
        <h1 className="font-bold text-lg text-center flex-1 pr-8">{isSeller ? '사장님 고객센터' : '고객센터'}</h1>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('notice')}
          className={`flex-1 py-3 font-extrabold text-sm transition-all ${activeTab === 'notice' ? 'text-black border-b-4 border-[#FFE400]' : 'text-gray-400'}`}
        >
          {isSeller ? '사장님 공지' : '공지사항'}
        </button>
        <button 
          onClick={() => setActiveTab('faq')}
          className={`flex-1 py-3 font-extrabold text-sm transition-all ${activeTab === 'faq' ? 'text-black border-b-4 border-[#FFE400]' : 'text-gray-400'}`}
        >
          FAQ
        </button>
        <button 
          onClick={() => setActiveTab('inquiry')}
          className={`flex-1 py-3 font-extrabold text-sm transition-all ${activeTab === 'inquiry' ? 'text-black border-b-4 border-[#FFE400]' : 'text-gray-400'}`}
        >
          1:1 문의
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'notice' && (
          <div className="divide-y divide-gray-50">
            {notices.map(notice => (
              <div key={notice.id} className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center group">
                <div>
                  <div className="text-sm font-bold mb-1 group-hover:text-black">{notice.title}</div>
                  <div className="text-xs text-gray-400">{notice.date}</div>
                </div>
                <span className="text-gray-200 group-hover:text-[#FFE400] transition-colors">❯</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="divide-y divide-gray-50">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-50">
                <button 
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full text-left p-4 flex justify-between items-center"
                >
                  <span className="text-sm font-bold"><span className="text-[#FFE400] bg-black px-1.5 py-0.5 rounded mr-2 text-[10px]">Q</span>{faq.question}</span>
                  <span className={`text-gray-400 transition-transform ${expandedFaq === index ? 'rotate-180 text-black' : ''}`}>▼</span>
                </button>
                {expandedFaq === index && (
                  <div className="p-4 bg-gray-50 text-sm text-gray-600 leading-relaxed">
                    <div className="flex gap-2">
                      <span className="text-gray-400 font-bold shrink-0">A.</span>
                      <span>{faq.answer}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'inquiry' && (
          <div className="p-5">
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
               <h3 className="font-extrabold text-sm mb-1">{isSeller ? '사장님의 성공을 돕겠습니다' : '궁금한 점이 있으신가요?'}</h3>
               <p className="text-xs text-gray-500">{isSeller ? '가게 운영, 정산, 상품 노출 등 무엇이든 물어보세요.' : '문의를 남겨주시면 담당자가 확인 후 24시간 이내에 답변드릴게요.'}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">문의 유형</label>
                <select className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FFE400] bg-white transition-all appearance-none">
                  {isSeller ? (
                    <>
                      <option>정산 문의</option>
                      <option>상품 노출/수정 문의</option>
                      <option>입점/해지 문의</option>
                      <option>기타 운영 문의</option>
                    </>
                  ) : (
                    <>
                      <option>주문/결제 문의</option>
                      <option>배송/수령 문의</option>
                      <option>취소/환불 문의</option>
                      <option>가게/상품 문의</option>
                      <option>기타 문의</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">상세 내용</label>
                <textarea 
                  rows={6}
                  placeholder={isSeller ? "가게명과 함께 구체적인 상담 내용을 적어주세요." : "상담이 필요한 내용을 상세히 적어주세요."}
                  className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FFE400] bg-white transition-all resize-none"
                ></textarea>
              </div>
              <button className="w-full bg-[#FFE400] text-black font-extrabold py-4 rounded-xl mt-4 shadow-sm hover:brightness-95 active:scale-[0.98] transition-all">
                {isSeller ? '상담 접수하기' : '문의하기'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
