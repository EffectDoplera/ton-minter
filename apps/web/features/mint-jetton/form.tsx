'use client'

import { JettonImage } from '@/entities/jetton/ui/jetton-image'
import { JettonInfo } from '@/entities/jetton/ui/jetton-info'
import { useTonConnectModal, useTonWallet } from '@/features/connect-wallet'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CreateJettonFormSchema } from './schema'
import { useMintJetton } from './use-mint-jetton'

export const MintJettonForm = () => {
  const form = useForm<z.infer<typeof CreateJettonFormSchema>>({
    resolver: zodResolver(CreateJettonFormSchema),
    defaultValues: {
      name: '',
      symbol: '',
      decimals: '9',
      amount: '',
      description: '',
      image: '',
      meta: {
        website: '',
        twitter: '',
        telegram: '',
      },
    },
  })

  const wallet = useTonWallet()
  const { open } = useTonConnectModal()
  const minter = useMintJetton()

  async function onSubmit(data: z.infer<typeof CreateJettonFormSchema>) {
    await minter.mutateAsync(data)
  }
  return (
    <Card className="flex flex-col items-center w-full max-w-screen-md mx-auto">
      <Form {...form}>
        <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <div className="gap-4 sm:flex sm:flex-row">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-25 h-25 p-1 rounded-full">
                    <JettonImage src={form.getValues('image')} editable />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit logo</DialogTitle>
                  </DialogHeader>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jetton Logo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>URL of 256x256 pixel PNG/JPEG/WEBP/GIF image of token logo.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <JettonInfo
                name={form.watch('name')}
                symbol={form.watch('symbol')}
                description={form.watch('description')}
              />
            </div>
          </CardHeader>

          <CardContent className="flex flex-col items-center w-full space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
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
                <FormItem className="w-full">
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
                <FormItem className="w-full">
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
                <FormItem className="w-full">
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
                <FormItem className="w-full">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Optional sentence explaining about your project.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meta.website"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meta.twitter"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meta.telegram"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Telegram</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-[0.8rem] text-muted-foreground">You will need at least 0.25 TON for deployment fees</p>
            {wallet && <Button type="submit">Deploy</Button>}
            {!wallet && (
              <Button type="button" onClick={open}>
                Connect wallet
              </Button>
            )}
          </CardContent>
        </form>
      </Form>
    </Card>
  )
}
