
/* eslint-disable @typescript-eslint/ban-ts-comment */

//@ts-nocheck
export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
}

export interface Comment {
  commentValue: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  username: any;
  id: string;
  user: number;
  commentvalue: string;
}

export interface Like {
  id: string;
  user: number;
}

export interface ContentItem {
  id: number;
  title: string;
  thumbnail: string;
  likeCount: number;
  content: Record<string, unknown>;
  excerpt: string;
  commentedBy: Comment[];
  tag: string[];
  likedBy: Like[];
  updatedAt: string;
  createdAt: string;
}

export interface GalleryEvent {
  thumbnail: unknown;
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  coverImage: string;
  images: string[];
  tag: string[];
}

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type SortOption = 'newest' | 'oldest' | 'most-liked';
export type ContentType = 'blog' | 'publication';
