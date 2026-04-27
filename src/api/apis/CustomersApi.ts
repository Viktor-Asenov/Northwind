/* tslint:disable */
/* eslint-disable */

import * as runtime from '../runtime';
import type { Customer } from '../models/Customer';

export interface ApiCustomersIdGetRequest {
  id: string;
}

export class CustomersApi extends runtime.BaseAPI {
  async apiCustomersGet(
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<Customer[]> {
    const response = await this.request(
      { path: `/api/Customers`, method: 'GET', headers: {} },
      initOverrides
    );
    return new runtime.JSONApiResponse<Customer[]>(response).value();
  }

  async apiCustomersIdGet(
    requestParameters: ApiCustomersIdGetRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<Customer> {
    if (requestParameters['id'] == null) {
      throw new runtime.RequiredError(
        'id',
        'Required parameter "id" was null or undefined when calling apiCustomersIdGet().'
      );
    }
    let urlPath = `/api/Customers/{id}`;
    urlPath = urlPath.replace(
      `{${'id'}}`,
      encodeURIComponent(String(requestParameters['id']))
    );
    const response = await this.request(
      { path: urlPath, method: 'GET', headers: {} },
      initOverrides
    );
    return new runtime.JSONApiResponse<Customer>(response).value();
  }
}
