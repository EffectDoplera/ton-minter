'use client'

import { Button } from '@/shared/ui/button'
import { useInfiniteQuery } from '@tanstack/react-query'
import { FC, PropsWithChildren, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

interface LoadMoreProps extends PropsWithChildren {
  initialOffset?: number
  action: (offset: number) => Promise<readonly [React.JSX.Element[], number | null]>
}

export const LoadMore: FC<LoadMoreProps> = ({ children, action, initialOffset = 0 }) => {
  const { ref, inView } = useInView()

  const { fetchNextPage, isLoading, data } = useInfiniteQuery({
    queryKey: ['load-more'],
    queryFn: async ({ pageParam }) => {
      return action(pageParam)
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
      <Button ref={ref} onClick={() => fetchNextPage()} variant="outline" size="lg" className="col-span-full">
        {isLoading ? 'Loading...' : 'Load More'}
      </Button>
    </>
  )
}
