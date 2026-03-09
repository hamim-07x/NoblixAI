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

  private async init() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        // Dynamic import to avoid SSR issues with window
        const WebApp = (await import('@twa-dev/sdk')).default;
        this.webApp = WebApp;
        
        if (WebApp.initDataUnsafe && WebApp.initDataUnsafe.user) {
          this.user.set(WebApp.initDataUnsafe.user as TelegramUser);
        } else {
          // Mock data for local testing outside Telegram
          this.user.set({
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
            photo_url: 'https://picsum.photos/seed/testuser/100/100'
          });
        }
        WebApp.ready();
        WebApp.expand();
        this.isReady.set(true);
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

