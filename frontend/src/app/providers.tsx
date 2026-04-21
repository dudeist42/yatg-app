'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/shared/lib/query-client';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
