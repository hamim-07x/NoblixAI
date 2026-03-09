import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { WalletComponent } from './wallet.component';
import { AirdropComponent } from './airdrop.component';
import { MarketComponent } from './market.component';
import { EarnComponent } from './earn.component';
import { MenuComponent } from './menu.component';

type Tab = 'wallet' | 'airdrop' | 'market' | 'earn' | 'menu';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule,
    WalletComponent,
    AirdropComponent,
    MarketComponent,
    EarnComponent,
    MenuComponent
  ],
  template: `
    <div class="flex justify-center bg-black min-h-screen">
      <div class="w-full max-w-md bg-[#0f0f0f] text-white overflow-hidden font-sans h-[100dvh] relative flex flex-col shadow-2xl">
        <!-- Main Content Area -->
        <div class="flex-1 overflow-y-auto pb-28 scrollbar-hide">
          @switch (activeTab()) {
            @case ('wallet') { <app-wallet /> }
            @case ('airdrop') { <app-airdrop /> }
            @case ('market') { <app-market /> }
            @case ('earn') { <app-earn /> }
            @case ('menu') { <app-menu /> }
          }
        </div>

        <!-- Bottom Navigation Bar -->
        <div class="absolute bottom-0 left-0 right-0 bg-[#141414]/95 backdrop-blur-md border-t border-gray-800 px-2 py-2 pb-safe z-50">
          <div class="flex justify-around items-center">
            @for (tab of tabs; track tab.id) {
              <button 
                (click)="activeTab.set(tab.id)"
                class="flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200"
                [class.text-blue-500]="activeTab() === tab.id"
                [class.text-gray-500]="activeTab() !== tab.id"
              >
                <div 
                  class="w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-colors"
                  [class.bg-blue-500/10]="activeTab() === tab.id"
                >
                  <mat-icon [class.filled]="activeTab() === tab.id">{{ tab.icon }}</mat-icon>
                </div>
                <span class="text-[10px] font-medium">{{ tab.label }}</span>
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pb-safe {
      padding-bottom: env(safe-area-inset-bottom, 16px);
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .filled {
      font-variation-settings: 'FILL' 1;
    }
  `]
})
export class App {
  activeTab = signal<Tab>('wallet');

  tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'wallet', label: 'Wallet', icon: 'account_balance_wallet' },
    { id: 'airdrop', label: 'Airdrop', icon: 'card_giftcard' },
    { id: 'market', label: 'Market', icon: 'storefront' },
    { id: 'earn', label: 'Earn', icon: 'monetization_on' },
    { id: 'menu', label: 'Menu', icon: 'menu' }
  ];
}
