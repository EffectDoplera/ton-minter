import { JettonPreview } from '@/entities/jetton'
import { db } from '@/shared/database'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb'
import { ComingSoon, ComingSoonContent } from '@/shared/ui/coming-soon'
import { notFound } from 'next/navigation'
import { cache } from 'react'

const getJettonById = cache(async (id: string) => {
  const query = await db.query.jettons.findFirst({
    where: ({ address }, { eq }) => eq(address, id),
    with: {
      meta: true,
    },
  })
  if (!query) notFound()
  return query
})

const JettonPage = async ({ params }: { params: { address: string } }) => {
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
      <ComingSoon className="h-96 grid place-content-center md:col-span-4">
        <ComingSoonContent>CHART</ComingSoonContent>
      </ComingSoon>
      <ComingSoon className="h-96 grid place-content-center md:col-span-4">
        <ComingSoonContent>Trade</ComingSoonContent>
      </ComingSoon>
    </div>
  )
}

export default JettonPage
