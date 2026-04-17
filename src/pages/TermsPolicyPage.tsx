import React, { useState } from 'react';
import type { Page } from '../types';

export function TermsPolicyPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const policies = [
    { 
      title: '서비스 이용약관', 
      date: '2024.03.20 개정',
      content: `제1조(목적) 이 약관은 살리장(이하 "회사")이 운영하는 살리장 서비스(이하 "서비스")를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
      
제2조(서비스의 제공 및 변경) 1. 회사는 다음과 같은 서비스를 제공합니다.
  - 지역 기반 신선식품 중개 서비스
  - 상품 정보 제공 및 구매 계약 체결
  - 기타 회사가 정하는 업무`
    },
    { 
      title: '개인정보 처리방침', 
      date: '2024.03.15 개정',
      content: `1. 수집하는 개인정보 항목: 이름, 휴대전화번호, 위치정보, 이메일 주소 등
      
2. 개인정보의 수집 및 이용 목적:
  - 서비스 제공에 따른 본인 식별 및 인증
  - 위치 기반 서비스 제공 및 상품 추천
  - 마케팅 및 광고에 활용 (동의 시)`
    },
    { 
      title: '위치기반 서비스 이용약관', 
      date: '2024.03.10 개정',
      content: `제1조(목적) 본 약관은 이용자가 회사가 제공하는 위치기반서비스를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
      
제2조(서비스의 내용) 회사는 위치정보사업자로부터 제공받은 위치정보를 바탕으로 이용자의 현 위치를 확인하여 주변 가게 정보를 제공합니다.`
    },
    { 
      title: '전자금융거래 이용약관', 
      date: '2024.03.05 개정',
      content: `제1조(목적) 본 약관은 이용자가 전자금융거래를 이용함에 있어 금융기관 또는 전자금융업자와 이용자 사이의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
      
제2조(결제 및 환불) 서비스 내에서의 모든 결제는 안전한 결제 대행사를 통해 이루어지며, 환불 규정은 관련 법령 및 회사의 운영 정책에 따릅니다.`
    },
    { 
      title: '오픈소스 라이선스', 
      date: 'v1.0.0',
      content: `본 서비스는 다음의 오픈소스 소프트웨어를 포함하고 있습니다:
      
- React (MIT License)
- Vite (MIT License)
- Tailwind CSS (MIT License)
- Lucide React (ISC License)
      
각 소프트웨어의 라이선스 전문은 해당 프로젝트의 저장소에서 확인하실 수 있습니다.`
    },
  ];

  return (
    <div className="flex flex-col bg-white min-h-full">
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shrink-0">
        <button onClick={() => onNavigate('my')} className="p-1 mr-2 text-xl">←</button>
        <h1 className="font-bold text-lg text-center flex-1 pr-8">약관 및 정책</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-50">
          {policies.map((policy, i) => (
            <div key={i} className="border-b border-gray-50">
              <button 
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                className="w-full p-5 flex justify-between items-center hover:bg-gray-50 active:bg-gray-100 transition-all text-left group"
              >
                <div>
                  <div className={`font-bold text-sm transition-colors ${expandedIndex === i ? 'text-black' : 'text-gray-800'}`}>
                    {policy.title}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 font-medium">{policy.date}</div>
                </div>
                <span className={`text-gray-300 transition-transform duration-300 ${expandedIndex === i ? 'rotate-180 text-black' : 'group-hover:text-[#FFE400]'}`}>▼</span>
              </button>
              
              {expandedIndex === i && (
                <div className="px-5 pb-6 bg-gray-50 animate-fadeIn">
                  <div className="p-4 bg-white rounded-xl border border-gray-100 text-[12px] text-gray-600 leading-relaxed whitespace-pre-line shadow-sm">
                    {policy.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="p-8 mt-6 text-center">
          <p className="text-[10px] text-gray-300 leading-relaxed">
            살리장은 투명한 정책 운영을 통해<br />
            여러분의 소중한 정보를 안전하게 보호합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
