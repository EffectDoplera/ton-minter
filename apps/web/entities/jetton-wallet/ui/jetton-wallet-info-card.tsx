import { formatJettonBalance } from '@/entities/jetton'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { JettonWalletTransfer } from './jetton-walet-transfer'

interface JettonWalletInfoCardProps {
  address: string
  balance?: number | bigint
}

export const JettonWalletInfoCard: React.FC<JettonWalletInfoCardProps> = ({ address, balance, ...props }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Connected Jetton Wallet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="text-xl flex flex-row items-center gap-2 ">
          <p className="font-bold flex-shrink-0">Wallet Address:</p>
          <Input readOnly value={address} className="truncate min-w-content" />
        </div>

        <div className="text-xl flex flex-row items-center gap-2 ">
          <p className="font-bold flex-shrink-0">Wallet Balance:</p>
          <Input readOnly value={formatJettonBalance(balance)} className="truncate min-w-content" />
        </div>

        <JettonWalletTransfer />
      </CardContent>
    </Card>
  )
}
