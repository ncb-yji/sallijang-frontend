/**
 * 타겟 시간과 현재 시간을 받아 포맷된 카운트다운 문자열을 반환합니다.
 * @param targetDate 마감 시간
 * @param now 현재 시간
 * @returns 'HH:MM:SS' 형식의 문자열
 */
export function formatCountdown(targetDate: Date, now: Date) {
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return "00:00:00";
  
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
