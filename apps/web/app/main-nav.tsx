'use client'

import { cn } from '@/shared/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentPropsWithoutRef, FC } from 'react'

export const MainNav = () => {
  const pathname = usePathname()

  return (
    <ul className="hidden md:flex items-center gap-4">
      <li className="flex-1 text-center text-white">
        <NavLink href="/" active={pathname === '/'}>
          Home
        </NavLink>
      </li>
      <li className="flex-1 text-center text-white">
        <NavLink href="/create-jetton" active={pathname === '/create-jetton'}>
          Launch
        </NavLink>
      </li>
    </ul>
  )
}

const navLinkVariants = cva('relative font-semibold', {
  variants: {
    active: {
      true: 'after:content-[""] after:absolute after:h-1 after:w-6 after:bg-blue-500 after:-bottom-1.5 after:left-[50%] after:rounded after:translate-x-[-50%]',
    },
  },
  defaultVariants: {
    active: false,
  },
})

const NavLink: FC<ComponentPropsWithoutRef<typeof Link> & VariantProps<typeof navLinkVariants>> = ({
  className,
  active,
  ...props
}) => {
  return <Link className={cn(navLinkVariants({ active }), className)} {...props} />
}
