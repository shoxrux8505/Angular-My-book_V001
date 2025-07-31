import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  parsToString(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }

  log(message: string) {
    if (!environment.production) {
      console.log(`[Log]: ${this.parsToString(message)}`);
    }
  }

  warn(message: string) {
    if (!environment.production) {
      console.warn(`[Warning]: ${this.parsToString(message)}`);
    }
  }

  error(message: string) {
    console.error(`[Error]: ${this.parsToString(message)}`);  // Xatolarni har doim ko'rsatish
  }

  info(message: string) {
    if (!environment.production) {
      console.info(`[Info]: ${this.parsToString(message)}`);
    }
  }

  debug(message: string) {
    if (!environment.production) {
      console.debug(`[Debug]: ${this.parsToString(message)}`);
    }
  }
}
