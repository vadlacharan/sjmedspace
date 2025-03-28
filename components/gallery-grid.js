"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Tag, Info } from "lucide-react"

export default function GalleryGrid({ categoryFilter, eventFilter }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastVisible, setLastVisible] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchImages = async (isLoadMore = false) => {
    try {
      setLoading(true)

      // Start building the query
      let q = collection(db, "gallery")
      const constraints = []

      // Add filters
      if (categoryFilter && categoryFilter !== "all") {
        constraints.push(where("category", "==", categoryFilter))
      }

      if (eventFilter && eventFilter !== "all") {
        constraints.push(where("event", "==", eventFilter))
      }

      // Add sort and pagination
      constraints.push(orderBy("createdAt", "desc"))

      if (isLoadMore && lastVisible) {
        constraints.push(startAfter(lastVisible))
      }

      constraints.push(limit(12))

      q = query(q, ...constraints)

      const querySnapshot = await getDocs(q)

      // Check if we have more results
      setHasMore(querySnapshot.docs.length === 12)

      // Set the last visible document for pagination
      if (querySnapshot.docs.length > 0) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
      } else {
        setLastVisible(null)
      }

      const imagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }))

      if (isLoadMore) {
        setImages((prev) => [...prev, ...imagesData])
      } else {
        setImages(imagesData)
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages(false)
  }, [categoryFilter, eventFilter])

  const handleLoadMore = () => {
    fetchImages(true)
  }

  const handleImageClick = (image) => {
    setSelectedImage(image)
    setIsDialogOpen(true)
  }

  if (loading && images.length === 0) {
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

  if (images.length === 0) {
    // If no real images, show placeholders
    const placeholders = Array(9)
      .fill(0)
      .map((_, i) => ({
        id: `placeholder-${i}`,
        title: `Gallery Image ${i + 1}`,
        description: "This is a placeholder image for the gallery.",
        imageUrl: `/placeholder.svg?height=400&width=400`,
        category: i % 2 === 0 ? "Conference" : "Workshop",
        event: i % 3 === 0 ? "USMLE Prep Workshop 2023" : "Medical Education Conference 2023",
        location: "New York, NY",
        createdAt: new Date(2023, i % 12, (i % 28) + 1),
      }))

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholders.map((image) => (
            <GalleryItem key={image.id} image={image} onClick={() => handleImageClick(image)} />
          ))}
        </div>

        <ImageDialog image={selectedImage} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
      </>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <GalleryItem key={image.id} image={image} onClick={() => handleImageClick(image)} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={handleLoadMore} disabled={loading} variant="outline" size="lg">
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      <ImageDialog image={selectedImage} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

function GalleryItem({ image, onClick }) {
  return (
    <div className="overflow-hidden rounded-lg bg-muted cursor-pointer group relative aspect-square" onClick={onClick}>
      <Image
        src={image.imageUrl || "/placeholder.svg"}
        alt={image.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white font-medium">{image.title}</h3>
        <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
          <Calendar className="h-3 w-3" />
          <span>
            {new Date(image.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

function ImageDialog({ image, isOpen, onClose }) {
  if (!image) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{image.title}</DialogTitle>
          <DialogDescription>
            {image.event && <span className="block text-sm">{image.event}</span>}
            <div className="flex flex-wrap items-center gap-2 text-sm mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(image.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {image.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {image.location}
                </span>
              )}
              {image.category && (
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <Badge variant="outline" className="text-xs py-0 h-5">
                    {image.category}
                  </Badge>
                </span>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image src={image.imageUrl || "/placeholder.svg"} alt={image.title} fill className="object-contain" />
        </div>
        {image.description && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>{image.description}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

