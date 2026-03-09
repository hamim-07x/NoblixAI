import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { TelegramService } from './telegram.service';

@Component({
  selector: 'app-airdrop',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex flex-col bg-[#0f0f0f] text-white p-4 min-h-full">
      <div class="text-center mb-8 mt-4">
        <div class="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
          <mat-icon class="text-5xl text-white">card_giftcard</mat-icon>
        </div>
        <h1 class="text-2xl font-bold mb-2">Airdrop Phase 1</h1>
        <p class="text-gray-400 text-sm">Complete tasks to earn more tokens before the snapshot.</p>
      </div>

      <div class="bg-gray-900 rounded-2xl p-5 mb-6 border border-gray-800">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-300">Your Allocation</span>
          <span class="text-lg font-bold text-purple-400">{{ allocation() }} NBX</span>
        </div>
        <div class="w-full bg-gray-800 rounded-full h-2.5 mt-2">
          <div class="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full" style="width: 45%"></div>
        </div>
        <p class="text-xs text-gray-500 mt-2 text-right">45% of max possible</p>
      </div>

      <h3 class="text-lg font-semibold mb-4">Available Tasks</h3>
      
      <div class="space-y-3 pb-6">
        @for (task of tasks(); track task.id) {
          <div class="bg-gray-900/80 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-purple-400">
                <mat-icon>{{ task.icon }}</mat-icon>
              </div>
              <div>
                <h4 class="font-medium text-sm">{{ task.title }}</h4>
                <p class="text-xs text-gray-400 mt-1">+{{ task.reward }} NBX</p>
              </div>
            </div>
            <button 
              (click)="claimTask(task.id)"
              [disabled]="task.completed"
              class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              [class.bg-purple-600]="!task.completed"
              [class.text-white]="!task.completed"
              [class.hover:bg-purple-700]="!task.completed"
              [class.bg-gray-800]="task.completed"
              [class.text-gray-500]="task.completed"
            >
              {{ task.completed ? 'Done' : 'Start' }}
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class AirdropComponent {
  http = inject(HttpClient);
  tgService = inject(TelegramService);
  
  allocation = signal(1250);
  tasks = signal([
    { id: 1, title: 'Join Telegram Channel', icon: 'campaign', reward: 500, completed: true },
    { id: 2, title: 'Follow on Twitter', icon: 'flutter_dash', reward: 300, completed: false },
    { id: 3, title: 'Connect Wallet', icon: 'account_balance_wallet', reward: 1000, completed: false },
    { id: 4, title: 'Invite 3 Friends', icon: 'group_add', reward: 1500, completed: false }
  ]);

  claimTask(id: number) {
    // Implement task claiming logic
    const taskIndex = this.tasks().findIndex(t => t.id === id);
    if (taskIndex > -1) {
      const newTasks = [...this.tasks()];
      newTasks[taskIndex].completed = true;
      this.tasks.set(newTasks);
      this.allocation.update(val => val + newTasks[taskIndex].reward);
      
      // Update backend
      const user = this.tgService.user();
      if (user) {
        this.http.post('/api/user/add-balance', { 
          userId: user.id, 
          amount: newTasks[taskIndex].reward 
        }).subscribe({
          error: err => console.error('Failed to add balance:', err)
        });
      }
    }
  }
}
