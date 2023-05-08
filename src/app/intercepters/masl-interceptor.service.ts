import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MaslInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error?.headers?.get('x-powerbi-error-info') === 'TokenExpired' ||
          error?.error?.code === 'TokenExpired'
        ) {
          this.authService
            .refreshToken()
            .then((res: any) => {
              location.reload();
            })
            .catch((err: any) => {
              this.authService.signOut();
            });
        }
        return throwError(error);
      })
    );
  }
}
