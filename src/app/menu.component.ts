import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SettingsService, Theme, Currency } from './settings.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex flex-col bg-black dark:bg-white text-white dark:text-black min-h-full pb-24 transition-colors duration-300">
      @if (currentView() === 'main') {
        <h1 class="text-3xl font-bold px-4 py-6">{{ t().settings }}</h1>

        <div class="px-4 space-y-4">
          <!-- Group 1 -->
          <div class="bg-[#141414] dark:bg-gray-100 rounded-2xl overflow-hidden transition-colors duration-300">
            <div class="flex items-center justify-between p-3.5 border-b border-white/5 dark:border-black/5 hover:bg-white/5 dark:hover:bg-black/5 cursor-pointer transition-colors" (click)="setView('language')">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center">
                  <mat-icon class="text-white text-[18px] w-[18px] h-[18px]">translate</mat-icon>
                </div>
                <span class="text-[15px] font-medium">{{ t().language }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-[15px] text-gray-500">{{ getLanguageName() }}</span>
                <mat-icon class="text-gray-600 text-[20px] w-[20px] h-[20px]">chevron_right</mat-icon>
              </div>
            </div>

            <div class="flex items-center justify-between p-3.5 border-b border-white/5 dark:border-black/5 hover:bg-white/5 dark:hover:bg-black/5 cursor-pointer transition-colors" (click)="setView('currency')">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center">
                  <mat-icon class="text-white text-[18px] w-[18px] h-[18px]">payments</mat-icon>
                </div>
                <span class="text-[15px] font-medium">{{ t().walletCurrency }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-[15px] text-gray-500">{{ getCurrencyName() }}</span>
                <mat-icon class="text-gray-600 text-[20px] w-[20px] h-[20px]">chevron_right</mat-icon>
              </div>
            </div>

            <div class="flex items-center justify-between p-3.5 border-b border-white/5 dark:border-black/5 hover:bg-white/5 dark:hover:bg-black/5 cursor-pointer transition-colors" (click)="setView('timezone')">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center">
                  <mat-icon class="text-white text-[18px] w-[18px] h-[18px]">schedule</mat-icon>
                </div>
                <span class="text-[15px] font-medium">{{ t().timeZone }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-[15px] text-gray-500">{{ getTimezoneName() }}</span>
                <mat-icon class="text-gray-600 text-[20px] w-[20px] h-[20px]">chevron_right</mat-icon>
              </div>
            </div>

            <div class="flex items-center justify-between p-3.5 border-b border-white/5 dark:border-black/5 hover:bg-white/5 dark:hover:bg-black/5 cursor-pointer transition-colors" (click)="setView('theme')">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#8B5CF6] flex items-center justify-center">
                  <mat-icon class="text-white text-[18px] w-[18px] h-[18px]">dark_mode</mat-icon>
                </div>
                <span class="text-[15px] font-medium">{{ t().theme }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-[15px] text-gray-500">{{ getThemeName() }}</span>
                <mat-icon class="text-gray-600 text-[20px] w-[20px] h-[20px]">chevron_right</mat-icon>
              </div>
            </div>

            <div class="flex items-center justify-between p-3.5 hover:bg-white/5 dark:hover:bg-black/5 cursor-pointer transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center">
                  <mat-icon class="text-white text-[18px] w-[18px] h-[18px]">tune</mat-icon>
                </div>
                <span class="text-[15px] font-medium">{{ t().exchangeSettings }}</span>
              </div>
              <mat-icon class="text-gray-600 text-[20px] w-[20px] h-[20px]">chevron_right</mat-icon>
            </div>
          </div>

          <!-- Group 2 -->
          <div class="bg-[#141414] dark:bg-gray-100 rounded-2xl overflow-hidden transition-colors duration-300">
            <div class="flex items-center justify-between p-3.5 hover:bg-white/5 dark:hover:bg-black/5 cursor-pointer transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#EF4444] flex items-center justify-center">
                  <mat-icon class="text-white text-[18px] w-[18px] h-[18px]">person_add</mat-icon>
                </div>
                <span class="text-[15px] font-medium">{{ t().referralLink }}</span>
              </div>
              <mat-icon class="text-gray-500 text-[20px] w-[20px] h-[20px]">content_copy</mat-icon>
            </div>
          </div>

          <!-- Group 3 -->
          <div class="bg-[#141414] dark:bg-gray-100 rounded-2xl overflow-hidden transition-colors duration-300">
            <div class="flex items-center justify-between p-3.5 hover:bg-white/5 dark:hover:bg-black/5 cursor-pointer transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center">
                  <mat-icon class="text-white text-[18px] w-[18px] h-[18px]">support_agent</mat-icon>
                </div>
                <span class="text-[15px] font-medium">{{ t().support }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-[15px] text-gray-500">{{ t().launchBot }}</span>
                <mat-icon class="text-gray-600 text-[20px] w-[20px] h-[20px]">chevron_right</mat-icon>
              </div>
            </div>
          </div>

          <!-- Group 4 (Links) -->
          <div class="bg-[#141414] rounded-2xl overflow-hidden">
            <div class="flex items-center justify-between p-3.5 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
              <span class="text-[15px] text-[#3B82F6]">{{ t().amlPolicy }}</span>
              <mat-icon class="text-gray-600 text-[20px] w-[20px] h-[20px]">chevron_right</mat-icon>
            </div>
            <div class="flex items-center justify-between p-3.5 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
              <span class="text-[15px] text-[#3B82F6]">{{ t().privacyPolicy }}</span>
              <mat-icon class="text-gray-600 text-[20px] w-[20px] h-[20px]">chevron_right</mat-icon>
            </div>
            <div class="flex items-center justify-between p-3.5 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
              <span class="text-[15px] text-[#3B82F6]">{{ t().termsOfUse }}</span>
              <mat-icon class="text-gray-600 text-[20px] w-[20px] h-[20px]">chevron_right</mat-icon>
            </div>
            <div class="flex items-center justify-between p-3.5 hover:bg-white/5 cursor-pointer transition-colors">
              <span class="text-[15px] text-[#3B82F6]">{{ t().siteTerms }}</span>
              <mat-icon class="text-gray-600 text-[20px] w-[20px] h-[20px]">chevron_right</mat-icon>
            </div>
          </div>
        </div>
      } @else if (currentView() === 'language') {
        <div class="flex items-center gap-3 px-4 py-6">
          <button (click)="setView('main')" class="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <mat-icon class="text-white">arrow_back</mat-icon>
          </button>
          <h1 class="text-3xl font-bold">{{ t().language }}</h1>
        </div>
        
        <div class="px-4">
          <div class="bg-[#141414] rounded-2xl overflow-hidden">
            @for (lang of languages; track lang.id) {
              <div class="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer transition-colors" (click)="setLanguage(lang.id)">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">{{ lang.flag }}</span>
                  <span class="text-[16px] font-medium">{{ lang.name }}</span>
                </div>
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                     [class.border-[#3B82F6]]="settings.language() === lang.id"
                     [class.border-gray-600]="settings.language() !== lang.id">
                  @if (settings.language() === lang.id) {
                    <div class="w-2.5 h-2.5 bg-[#3B82F6] rounded-full"></div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      } @else if (currentView() === 'theme') {
        <div class="flex items-center gap-3 px-4 py-6">
          <button (click)="setView('main')" class="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <mat-icon class="text-white">arrow_back</mat-icon>
          </button>
          <h1 class="text-3xl font-bold">{{ t().theme }}</h1>
        </div>
        
        <div class="px-4">
          <div class="bg-[#141414] dark:bg-gray-100 rounded-2xl overflow-hidden transition-colors duration-300">
            @for (theme of themes; track theme.id) {
              <div class="flex items-center justify-between p-4 border-b border-white/5 dark:border-black/5 last:border-0 hover:bg-white/5 dark:hover:bg-black/5 cursor-pointer transition-colors" (click)="setTheme(theme.id)">
                <div class="flex items-center gap-3">
                  <mat-icon class="text-gray-400 dark:text-gray-600">{{ theme.icon }}</mat-icon>
                  <span class="text-[16px] font-medium">{{ theme.name }}</span>
                </div>
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                     [class.border-[#3B82F6]]="settings.theme() === theme.id"
                     [class.border-gray-600]="settings.theme() !== theme.id">
                  @if (settings.theme() === theme.id) {
                    <div class="w-2.5 h-2.5 bg-[#3B82F6] rounded-full"></div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      } @else if (currentView() === 'timezone') {
        <div class="flex items-center gap-3 px-4 py-6">
          <button (click)="setView('main')" class="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-colors">
            <mat-icon class="text-white dark:text-black">arrow_back</mat-icon>
          </button>
          <h1 class="text-3xl font-bold">{{ t().timeZone }}</h1>
        </div>
        
        <div class="px-4">
          <div class="bg-[#141414] dark:bg-gray-100 rounded-2xl overflow-hidden h-[60vh] overflow-y-auto scrollbar-hide transition-colors duration-300">
            @for (tz of timezones; track tz.id) {
              <div class="flex items-center justify-between p-4 border-b border-white/5 dark:border-black/5 last:border-0 hover:bg-white/5 dark:hover:bg-black/5 cursor-pointer transition-colors" (click)="setTimezone(tz.id)">
                <div class="flex items-center gap-3">
                  <span class="text-[16px] font-medium">{{ tz.name }}</span>
                </div>
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                     [class.border-[#3B82F6]]="settings.timezone() === tz.id"
                     [class.border-gray-600]="settings.timezone() !== tz.id">
                  @if (settings.timezone() === tz.id) {
                    <div class="w-2.5 h-2.5 bg-[#3B82F6] rounded-full"></div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      } @else if (currentView() === 'currency') {
        <div class="flex items-center gap-3 px-4 py-6">
          <button (click)="setView('main')" class="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-colors">
            <mat-icon class="text-white dark:text-black">arrow_back</mat-icon>
          </button>
          <h1 class="text-3xl font-bold">{{ t().walletCurrency }}</h1>
        </div>
        
        <div class="px-4">
          <div class="bg-[#141414] dark:bg-gray-100 rounded-2xl overflow-hidden h-[60vh] overflow-y-auto scrollbar-hide transition-colors duration-300">
            @for (currency of currencies; track currency.id) {
              <div class="flex items-center justify-between p-4 border-b border-white/5 dark:border-black/5 last:border-0 hover:bg-white/5 dark:hover:bg-black/5 cursor-pointer transition-colors" (click)="setCurrency(currency.id)">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center text-sm font-bold">
                    {{ currency.symbol }}
                  </div>
                  <span class="text-[16px] font-medium">{{ currency.name }} ({{ currency.id }})</span>
                </div>
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                     [class.border-[#3B82F6]]="settings.currency() === currency.id"
                     [class.border-gray-600]="settings.currency() !== currency.id">
                  @if (settings.currency() === currency.id) {
                    <div class="w-2.5 h-2.5 bg-[#3B82F6] rounded-full"></div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class MenuComponent {
  settings = inject(SettingsService);
  currentView = signal<'main' | 'language' | 'theme' | 'timezone' | 'currency'>('main');

  languages = [
    { id: 'en', name: 'English', flag: '🇬🇧' },
    { id: 'ru', name: 'Русский', flag: '🇷🇺' },
    { id: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  themes = [
    { id: 'light', name: 'Light', icon: 'light_mode' },
    { id: 'dark', name: 'Dark', icon: 'dark_mode' },
    { id: 'system', name: 'Auto', icon: 'desktop_windows' }
  ];

  timezones = [
    { id: 'UTC-12', name: 'UTC-12:00 (Baker Island)' },
    { id: 'UTC-11', name: 'UTC-11:00 (American Samoa)' },
    { id: 'UTC-10', name: 'UTC-10:00 (Hawaii)' },
    { id: 'UTC-9', name: 'UTC-09:00 (Alaska)' },
    { id: 'UTC-8', name: 'UTC-08:00 (Pacific Time)' },
    { id: 'UTC-7', name: 'UTC-07:00 (Mountain Time)' },
    { id: 'UTC-6', name: 'UTC-06:00 (Central Time)' },
    { id: 'UTC-5', name: 'UTC-05:00 (Eastern Time)' },
    { id: 'UTC-4', name: 'UTC-04:00 (Atlantic Time)' },
    { id: 'UTC-3', name: 'UTC-03:00 (Buenos Aires)' },
    { id: 'UTC-2', name: 'UTC-02:00 (Mid-Atlantic)' },
    { id: 'UTC-1', name: 'UTC-01:00 (Azores)' },
    { id: 'UTC', name: 'UTC±00:00 (London)' },
    { id: 'UTC+1', name: 'UTC+01:00 (Berlin, Paris)' },
    { id: 'UTC+2', name: 'UTC+02:00 (Cairo, Kyiv)' },
    { id: 'UTC+3', name: 'UTC+03:00 (Moscow, Riyadh)' },
    { id: 'UTC+4', name: 'UTC+04:00 (Dubai)' },
    { id: 'UTC+5', name: 'UTC+05:00 (Islamabad)' },
    { id: 'UTC+5:30', name: 'UTC+05:30 (India)' },
    { id: 'UTC+6', name: 'UTC+06:00 (Dhaka)' },
    { id: 'UTC+7', name: 'UTC+07:00 (Bangkok)' },
    { id: 'UTC+8', name: 'UTC+08:00 (Beijing, Singapore)' },
    { id: 'UTC+9', name: 'UTC+09:00 (Tokyo, Seoul)' },
    { id: 'UTC+10', name: 'UTC+10:00 (Sydney)' },
    { id: 'UTC+11', name: 'UTC+11:00 (Solomon Is.)' },
    { id: 'UTC+12', name: 'UTC+12:00 (Auckland)' }
  ];

  currencies = [
    { id: 'USD', name: 'US Dollar', symbol: '$' },
    { id: 'EUR', name: 'Euro', symbol: '€' },
    { id: 'GBP', name: 'British Pound', symbol: '£' },
    { id: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { id: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { id: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { id: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { id: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
    { id: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { id: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { id: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
    { id: 'AED', name: 'UAE Dirham', symbol: 'د.إ' }
  ];

  translations: Record<string, any> = {
    en: {
      settings: 'Settings',
      language: 'Language',
      walletCurrency: 'Wallet Currency',
      timeZone: 'Time Zone',
      theme: 'Theme',
      exchangeSettings: 'Exchange Settings',
      referralLink: 'Referral Link',
      support: 'Support',
      launchBot: 'Launch Bot',
      amlPolicy: 'Anti-Money Laundering Policy',
      privacyPolicy: 'Privacy Policy',
      termsOfUse: 'Terms of Use',
      siteTerms: 'Site terms of use'
    },
    ru: {
      settings: 'Настройки',
      language: 'Язык',
      walletCurrency: 'Валюта кошелька',
      timeZone: 'Часовой пояс',
      theme: 'Тема',
      exchangeSettings: 'Настройки обмена',
      referralLink: 'Реферальная ссылка',
      support: 'Поддержка',
      launchBot: 'Запустить бота',
      amlPolicy: 'Политика ПОД',
      privacyPolicy: 'Политика конфиденциальности',
      termsOfUse: 'Условия использования',
      siteTerms: 'Условия сайта'
    },
    zh: {
      settings: '设置',
      language: '语言',
      walletCurrency: '钱包货币',
      timeZone: '时区',
      theme: '主题',
      exchangeSettings: '兑换设置',
      referralLink: '推荐链接',
      support: '支持',
      launchBot: '启动机器人',
      amlPolicy: '反洗钱政策',
      privacyPolicy: '隐私政策',
      termsOfUse: '使用条款',
      siteTerms: '网站使用条款'
    }
  };

  t() {
    return this.translations[this.settings.language()] || this.translations['en'];
  }

  setView(view: 'main' | 'language' | 'theme' | 'timezone' | 'currency') {
    this.currentView.set(view);
  }

  setLanguage(id: string) {
    this.settings.language.set(id);
    this.setView('main');
  }

  setTheme(id: string) {
    this.settings.theme.set(id as Theme);
    this.setView('main');
  }

  setTimezone(id: string) {
    this.settings.timezone.set(id);
    this.setView('main');
  }

  setCurrency(id: string) {
    this.settings.currency.set(id as Currency);
    this.setView('main');
  }

  getLanguageName() {
    return this.languages.find(l => l.id === this.settings.language())?.name || 'English';
  }

  getThemeName() {
    return this.themes.find(t => t.id === this.settings.theme())?.name || 'Auto';
  }

  getTimezoneName() {
    return this.timezones.find(t => t.id === this.settings.timezone())?.id || 'UTC';
  }

  getCurrencyName() {
    return this.currencies.find(c => c.id === this.settings.currency())?.id || 'USD';
  }
}
