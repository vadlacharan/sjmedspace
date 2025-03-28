"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export default function GalleryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [event, setEvent] = useState(searchParams.get("event") || "")

  const [categories, setCategories] = useState([])
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // In a real app, you might have a separate collection for categories and events
        // For now, we'll use placeholder data
        setCategories(["Conference", "Workshop", "Seminar", "Social Event", "Graduation", "Award Ceremony"])

        setEvents([
          "USMLE Prep Workshop 2023",
          "Medical Education Conference 2023",
          "Research Symposium 2022",
          "Annual Gala 2023",
          "Student Recognition Ceremony",
        ])
      } catch (error) {
        console.error("Error fetching filters:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFilters()
  }, [])

  const handleApplyFilters = () => {
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (event) params.set("event", event)

    router.push(`/gallery?${params.toString()}`)
  }

  const handleReset = () => {
    setCategory("")
    setEvent("")
    router.push("/gallery")
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={event} onValueChange={setEvent}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {events.map((evt) => (
              <SelectItem key={evt} value={evt}>
                {evt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={handleReset}>
          Reset Filters
        </Button>
        <Button type="button" onClick={handleApplyFilters}>
          <Filter className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  )
}

