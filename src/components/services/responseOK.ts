import type { AxiosResponse } from 'axios';

export function responseOK(response: AxiosResponse<any, any>): boolean {
  return (
    response &&
    response.status >= 200 &&
    response.status <= 299 &&
    response.statusText === 'OK'
  );
}
