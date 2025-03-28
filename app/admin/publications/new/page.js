"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { db, storage } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, Save, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function NewPublicationPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState(null)
  const [coverImagePreview, setCoverImagePreview] = useState("")
  const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState("")
  const [authors, setAuthors] = useState([{ name: "", title: "", avatar: "" }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewTab, setPreviewTab] = useState("edit")

  // Categories for the dropdown
  const categories = [
    "USMLE Step 1",
    "USMLE Step 2",
    "USMLE Step 3",
    "Clinical Skills",
    "Medical Education",
    "Research Methodology",
  ]

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/")
    }
  }, [user, loading, isAdmin, router])

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddAuthor = () => {
    setAuthors([...authors, { name: "", title: "", avatar: "" }])
  }

  const handleRemoveAuthor = (index) => {
    const newAuthors = [...authors]
    newAuthors.splice(index, 1)
    setAuthors(newAuthors)
  }

  const handleAuthorChange = (index, field, value) => {
    const newAuthors = [...authors]
    newAuthors[index][field] = value
    setAuthors(newAuthors)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !category || !excerpt || !content) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (authors.length === 0 || !authors[0].name) {
      toast({
        title: "Author required",
        description: "Please add at least one author.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Upload cover image if provided
      let coverImageUrl = ""
      if (coverImage) {
        const storageRef = ref(storage, `publications/covers/${Date.now()}_${coverImage.name}`)
        await uploadBytes(storageRef, coverImage)
        coverImageUrl = await getDownloadURL(storageRef)
      }

      // Filter out empty authors
      const validAuthors = authors.filter((author) => author.name.trim())

      // Create publication document
      const publicationData = {
        title,
        category,
        excerpt,
        content,
        coverImageUrl,
        tags,
        authors: validAuthors,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
        likes: 0,
        comments: 0,
        likedBy: [],
        savedBy: [],
        status: "published",
      }

      const docRef = await addDoc(collection(db, "publications"), publicationData)

      toast({
        title: "Publication created",
        description: "Your publication has been successfully created.",
      })

      router.push(`/publications/${docRef.id}`)
    } catch (error) {
      console.error("Error creating publication:", error)
      toast({
        title: "Error",
        description: "Failed to create publication. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !user) {
    return <div className="container py-12">Loading...</div>
  }

  if (!isAdmin) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <div className="flex flex-col space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Create New Publication</h1>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            <Save className="h-4 w-4" />
            {isSubmitting ? "Publishing..." : "Publish"}
          </Button>
        </div>

        <Tabs value={previewTab} onValueChange={setPreviewTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Publication Details</CardTitle>
                <CardDescription>Enter the basic information about your publication.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter publication title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
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
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Enter a brief summary of the publication"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter the full content of the publication"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[300px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover-image">Cover Image</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("cover-image").click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </Button>
                    <Input
                      id="cover-image"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                    />
                    {coverImagePreview && (
                      <div className="relative h-16 w-16 overflow-hidden rounded-md">
                        <img
                          src={coverImagePreview || "/placeholder.svg"}
                          alt="Cover preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="Add a tag"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag} disabled={!currentTag.trim()}>
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Add Tag</span>
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {tag}</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authors</CardTitle>
                <CardDescription>Add the authors of this publication.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {authors.map((author, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                    {authors.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => handleRemoveAuthor(index)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove Author</span>
                      </Button>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor={`author-name-${index}`}>Name</Label>
                      <Input
                        id={`author-name-${index}`}
                        placeholder="Author name"
                        value={author.name}
                        onChange={(e) => handleAuthorChange(index, "name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`author-title-${index}`}>Title</Label>
                      <Input
                        id={`author-title-${index}`}
                        placeholder="Author title or role"
                        value={author.title}
                        onChange={(e) => handleAuthorChange(index, "title", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`author-avatar-${index}`}>Avatar URL</Label>
                      <Input
                        id={`author-avatar-${index}`}
                        placeholder="URL to author's avatar image"
                        value={author.avatar}
                        onChange={(e) => handleAuthorChange(index, "avatar", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={handleAddAuthor} className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Add Another Author
                </Button>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isSubmitting ? "Publishing..." : "Publish"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">{title || "Publication Title"}</h1>
                    <div className="flex items-center gap-2">
                      {category && <Badge variant="outline">{category}</Badge>}
                      <span className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {authors
                      .filter((a) => a.name)
                      .map((author, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            {author.avatar ? (
                              <img
                                src={author.avatar || "/placeholder.svg"}
                                alt={author.name}
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium">{author.name.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{author.name}</p>
                            {author.title && <p className="text-xs text-muted-foreground">{author.title}</p>}
                          </div>
                        </div>
                      ))}
                  </div>

                  {coverImagePreview && (
                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                      <img
                        src={coverImagePreview || "/placeholder.svg"}
                        alt="Publication cover"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <p className="text-lg font-medium">{excerpt || "Publication excerpt will appear here..."}</p>
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      {content ? (
                        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }} />
                      ) : (
                        <p>Publication content will appear here...</p>
                      )}
                    </div>
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

