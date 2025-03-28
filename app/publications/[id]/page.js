import { Suspense } from "react"
import PublicationDetail from "@/components/publication-detail"
import { Skeleton } from "@/components/ui/skeleton"

export async function generateMetadata({ params }) {
  // In a real app, you would fetch the publication data here
  // and generate dynamic metadata
  return {
    title: "Publication - SJMedSpace",
    description: "View USMLE research publication details",
  }
}

export default function PublicationPage({ params }) {
  const { id } = params

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <Suspense fallback={<PublicationDetailSkeleton />}>
        <PublicationDetail id={id} />
      </Suspense>
    </div>
  )
}

function PublicationDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>

      <Skeleton className="h-64 w-full" />

      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

