/* tslint:disable */
/* eslint-disable */

import * as runtime from '../runtime';
import type { Order } from '../models/Order';

export interface ApiOrdersGetRequest {
  customerId?: string;
}

export interface ApiOrdersIdGetRequest {
  id: number;
}

export class OrdersApi extends runtime.BaseAPI {
  async apiOrdersGet(
    requestParameters: ApiOrdersGetRequest = {},
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<Order[]> {
    const queryParameters: runtime.HTTPQuery = {};
    if (requestParameters['customerId'] != null) {
      queryParameters['customerId'] = requestParameters['customerId'];
    }
    const response = await this.request(
      {
        path: `/api/Orders`,
        method: 'GET',
        headers: {},
        query: queryParameters,
      },
      initOverrides
    );
    return new runtime.JSONApiResponse<Order[]>(response).value();
  }

  async apiOrdersIdGet(
    requestParameters: ApiOrdersIdGetRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<Order> {
    if (requestParameters['id'] == null) {
      throw new runtime.RequiredError(
        'id',
        'Required parameter "id" was null or undefined when calling apiOrdersIdGet().'
      );
    }
    let urlPath = `/api/Orders/{id}`;
    urlPath = urlPath.replace(
      `{${'id'}}`,
      encodeURIComponent(String(requestParameters['id']))
    );
    const response = await this.request(
      { path: urlPath, method: 'GET', headers: {} },
      initOverrides
    );
    return new runtime.JSONApiResponse<Order>(response).value();
  }
}
