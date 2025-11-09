import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-metrics',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="p-4 rounded-md shadow-sm bg-white dark:bg-gray-800">
        <div class="text-xs text-gray-500 dark:text-gray-400">Total devices</div>
        <div class="text-2xl font-semibold text-gray-800 dark:text-gray-100">{{ total }}</div>
      </div>

      <div class="p-4 rounded-md shadow-sm bg-white dark:bg-gray-800">
        <div class="text-xs text-gray-500 dark:text-gray-400">Online</div>
        <div class="flex items-center">
          <!-- green blinking dot -->
          <span class="relative inline-flex mr-3 items-center" aria-hidden="true">
            <span class="inline-flex h-3 w-3 rounded-full bg-green-400 dark:bg-green-300"></span>
            <span class="absolute inline-flex h-full w-full rounded-full bg-green-400 dark:bg-green-300 opacity-75 animate-ping"></span>
          </span>
          <div class="text-2xl font-semibold text-green-600 dark:text-green-400">{{ online }}</div>
        </div>
      </div>

      <div class="p-4 rounded-md shadow-sm bg-white dark:bg-gray-800">
        <div class="text-xs text-gray-500 dark:text-gray-400">Offline</div>
        <div class="flex items-center">
          <!-- red blinking dot -->
          <span class="relative inline-flex mr-3 items-center" aria-hidden="true">
            <span class="inline-flex h-3 w-3 rounded-full bg-red-500 dark:bg-red-400"></span>
            <span class="absolute inline-flex h-full w-full rounded-full bg-red-500 dark:bg-red-400 opacity-75 animate-ping"></span>
          </span>
          <div class="text-2xl font-semibold text-red-600 dark:text-red-400">{{ offline }}</div>
        </div>
      </div>

      <div class="p-4 rounded-md shadow-sm bg-white dark:bg-gray-800">
        <div class="text-xs text-gray-500 dark:text-gray-400">Newest seen</div>
        <div class="text-sm text-gray-700 dark:text-gray-200">{{ newestSeen || '-' }}</div>
      </div>
    </div>
  `
})
export class InventoryMetricsComponent {
  @Input() assets: Record<string, any> = {};

  get entries() { return Object.values(this.assets || {}); }
  get total() { return this.entries.length; }
  get online() { return this.entries.filter((e: any) => e.status === 'online').length; }
  get offline() { return this.entries.filter((e: any) => e.status !== 'online').length; }
  get newestSeen() {
    const times = this.entries
      .map((e: any) => e.last_seen ? Date.parse(e.last_seen) : 0)
      .filter(Boolean)
      .sort((a,b) => b - a);
    return times.length ? new Date(times[0]).toLocaleString() : null;
  }
}