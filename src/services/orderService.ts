import { OrdersApi } from '@/api';
import { apiConfig } from './apiConfig';

const client = new OrdersApi(apiConfig);

export const orderService = {
  getByCustomer: (customerId: string) => client.apiOrdersGet({ customerId }),
  getById: (id: number) => client.apiOrdersIdGet({ id }),
};
