import { fromNano } from '@ton/ton'

export const formatJettonBalance = (balance: number | bigint | undefined) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(+fromNano(balance ?? 0))

export const getSocialLinks = (meta: any) => {
  return Object.entries(meta)
    .filter(([key]) => !['id', 'jettonId'].includes(key))
    .reduce(
      (acc, [key, value]) => {
        acc.push({
          name: key,
          url: value as string,
        })
        return acc
      },
      [] as Record<string, string>[],
    )
}
