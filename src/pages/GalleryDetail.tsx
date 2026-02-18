
/* eslint-disable @typescript-eslint/ban-ts-comment */

//@ts-nocheck
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '@/lib/mock-api';
import type { GalleryEvent } from '@/lib/types';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LexicalComponent } from '@/components/Lexical';

export default function GalleryDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<GalleryEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getGalleryEventById(parseInt(id))
      .then(setEvent)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl animate-pulse space-y-6">
            <div className="h-6 w-32 rounded bg-muted" />
            <div className="h-10 w-2/3 rounded bg-muted" />
            <div className="h-80 rounded-lg bg-muted" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="font-display text-2xl font-bold">Event not found</h2>
          <Link to="/gallery"><Button variant="outline" className="mt-6">Back to Gallery</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <Link to="/gallery">
            <Button variant="ghost" size="sm" className="mb-6 gap-1 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> All Events
            </Button>
          </Link>

          <header className="space-y-4">
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{event.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {/* <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {format(new Date(event.date), 'MMMM d, yyyy')}</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {event.location}</span> */}
            </div>
          </header>

             <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <img
                   src={event.thumbnail?.url || "/placeholder.svg"}
                  alt={`${event.title} `}
                  className=" w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <LexicalComponent data={event.description} />
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {/* {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Full size" className="max-h-[85vh] max-w-full rounded-lg object-contain" />
        </div>
      )} */}
    </Layout>
  );
}
