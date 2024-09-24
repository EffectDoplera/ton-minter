'use server'

import { createJetton } from '@/entities/jetton/api'
import { CreateJettonSchema } from '@/features/mint-jetton/schema'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const createJettonAction = async (data: z.infer<typeof CreateJettonSchema>) => {
  await createJetton(data)
  revalidatePath('/')
  redirect('/')
}
