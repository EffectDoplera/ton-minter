'use client'

import { TonConnectUIProvider } from '@/features/connect-wallet'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TonConnectUIProvider manifestUrl="https://app.hipo.finance/tonconnect-manifest.json">
      {children}
    </TonConnectUIProvider>
  )
}
