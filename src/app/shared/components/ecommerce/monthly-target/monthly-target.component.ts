import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexFill,
  ApexStroke,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { DropdownItemComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component';

@Component({
  selector: 'app-monthly-target',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
    DropdownComponent,
    DropdownItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './monthly-target.component.html',
})
export class MonthlyTargetComponent implements OnChanges {
  @Input() assets: Record<string, any> = {};

  private entries() {
    return Object.values(this.assets || {});
  }
  get online() {
    return this.entries().filter((e: any) => e.status === 'online').length;
  }
  get offline() {
    return this.entries().filter((e: any) => e.status !== 'online').length;
  }
  get onlinePercent() {
    // use only entries that have a meaningful status (online/offline)
    const totalWithStatus = this.entries().filter((e: any) => typeof e.status === 'string' && e.status.length).length;
    const denom = totalWithStatus || this.entries().length || 1;
    return Math.round((this.online / denom) * 100);
  }

  public series: ApexNonAxisChartSeries = [0];
  public chart: ApexChart = {
    fontFamily: 'Outfit, sans-serif',
    type: 'radialBar',
    height: 220,
    sparkline: { enabled: true },
  };
  public plotOptions: ApexPlotOptions = {
    radialBar: {
      startAngle: -85,
      endAngle: 85,
      hollow: { size: '70%' },
      track: {
        background: '#E4E7EC',
        strokeWidth: '100%',
        margin: 5,
      },
      dataLabels: {
        name: { show: false },
        value: {
          fontSize: '28px',
          fontWeight: '600',
          offsetY: -20,
          color: '#1D2939',
          formatter: (val: number) => `${val}%`,
        },
      },
    },
  };
  public fill: ApexFill = {
    type: 'solid',
    colors: ['#465FFF'],
  };
  public stroke: ApexStroke = {
    lineCap: 'round',
  };
  public labels: string[] = ['Online %'];
  public colors: string[] = ['#465FFF'];

  isOpen = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assets']) {
      this.series = [Math.max(0, Math.min(100, this.onlinePercent))];
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }
}