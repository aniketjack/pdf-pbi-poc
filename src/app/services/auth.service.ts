import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  accessToken: string = '';
  activeUser = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient, private msalService: MsalService) {}

  login() {
    return this.msalService.loginRedirect();
  }

  checkAndSetActiveAccounts() {
    return new Promise((resolve, reject) => {
      let activeAccount = this.msalService.instance.getActiveAccount();

      if (
        !activeAccount &&
        this.msalService.instance.getAllAccounts().length > 0
      ) {
        let accounts = this.msalService.instance.getAllAccounts();
        this.msalService.instance.setActiveAccount(accounts[0]);
        activeAccount = accounts[0];
      }
      if (activeAccount) {
        this.activeUser.next(activeAccount);
        localStorage.setItem('_u', JSON.stringify(activeAccount));
        this.storeAccessToken();
        resolve(activeAccount);
      } else {
        resolve(null);
      }
    });
  }

  getActiveAccounts() {
    return this.msalService.instance.getAllAccounts();
  }

  signOut() {
    localStorage.removeItem('_u');
    this.msalService.logout();
  }

  storeAccessToken() {
    for (const storage of Object.keys(localStorage)) {
      if (storage.includes('accesstoken')) {
        const storageItem: any = JSON.parse(
          localStorage.getItem(storage) || ''
        );
        this.accessToken = storageItem['secret'];
      }
    }
  }

  refreshToken() {
    return this.msalService.instance.acquireTokenSilent({
      scopes: ['https://analysis.windows.net/powerbi/api/dataset.read.all'],
      account: this.msalService.instance.getActiveAccount() as AccountInfo,
    });
  }
}
