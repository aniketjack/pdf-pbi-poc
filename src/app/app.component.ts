import { Component } from '@angular/core';
import { MsalBroadcastService } from '@azure/msal-angular';
import { AuthService } from './services/auth.service';
import {
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pbi-poc-app';
  userDetails: any;
  userName: any;
  constructor(
    private msalBroadcastService: MsalBroadcastService,
    private authService: AuthService,
  ){}


  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
      )
      .subscribe((result: EventMessage) => {
        this.authService.checkAndSetActiveAccounts().then((res) => {
          this.userDetails = res;
          console.log("checkAndSetActiveAccounts Final Role",this.userDetails?.idTokenClaims);
          this.userDetails.name=this.userDetails.name.trim()
          let nameArr=this.userDetails.name.split(',');
          this.userName = nameArr[1]+" "+nameArr[0];
        });
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.authService.checkAndSetActiveAccounts().then((res) => {
          this.authService.storeAccessToken();
          this.userDetails = res;
          console.log("checkAndSetActiveAccounts Final Role",this.userDetails?.idTokenClaims);
          this.userDetails.name=this.userDetails.name.trim()
          let nameArr=this.userDetails.name.split(',');
          this.userName=nameArr[1]+" "+nameArr[0];
        });
      });

    this.authService.checkAndSetActiveAccounts().then((res) => {
      this.userDetails = res;
      this.userDetails.name=this.userDetails.name.trim()
      let nameArr=this.userDetails.name.split(',');
      this.userName=nameArr[1]+" "+nameArr[0];
      console.log("checkAndSetActiveAccounts Final Role",this.userDetails?.idTokenClaims);
    });

  }


}
