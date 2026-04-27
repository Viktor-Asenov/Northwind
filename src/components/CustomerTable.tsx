import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerService } from '@/services/customerService';
import type { Customer } from '@/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Search,
  Users,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  X,
} from 'lucide-react';

type SortKey = keyof Pick<
  Customer,
  'customerId' | 'companyName' | 'contactName' | 'country'
>;
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 10;

function getPageNums(page: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '…')[] = [1];
  if (page > 3) pages.push('…');
  for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++)
    pages.push(i);
  if (page < total - 2) pages.push('…');
  pages.push(total);
  return pages;
}

export function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('companyName');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    customerService
      .getAll()
      .then(setCustomers)
      .catch(() =>
        setError('Failed to load customers. Ensure the API is running.')
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.customerId?.toLowerCase().includes(q) ||
        c.companyName?.toLowerCase().includes(q) ||
        c.contactName?.toLowerCase().includes(q) ||
        c.country?.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = (a[sortKey] ?? '').toLowerCase();
      const bv = (b[sortKey] ?? '').toLowerCase();
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageNums = getPageNums(page, totalPages);

  const ColHeader = ({ label, col }: { label: string; col: SortKey }) => {
    const active = sortKey === col;
    return (
      <button
        onClick={() => handleSort(col)}
        className={cn(
          'flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider select-none transition-colors hover:text-foreground',
          active ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        {label}
        {active ? (
          sortDir === 'asc' ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-35" />
        )}
      </button>
    );
  };

  if (error)
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
        <span className="font-semibold">Error:</span> {error}
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <Users className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        </div>
        <p className="ml-[52px] mt-1 text-sm text-muted-foreground">
          {loading
            ? 'Loading…'
            : `${customers.length} customers in your database`}
        </p>
      </div>

      {/* Search bar */}
      <Card className="border shadow-sm">
        <CardContent className="flex items-center gap-4 px-5 py-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by company, contact, ID or country…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-9 bg-background pl-9 pr-9 shadow-none"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {!loading && (
            <p className="shrink-0 text-sm text-muted-foreground tabular-nums">
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>
              {filtered.length !== customers.length && (
                <span> of {customers.length}</span>
              )}{' '}
              results
            </p>
          )}
        </CardContent>
      </Card>

      {/* Data table */}
      <Card className="overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-28 pl-5">
                <ColHeader label="ID" col="customerId" />
              </TableHead>
              <TableHead>
                <ColHeader label="Company" col="companyName" />
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <ColHeader label="Contact" col="contactName" />
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <ColHeader label="Country" col="country" />
              </TableHead>
              <TableHead className="w-10 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <TableRow key={i} className={cn(i % 2 === 1 && 'bg-muted/20')}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j} className={cn(j === 0 && 'pl-5')}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Search className="h-8 w-8 opacity-25" />
                    <p className="text-sm font-medium">
                      No customers match &ldquo;{search}&rdquo;
                    </p>
                    <button
                      onClick={() => setSearch('')}
                      className="text-xs underline-offset-2 hover:underline"
                    >
                      Clear search
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((c, idx) => (
                <TableRow
                  key={c.customerId}
                  onClick={() => navigate(`/customers/${c.customerId}`)}
                  className={cn(
                    'group cursor-pointer transition-colors',
                    idx % 2 === 1
                      ? 'bg-muted/20 hover:bg-muted/50'
                      : 'hover:bg-muted/40'
                  )}
                >
                  <TableCell className="pl-5">
                    <span className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[11px] tracking-wide text-muted-foreground">
                      {c.customerId}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {c.companyName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm leading-tight">{c.contactName}</div>
                    {c.contactTitle && (
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        {c.contactTitle}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                      {c.country}
                    </span>
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 pt-1">
          <p className="text-xs text-muted-foreground">
            Showing{' '}
            <span className="font-medium text-foreground">
              {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, sorted.length)}
            </span>{' '}
            of{' '}
            <span className="font-medium text-foreground">{sorted.length}</span>{' '}
            customers
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage(1)}
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {pageNums.map((n, i) =>
              n === '…' ? (
                <span
                  key={`ellipsis-${i}`}
                  className="flex h-8 w-8 select-none items-center justify-center text-sm text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <Button
                  key={n}
                  variant={n === page ? 'default' : 'outline'}
                  size="icon"
                  className={cn(
                    'h-8 w-8 text-sm',
                    n === page && 'pointer-events-none shadow-none'
                  )}
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
