/**
 * 구글 애드센스 설정. 승인 후 콘솔에서 받은 값으로 채우면 광고가 나온다.
 * client: 'ca-pub-0000000000000000' 형태, slots: 광고 단위 ID(숫자)
 * 비어 있으면 광고 자리만 연한 상자로 표시된다.
 */
export const ADSENSE = {
  client: 'ca-pub-2882245715696743',
  slots: { left: '', right: '', bottom: '', feed: '' },
  /** 인피드(목록 사이) 광고 단위를 만들 때 애드센스가 주는 레이아웃 키 */
  feedLayoutKey: '',
  /** 경기 카드 몇 개마다 광고 1개 */
  feedEvery: 5,
};
