/* eslint-disable @typescript-eslint/ban-ts-comment */

//@ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '@/lib/mock-api';
import { allTags } from '@/lib/mock-data';
import type { ContentItem, ContentType, SortOption, PaginatedResponse } from '@/lib/types';
import ContentCard from '@/components/content/ContentCard';
import ContentFilters from '@/components/content/ContentFilters';
import PaginationControls from '@/components/content/PaginationControls';
import SkeletonCard from '@/components/common/SkeletonCard';
import Layout from '@/components/layout/Layout';

interface ContentListPageProps {
  type: ContentType;
  title: string;
  description: string;
}

export default function ContentListPage({ type, title, description }: ContentListPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<PaginatedResponse<ContentItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const sort = (searchParams.get('sort') as SortOption) || 'newest';
  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

  const updateParams = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.getContent(type, { page, limit: 6, search, tags: selectedTags, sort })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [type, page, search, sort, searchParams.get('tags')]);

  const handleSearchChange = (v: string) => updateParams({ search: v, page: '' });
  const handleSortChange = (v: SortOption) => updateParams({ sort: v, page: '' });
  const handleTagToggle = (tag: string) => {
    const next = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag];
    updateParams({ tags: next.join(','), page: '' });
  };
  const handleClearFilters = () => setSearchParams({});
  const hasActiveFilters = !!search || selectedTags.length > 0 || sort !== 'newest';

  return (
    <Layout>
      <section className="hero-gradient py-16 text-green-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-bold md:text-5xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-green-50">{description}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <ContentFilters
          search={search}
          onSearchChange={handleSearchChange}
          sort={sort}
          onSortChange={handleSortChange}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          allTags={allTags}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : data && data.docs.length > 0 ? (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.docs.map((item, i) => (
                <ContentCard key={item.id} item={item} type={type} index={i} />
              ))}
            </div>
            <PaginationControls
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={(p) => updateParams({ page: String(p) })}
            />
          </>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No {type === 'blog' ? 'blogs' : 'publications'} found.</p>
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="mt-2 text-sm text-accent underline">Clear filters</button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
