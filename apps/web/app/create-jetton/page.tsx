import { MintJettonForm } from '@/features/mint-jetton'

export const dynamic = 'force-dynamic'

export default function CreateJetton() {
  return (
    <div className="grid">
      <MintJettonForm />
    </div>
  )
}
