import { CustomersApi } from '@/api';
import { apiConfig } from './apiConfig';

const client = new CustomersApi(apiConfig);

export const customerService = {
  getAll: () => client.apiCustomersGet(),
  getById: (id: string) => client.apiCustomersIdGet({ id }),
};
