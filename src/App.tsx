import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CustomerTable } from '@/components/CustomerTable';
import { OrderDetails } from '@/components/OrderDetails';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <header className="bg-primary text-primary-foreground sticky top-0 z-10 shadow-md">
          <div className="container mx-auto px-6 h-14 flex items-center gap-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-md bg-primary-foreground/15 ring-1 ring-primary-foreground/20 shrink-0">
              <span className="text-xs font-bold select-none">N</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-sm tracking-tight">
                Northwind
              </span>
              <span className="text-primary-foreground/50 text-xs hidden sm:block">
                Customer Portal
              </span>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-6 py-10">
          <Routes>
            <Route path="/" element={<CustomerTable />} />
            <Route path="/customers/:customerId" element={<OrderDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
