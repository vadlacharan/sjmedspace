"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { db, storage } from "@/lib/firebase"
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, Trash2, MoreHorizontal, Eye, Upload, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminGalleryList() {
  const { toast } = useToast()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastVisible, setLastVisible] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // New state for upload functionality
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageTitle, setImageTitle] = useState("")
  const [imageDescription, setImageDescription] = useState("")
  const [imageCategory, setImageCategory] = useState("")
  const [imageEvent, setImageEvent] = useState("")
  const [imageLocation, setImageLocation] = useState("")

  // Categories and events for the dropdown
  const categories = [
    "Conference",
    "Workshop",
    "Seminar",
    "Social Event",
    "Graduation",
    "Award Ceremony",
    "Medical Illustration",
    "Anatomical Drawing",
  ]

  const events = [
    "USMLE Prep Workshop 2023",
    "Medical Education Conference 2023",
    "Research Symposium 2022",
    "Annual Gala 2023",
    "Student Recognition Ceremony",
    "Medical Art Exhibition 2023",
  ]

  const fetchImages = async (isLoadMore = false) => {
    try {
      setLoading(true)

      // Start building the query
      let q = collection(db, "gallery")
      const constraints = [orderBy("createdAt", "desc")]

      // Add pagination
      if (isLoadMore && lastVisible) {
        constraints.push(startAfter(lastVisible))
      }

      constraints.push(limit(10))

      q = query(q, ...constraints)

      const querySnapshot = await getDocs(q)

      // Check if we have more results
      setHasMore(querySnapshot.docs.length === 10)

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
      toast({
        title: "Error",
        description: "Failed to load gallery images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages(false)
  }, [])

  const handleLoadMore = () => {
    fetchImages(true)
  }

  const handleDeleteClick = (image) => {
    setDeleteTarget(image)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return

    try {
      // Delete the image from Storage if it has a storageRef
      if (deleteTarget.storageRef) {
        const imageRef = ref(storage, deleteTarget.storageRef)
        await deleteObject(imageRef)
      }

      // Delete the image document from Firestore
      await deleteDoc(doc(db, "gallery", deleteTarget.id))

      // Update local state
      setImages((prev) => prev.filter((img) => img.id !== deleteTarget.id))

      toast({
        title: "Image deleted",
        description: "The gallery image has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting gallery image:", error)
      toast({
        title: "Error",
        description: "Failed to delete gallery image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setDeleteTarget(null)
    }
  }

  // Handle file selection for upload
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)

      // Create a preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle image upload
  const handleUploadImage = async (e) => {
    e.preventDefault()

    if (!imageFile || !imageTitle) {
      toast({
        title: "Missing information",
        description: "Please provide an image and title.",
        variant: "destructive",
      })
      return
    }

    try {
      setUploadingImage(true)

      // Upload image to Firebase Storage
      const storageRef = ref(storage, `gallery/${Date.now()}_${imageFile.name}`)
      await uploadBytes(storageRef, imageFile)

      // Get the download URL
      const imageUrl = await getDownloadURL(storageRef)

      // Create document in Firestore
      const imageData = {
        title: imageTitle,
        description: imageDescription,
        category: imageCategory,
        event: imageEvent,
        location: imageLocation,
        imageUrl,
        storageRef: storageRef.fullPath,
        createdAt: serverTimestamp(),
      }

      await addDoc(collection(db, "gallery"), imageData)

      // Reset form and close dialog
      resetUploadForm()
      setShowUploadForm(false)

      // Refresh the gallery list
      fetchImages(false)

      toast({
        title: "Image uploaded",
        description: "The image has been successfully added to the gallery.",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  // Reset upload form
  const resetUploadForm = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageTitle("")
    setImageDescription("")
    setImageCategory("")
    setImageEvent("")
    setImageLocation("")
  }

  const toggleUploadForm = () => {
    setShowUploadForm(!showUploadForm)
    if (!showUploadForm) {
      resetUploadForm()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Gallery Images</h2>
        <Button onClick={toggleUploadForm} className="gap-2" type="button">
          {showUploadForm ? (
            <>
              <X className="h-4 w-4" />
              Cancel Upload
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add Image
            </>
          )}
        </Button>
      </div>

      {/* Inline Upload Form */}
      {showUploadForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload New Image</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUploadImage} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-upload">Image *</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image-upload").click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Select Image
                  </Button>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="relative h-20 w-20 overflow-hidden rounded-md">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">No image selected</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image-title">Title *</Label>
                  <Input
                    id="image-title"
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                    placeholder="Enter image title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image-location">Location</Label>
                  <Input
                    id="image-location"
                    value={imageLocation}
                    onChange={(e) => setImageLocation(e.target.value)}
                    placeholder="Enter location (optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image-category">Category</Label>
                  <Select value={imageCategory} onValueChange={setImageCategory}>
                    <SelectTrigger id="image-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image-event">Event</Label>
                  <Select value={imageEvent} onValueChange={setImageEvent}>
                    <SelectTrigger id="image-event">
                      <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((evt) => (
                        <SelectItem key={evt} value={evt}>
                          {evt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-description">Description</Label>
                <Textarea
                  id="image-description"
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  placeholder="Enter image description"
                  className="min-h-[80px]"
                />
              </div>

              <CardFooter className="px-0 pt-4">
                <div className="flex justify-end gap-2 w-full">
                  <Button type="button" variant="outline" onClick={toggleUploadForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploadingImage || !imageFile || !imageTitle} className="gap-2">
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-12 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-20" />
                    </TableCell>
                  </TableRow>
                ))
            ) : images.length > 0 ? (
              images.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>
                    <div className="h-12 w-12 relative rounded overflow-hidden">
                      <Image
                        src={image.imageUrl || "/placeholder.svg"}
                        alt={image.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{image.title}</TableCell>
                  <TableCell>{image.event}</TableCell>
                  <TableCell>
                    {new Date(image.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/gallery?id=${image.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/gallery/edit/${image.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(image)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No gallery images found. Add your first image to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button onClick={handleLoadMore} disabled={loading} variant="outline">
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the gallery image &quot;{deleteTarget?.title}&quot;. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

