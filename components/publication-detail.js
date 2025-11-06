"use client"

import { CardContent } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Bookmark, Share2, Calendar, AlertCircle, Trash2, Edit } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function PublicationDetail({ id }) {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()

  const [publication, setPublication] = useState(null)
  const [comments, setComments] = useState([])
  const [relatedPublications, setRelatedPublications] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const docRef = doc(db, "publications", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const publicationData = {
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          }

          setPublication(publicationData)

          // Check if user has liked or saved this publication
          if (user) {
            setIsLiked(publicationData.likedBy?.includes(user.uid) || false)
            setIsSaved(publicationData.savedBy?.includes(user.uid) || false)
          }

          // Fetch comments
          const commentsQuery = query(collection(db, "comments"), where("publicationId", "==", id))

          const commentsSnapshot = await getDocs(commentsQuery)
          const commentsData = commentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          }))

          // Sort comments by date (newest first)
          commentsData.sort((a, b) => b.createdAt - a.createdAt)

          setComments(commentsData)

          // Fetch related publications
          if (publicationData.category) {
            const relatedQuery = query(
              collection(db, "publications"),
              where("category", "==", publicationData.category),
              where("__name__", "!=", id),
            )

            const relatedSnapshot = await getDocs(relatedQuery)
            const relatedData = relatedSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate() || new Date(),
            }))

            // Get up to 3 related publications
            setRelatedPublications(relatedData.slice(0, 3))
          }
        } else {
          // Publication not found
          toast({
            title: "Publication not found",
            description: "The requested publication could not be found.",
            variant: "destructive",
          })
          router.push("/publications")
        }
      } catch (error) {
        console.error("Error fetching publication:", error)
        toast({
          title: "Error",
          description: "Failed to load publication. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPublication()
  }, [id, user, router, toast])

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like publications.",
        variant: "default",
      })
      return
    }

    try {
      const publicationRef = doc(db, "publications", id)

      if (isLiked) {
        // Unlike
        await updateDoc(publicationRef, {
          likes: (publication.likes || 0) - 1,
          likedBy: arrayRemove(user.uid),
        })

        setPublication((prev) => ({
          ...prev,
          likes: (prev.likes || 0) - 1,
        }))

        setIsLiked(false)
      } else {
        // Like
        await updateDoc(publicationRef, {
          likes: (publication.likes || 0) + 1,
          likedBy: arrayUnion(user.uid),
        })

        setPublication((prev) => ({
          ...prev,
          likes: (prev.likes || 0) + 1,
        }))

        setIsLiked(true)
      }
    } catch (error) {
      console.error("Error updating like:", error)
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save publications.",
        variant: "default",
      })
      return
    }

    try {
      const publicationRef = doc(db, "publications", id)

      if (isSaved) {
        // Unsave
        await updateDoc(publicationRef, {
          savedBy: arrayRemove(user.uid),
        })

        setIsSaved(false)

        toast({
          title: "Publication removed",
          description: "Publication removed from your saved items.",
        })
      } else {
        // Save
        await updateDoc(publicationRef, {
          savedBy: arrayUnion(user.uid),
        })

        setIsSaved(true)

        toast({
          title: "Publication saved",
          description: "Publication added to your saved items.",
        })
      }
    } catch (error) {
      console.error("Error updating save status:", error)
      toast({
        title: "Error",
        description: "Failed to update save status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment on publications.",
        variant: "default",
      })
      return
    }

    if (!commentText.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment before submitting.",
        variant: "default",
      })
      return
    }

    try {
      setSubmittingComment(true)

      // Add comment to Firestore
      const commentData = {
        publicationId: id,
        userId: user.uid,
        userName: user.displayName,
        userAvatar: user.photoURL,
        text: commentText,
        createdAt: serverTimestamp(),
      }

      const commentRef = await addDoc(collection(db, "comments"), commentData)

      // Update comment count in publication
      const publicationRef = doc(db, "publications", id)
      await updateDoc(publicationRef, {
        comments: (publication.comments || 0) + 1,
      })

      // Update local state
      setComments((prev) => [
        {
          id: commentRef.id,
          ...commentData,
          createdAt: new Date(),
        },
        ...prev,
      ])

      setPublication((prev) => ({
        ...prev,
        comments: (prev.comments || 0) + 1,
      }))

      setCommentText("")

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!user) return

    try {
      // Delete comment from Firestore
      await deleteDoc(doc(db, "comments", commentId))

      // Update comment count in publication
      const publicationRef = doc(db, "publications", id)
      await updateDoc(publicationRef, {
        comments: (publication.comments || 0) - 1,
      })

      // Update local state
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))

      setPublication((prev) => ({
        ...prev,
        comments: (prev.comments || 0) - 1,
      }))

      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading || !publication) {
    return <div>Loading publication...</div>
  }

  // Format date
  const formattedDate = new Date(publication.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Publication Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{publication.category}</Badge>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-4 w-4" /> {formattedDate}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{publication.title}</h1>

        <div className="flex flex-wrap items-center gap-4">
          {(publication.authors || []).map((author, index) => (
            <div key={index} className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{author.name}</p>
                {author.title && <p className="text-xs text-muted-foreground">{author.title}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          {(publication.tags || []).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

     

      {/* Publication Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        {publication.content ? (
          <div dangerouslySetInnerHTML={{ __html: publication.content }} />
        ) : (
          <>
            <p>
              The USMLE (United States Medical Licensing Examination) is a three-step examination for medical licensure
              in the United States. This comprehensive publication explores effective strategies for USMLE preparation,
              with a focus on high-yield concepts and evidence-based study approaches.
            </p>
            <h2>Key Concepts</h2>
            <p>
              Understanding the core concepts tested on the USMLE is essential for effective preparation. This
              publication delves into the most frequently tested topics and provides detailed explanations of complex
              medical concepts.
            </p>
            <p>
              The integration of basic science knowledge with clinical applications is a cornerstone of USMLE success.
              This publication bridges this gap by presenting clinical correlations for key basic science concepts.
            </p>
            <h2>Study Strategies</h2>
            <p>
              Effective study strategies can significantly impact USMLE performance. This publication outlines
              evidence-based approaches to study scheduling, resource selection, and test-taking techniques.
            </p>
            <p>
              Spaced repetition and active recall are powerful learning techniques that have been shown to enhance
              long-term retention. This publication provides practical guidance on implementing these techniques in
              USMLE preparation.
            </p>
            <h2>Clinical Applications</h2>
            <p>
              The ability to apply medical knowledge to clinical scenarios is a critical skill tested on the USMLE. This
              publication includes numerous clinical vignettes and case-based discussions to develop this essential
              skill.
            </p>
            <p>
              Understanding the pathophysiology of disease processes is fundamental to clinical reasoning. This
              publication explores the mechanisms underlying common diseases and their clinical manifestations.
            </p>
            <h2>Conclusion</h2>
            <p>
              Successful USMLE preparation requires a strategic approach that integrates comprehensive knowledge
              acquisition with effective study techniques. This publication provides the tools and insights needed to
              excel on these challenging examinations.
            </p>
          </>
        )}
      </div>

      {/* Publication Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={handleLike}
            disabled={!user}
          >
            <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
            {publication.likes || 0} Likes
          </Button>

          <Button
            variant={isSaved ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={handleSave}
            disabled={!user}
          >
            <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
            {isSaved ? "Saved" : "Save"}
          </Button>

          <a href={publication.avatar} target="_blank" rel="noopener noreferrer">Read Full Article</a>
        </div>

       
      </div>

      <Separator />

      {/* Comments Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Comments ({publication.comments || 0})</h2>

        {user ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <Textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[100px]"
            />
            <Button type="submit" disabled={submittingComment || !commentText.trim()}>
              {submittingComment ? "Submitting..." : "Submit Comment"}
            </Button>
          </form>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please{" "}
              <Link href="#" className="font-medium underline underline-offset-4">
                sign in
              </Link>{" "}
              to comment on this publication.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar>
                  <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                  <AvatarFallback>{comment.userName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{comment.userName}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {new Date(comment.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {(user?.uid === comment.userId || isAdmin) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete comment</span>
                      </Button>
                    )}
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>

      {/* Related Publications */}
      {relatedPublications.length > 0 && (
        <div className="space-y-6">
          <Separator />
          <h2 className="text-2xl font-bold tracking-tight">Related Publications</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedPublications.map((pub) => (
              <Card key={pub.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="h-32 w-full bg-muted" />
                </CardHeader>
                <CardContent className="p-4">
                  <Link href={`/publications/${pub.id}`}>
                    <h3 className="font-semibold line-clamp-2 hover:underline">{pub.title}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{pub.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

