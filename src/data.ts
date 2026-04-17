import type { Product } from './types';

// 그림 문자를 SVG 데이터 URL로 변환하는 유틸리티 함수
export const getSvgUrl = (emoji: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#FFFBE6"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-size="160">${emoji}</text></svg>`)}`;

/**
 * 앱 개발 및 테스트를 위한 더미 데이터 세트입니다.
 * 백엔드 서버 연동 전에 UI를 테스트하기 위한 목적으로 사용됩니다.
 */
export const DUMMY_PRODUCTS: Product[] = [
  { id: 1, name: "국내산 삼겹살", weight: "300g", originalPrice: 12000, discountPrice: 3600, shopName: "망원 정육점", distance: "도보 3분", remaining: 3, totalQuantity: 10, expiryMinutes: 23, category: "정육", imageUrl: getSvgUrl("🥩"), rating: 4.8, description: "오늘 썰어 더 신선한 한돈 삼겹살입니다. 구이용으로 강력 추천합니다!" },
  { id: 2, name: "유기농 시금치", weight: "500g", originalPrice: 4500, discountPrice: 1300, shopName: "초록 채소가게", distance: "도보 5분", remaining: 5, totalQuantity: 10, expiryMinutes: 60, category: "채소", imageUrl: getSvgUrl("🥬"), rating: 4.9, description: "무농약 친환경 시금치입니다. 겉잎이 살짝 시들었지만 속은 아주 싱싱합니다." },
  { id: 3, name: "오늘 구운 크루아상", weight: "5개", originalPrice: 8000, discountPrice: 2400, shopName: "동네 베이커리", distance: "도보 2분", remaining: 2, totalQuantity: 10, expiryMinutes: 18, category: "베이커리", imageUrl: getSvgUrl("🥐"), rating: 4.6, description: "프랑스산 고메버터를 사용하여 오늘 아침에 갓 구운 바삭하고 촉촉한 크루아상입니다." },
  { id: 4, name: "갈치", weight: "2마리", originalPrice: 15000, discountPrice: 5200, shopName: "수산 시장", distance: "도보 7분", remaining: 4, totalQuantity: 10, expiryMinutes: 120, category: "수산", imageUrl: getSvgUrl("🐟"), rating: 4.2, description: "구이나 조림 모두 맛있는 제주산 은갈치입니다. 약간의 생채기가 있어서 저렴하게 판매해요." },
  { id: 5, name: "제철 나물 모둠 반찬", originalPrice: 6000, discountPrice: 1800, shopName: "할머니 반찬가게", distance: "도보 4분", remaining: 1, totalQuantity: 10, expiryMinutes: 28, category: "반찬", imageUrl: getSvgUrl("🍱"), rating: 4.7, description: "조미료 없이 건강하게 당일 직접 무친 제철 나물 3종 세트입니다." },
  { id: 6, name: "한우 불고기용", weight: "200g", originalPrice: 18000, discountPrice: 7200, shopName: "망원 정육점", distance: "도보 3분", remaining: 6, totalQuantity: 10, expiryMinutes: 180, category: "정육", imageUrl: getSvgUrl("🍲"), rating: 4.8, description: "1등급 한우 앞다리살입니다. 불고기 양념해서 드시면 아주 부드럽고 맛있어요." },
];
