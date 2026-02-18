/* eslint-disable @typescript-eslint/ban-ts-comment */

//@ts-nocheck
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '@/lib/mock-api';
import type { ContentItem, ContentType } from '@/lib/types';
import Layout from '@/components/layout/Layout';
import LikeButton from '@/components/content/LikeButton';
import CommentSection from '@/components/content/CommentSection';
import { Badge } from '@/components/ui/badge';
import { LexicalCommand } from '@payloadcms/richtext-lexical/lexical';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LexicalComponent } from '@/components/Lexical';

interface ContentDetailPageProps {
  type: ContentType;
  backLabel: string;
  backPath: string;
}

export default function ContentDetailPage({
  type,
  backLabel,
  backPath,
}: ContentDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    api
      .getContentById(type, parseInt(id))
      .then((data) => {
        // 🔥 Normalize backend response to prevent crashes
        setItem({
          ...data,
          tag: data?.tag ?? [],
          commentedBy: data?.commentedBy ?? [],
          likedBy: data?.likedBy ?? [],
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [type, id]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl animate-pulse space-y-6">
            <div className="h-6 w-1/3 rounded bg-muted" />
            <div className="h-10 w-2/3 rounded bg-muted" />
            <div className="h-64 rounded-lg bg-muted" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Content not found
          </h2>
          <p className="mt-2 text-muted-foreground">
            {error || 'The requested item does not exist.'}
          </p>
          <Link to={backPath}>
            <Button variant="outline" className="mt-6">
              Back to {backLabel}
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Link to={backPath}>
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 gap-1 text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> {backLabel}
            </Button>
          </Link>

          <header className="space-y-4">
            {/* ✅ Safe tag rendering */}
            <div className="flex flex-wrap gap-1.5">
              {(item.tag ?? []).map((t: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>

            <h1 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
              {item.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(item.createdAt), 'MMMM d, yyyy')}
              </span>

              <LikeButton item={item} type={type} onUpdate={setItem} />
            </div>
          </header>

          {/* ✅ Safe thumbnail handling */}
          <div className="my-8 overflow-hidden rounded-lg">
            <img
              src={
                typeof item.thumbnail === 'string'
                  ? item.thumbnail
                  : '/placeholder.svg'
              }
              alt={item.title}
              className="h-auto w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>

          <div className="prose prose-lg max-w-none space-y-4 text-foreground">
            {/* Replace with real rich text rendering if needed */}
              <LexicalComponent data={item.content} />
          </div>

          <Separator className="my-10" />

          {/* ✅ Safe comment section */}
          <CommentSection
            item={item}
            type={type}
            onUpdate={(updated) =>
              setItem({
                ...updated,
                tag: updated?.tag ?? [],
                commentedBy: updated?.commentedBy ?? [],
                likedBy: updated?.likedBy ?? [],
              })
            }
          />
        </div>
      </article>
    </Layout>
  );
}
