import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/badge'
import * as React from 'react'

const ComingSoon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-xl border bg-card text-card-foreground shadow relative', className)}
      {...props}
    >
      {children}
      <div className="absolute inset-0 w-full h-full backdrop-blur-sm grid place-content-center ">
        <Badge className="text-2xl">Coming Soon</Badge>
      </div>
    </div>
  ),
)
ComingSoon.displayName = 'ComingSoon'

const ComingSoonContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-6', className)} {...props} />,
)
ComingSoonContent.displayName = 'ComingSoonContent'

export { ComingSoon, ComingSoonContent }
