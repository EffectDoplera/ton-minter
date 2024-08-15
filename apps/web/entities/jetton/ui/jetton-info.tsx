interface JettonInfoProps {
  name?: string
  symbol?: string
  description?: string
}

export const JettonInfo: React.FC<JettonInfoProps> = ({ name, symbol, description }) => {
  return (
    <div>
      <h3 className="text-xl font-bold">{`${name || 'Jetton name'} (${symbol || 'Symbol'})`}</h3>
      <p className="text-lg text-zinc-500">{description || 'Description'}</p>
    </div>
  )
}
