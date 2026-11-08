/** 웹사이트 빌드(vite.web.config.ts)일 때만 true. 토스 앱 빌드에서는 false */
export const IS_WEB = (import.meta.env.VITE_TARGET as string | undefined) === 'web';
