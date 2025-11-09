import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../../ui/badge/badge.component';

@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recent-orders.component.html'
})
export class RecentOrdersComponent {
  @Input() assets: Record<string, any> = {};

  get recentAssets() {
    return Object.entries(this.assets || {})
      .map(([k, v]) => ({ ...v, _key: k }))
      .filter(a => a.last_seen)
      .sort((x: any, y: any) => Date.parse(y.last_seen) - Date.parse(x.last_seen))
      .slice(0, 2);
  }

  trackByKey(_: number, item: any) { return item._key; }
  toLocal(t?: string) { return t ? new Date(t).toLocaleString() : '-'; }

  getBadgeColor(status: string): 'success' | 'warning' | 'error' {
    if (status === 'Delivered') return 'success';
    if (status === 'Pending') return 'warning';
    return 'error';
  }
}