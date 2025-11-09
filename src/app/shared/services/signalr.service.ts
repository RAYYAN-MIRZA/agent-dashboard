// src/app/services/signalr.service.ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  public deviceUpdates$ = new BehaviorSubject<any>(null);
  private apiUrl:string = "https://localhost:44336/agentHub";
  public assets$ = new BehaviorSubject<Record<string, any>>({});

  constructor() {}

  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl, { 
      // Add the http/https configuration here
      skipNegotiation: true, // You may need this for certain deployment scenarios, 
      transport: signalR.HttpTransportType.WebSockets, // Force WebSockets for faster debugging
      // The crucial part for CORS:
      withCredentials: true // <--- ADD THIS
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connected'))
      .catch(err => console.log('SignalR connection error:', err));
  }

  public addDeviceUpdateListener() {
    this.hubConnection?.on("Receive Scan Update", (data: any) => {
      // Parse incoming payload safely (string, object, ArrayBuffer, Blob)
      let parsed = this.parseIncoming(data);
      console.log('backend said ->', parsed);
      parsed = parsed?.devices;
      if (!parsed) { return; }

      // Emit parsed raw update for anyone listening
      this.deviceUpdates$.next(parsed);

      // Unwrap common wrappers (e.g., { payload: {...} } or { data: {...} })
      let payload: any = parsed;
      if (payload.payload && (typeof payload.payload === 'object')) payload = payload.payload;
      if (payload.data && (typeof payload.data === 'object')) payload = payload.data;

      // If backend sends an array of devices, convert to map by mac/ip (merge)
      if (Array.isArray(payload)) {
        const map: Record<string, any> = {};
        payload.forEach((d: any) => {
          const key = d.mac || d.ip || d.id || JSON.stringify(d);
          map[key] = d;
        });
        this.assets$.next({ ...(this.assets$.value || {}), ...map });
        return;
      }

      // If payload is an object, detect whether it's a full map (key -> device)
      if (typeof payload === 'object') {
        const keys = Object.keys(payload);
        const looksLikeMap = keys.length > 0 && keys.every(k =>
          typeof payload[k] === 'object' &&
          (payload[k].ip !== undefined || payload[k].mac !== undefined || payload[k].last_seen !== undefined)
        );

        if (looksLikeMap) {
          // Replace full snapshot
          this.assets$.next({ ...payload });
          return;
        }

        // Single device object (has mac or ip) -> merge under that key
        if (payload.mac || payload.ip) {
          const key = payload.mac || payload.ip;
          const current = this.assets$.value || {};
          this.assets$.next({ ...current, [key]: payload });
          return;
        }

        // Fallback: merge object into existing map
        const current = this.assets$.value || {};
        this.assets$.next({ ...current, ...payload });
      }
    });
  }

  // helper: safely parse incoming payloads
  private parseIncoming(data: any): any {
    if (data == null) return null;

    // already an object
    if (typeof data === 'object') return data;

    // string (JSON)
    if (typeof data === 'string') {
      try { return JSON.parse(data); } catch (err) { console.warn('SignalR: invalid JSON string', err); return null; }
    }

    // try decode ArrayBuffer / Uint8Array -> string -> JSON
    try {
      if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
        const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : new Uint8Array((data as any).buffer || data);
        const text = new TextDecoder().decode(bytes);
        return JSON.parse(text);
      }
    } catch (err) {
      console.warn('SignalR: could not decode binary payload', err);
      return null;
    }

    // unknown shape
    return null;
  }

  public sayhellotoBackend(arg: any): Promise<any> {
  // Use 'return' to allow the calling component to handle the Promise (good practice)
  return this.hubConnection.invoke("SendScanResult", arg)
    .then((result) => {
      // The 'result' is the value returned by the C# SendScanResult method
      console.log('Backend successfully invoked. Server returned:', result);
      return result; // Return the result for further chaining
    })
    .catch((err) => {
      // Handle any exceptions or errors from the server-side method
      console.error('Error invoking SendScanResult on the backend:', err);
      throw err; // Re-throw the error
    });
}

  public stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  
  public listenTriggerScan() {
    this.hubConnection.on("TriggerScan", (data: any) => {      
      console.log('backedn said->',data)
    });
  }

  getAssetsObservable(): Observable<Record<string, any>> {
    return this.assets$.asObservable();
  }

}
