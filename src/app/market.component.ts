import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex flex-col bg-[#0f0f0f] text-white p-4 min-h-full">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Market</h1>
        <button class="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white transition-colors">
          <mat-icon>search</mat-icon>
        </button>
      </div>

      <div class="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        @for (cat of categories; track cat) {
          <button 
            (click)="activeCategory = cat"
            class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
            [class.bg-blue-600]="activeCategory === cat"
            [class.text-white]="activeCategory === cat"
            [class.bg-gray-800]="activeCategory !== cat"
            [class.text-gray-400]="activeCategory !== cat"
          >
            {{ cat }}
          </button>
        }
      </div>

      <div class="grid grid-cols-2 gap-4 pb-6">
        @for (item of items; track item.id) {
          <div class="bg-gray-900 rounded-2xl p-4 border border-gray-800 flex flex-col">
            <div class="h-24 bg-gray-800 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group">
              <img [src]="item.image" [alt]="item.name" class="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300">
              <div class="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-yellow-400">
                {{ item.rarity }}
              </div>
            </div>
            <h3 class="font-semibold text-sm mb-1 truncate">{{ item.name }}</h3>
            <div class="flex items-center gap-1.5 mb-3">
              <div class="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#9945FF] to-[#14F195] flex items-center justify-center p-[1px]">
                <div class="w-full h-full bg-black rounded-full flex items-center justify-center">
                  <span class="text-[#14F195] font-bold text-[5px]">SOL</span>
                </div>
              </div>
              <p class="text-xs text-gray-500">{{ item.collection }}</p>
            </div>
            <div class="mt-auto flex justify-between items-end">
              <div>
                <p class="text-[10px] text-gray-400 mb-0.5">Price</p>
                <div class="flex items-center gap-1.5">
                  <div class="w-4 h-4 rounded-full bg-gradient-to-br from-blue-700 to-blue-400 flex items-center justify-center shadow-[0_0_5px_rgba(37,99,235,0.5)]">
                    <span class="text-white font-black text-[8px] tracking-tighter">N</span>
                  </div>
                  <p class="font-bold text-blue-400 text-sm">{{ item.price }} NBX</p>
                </div>
              </div>
              <button class="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <mat-icon class="text-sm">shopping_cart</mat-icon>
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class MarketComponent {
  categories = ['All', 'NFTs', 'Boosters', 'Skins', 'Tickets'];
  activeCategory = 'All';

  items = [
    { id: 1, name: 'Genesis Pass', collection: 'Founders', price: 5000, rarity: 'Legendary', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=genesis' },
    { id: 2, name: '2x Multiplier', collection: 'Boosts', price: 1500, rarity: 'Rare', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=boost' },
    { id: 3, name: 'Neon Avatar', collection: 'Cosmetics', price: 800, rarity: 'Uncommon', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=neon' },
    { id: 4, name: 'Mystery Box', collection: 'Loot', price: 2500, rarity: 'Epic', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=box' },
    { id: 5, name: 'VIP Ticket', collection: 'Events', price: 10000, rarity: 'Mythic', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=ticket' },
    { id: 6, name: 'Energy Drink', collection: 'Consumables', price: 300, rarity: 'Common', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=energy' }
  ];
}
