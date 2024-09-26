'use client'

import { Button } from '@/shared/ui/button'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { FC, PropsWithChildren, use, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

interface LoadMoreProps extends PropsWithChildren {
  initialOffset?: number
  action: (params: {
    offset?: number
    limit?: number
    params?: string
  }) => Promise<readonly [React.JSX.Element[], number | null]>
}

export const LoadMore: FC<LoadMoreProps> = ({ children, action, initialOffset = 0 }) => {
  const { ref, inView } = useInView()
  const searchParams = useSearchParams()

  const { fetchNextPage, isLoading, data } = useInfiniteQuery({
    queryKey: ['load-more'],
    queryFn: async ({ pageParam }) => {
      return action({
        offset: pageParam,
        params: searchParams.get('query') || '',
      })
    },
    initialPageParam: initialOffset,
    getNextPageParam: ([, nextOffset]) => nextOffset,
  })

  useEffect(() => {
    if (inView) fetchNextPage()
  }, [inView, fetchNextPage])

  return (
    <>
      {children}
      {data && data.pages.map(([items]) => items.map((item) => item))}
      <Button
        ref={ref}
        onClick={() => fetchNextPage()}
        variant="outline"
        size="lg"
        className="col-span-full"
        disabled={isLoading || !data?.pages[data.pages.length - 1]?.[1]}
      >
        {isLoading ? 'Loading...' : 'Load More'}
      </Button>
    </>
  )
}
