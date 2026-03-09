import { Component, inject, signal, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { TelegramService } from './telegram.service';

@Component({
  selector: 'app-earn',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex flex-col bg-[#0f0f0f] text-white p-4 min-h-full">
      <div class="text-center mb-6 mt-4">
        <h1 class="text-3xl font-bold mb-2">Tap to Earn</h1>
        <p class="text-gray-400 text-sm">Tap the coin to earn NBX</p>
      </div>

      <div class="flex-1 flex flex-col items-center justify-center relative py-10">
        <div class="text-5xl font-bold text-amber-500 mb-8 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
          {{ balance() | number }}
        </div>

        <button 
          (click)="tap()"
          class="w-64 h-64 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_50px_rgba(245,158,11,0.3)] flex items-center justify-center active:scale-95 transition-transform duration-100 relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-white/20 rounded-full blur-xl scale-75"></div>
          <span class="text-9xl font-black text-amber-100 drop-shadow-md">N</span>
        </button>

        <div class="mt-12 w-full max-w-xs">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-400 flex items-center gap-1"><mat-icon class="text-sm">bolt</mat-icon> Energy</span>
            <span class="font-bold">{{ energy() }} / {{ maxEnergy }}</span>
          </div>
          <div class="w-full bg-gray-800 rounded-full h-3">
            <div class="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-300" [style.width.%]="(energy() / maxEnergy) * 100"></div>
          </div>
        </div>
      </div>

      <!-- Floating +1 animations container -->
      <div class="fixed inset-0 pointer-events-none overflow-hidden z-50" id="tap-container"></div>
    </div>
  `
})
export class EarnComponent implements OnInit, OnDestroy {
  http = inject(HttpClient);
  tgService = inject(TelegramService);
  platformId = inject(PLATFORM_ID);

  balance = signal(0);
  energy = signal(1000);
  maxEnergy = 1000;
  tapValue = 1;
  private intervalId: any;

  ngOnInit() {
    const user = this.tgService.user();
    if (user) {
      this.http.post<{balance: number}>('/api/user/sync', { user }).subscribe({
        next: res => this.balance.set(res.balance),
        error: err => console.error('Failed to sync user:', err)
      });
    }

    // Energy regeneration only in browser
    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = setInterval(() => {
        if (this.energy() < this.maxEnergy) {
          this.energy.update(e => Math.min(this.maxEnergy, e + 1));
        }
      }, 1000);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  tap() {
    if (this.energy() >= this.tapValue) {
      this.balance.update(b => b + this.tapValue);
      this.energy.update(e => e - this.tapValue);
      
      this.createFloatingNumber();

      // Debounce API call in real app, but for demo we can just call it or sync periodically
      const user = this.tgService.user();
      if (user) {
        this.http.post('/api/user/add-balance', { 
          userId: user.id, 
          amount: this.tapValue 
        }).subscribe({
          error: err => console.error('Failed to add balance:', err)
        });
      }
    }
  }

  createFloatingNumber() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const container = document.getElementById('tap-container');
    if (!container) return;

    const el = document.createElement('div');
    el.textContent = '+' + this.tapValue;
    el.className = 'absolute text-2xl font-bold text-amber-400 pointer-events-none select-none animate-float-up';
    
    // Random position around center
    const x = window.innerWidth / 2 + (Math.random() * 100 - 50);
    const y = window.innerHeight / 2 + (Math.random() * 100 - 50);
    
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    
    container.appendChild(el);
    
    setTimeout(() => {
      el.remove();
    }, 1000);
  }
}
