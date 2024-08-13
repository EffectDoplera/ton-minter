'use client'

import { useTonConnectModal, useTonWallet } from '@/features/connect-wallet'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { toast } from '@/shared/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMintJetton } from './use-mint-jetton'

/**
 * 
 * name: 'FLY',
    description: 'FLY',
    symbol: 'FLY',
    decimals: '9',
    image: 'https://cryptologos.cc/logos/cosmos-atom-logo.svg?v=032',
 */

const FormSchema = z.object({
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
})

export const MintJettonForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      symbol: '',
      decimals: '9',
      amount: '',
      description: '',
      image: '',
    },
  })

  const wallet = useTonWallet()
  const { open } = useTonConnectModal()
  const minter = useMintJetton()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })

    minter.mutate(data)
  }
  return (
    <Card className="flex flex-col items-center">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Mint your Jetton</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jetton Logo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    URL of 256x256 pixel PNG image of token logo with transparent background.{' '}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jetton Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Your project unabbreviated name with spaces (usually 1-3 words)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jetton Symbol</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Currency symbol appearing in balance (usually 3-5 uppercase chars).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="decimals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jetton Decimals</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>The decimal precision of your token (9 is TON default)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jettons to mint</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Number of initial tokens to mint and send to your wallet address (float).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Optional sentence explaining about your project.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {wallet && <Button type="submit">Deploy</Button>}
            {!wallet && <Button onClick={open}>Connect wallet</Button>}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
