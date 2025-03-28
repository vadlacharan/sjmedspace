"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

export default function PublicationsSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [tag, setTag] = useState(searchParams.get("tag") || "")
  const [sort, setSort] = useState(searchParams.get("sort") || "recent")

  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // In a real app, you might have a separate collection for categories and tags
        // For now, we'll use placeholder data
        setCategories(["USMLE Step 1", "USMLE Step 2", "USMLE Step 3", "Clinical Skills", "Medical Education"])

        setTags([
          "anatomy",
          "pathology",
          "pharmacology",
          "physiology",
          "biochemistry",
          "microbiology",
          "immunology",
          "high-yield",
          "clinical cases",
          "study strategies",
        ])
      } catch (error) {
        console.error("Error fetching filters:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFilters()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (category) params.set("category", category)
    if (tag) params.set("tag", tag)
    if (sort) params.set("sort", sort)

    router.push(`/publications?${params.toString()}`)
  }

  const handleReset = () => {
    setSearchQuery("")
    setCategory("")
    setTag("")
    setSort("recent")
    router.push("/publications")
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search publications..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
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

          <Select value={tag} onValueChange={setTag}>
            <SelectTrigger>
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {tags.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="comments">Most Comments</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={handleReset}>
          Reset Filters
        </Button>
        <Button type="submit">
          <Filter className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </form>
  )
}

