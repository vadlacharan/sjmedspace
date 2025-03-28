"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { BookOpen, Users, MessageSquare, Image, Plus, Upload } from "lucide-react"
import AdminPublicationsList from "@/components/admin-publications-list"
import AdminGalleryList from "@/components/admin-gallery-list"

export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/")
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return <div className="container py-12">Loading...</div>
  }

  if (!isAdmin) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage publications, gallery, and site content.</p>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/admin/publications/new">
                <Plus className="mr-2 h-4 w-4" />
                New Publication
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                document.getElementById("gallery-tab").click()
                setTimeout(() => {
                  const addImageBtn = document.querySelector("[data-add-image-btn]")
                  if (addImageBtn) addImageBtn.click()
                }, 100)
              }}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload to Gallery
            </Button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Publications</CardTitle>
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100+</div>
              <p className="text-xs text-muted-foreground">12 published this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">500+</div>
              <p className="text-xs text-muted-foreground">45 new this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">250+</div>
              <p className="text-xs text-muted-foreground">32 new this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Gallery Images</CardTitle>
              <Image className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75+</div>
              <p className="text-xs text-muted-foreground">15 uploaded this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Tabs */}
        <Tabs defaultValue="publications" className="space-y-4" id="admin-tabs">
          <TabsList>
            <TabsTrigger value="publications">Publications</TabsTrigger>
            <TabsTrigger value="gallery" id="gallery-tab">
              Gallery
            </TabsTrigger>
          </TabsList>
          <TabsContent value="publications" className="space-y-4">
            <AdminPublicationsList />
          </TabsContent>
          <TabsContent value="gallery" className="space-y-4" id="gallery-section">
            <AdminGalleryList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

