import { Component, inject, OnInit, OnDestroy, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TelegramService } from './telegram.service';
import { HttpClient } from '@angular/common/http';
import { CryptoService } from './crypto.service';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex flex-col bg-[#050505] dark:bg-white text-white dark:text-black p-4 min-h-full transition-colors duration-300 pb-24">
      
      @if (!selectedToken()) {
        <!-- Main Wallet View -->
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            <div class="relative">
              <img 
                [src]="tgService.user()?.photo_url || 'https://picsum.photos/seed/avatar/100/100'" 
                alt="Profile" 
                class="w-12 h-12 rounded-full border border-white/10 dark:border-black/10 object-cover"
                referrerpolicy="no-referrer"
              >
              <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050505] dark:border-white rounded-full"></div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-lg font-bold text-white dark:text-black">NoblixAi Wallet</h2>
                <span class="bg-[#3B82F6]/20 text-[#3B82F6] text-[10px] font-bold px-2 py-0.5 rounded-full">BETA</span>
              </div>
              <div class="flex items-center gap-1 mt-0.5">
                <span class="text-xs font-medium text-gray-500 bg-white/5 dark:bg-black/5 px-1.5 py-0.5 rounded">UID</span>
                <span class="text-xs font-medium text-gray-400 dark:text-gray-500">{{ tgService.user()?.id || '987654321' }}</span>
              </div>
            </div>
          </div>
          <button class="w-10 h-10 rounded-full bg-white/5 dark:bg-black/5 flex items-center justify-center hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
            <mat-icon class="text-gray-400 dark:text-gray-600">notifications</mat-icon>
          </button>
        </div>

        <!-- Balance Section -->
        <div class="flex flex-col items-center mb-8">
          <p class="text-gray-400 dark:text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">Total Balance</p>
          <div class="flex items-center gap-3">
            <h1 class="text-5xl font-bold tracking-tight text-white dark:text-black">{{ currencySymbol() }}{{ totalUsdBalance() | number:'1.2-2' }}</h1>
            <button class="text-gray-500 hover:text-gray-300 dark:hover:text-gray-700 transition-colors">
              <mat-icon>visibility</mat-icon>
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-8 mb-10">
          <div class="flex flex-col items-center gap-2">
            <button class="w-14 h-14 rounded-2xl bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 text-white dark:text-black flex items-center justify-center hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
              <mat-icon>add</mat-icon>
            </button>
            <span class="text-xs font-medium text-gray-400 dark:text-gray-500">Deposit</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <button class="w-14 h-14 rounded-2xl bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 text-white dark:text-black flex items-center justify-center hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
              <mat-icon>swap_horiz</mat-icon>
            </button>
            <span class="text-xs font-medium text-gray-400 dark:text-gray-500">Trade</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <button class="w-14 h-14 rounded-2xl bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 text-white dark:text-black flex items-center justify-center hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
              <mat-icon>qr_code_scanner</mat-icon>
            </button>
            <span class="text-xs font-medium text-gray-400 dark:text-gray-500">Pay</span>
          </div>
        </div>

        <!-- Assets List -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">Your Assets</h3>
            <button class="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-black transition-colors">
              <mat-icon>filter_list</mat-icon>
            </button>
          </div>
          
          <div class="space-y-3">
            @for (asset of assets(); track asset.symbol) {
              <div (click)="openToken(asset)" (keyup.enter)="openToken(asset)" tabindex="0" class="flex items-center justify-between bg-[#141414] dark:bg-gray-100 p-4 rounded-3xl border border-white/5 dark:border-black/5 hover:bg-white/[0.04] dark:hover:bg-black/[0.04] transition-colors cursor-pointer active:scale-[0.98]">
                <div class="flex items-center gap-4">
                  @if (asset.type === 'nbx') {
                    <div class="w-11 h-11 rounded-full bg-[#8B5CF6] flex items-center justify-center shadow-lg">
                      <span class="text-white font-black text-xl tracking-tighter">N</span>
                    </div>
                  } @else {
                    <img [src]="asset.icon" [alt]="asset.symbol" class="w-11 h-11 rounded-full object-contain bg-white/5 dark:bg-black/5 p-1">
                  }
                  <div>
                    <p class="font-bold text-lg text-gray-100 dark:text-gray-900 leading-tight">{{ asset.symbol }}</p>
                    <div class="flex items-center gap-2 mt-0.5">
                      <p class="text-xs text-gray-500 dark:text-gray-500">{{ currencySymbol() }}{{ asset.price() | number: (asset.symbol === 'NBX' || asset.symbol === 'PEPE' ? '1.4-6' : '1.2-2') }}</p>
                      <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" 
                            [class.bg-green-500/20]="asset.change() >= 0" 
                            [class.text-green-400]="asset.change() >= 0" 
                            [class.bg-red-500/20]="asset.change() < 0" 
                            [class.text-red-400]="asset.change() < 0">
                        {{ asset.change() >= 0 ? '+' : '' }}{{ asset.change() | number:'1.2-2' }}%
                      </span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-bold text-lg text-white dark:text-black leading-tight">{{ currencySymbol() }}{{ (asset.balance() * asset.price()) | number:'1.2-2' }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ asset.balance() | number:'1.2-2' }} {{ asset.symbol }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <!-- Token Detail View -->
        <div class="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
          <!-- Top Nav -->
          <div class="flex items-center justify-between mb-8">
            <button (click)="closeToken()" class="w-10 h-10 rounded-full bg-white/5 dark:bg-black/5 flex items-center justify-center hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
              <mat-icon class="text-white dark:text-black">arrow_back</mat-icon>
            </button>
            <h2 class="text-lg font-bold text-white dark:text-black">{{ selectedToken().name }}</h2>
            <div class="w-10 h-10"></div> <!-- Spacer for centering -->
          </div>

          <!-- Token Balance -->
          <div class="flex flex-col items-center justify-center mb-10">
            @if (selectedToken().type === 'nbx') {
              <div class="w-20 h-20 rounded-full bg-[#8B5CF6] flex items-center justify-center shadow-lg mb-4">
                <span class="text-white font-black text-4xl tracking-tighter">N</span>
              </div>
            } @else {
              <img [src]="selectedToken().icon" [alt]="selectedToken().symbol" class="w-20 h-20 rounded-full object-contain bg-white/5 dark:bg-black/5 p-2 mb-4">
            }
            
            <h1 class="text-5xl font-bold tracking-tight text-white dark:text-black mb-2">{{ currencySymbol() }}{{ (selectedToken().balance() * selectedToken().price()) | number:'1.2-2' }}</h1>
            <div class="flex items-center gap-2">
              <span class="text-lg font-medium text-gray-400 dark:text-gray-500">{{ selectedToken().balance() | number:'1.2-2' }} {{ selectedToken().symbol }}</span>
              <span class="text-sm font-bold px-2 py-0.5 rounded" 
                    [class.bg-green-500/20]="selectedToken().change() >= 0" 
                    [class.text-green-400]="selectedToken().change() >= 0" 
                    [class.bg-red-500/20]="selectedToken().change() < 0" 
                    [class.text-red-400]="selectedToken().change() < 0">
                {{ selectedToken().change() >= 0 ? '+' : '' }}{{ selectedToken().change() | number:'1.2-2' }}%
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-center gap-6 mb-10">
            <div class="flex flex-col items-center gap-2">
              <button class="w-14 h-14 rounded-2xl bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 text-white dark:text-black flex items-center justify-center hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
                <mat-icon>arrow_upward</mat-icon>
              </button>
              <span class="text-xs font-medium text-gray-400 dark:text-gray-500">Send</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <button class="w-14 h-14 rounded-2xl bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 text-white dark:text-black flex items-center justify-center hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
                <mat-icon>arrow_downward</mat-icon>
              </button>
              <span class="text-xs font-medium text-gray-400 dark:text-gray-500">Receive</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <button class="w-14 h-14 rounded-2xl bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 text-white dark:text-black flex items-center justify-center hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
                <mat-icon>swap_horiz</mat-icon>
              </button>
              <span class="text-xs font-medium text-gray-400 dark:text-gray-500">Trade</span>
            </div>
          </div>

          <!-- History -->
          <div class="flex-1 bg-[#141414] dark:bg-gray-100 rounded-t-3xl -mx-4 p-6 border-t border-white/5 dark:border-black/5 transition-colors duration-300">
            <h3 class="text-sm font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-4">Transaction History</h3>
            
            <div class="space-y-4">
              @for (tx of getTokenHistory(selectedToken().symbol); track tx.id) {
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-black/50 dark:bg-white/50 border border-white/5 dark:border-black/5 flex items-center justify-center" 
                         [class.text-green-400]="tx.type === 'receive'" 
                         [class.text-white]="tx.type === 'send'"
                         [class.dark:text-black]="tx.type === 'send'"
                         [class.text-blue-400]="tx.type === 'trade'">
                      <mat-icon>{{ tx.type === 'receive' ? 'call_received' : (tx.type === 'send' ? 'call_made' : 'swap_horiz') }}</mat-icon>
                    </div>
                    <div>
                      <p class="font-medium text-sm text-gray-200 dark:text-gray-800">{{ tx.title }}</p>
                      <p class="text-xs text-gray-500 mt-0.5">{{ tx.date }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-sm" 
                       [class.text-green-400]="tx.type === 'receive'" 
                       [class.text-white]="tx.type === 'send' || tx.type === 'trade'"
                       [class.dark:text-black]="tx.type === 'send' || tx.type === 'trade'">
                      {{ tx.type === 'receive' ? '+' : (tx.type === 'send' ? '-' : '') }}{{ tx.amount }} {{ selectedToken().symbol }}
                    </p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ currencySymbol() }}{{ (tx.amount * selectedToken().price()) | number:'1.2-2' }}</p>
                  </div>
                </div>
              }
              
              @if (getTokenHistory(selectedToken().symbol).length === 0) {
                <div class="text-center py-8">
                  <mat-icon class="text-gray-600 dark:text-gray-400 text-4xl mb-2">history</mat-icon>
                  <p class="text-gray-500 text-sm">No transactions yet</p>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class WalletComponent implements OnInit, OnDestroy {
  tgService = inject(TelegramService);
  http = inject(HttpClient);
  cryptoService = inject(CryptoService);
  settings = inject(SettingsService);
  platformId = inject(PLATFORM_ID);
  
  balance = signal<number>(0);
  selectedToken = signal<any>(null);
  private intervalId: any;

  // Dynamic Prices & Balances for NBX (mocked)
  nbxPrice = signal(0.01);
  nbxChange = signal(12.50);
  
  // Balances
  balances: Record<string, number> = {
    'BTC': 0,
    'ETH': 0,
    'SOL': 0,
    'TON': 0,
    'USDT': 0,
    'DOGE': 0,
    'NOT': 0,
    'PEPE': 0
  };

  currencySymbol = computed(() => this.settings.getCurrencySymbol(this.settings.currency()));

  assets = computed(() => {
    const tokensData = this.cryptoService.tokens();
    const vsCurrency = this.settings.currency().toLowerCase();
    
    const assetList: any[] = [];

    // Order based on screenshot: BTC, ETH, SOL, TON, USDT, DOGE, NOT, NBX, PEPE
    const order = ['bitcoin', 'ethereum', 'solana', 'the-open-network', 'tether', 'dogecoin', 'notcoin', 'pepe'];

    order.forEach(id => {
      const token = tokensData.find(t => t.id === id);
      if (token) {
        assetList.push({
          symbol: token.symbol.toUpperCase(),
          name: token.name,
          price: () => token.current_price,
          change: () => token.price_change_percentage_24h,
          balance: () => this.balances[token.symbol.toUpperCase()] || 0,
          type: token.symbol.toLowerCase(),
          icon: token.image
        });
      }
    });

    // Add NBX manually
    let currentNbxPrice = this.nbxPrice();
    const usdtToken = tokensData.find(t => t.id === 'tether');
    if (vsCurrency !== 'usd' && usdtToken) {
       currentNbxPrice = currentNbxPrice * usdtToken.current_price;
    }

    // Insert NBX before PEPE
    const nbxAsset = { 
      symbol: 'NBX', 
      name: 'NOBLIX', 
      price: () => currentNbxPrice, 
      change: () => this.nbxChange(), 
      balance: () => this.balance(), 
      type: 'nbx' 
    };
    
    const pepeIndex = assetList.findIndex(a => a.symbol === 'PEPE');
    if (pepeIndex !== -1) {
      assetList.splice(pepeIndex, 0, nbxAsset);
    } else {
      assetList.push(nbxAsset);
    }

    // If API hasn't loaded yet, provide some defaults to match screenshot
    if (assetList.length <= 1) {
      return [
        { symbol: 'BTC', name: 'Bitcoin', price: () => 70949.00, change: () => 2.40, balance: () => 0, type: 'btc', icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
        { symbol: 'ETH', name: 'Ethereum', price: () => 3500.36, change: () => -1.20, balance: () => 0, type: 'eth', icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
        { symbol: 'SOL', name: 'Solana', price: () => 145.20, change: () => 5.40, balance: () => 0, type: 'sol', icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
        { symbol: 'TON', name: 'Toncoin', price: () => 6.35, change: () => 5.80, balance: () => 0, type: 'ton', icon: 'https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png' },
        { symbol: 'USDT', name: 'Tether', price: () => 1.00, change: () => 0.01, balance: () => 0, type: 'usdt', icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' },
        { symbol: 'DOGE', name: 'Dogecoin', price: () => 0.16, change: () => 1.20, balance: () => 0, type: 'doge', icon: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' },
        { symbol: 'NOT', name: 'Notcoin', price: () => 0.015, change: () => 15.80, balance: () => 0, type: 'not', icon: 'https://assets.coingecko.com/coins/images/35461/large/notcoin.png' },
        nbxAsset,
        { symbol: 'PEPE', name: 'Pepe', price: () => 0.000012, change: () => -3.40, balance: () => 0, type: 'pepe', icon: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg' }
      ];
    }

    return assetList;
  });

  totalUsdBalance = computed(() => {
    return this.assets().reduce((total, asset) => total + (asset.balance() * asset.price()), 0);
  });

  // Mock Transaction History
  allTransactions = [
    { id: 1, symbol: 'NBX', title: 'Airdrop Claim', type: 'receive', amount: 500, date: 'Today, 10:30 AM' },
    { id: 2, symbol: 'NBX', title: 'Daily Reward', type: 'receive', amount: 50, date: 'Yesterday, 09:15 AM' },
    { id: 3, symbol: 'SOL', title: 'Deposit', type: 'receive', amount: 0.5, date: 'Mar 07, 14:20 PM' },
    { id: 4, symbol: 'TON', title: 'Trade TON/USDT', type: 'trade', amount: 12.4, date: 'Mar 06, 11:10 AM' },
    { id: 5, symbol: 'USDT', title: 'Deposit', type: 'receive', amount: 25.50, date: 'Mar 05, 08:00 PM' }
  ];

  ngOnInit() {
    const user = this.tgService.user();
    if (user) {
      // Register user and get balance
      this.http.post<{balance: number}>('/api/user/sync', { user }).subscribe({
        next: (res) => {
          this.balance.set(res.balance);
        },
        error: (err) => console.error('Failed to sync user', err)
      });
    }

    // Simulate live market price fluctuations for NBX only in browser
    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = setInterval(() => {
        this.nbxPrice.update(p => p * (1 + (Math.random() * 0.02 - 0.01)));
        this.nbxChange.update(c => c + (Math.random() * 0.5 - 0.25));
      }, 3000);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  openToken(asset: any) {
    this.selectedToken.set(asset);
  }

  closeToken() {
    this.selectedToken.set(null);
  }

  getTokenHistory(symbol: string) {
    return this.allTransactions.filter(tx => tx.symbol === symbol);
  }
}
