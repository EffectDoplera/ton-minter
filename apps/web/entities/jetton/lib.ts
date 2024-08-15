import { fromNano } from '@ton/ton'

export const formatJettonBalance = (balance: number | bigint | undefined) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(+fromNano(balance ?? 0))
