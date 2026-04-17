import React, { useState } from 'react';
import type { Page } from '../types';

/**
 * 회원가입 페이지 컴포넌트
 * 구매자 / 판매자 역할을 선택하여 가입합니다.
 */
export function SignupPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [role, setRole] = useState<'USER' | 'SELLER'>('USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopAddressDetail, setShopAddressDetail] = useState('');

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !name) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (role === 'SELLER' && !shopName) {
      alert("가게 이름을 입력해주세요.");
      return;
    }
    if (role === 'SELLER' && !shopAddress) {
      alert("가게 주소를 입력해주세요. (\uc608: 서울 마포구 망원동 123-4)");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          full_name: name,
          password: password,
          role: role === 'USER' ? 'buyer' : 'seller'
        }),
      });

      if (!response.ok) {
        const err = await response.json();

        // 1. 백엔드에서 우리가 직접 발생시킨 에러 (문자열 형태)
        if (typeof err.detail === 'string') {
          if (err.detail === "Email already registered") {
            alert("이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.");
          } else {
            alert(`회원가입 실패: ${err.detail}`);
          }
          return;
        }

        // 2. FastAPI 422 데이터 검증 에러 (배열 형태)
        if (Array.isArray(err.detail) && err.detail.length > 0) {
          const firstError = err.detail[0];
          // loc 배열의 마지막 요소가 에러가 난 필드 이름입니다. (예: ["body", "email"])
          const errorField = firstError.loc[firstError.loc.length - 1];

          if (errorField === 'email') {
            alert("올바르지 않은 이메일 형식입니다. (예: example@mail.com)");
          } else if (errorField === 'password') {
            alert("비밀번호는 문자, 숫자, 특수문자를 모두 포함하여 8~20자 사이로 입력해주세요.");
          } else {
            alert(`입력값을 다시 확인해주세요. (${errorField})`);
          }
          return;
        }

        alert("회원가입 중 오류가 발생했습니다.");
        return;
      }

      const userData = await response.json();

      if (role === 'SELLER') {
        try {
          const storeRes = await fetch(`http://localhost:8001/api/v1/stores/?owner_id=${userData.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              name: shopName, 
              address: shopAddress,          // 다음 주소 검색으로 받은 기반 주소 (지오코딩용)
              address_detail: shopAddressDetail || undefined  // 상세주소 (선택)
            })
          });
          if (!storeRes.ok) {
            const errBody = await storeRes.text();
            console.error("Store creation HTTP error:", storeRes.status, errBody);
          }
        } catch (e) {
          // 스토어 생성 실패 시에도 회원가입 자체는 성공 처리
          console.error("Store creation failed:", e);
        }
      }

      alert(`${role === 'USER' ? '구매자' : '판매자'} 회원가입이 완료되었습니다!`);
      onNavigate('login');

    } catch (error) {
      console.error(error);
      alert('서버와 통신할 수 없습니다.');
    }
  };

  return (
    <div className="flex flex-col bg-white min-h-full">
      <header className="bg-white p-4 border-b border-gray-100 sticky top-0 z-10 flex items-center shadow-sm">
        <button onClick={() => onNavigate('login')} className="p-1 mr-2 text-xl absolute left-4">←</button>
        <h1 className="text-lg font-bold mx-auto">회원가입</h1>
      </header>

      <div className="p-6 flex flex-col gap-6 w-full max-w-sm mx-auto">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">가입 유형</label>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setRole('USER')}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${role === 'USER' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}
            >
              구매자
            </button>
            <button
              onClick={() => setRole('SELLER')}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${role === 'SELLER' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}
            >
              판매자
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] focus:bg-white focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] focus:bg-white focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
            />
          </div>

          {role === 'SELLER' && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-700">가게 이름</label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="가게 이름을 입력하세요"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] focus:bg-white focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-700">가게 주소</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shopAddress}
                    readOnly
                    placeholder="주소 검색 버튼을 눌러 검색하세요"
                    className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 outline-none cursor-default"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      new (window as any).daum.Postcode({
                        oncomplete: (data: any) => {
                          // 도로명 주소 우선, 없으면 지번주소 사용
                          const fullAddress = data.roadAddress || data.jibunAddress;
                          setShopAddress(fullAddress);
                        }
                      }).open();
                    }}
                    className="shrink-0 px-4 py-3 bg-[#FFE400] text-black font-extrabold rounded-xl hover:bg-yellow-400 active:scale-95 transition-transform text-sm"
                  >
                    검색
                  </button>
                </div>
                {shopAddress && (
                  <div className="flex flex-col gap-1 mt-1">
                    <input
                      type="text"
                      placeholder="상세 주소 입력 (동동, 안, 스타연트 등) - 선택사항"
                      value={shopAddressDetail}
                      onChange={(e) => setShopAddressDetail(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] focus:bg-white focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1 px-1">파란 검색 버튼을 눌러 주소를 검색하는게 정확합니다.</p>
              </div>
            </>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 (문자, 숫자, 특수문자 포함 8~20자)"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] focus:bg-white focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 재입력"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:border-[#FFE400] focus:bg-white focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleSignup}
          className="w-full bg-[#FFE400] text-black font-extrabold text-lg py-4 rounded-xl hover:bg-yellow-400 active:scale-95 transition-transform shadow-sm mt-4 mb-10"
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
