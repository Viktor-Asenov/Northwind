import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerService } from '@/services/customerService';
import { orderService } from '@/services/orderService';
import type { Customer, Order } from '@/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Package, MapPin, Phone, User } from 'lucide-react';

export function OrderDetails() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;
    Promise.all([
      customerService.getById(customerId),
      orderService.getByCustomer(customerId),
    ])
      .then(([cust, ords]) => {
        setCustomer(cust);
        setOrders(ords);
      })
      .catch(() => setError('Failed to load customer details.'))
      .finally(() => setLoading(false));
  }, [customerId]);

  const fmt = (d?: Date | string | null) =>
    d
      ? new Date(d).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '—';

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/')}
        className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Customers
      </Button>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-5 py-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Customer card */}
      {loading ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : (
        customer && (
          <Card className="overflow-hidden">
            <div className="bg-muted/40 border-b px-6 py-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {customer.companyName}
                  </h1>
                  <span className="mt-1.5 inline-block font-mono text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded border">
                    {customer.customerId}
                  </span>
                </div>
                {customer.country && (
                  <Badge
                    variant="outline"
                    className="self-start gap-1 shrink-0"
                  >
                    <MapPin className="h-3 w-3" />
                    {[customer.city, customer.country]
                      .filter(Boolean)
                      .join(', ')}
                  </Badge>
                )}
              </div>
            </div>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4 pt-5 pb-5 text-sm">
              {(
                [
                  {
                    icon: <User className="h-3.5 w-3.5" />,
                    label: 'Contact',
                    value: customer.contactName,
                  },
                  { icon: null, label: 'Title', value: customer.contactTitle },
                  {
                    icon: <Phone className="h-3.5 w-3.5" />,
                    label: 'Phone',
                    value: customer.phone,
                  },
                  { icon: null, label: 'Fax', value: customer.fax },
                  {
                    icon: <MapPin className="h-3.5 w-3.5" />,
                    label: 'Address',
                    value: customer.address,
                  },
                  { icon: null, label: 'Region', value: customer.region },
                  { icon: null, label: 'Postal', value: customer.postalCode },
                ] as {
                  icon: React.ReactNode;
                  label: string;
                  value: string | null | undefined;
                }[]
              )
                .filter(({ value }) => value)
                .map(({ icon, label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5 flex items-center gap-1">
                      {icon}
                      {label}
                    </p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
            </CardContent>
          </Card>
        )
      )}

      {/* Orders heading */}
      <div className="flex items-center gap-2 pt-2">
        <Package className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">
          {loading ? 'Orders' : `Orders (${orders.length})`}
        </h2>
      </div>

      {/* Orders table */}
      {loading ? (
        <Skeleton className="h-48 w-full rounded-xl" />
      ) : orders.length === 0 ? (
        <div className="rounded-xl border bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
          No orders found for this customer.
        </div>
      ) : (
        <div className="rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-24 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Order #
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ordered
                </TableHead>
                <TableHead className="hidden sm:table-cell text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Required By
                </TableHead>
                <TableHead className="hidden sm:table-cell text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Shipped
                </TableHead>
                <TableHead className="hidden md:table-cell text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ship To
                </TableHead>
                <TableHead className="hidden sm:table-cell text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Freight
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.orderId}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <TableCell className="font-mono font-semibold text-sm">
                    #{order.orderId}
                  </TableCell>
                  <TableCell className="text-sm">
                    {fmt(order.orderDate)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {fmt(order.requiredDate)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {fmt(order.shippedDate)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {order.shipName && (
                      <div>
                        <div className="text-sm font-medium">
                          {order.shipName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {[order.shipCity, order.shipCountry]
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right font-mono text-sm">
                    {order.freight != null
                      ? `$${order.freight.toFixed(2)}`
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={order.shippedDate ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {order.shippedDate ? 'Shipped' : 'Pending'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
