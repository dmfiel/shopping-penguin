import type { AxiosResponse } from 'axios';

export function responseOK(response: AxiosResponse<any, any>): boolean {
  console.log(response.status, response.statusText);
  return (
    response &&
    response.status >= 200 &&
    response.status <= 299 &&
    (response.statusText === 'OK' || response.statusText === '')
  );
}
