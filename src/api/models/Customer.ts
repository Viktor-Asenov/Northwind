/* tslint:disable */
/* eslint-disable */
import type { Order } from './Order';

export interface Customer {
  customerId?: string | null;
  companyName?: string | null;
  contactName?: string | null;
  contactTitle?: string | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phone?: string | null;
  fax?: string | null;
  orders?: Order[] | null;
}
