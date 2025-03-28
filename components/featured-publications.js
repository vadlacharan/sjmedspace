"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, MessageSquare, Calendar } from "lucide-react"

export default function FeaturedPublications() {
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const q = query(collection(db, "publications"), orderBy("createdAt", "desc"), limit(3))

        const querySnapshot = await getDocs(q)
        const publicationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }))

        setPublications(publicationsData)
      } catch (error) {
        console.error("Error fetching publications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPublications()
  }, [])

  if (loading) {
    return (
      <>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-0">
              <Skeleton className="h-48 w-full" />
            </CardHeader>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="flex justify-between p-6 pt-0">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardFooter>
          </Card>
        ))}
      </>
    )
  }

  // If no publications are available, show placeholders
  if (publications.length === 0) {
    const placeholders = [
      {
        id: "1",
        title: "USMLE Step 1 Preparation Strategies",
        excerpt:
          "Effective strategies for USMLE Step 1 preparation, including study schedules, resource recommendations, and test-taking techniques.",
        authors: [
          { name: "Dr. Sailaja Sanikommu", avatar: "/placeholder.svg" },
          { name: "Dr. John Smith", avatar: "/placeholder.svg" },
        ],
        category: "USMLE Step 1",
        tags: ["preparation", "study strategies"],
        likes: 124,
        comments: 32,
        createdAt: new Date("2023-08-15"),
      },
      {
        id: "2",
        title: "High-Yield Pathology Concepts for USMLE Step 2 CK",
        excerpt:
          "A comprehensive review of high-yield pathology concepts frequently tested on the USMLE Step 2 CK examination.",
        authors: [
          { name: "Dr. Sailaja Sanikommu", avatar: "/placeholder.svg" },
          { name: "Dr. Emily Johnson", avatar: "/placeholder.svg" },
        ],
        category: "USMLE Step 2",
        tags: ["pathology", "high-yield"],
        likes: 98,
        comments: 24,
        createdAt: new Date("2023-09-22"),
      },
      {
        id: "3",
        title: "Clinical Case Scenarios for USMLE Step 3",
        excerpt:
          "Practice with realistic clinical case scenarios designed to prepare candidates for the USMLE Step 3 examination.",
        authors: [
          { name: "Dr. Sailaja Sanikommu", avatar: "/placeholder.svg" },
          { name: "Dr. Michael Chen", avatar: "/placeholder.svg" },
        ],
        category: "USMLE Step 3",
        tags: ["clinical cases", "practice scenarios"],
        likes: 76,
        comments: 18,
        createdAt: new Date("2023-10-10"),
      },
    ]

    return (
      <>
        {placeholders.map((publication) => (
          <PublicationCard key={publication.id} publication={publication} />
        ))}
      </>
    )
  }

  return (
    <>
      {publications.map((publication) => (
        <PublicationCard key={publication.id} publication={publication} />
      ))}
    </>
  )
}

function PublicationCard({ publication }) {
  // Format date
  const formattedDate = new Date(publication.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="overflow-hidden flex flex-col">
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
        <div className="flex items-center gap-3 text-muted-foreground text-sm">
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4" /> {publication.likes || 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" /> {publication.comments || 0}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}

