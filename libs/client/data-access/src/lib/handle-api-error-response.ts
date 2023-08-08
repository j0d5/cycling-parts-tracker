import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '@cpt/shared/domain';
import { catchError, Observable, throwError } from 'rxjs';

const isApiError = (err: unknown): err is ApiErrorResponse => {
  if (err instanceof HttpErrorResponse) {
    if (
      Object.keys(err.error).includes('message') &&
      Object.keys(err.error).includes('error')
    ) {
      return true;
    }
  }
  return false;
};

/**
 * This OperatorFunction attempts to "normalize" caught errors from the API
 * by ensuring all caught errors are re-thrown as Error objects. This allows
 * subscribers to strongly type the errors being caught in a subscription.
 *
 */
export function handleApiError(obs: Observable<any>) {
  return obs.pipe(
    catchError((err) => {
      const errContent = err.error;
      if (isApiError(err)) {
        const { message } = errContent;
        let returnMsg = message;
        if (Array.isArray(message)) {
          returnMsg = message.join(' ');
        }
        return throwError(() => new Error(returnMsg));
      } else if (err instanceof HttpErrorResponse) {
        return throwError(() => err.error);
      }
      return throwError(() => err);
    })
  );
}
