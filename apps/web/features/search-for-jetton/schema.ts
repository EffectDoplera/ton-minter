import { z } from 'zod'

export const SearchForJettonFormSchema = z.object({
  query: z.string().min(2),
})

export type SearchForJettonFormValues = z.infer<typeof SearchForJettonFormSchema>
