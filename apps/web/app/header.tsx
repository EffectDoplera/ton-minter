'use client'

import { TonConnectButton } from '@/features/connect-wallet'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { toast } from '@/shared/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormSchema = z.object({
  address: z.string().min(2),
})

export const Header = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      address: '',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <header className="p-4 sticky z-10 top-0 bg-slate-200 flex flex-col gap-4 rounded-b-3xl">
      <div className="flex items-center justify-between">
        <div className="flex justify-between gap-1">
          <Image src="/toncoin-ton-logo.svg" alt="toncoin logo" width={30} height={30} priority />
          <p className="text-2xl font-bold uppercase">Ton Minter</p>
        </div>
        <TonConnectButton />
      </div>

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute top-2 left-2 text-muted-foreground" />
                  <FormControl className="px-8 ">
                    <Input {...field} placeholder="Jetton address" className="bg-white" />
                  </FormControl>
                  <FormDescription>Enter an existing Jetton contract address. example</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </header>
  )
}
