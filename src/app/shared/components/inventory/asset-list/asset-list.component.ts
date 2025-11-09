import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-md shadow-sm overflow-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left text-xs text-gray-600 dark:text-gray-300">IP / MAC</th>
            <th class="px-4 py-2 text-left text-xs text-gray-600 dark:text-gray-300">Status</th>
            <th class="px-4 py-2 text-left text-xs text-gray-600 dark:text-gray-300">First seen</th>
            <th class="px-4 py-2 text-left text-xs text-gray-600 dark:text-gray-300">Last seen</th>
            <th class="px-4 py-2 text-left text-xs text-gray-600 dark:text-gray-300">Confidence</th>
          </tr>
        </thead>

        <tbody *ngIf="assetArray.length; else emptyState">
          <tr *ngFor="let a of assetArray; trackBy: trackByKey" class="border-t border-gray-100 dark:border-gray-700">
            <td class="px-4 py-3">
              <div class="font-medium text-gray-800 dark:text-gray-100">{{ a.ip || a.mac || a._key }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ a.mac }}</div>
            </td>

            <td class="px-4 py-3">
              <span
                class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                [ngClass]="a.status === 'online'
                  ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300'">
                {{ a.status || 'unknown' }}
              </span>
            </td>

            <td class="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">{{ toLocal(a.first_seen) }}</td>
            <td class="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">{{ toLocal(a.last_seen) }}</td>
            <td class="px-4 py-3 text-gray-800 dark:text-gray-100">{{ a.confidence ?? '-' }}</td>
          </tr>
        </tbody>
      </table>

      <ng-template #emptyState>
        <div class="p-6 text-center text-gray-600 dark:text-gray-300">
          No assets found.
        </div>
      </ng-template>
    </div>
  `
})
export class AssetListComponent {
  @Input() assets: Record<string, any> = {};

  get assetArray() {
    return Object.entries(this.assets || {}).map(([k, v]) => ({ ...v, _key: k }));
  }

  trackByKey(_: number, item: any) { return item._key; }
  toLocal(t?: string) { return t ? new Date(t).toLocaleString() : '-'; }
}