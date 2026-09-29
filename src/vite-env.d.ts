/// <reference types="vite/client" />

declare global {
  interface Window {
    __CORE_ENV__?: {
      readonly apiUrl: string;
    };
  }
}

export {};
