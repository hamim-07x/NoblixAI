import { Injectable, signal, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService, Currency } from './settings.service';

export interface TokenData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private http = inject(HttpClient);
  private settings = inject(SettingsService);
  
  tokens = signal<TokenData[]>([]);

  private coinIds = ['bitcoin', 'ethereum', 'solana', 'the-open-network', 'tether', 'dogecoin', 'notcoin', 'pepe'];

  constructor() {
    this.fetchPrices(this.settings.currency());
    
    // Refresh when currency changes
    effect(() => {
      this.fetchPrices(this.settings.currency());
    });

    // Refresh every 30 seconds
    setInterval(() => this.fetchPrices(this.settings.currency()), 30000);
  }

  private fetchPrices(currency: Currency) {
    const vsCurrency = currency.toLowerCase();
    const ids = this.coinIds.join(',');
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vsCurrency}&ids=${ids}`;
    
    this.http.get<TokenData[]>(url)
      .subscribe({
        next: (data) => this.tokens.set(data),
        error: (err) => console.error('Failed to fetch crypto prices', err)
      });
  }
}
