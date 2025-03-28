"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, doc, updateDoc, arrayRemove } from "firebase/firestore"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageSquare, Calendar, Bookmark, BookmarkX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SavedPublicationsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [savedPublications, setSavedPublications] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchSavedPublications = async () => {
      if (!user) return

      try {
        setLoadingData(true)

        const publicationsQuery = query(collection(db, "publications"), where("savedBy", "array-contains", user.uid))

        const publicationsSnapshot = await getDocs(publicationsQuery)
        const publicationsData = publicationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }))

        setSavedPublications(publicationsData)
      } catch (error) {
        console.error("Error fetching saved publications:", error)
        toast({
          title: "Error",
          description: "Failed to load saved publications. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoadingData(false)
      }
    }

    fetchSavedPublications()
  }, [user, toast])

  const handleRemoveSaved = async (publicationId) => {
    if (!user) return

    try {
      // Update Firestore
      const publicationRef = doc(db, "publications", publicationId)
      await updateDoc(publicationRef, {
        savedBy: arrayRemove(user.uid),
      })

      // Update local state
      setSavedPublications((prev) => prev.filter((pub) => pub.id !== publicationId))

      toast({
        title: "Publication removed",
        description: "Publication removed from your saved items.",
      })
    } catch (error) {
      console.error("Error removing saved publication:", error)
      toast({
        title: "Error",
        description: "Failed to remove publication. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading || !user) {
    return <div className="container py-12">Loading...</div>
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Saved Publications</h1>
          <p className="text-muted-foreground mt-2">Access your bookmarked publications for future reference.</p>
        </div>

        {loadingData ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-8 w-full" />
                  </CardFooter>
                </Card>
              ))}
          </div>
        ) : savedPublications.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedPublications.map((publication) => (
              <Card key={publication.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="line-clamp-1">
                    <Link href={`/publications/${publication.id}`} className="hover:underline">
                      {publication.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant="outline">{publication.category}</Badge>
                    <span className="text-xs flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(publication.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">{publication.excerpt}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {publication.tags &&
                      publication.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {publication.likes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {publication.comments || 0}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveSaved(publication.id)}
                    >
                      <BookmarkX className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/publications/${publication.id}`}>Read</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No saved publications yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Browse publications and save the ones you find interesting for future reference.
            </p>
            <Button asChild>
              <Link href="/publications">Browse Publications</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

