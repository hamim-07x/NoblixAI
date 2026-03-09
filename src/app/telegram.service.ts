import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class TelegramService {
  user = signal<TelegramUser | null>(null);
  isReady = signal<boolean>(false);
  platformId = inject(PLATFORM_ID);
  
  private webApp: any = null;

  constructor() {
    this.init();
  }

  private init() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        if (window.Telegram && window.Telegram.WebApp) {
          this.webApp = window.Telegram.WebApp;
          
          if (this.webApp.initDataUnsafe && this.webApp.initDataUnsafe.user) {
            this.user.set(this.webApp.initDataUnsafe.user as TelegramUser);
          } else {
            // Mock data for local testing outside Telegram
            this.user.set({
              id: 0,
              first_name: 'Guest',
              last_name: '(Not in Mini App)',
              username: 'guest',
              photo_url: 'https://picsum.photos/seed/guest/100/100'
            });
          }
          this.webApp.ready();
          this.webApp.expand();
          this.isReady.set(true);
        } else {
          // Mock data if Telegram WebApp is not available
          this.user.set({
            id: 0,
            first_name: 'Guest',
            last_name: '(Browser)',
            username: 'guest',
            photo_url: 'https://picsum.photos/seed/guest/100/100'
          });
          this.isReady.set(true);
        }
      } catch (e) {
        console.error('Error initializing Telegram Web App', e);
      }
    }
  }

  close() {
    if (this.webApp) {
      this.webApp.close();
    }
  }
}

