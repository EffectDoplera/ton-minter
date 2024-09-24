import { z } from 'zod'

export const CreateJettonFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Jetton Name must be at least 2 characters.',
  }),
  symbol: z.string().min(2, {
    message: 'Jetton Symbol must be at least 2 characters.',
  }),
  decimals: z.string().min(0).max(9),
  amount: z.string(),
  description: z.string(),
  image: z.string(),
  meta: z.object({
    website: z.string(),
    twitter: z.string(),
    telegram: z.string(),
  }),
})

export const CreateJettonSchema = CreateJettonFormSchema.extend({
  minter: z.string(),
  address: z.string(),
}).omit({
  decimals: true,
  amount: true,
})
