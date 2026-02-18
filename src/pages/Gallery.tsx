/* eslint-disable @typescript-eslint/ban-ts-comment */

//@ts-nocheck
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { api } from "@/lib/mock-api";
import type { GalleryEvent, PaginatedResponse } from "@/lib/types";
import Layout from "@/components/layout/Layout";
import PaginationControls from "@/components/content/PaginationControls";
import SkeletonCard from "@/components/common/SkeletonCard";

export default function Gallery() {
  const [data, setData] = useState<PaginatedResponse<GalleryEvent> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);

    api
      .getGalleryEvents({ page, limit: 6 })
      .then(setData)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <Layout>
      <section className="hero-gradient py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            Event Gallery
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Browse highlights from our events.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : data && data.docs.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.docs.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/gallery/${event.id}`}
                    className="group block overflow-hidden rounded-lg border border-border bg-card card-shadow transition-all hover:card-shadow-hover"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={event.thumbnail|| "/placeholder.svg"}
                        alt={event.title || "Event image"}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/placeholder.svg";
                        }}
                      />
                    </div>

                    <div className="p-5">
                      <h3 className="font-display text-lg font-semibold text-card-foreground group-hover:text-accent transition-colors">
                        {event.title}
                      </h3>

                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(event.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <PaginationControls
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </>
        ) : (
          <p className="py-16 text-center text-muted-foreground">
            No events found.
          </p>
        )}
      </div>
    </Layout>
  );
}
