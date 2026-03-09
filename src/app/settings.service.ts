import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'BDT' | 'INR' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'CNY';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  theme = signal<Theme>('dark');
  currency = signal<Currency>('USD');
  language = signal<string>('en');
  timezone = signal<string>('UTC');

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    if (this.isBrowser) {
      // Load from local storage if available
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        this.theme.set(savedTheme);
      }

      const savedCurrency = localStorage.getItem('currency') as Currency;
      if (savedCurrency) {
        this.currency.set(savedCurrency);
      }

      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage) {
        this.language.set(savedLanguage);
      }

      const savedTimezone = localStorage.getItem('timezone');
      if (savedTimezone) {
        this.timezone.set(savedTimezone);
      }
    }

    // Effect to save theme and apply it
    effect(() => {
      const currentTheme = this.theme();
      if (this.isBrowser) {
        localStorage.setItem('theme', currentTheme);
        this.applyTheme(currentTheme);
      }
    });

    // Effect to save currency
    effect(() => {
      const currentCurrency = this.currency();
      if (this.isBrowser) {
        localStorage.setItem('currency', currentCurrency);
      }
    });

    // Effect to save language
    effect(() => {
      const currentLanguage = this.language();
      if (this.isBrowser) {
        localStorage.setItem('language', currentLanguage);
      }
    });

    // Effect to save timezone
    effect(() => {
      const currentTimezone = this.timezone();
      if (this.isBrowser) {
        localStorage.setItem('timezone', currentTimezone);
      }
    });
  }

  private applyTheme(theme: Theme) {
    if (!this.isBrowser) return;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  getCurrencySymbol(currency: Currency): string {
    const symbols: Record<Currency, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'BDT': '৳',
      'INR': '₹',
      'JPY': '¥',
      'AUD': 'A$',
      'CAD': 'C$',
      'CHF': 'CHF',
      'CNY': '¥'
    };
    return symbols[currency] || '$';
  }
}
