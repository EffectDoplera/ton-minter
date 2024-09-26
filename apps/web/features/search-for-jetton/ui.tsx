'use client'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'
import { SearchForJettonFormValues } from './schema'

export const SearchBar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<SearchForJettonFormValues>({
    defaultValues: {
      query: searchParams.get('query') || '',
    },
  })

  const debounced = useDebouncedCallback(() => {
    if (form.getValues('query')) {
      router.replace(`/?query=${form.getValues('query')}`, { scroll: false })
    } else {
      router.replace('/', { scroll: false })
    }
  }, 300)

  const onSubmit = (input: SearchForJettonFormValues, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault()
  }

  return (
    <search>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="space-y-0 relative">
                <MagnifyingGlassIcon className="h-4 w-4 absolute top-3 left-3 text-muted-foreground" />
                <FormControl>
                  <Input
                    placeholder="Search for jettons"
                    className="placeholder-shown:truncate pl-9"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      debounced()
                    }}
                  />
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
