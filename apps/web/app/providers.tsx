'use client'

import { TonConnectUIProvider } from '@/features/connect-wallet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

// Create a client
const queryClient = new QueryClient()

export const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <TonConnectUIProvider manifestUrl="https://ton-minter-ashen.vercel.app/tonconnect-manifest.json">
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange {...props}>
          {children}
        </NextThemesProvider>
      </QueryClientProvider>
    </TonConnectUIProvider>
  )
}
