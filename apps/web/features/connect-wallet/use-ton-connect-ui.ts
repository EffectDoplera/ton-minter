'use client'

import { TonConnectUI, TonConnectUiOptions } from '@tonconnect/ui'
import { useCallback, useContext } from 'react'
import { TonConnectUIContext } from './ton-connect-ui-provider'

/**
 * Use it to get access to the `TonConnectUI` instance and UI options updating function.
 */
export function useTonConnectUI(): [TonConnectUI, (options: TonConnectUiOptions) => void] {
  const tonConnectUI = useContext(TonConnectUIContext)
  const setOptions = useCallback(
    (options: TonConnectUiOptions) => {
      if (tonConnectUI) {
        tonConnectUI!.uiOptions = options
      }
    },
    [tonConnectUI],
  )

  if (typeof window === 'undefined') {
    return [null as unknown as TonConnectUI, () => {}]
  }

  return [tonConnectUI!, setOptions]
}
