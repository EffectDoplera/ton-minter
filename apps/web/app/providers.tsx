'use client'

import { TonConnectUIProvider } from '@/features/connect-wallet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TonConnectUIProvider manifestUrl="https://app.hipo.finance/tonconnect-manifest.json">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TonConnectUIProvider>
  )
}
