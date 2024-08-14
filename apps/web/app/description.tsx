import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'

export const Description = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">This is an open source tool</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p>
          Jetton is the fungible token standard for TON blockchain. This free educational tool allows you to deploy your
          own Jetton to mainnet in one click. You will need at least 0.25 TON for deployment fees.
        </p>

        <p>
          For detailed instructions and in-depth explanations of all fields please see the GitHub README. It includes
          several best practice recommendations so please take a look.
        </p>

        <p>
          Never deploy code that you've never seen before! This deployer is fully open source with all smart contract
          code available here. The HTML form is also open source and served from GitHub Pages.
        </p>

        <p>Is this deployer safe? Yes! Read this to understand why.</p>
      </CardContent>

      <CardFooter>GitHub Repo</CardFooter>
    </Card>
  )
}
