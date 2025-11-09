import { Component, OnInit } from '@angular/core';
// import { EcommerceMetricsComponent } from '../../../shared/components/ecommerce/ecommerce-metrics/ecommerce-metrics.component';
// import { MonthlySalesChartComponent } from '../../../shared/components/ecommerce/monthly-sales-chart/monthly-sales-chart.component';
import { MonthlyTargetComponent } from '../../../shared/components/ecommerce/monthly-target/monthly-target.component';
import { StatisticsChartComponent } from '../../../shared/components/ecommerce/statics-chart/statics-chart.component';
import { DemographicCardComponent } from '../../../shared/components/ecommerce/demographic-card/demographic-card.component';
import { RecentOrdersComponent } from '../../../shared/components/ecommerce/recent-orders/recent-orders.component';
import { AssetListComponent } from '../../../shared/components/inventory/asset-list/asset-list.component';
import { InventoryMetricsComponent } from '../../../shared/components/inventory/inventory-metrics/inventory-metrics.component';
import { SignalRService } from '../../../shared/services/signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ecommerce',
  imports: [
    // EcommerceMetricsComponent,
    // MonthlySalesChartComponent,
    MonthlyTargetComponent,
    StatisticsChartComponent,
    DemographicCardComponent,
    RecentOrdersComponent,
    AssetListComponent,
    InventoryMetricsComponent,    
  ],
  templateUrl: './ecommerce.component.html',
})
export class EcommerceComponent implements OnInit {
  private assetsSub?: Subscription;
  constructor( private signalRService:SignalRService) {}  
  // sample JSON you provided (use real backend response later)
  assets: Record<string, any> = {
    "d8:47:32:b2:c6:5c": {
      "ip": "192.168.1.1",
      "mac": "d8:47:32:b2:c6:5c",
      "hostname": "",
      "vendor": "",
      "first_seen": "2025-10-26T23:06:13.154870+00:00",
      "last_seen": "2025-10-29T21:37:58.625329+00:00",
      "discovery_sources": ["arp"],
      "open_ports": [],
      "evidence": [{"type":"arp","weight":40,"details":"MAC present in ARP/ARP scan"}],
      "confidence": 40,
      "status": "offline"
    },
    "fe:e8:6d:29:ef:d7": {
      "ip": "192.168.1.103",
      "mac": "fe:e8:6d:29:ef:d7",
      "hostname": "",
      "vendor": "",
      "first_seen": "2025-10-26T23:06:13.159769+00:00",
      "last_seen": "2025-10-29T21:37:58.625354+00:00",
      "discovery_sources":["arp"],
      "open_ports": [],
      "evidence":[{"type":"arp","weight":40,"details":"MAC present in ARP/ARP scan"}],
      "confidence":40,
      "status":"offline"
    },
    "74:78:27:01:dc:23": {
      "ip":"192.168.1.101","mac":"74:78:27:01:dc:23","hostname":"","vendor":"",
      "first_seen":"2025-10-26T23:06:13.198581+00:00","last_seen":"2025-10-29T21:37:58.652394+00:00",
      "discovery_sources":["arp"],"open_ports":[],"evidence":[{"type":"arp","weight":40,"details":"MAC present in ARP/ARP scan"}],
      "confidence":40,"status":"offline"
    },
    "2c:33:7a:ff:bd:1b": {
      "ip":"192.168.1.107","mac":"2c:33:7a:ff:bd:1b","hostname":"","vendor":"",
      "first_seen":"2025-10-26T23:06:13.219699+00:00","last_seen":"2025-10-26T23:13:27.956984+00:00",
      "discovery_sources":["arp"],"open_ports":[],"evidence":[{"type":"arp","weight":40,"details":"MAC present in ARP/ARP scan"}],
      "confidence":40,"status":"offline"
    },
    "96:ca:30:f5:29:48": {
      "ip":"192.168.1.109","mac":"96:ca:30:f5:29:48","hostname":"","vendor":"",
      "first_seen":"2025-10-26T23:06:13.234880+00:00","last_seen":"2025-10-26T23:13:27.956996+00:00",
      "discovery_sources":["arp","mdns"],"open_ports":[],"evidence":[{"type":"arp","weight":40,"details":"MAC present in ARP/ARP scan"},{"type":"mdns","weight":30,"details":"mDNS service observed"}],
      "confidence":70,"status":"offline"
    },
    "fa:d7:89:f7:32:c9": {
      "ip":"192.168.1.105","mac":"fa:d7:89:f7:32:c9","hostname":"","vendor":"",
      "first_seen":"2025-10-26T23:08:44.318472+00:00","last_seen":"2025-10-26T23:13:27.957007+00:00",
      "discovery_sources":["arp"],"open_ports":[],"evidence":[{"type":"arp","weight":40,"details":"MAC present in ARP/ARP scan"}],
      "confidence":40,"status":"offline"
    },
    "82:73:15:f9:49:a1": {
      "ip":"192.168.1.100","mac":"82:73:15:f9:49:a1","hostname":"","vendor":"",
      "first_seen":"2025-10-29T21:37:58.563670+00:00","last_seen":"2025-10-29T21:37:58.737661+00:00",
      "discovery_sources":["arp"],"open_ports":[],"evidence":[{"type":"arp","weight":40,"details":"MAC present in ARP/ARP scan"}],
      "confidence":40,"status":"offline"
    },
  };
  
   ngOnInit(): void {
    this.signalRService.startConnection();

    // ensure service will emit updates into assets$
    this.signalRService.addDeviceUpdateListener();
    
    this.assetsSub = this.signalRService.getAssetsObservable().subscribe((incoming) => {
      if (!incoming) { return; }
      
      const incomingKeys = Object.keys(incoming);
      const looksLikeMap = incomingKeys.every(k => typeof incoming[k] === 'object');
      if (looksLikeMap) {

        this.assets = { ...incoming };
      } else {

        this.assets = { ...this.assets, ...incoming };
      }
    });

    this.signalRService.listenTriggerScan();
  }

    ngOnDestroy(): void {
    this.assetsSub?.unsubscribe();
  }

  hello():void{
    let inp ='Hellow'
    this.signalRService.sayhellotoBackend(inp);
  }
}
