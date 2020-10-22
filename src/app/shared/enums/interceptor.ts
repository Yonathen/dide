import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavigationInterceptor } from '../interceptor/navigation.interceptor';

/** Http interceptor providers in outside-in order */
export const navigationInterceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: NavigationInterceptor, multi: true },
];
