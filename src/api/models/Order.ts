/* tslint:disable */
/* eslint-disable */

export interface Order {
  orderId?: number | null;
  customerId?: string | null;
  employeeId?: number | null;
  orderDate?: string | null;
  requiredDate?: string | null;
  shippedDate?: string | null;
  shipVia?: number | null;
  freight?: number | null;
  shipName?: string | null;
  shipAddress?: string | null;
  shipCity?: string | null;
  shipRegion?: string | null;
  shipPostalCode?: string | null;
  shipCountry?: string | null;
}
