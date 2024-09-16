import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { cn } from '@/shared/lib/utils'
import { Toaster } from '@/shared/ui/toaster'
import { Header } from './header'
import { Providers } from './providers'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn('min-h-[100dvh]', geistSans.variable, geistMono.variable)} suppressHydrationWarning>
      <body className="grid grid-rows-[auto_1fr_auto] min-h-[100dvh] bg-background antialiased">
        <Providers>
          <Header />
          <main className="flex flex-1 relative z-10 max-w-[100vw] overflow-hidden py-8">
            <div className="relative z-20 px-8 w-full max-w-screen-xl mx-auto my-auto grid grid-cols-1 gap-12 place-items-center">
              {children}
            </div>
          </main>
          <footer className="py-4 px-4">
            <p className="text-balance text-center text-sm leading-loose md:text-left">
              Built by{' '}
              <a
                href="https://github.com/EffectDoplera"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                EffectDoplera
              </a>
              . The source code is available on{' '}
              <a
                href="https://github.com/EffectDoplera/#"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </footer>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
