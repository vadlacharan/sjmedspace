"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { useAuth } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageSquare, Calendar, Bookmark, Settings } from "lucide-react"

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [savedPublications, setSavedPublications] = useState([])
  const [userComments, setUserComments] = useState([])
  const [userLikes, setUserLikes] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      try {
        setLoadingData(true)

        // Fetch saved publications
        const publicationsQuery = query(collection(db, "publications"), where("savedBy", "array-contains", user.uid))

        const publicationsSnapshot = await getDocs(publicationsQuery)
        const publicationsData = publicationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }))

        setSavedPublications(publicationsData)

        // Fetch user comments
        const commentsQuery = query(
          collection(db, "comments"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
        )

        const commentsSnapshot = await getDocs(commentsQuery)
        const commentsData = commentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }))

        setUserComments(commentsData)

        // Fetch publications liked by user
        const likesQuery = query(collection(db, "publications"), where("likedBy", "array-contains", user.uid))

        const likesSnapshot = await getDocs(likesQuery)
        const likesData = likesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }))

        setUserLikes(likesData)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoadingData(false)
      }
    }

    fetchUserData()
  }, [user])

  if (loading || !user) {
    return <div className="container py-12">Loading...</div>
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.photoURL} alt={user.displayName} />
              <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.displayName}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link href="/profile/settings">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="saved" className="space-y-4">
          <TabsList>
            <TabsTrigger value="saved" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Saved
            </TabsTrigger>
            <TabsTrigger value="comments" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments
            </TabsTrigger>
            <TabsTrigger value="likes" className="gap-2">
              <Heart className="h-4 w-4" />
              Likes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="space-y-4">
            <h2 className="text-xl font-semibold">Saved Publications</h2>
            {loadingData ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array(3)
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {savedPublications.map((publication) => (
                  <Card key={publication.id}>
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
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{publication.excerpt}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
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
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/publications/${publication.id}`}>Read More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">No saved publications yet</h3>
                <p className="text-muted-foreground mb-4">
                  Browse publications and save the ones you find interesting.
                </p>
                <Button asChild>
                  <Link href="/publications">Browse Publications</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <h2 className="text-xl font-semibold">Your Comments</h2>
            {loadingData ? (
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-16 w-full" />
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : userComments.length > 0 ? (
              <div className="space-y-4">
                {userComments.map((comment) => (
                  <Card key={comment.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        <Link href={`/publications/${comment.publicationId}`} className="hover:underline">
                          On: {comment.publicationTitle || "Publication"}
                        </Link>
                      </CardTitle>
                      <CardDescription>
                        {new Date(comment.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{comment.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">No comments yet</h3>
                <p className="text-muted-foreground mb-4">Join the conversation by commenting on publications.</p>
                <Button asChild>
                  <Link href="/publications">Browse Publications</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="likes" className="space-y-4">
            <h2 className="text-xl font-semibold">Liked Publications</h2>
            {loadingData ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array(3)
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
            ) : userLikes.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userLikes.map((publication) => (
                  <Card key={publication.id}>
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
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{publication.excerpt}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4 fill-current" />
                          {publication.likes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {publication.comments || 0}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/publications/${publication.id}`}>Read More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">No liked publications yet</h3>
                <p className="text-muted-foreground mb-4">Browse publications and like the ones you enjoy.</p>
                <Button asChild>
                  <Link href="/publications">Browse Publications</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

