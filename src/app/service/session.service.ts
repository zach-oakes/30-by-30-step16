import { Injectable } from '@angular/core';
import {Session} from "../model/session";

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  getSession(id: string): Session | null {
    const sessionItem = sessionStorage.getItem(id);

    if (sessionItem) {
      return JSON.parse(sessionItem) as Session;
    }

    return null;
  }
}
