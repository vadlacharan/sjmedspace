'use client'

import { useState, useEffect, useCallback } from 'react'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, CheckCircle, Heart } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

export default function Publications() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [showFavorites, setShowFavorites] = useState(false)
  const [publications, setPublications] = useState([])
  const [savedPublications, setSavedPublications] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavoriteLoading, setIsFavoriteLoading] = useState({})
  const router = useRouter()

  const fetchPublications = useCallback(async () => {
    try {
      const response = await fetch("/api/publications")
      if (!response.ok) {
        throw new Error('Failed to fetch publications')
      }
      const data = await response.json()
      setPublications(data.publications)
    } catch (error) {
      setError("Error fetching publications. Please try again later.")
    }
  }, [])

  const fetchSavedPublications = useCallback(async () => {
    try {
      const response = await fetch("/api/savepublication")
      if (!response.ok) {
        throw new Error('Failed to fetch saved publications')
      }
      const data = await response.json()
      setSavedPublications(data.savedpublications)
    } catch (error) {
      setError("Error fetching saved publications. Please try again later.")
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await Promise.all([fetchPublications(), fetchSavedPublications()])
      setIsLoading(false)
    }
    fetchData()
  }, [fetchPublications, fetchSavedPublications])

  const filteredPublications = publications.filter(pub => {
    const isSaved = savedPublications.some(saved => saved?.publication_id === pub.id)
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || 
      (filter === 'read' && isSaved) || 
      (filter === 'unread' && !isSaved)
    const matchesFavorites = !showFavorites || (isSaved && savedPublications.find(saved => saved?.publication_id === pub.id)?.favourite)
    return matchesSearch && matchesFilter && matchesFavorites
  })

  const favoritePublications = savedPublications.filter(pub => pub?.favourite)

  const toggleFavorite = async (id) => {
    setIsFavoriteLoading(prev => ({ ...prev, [id]: true }))
    try {
      // Optimistic update
      setSavedPublications(prev => prev.map(pub => 
        pub.publication_id === id ? { ...pub, favourite: !pub.favourite } : pub
      ))

      const response = await fetch("/api/savepublication", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      })
      if (!response.ok) {
        throw new Error('Failed to toggle favorite')
      }
      const updatedSavedPub = await response.json()
      
      // Update with server response
      setSavedPublications(prev => prev.map(pub => 
        pub.id === updatedSavedPub.id ? updatedSavedPub : pub
      ))
    } catch (error) {
      // Revert optimistic update on error
      setSavedPublications(prev => prev.map(pub => 
        pub.publication_id === id ? { ...pub, favourite: !pub.favourite } : pub
      ))
      setError("Error updating favorite status. Please try again.")
    } finally {
      setIsFavoriteLoading(prev => ({ ...prev, [id]: false }))
    }
  }

  const handleReadArticle = async (id) => {
    try {
      const response = await fetch("/api/savepublication", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      })
      if (!response.ok) {
        throw new Error('Failed to save publication')
      }
      const data = await response.json()
      setSavedPublications(prev => [...prev, data.savedPublication])
      router.push(data.link)
    } catch (error) {
      setError("Error saving publication. Please try again.")
    }
  }

  const renderPublicationCard = (pub) => {
    const savedPub = savedPublications.find(saved => saved?.publication_id === pub.id)
    const isSaved = !!savedPub
    const isFavorite = isSaved && savedPub.favourite

    return (
      <Card key={pub.id} className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">{pub.title}</CardTitle>
            <div className="flex items-center space-x-2">
              {isSaved && (
                <CheckCircle className="h-5 w-5 text-green-300" />
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleFavorite(pub.id)}
                className="text-white hover:text-teal-200"
                disabled={isFavoriteLoading[pub.id]}
              >
                {isFavoriteLoading[pub.id] ? (
                  <Skeleton className="h-5 w-5 rounded-full bg-white/50" />
                ) : (
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                )}
                <span className="sr-only">
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex justify-between items-center">
          <Badge variant="secondary">{pub.category}</Badge>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-teal-600 hover:text-teal-700"
            onClick={() => handleReadArticle(pub.id)}
          >
            {isSaved ? 'Read Again' : 'Read Full Article'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto mt-8 px-4">
          <h1 className="text-4xl font-bold text-teal-600 mb-8">Publications</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-4xl font-bold text-teal-600 mb-8">Publications</h1>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="relative flex-grow w-full sm:w-auto">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search publications..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Publications</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-favorites"
                checked={showFavorites}
                onCheckedChange={setShowFavorites}
              />
              <Label htmlFor="show-favorites">Show Favorites</Label>
            </div>
          </div>
        </div>

        {showFavorites ? (
          <div>
            <h2 className="text-2xl font-bold text-teal-600 mb-4">Favorite Publications</h2>
            <div className="space-y-4">
              {favoritePublications.map(savedPub => {
                const pub = publications.find(p => p.id === savedPub?.publication_id)
                return pub ? renderPublicationCard(pub) : null
              })}
            </div>
            {favoritePublications.length === 0 && (
              <p className="text-center text-muted-foreground">No favorite publications yet.</p>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-teal-600 mb-4">All Publications</h2>
            <div className="space-y-4">
              {filteredPublications.map(renderPublicationCard)}
            </div>
            {filteredPublications.length === 0 && !error && (
              <p className="text-center text-muted-foreground mt-8">No publications found.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

