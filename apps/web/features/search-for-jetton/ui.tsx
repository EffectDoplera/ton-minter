'use client'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormSchema = z.object({
  address: z.string().min(2),
})

type FormData = z.infer<typeof FormSchema>

export const SearchBar = () => {
  const form = useForm<FormData>({
    defaultValues: {
      address: '',
    },
  })

  // const { mutate, error } = useServerActionMutation(searchBy, {
  //   mutationKey: ['searchBy'],
  // })

  const onSubmit = (input: FormData) => {
    console.log(input)

    // if (!error) form.reset()
  }

  return (
    <search>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="space-y-0 relative">
                <MagnifyingGlassIcon className="h-4 w-4 absolute top-3 left-3 text-muted-foreground" />
                <FormControl>
                  <Input placeholder="Search for jettons" className="placeholder-shown:truncate pl-9" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </search>
  )
}
