import { Suspense } from "react"
import GalleryGrid from "@/components/gallery-grid"
import GalleryFilter from "@/components/gallery-filter"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Art Gallery - SJMedSpace",
  description: "Browse event photos and art from SJMedSpace",
}

export default function GalleryPage({ searchParams }) {
  const { category, event } = searchParams

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <div className="flex flex-col space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Art Gallery</h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Browse photos from our events and artistic creations from our community.
          </p>
        </div>

        <GalleryFilter />

        <Suspense fallback={<GalleryGridSkeleton />}>
          <GalleryGrid categoryFilter={category} eventFilter={event} />
        </Suspense>
      </div>
    </div>
  )
}

function GalleryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(9)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
    </div>
  )
}

