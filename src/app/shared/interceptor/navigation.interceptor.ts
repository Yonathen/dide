import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class NavigationInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    /*const headers = new HttpHeaders({
        'Content-Type' : 'application/form-data; charset=UTF-8, application/json',
        Authorization : `Bearer ${T}`,
      });

    const requestChange = request.clone({headers});
    return next.handle(requestChange).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && (event.status === 201 || event.status === 200)) {
          this.spinner.hide();
        }
      })
    );*/
    return next.handle(request);
  }
}
