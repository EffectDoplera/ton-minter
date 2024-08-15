import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Pencil2Icon } from '@radix-ui/react-icons'
import Image from 'next/image'

interface JettonImageProps {
  src: string
  editable?: boolean
}

export const JettonImage: React.FC<JettonImageProps> = ({ src, editable = false }) => {
  return (
    <Avatar className="inline-flex w-25 h-25 group">
      <AvatarImage className="w-25 h-25" src={src} alt="Jetton Logo" width={100} height={100} />
      <AvatarFallback>
        <Image src="/coin-logo.svg" alt="Jetton Logo placeholder" width={100} height={100} priority />
      </AvatarFallback>
      {editable && (
        <div className="absolute inset-0 h-full w-full opacity-0 transition-opacity bg-slate-100 group-hover:opacity-40 grid place-items-center">
          <Pencil2Icon className="w-6 h-6 text-slate-500" />
        </div>
      )}
    </Avatar>
  )
}
