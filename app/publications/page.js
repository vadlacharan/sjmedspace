import { Suspense } from "react"
import PublicationsList from "@/components/publications-list"
import PublicationsSearch from "@/components/publications-search"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Publications - SJMedSpace",
  description: "Browse USMLE-focused research publications",
}

export default function PublicationsPage({ searchParams }) {
  const { q, category, tag, sort } = searchParams

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <div className="flex flex-col space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Publications</h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Browse our collection of USMLE-focused research publications and educational resources.
          </p>
        </div>

        <PublicationsSearch />

        <Suspense fallback={<PublicationsListSkeleton />}>
          <PublicationsList searchQuery={q} categoryFilter={category} tagFilter={tag} sortOption={sort} />
        </Suspense>
      </div>
    </div>
  )
}

function PublicationsListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
    </div>
  )
}

