import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import TelegramAuthProvider from './components/TelegramAuthProvider';
import Home                 from './pages/Home';
import Nearby               from './pages/Nearby';
import BusinessProfile      from './pages/BusinessProfile';
import Booking              from './pages/Booking';
import BottomNav            from './components/BottomNav';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TelegramAuthProvider>
        <div className="max-w-md mx-auto min-h-screen bg-gray-50 relative">
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/nearby"       element={<Nearby />} />
            <Route path="/business/:id" element={<BusinessProfile />} />
            <Route path="/booking/:id"  element={<Booking />} />
          </Routes>
          <BottomNav />
        </div>
      </TelegramAuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;