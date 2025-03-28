"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, MessageSquare, Calendar, Bookmark } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function PublicationsList({ searchQuery, categoryFilter, tagFilter, sortOption }) {
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastVisible, setLastVisible] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const { user } = useAuth()

  const fetchPublications = async (isLoadMore = false) => {
    try {
      setLoading(true)

      // Start building the query
      let q = collection(db, "publications")
      const constraints = []

      // Add filters
      if (categoryFilter) {
        constraints.push(where("category", "==", categoryFilter))
      }

      if (tagFilter) {
        constraints.push(where("tags", "array-contains", tagFilter))
      }

      // Add sort
      if (sortOption === "popular") {
        constraints.push(orderBy("likes", "desc"))
      } else if (sortOption === "comments") {
        constraints.push(orderBy("comments", "desc"))
      } else {
        // Default to most recent
        constraints.push(orderBy("createdAt", "desc"))
      }

      // Add pagination
      if (isLoadMore && lastVisible) {
        constraints.push(startAfter(lastVisible))
      }

      constraints.push(limit(9))

      q = query(q, ...constraints)

      const querySnapshot = await getDocs(q)

      // Check if we have more results
      setHasMore(querySnapshot.docs.length === 9)

      // Set the last visible document for pagination
      if (querySnapshot.docs.length > 0) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
      } else {
        setLastVisible(null)
      }

      const publicationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }))

      // Filter by search query if provided
      let filteredPublications = publicationsData
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredPublications = publicationsData.filter(
          (pub) =>
            pub.title.toLowerCase().includes(query) ||
            pub.excerpt.toLowerCase().includes(query) ||
            (pub.authors && pub.authors.some((author) => author.name.toLowerCase().includes(query))),
        )
      }

      if (isLoadMore) {
        setPublications((prev) => [...prev, ...filteredPublications])
      } else {
        setPublications(filteredPublications)
      }
    } catch (error) {
      console.error("Error fetching publications:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPublications(false)
  }, [searchQuery, categoryFilter, tagFilter, sortOption])

  const handleLoadMore = () => {
    fetchPublications(true)
  }

  if (loading && publications.length === 0) {
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

  if (publications.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No publications found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {publications.map((publication) => (
          <PublicationCard key={publication.id} publication={publication} isAuthenticated={!!user} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button onClick={handleLoadMore} disabled={loading} variant="outline" size="lg">
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}

function PublicationCard({ publication, isAuthenticated }) {
  // Format date
  const formattedDate = new Date(publication.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="h-48 w-full bg-muted relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-muted-foreground">Publication Cover</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{publication.category}</Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formattedDate}
            </span>
          </div>
          <Link href={`/publications/${publication.id}`}>
            <CardTitle className="line-clamp-2 hover:underline cursor-pointer">{publication.title}</CardTitle>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-3">{publication.excerpt}</p>
          <div className="flex flex-wrap gap-1 pt-2">
            {publication.tags &&
              publication.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <div className="flex -space-x-2">
          {(publication.authors || []).slice(0, 3).map((author, index) => (
            <Avatar key={index} className="border-2 border-background h-8 w-8">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            disabled={!isAuthenticated}
            title={isAuthenticated ? "Like" : "Sign in to like"}
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Like</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={!isAuthenticated}
            title={isAuthenticated ? "Save" : "Sign in to save"}
          >
            <Bookmark className="h-4 w-4" />
            <span className="sr-only">Save</span>
          </Button>
          <Button variant="ghost" size="icon" title="Comments">
            <MessageSquare className="h-4 w-4" />
            <span className="sr-only">Comments</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

