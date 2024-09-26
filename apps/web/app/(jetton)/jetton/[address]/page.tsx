import { getJettonById } from '@/entities/jetton/api'
import { JettonPreview } from '@/entities/jetton/ui/jetton-preview'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb'
import { ComingSoon, ComingSoonContent } from '@/shared/ui/coming-soon'

interface JettonPageProps {
  params: {
    address: string
  }
}

const JettonPage = async ({ params }: JettonPageProps) => {
  const data = await getJettonById(params.address)
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 justify-center">
      <Breadcrumb className="col-span-full">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Jetton</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <JettonPreview jetton={data} />
      <ComingSoon className="h-96 grid place-content-center md:col-span-6">
        <ComingSoonContent>CHART</ComingSoonContent>
      </ComingSoon>
      <ComingSoon className="h-96 grid place-content-center md:col-span-6">
        <ComingSoonContent>Trade</ComingSoonContent>
      </ComingSoon>
    </div>
  )
}

export default JettonPage
