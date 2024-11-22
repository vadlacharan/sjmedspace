'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bookmark, Search } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const publications = [
  { 
    id: 1,
    title: "Advancements in Telemedicine", 
    category: "Technology",
  },
  { 
    id: 2,
    title: "AI in Medical Diagnosis", 
    category: "Artificial Intelligence",
  },
  { 
    id: 3,
    title: "The Future of Personalized Medicine", 
    category: "Research",
  },
  { 
    id: 4,
    title: "Ethical Considerations in Gene Therapy", 
    category: "Ethics",
  },
  { 
    id: 5,
    title: "Nanotechnology in Drug Delivery", 
    category: "Pharmacology",
  },
  { 
    id: 6,
    title: "Mental Health in the Digital Age", 
    category: "Psychology",
  },
]

export default function Publications() {
  const [searchTerm, setSearchTerm] = useState('')
  const [readLater, setReadLater] = useState([])
  const [showReadLater, setShowReadLater] = useState(false)

  const filteredPublications = publications.filter(pub =>
    (pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pub.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!showReadLater || readLater.includes(pub.id)))

  const toggleReadLater = (id) => {
    setReadLater(prev => 
      prev.includes(id) ? prev.filter(pubId => pubId !== id) : [...prev, id])
  }

  return (
    (<div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-4xl font-bold text-teal-600 mb-8">Latest Publications</h1>
        <div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="relative flex-grow w-full sm:w-auto">
            <Search
              className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search publications..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="read-later-mode"
              checked={showReadLater}
              onCheckedChange={setShowReadLater} />
            <Label htmlFor="read-later-mode">Show Read Later</Label>
          </div>
        </div>
        <div className="space-y-4">
          {filteredPublications.map((pub) => (
            <Card key={pub.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">{pub.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleReadLater(pub.id)}
                    className="text-white hover:text-teal-200">
                    <Bookmark className={`h-5 w-5 ${readLater.includes(pub.id) ? 'fill-current' : ''}`} />
                    <span className="sr-only">
                      {readLater.includes(pub.id) ? 'Remove from Read Later' : 'Add to Read Later'}
                    </span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex justify-between items-center">
                <Badge variant="secondary">{pub.category}</Badge>
                <Button variant="outline" size="sm" className="text-teal-600 hover:text-teal-700">
                  Read Full Article
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredPublications.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">No publications found.</p>
        )}
      </main>
    </div>)
  );
}

