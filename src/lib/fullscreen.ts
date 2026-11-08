import { NavigationBar, setDeviceOrientation } from '@apps-in-toss/web-framework';

/** 전체화면일 때 토스 상단 바를 검은색으로 (흰 바가 영상 위에 떠 보이지 않게) */
async function darkNavBar(dark: boolean) {
  try {
    await NavigationBar.setOptions(
      dark
        ? { backgroundColor: '#000000', theme: 'dark', withTitle: false }
        : { backgroundColor: null, theme: 'light', withTitle: true },
    );
  } catch {
    /* 미지원 환경 */
  }
}

/** 가로 전체화면 켜기/끄기 (회전 미지원이면 화면만 채움) */
export async function setLandscape(on: boolean) {
  document.body.classList.toggle('no-scroll', on);
  darkNavBar(on);
  try {
    if (setDeviceOrientation.isSupported()) await setDeviceOrientation({ type: on ? 'landscape' : 'portrait' });
  } catch {
    /* 토스 앱 밖이거나 미지원 버전 */
  }
}
