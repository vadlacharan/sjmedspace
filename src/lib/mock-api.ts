import type { ContentItem, PaginatedResponse, SortOption, GalleryEvent, ContactFormData } from './types';
import { mockBlogs, mockPublications, mockGalleryEvents } from './mock-data';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function paginate<T>(items: T[], page: number, limit: number): PaginatedResponse<T> {
  const totalDocs = items.length;
  const totalPages = Math.ceil(totalDocs / limit);
  const start = (page - 1) * limit;
  const docs = items.slice(start, start + limit);

  return {
    docs,
    totalDocs,
    limit,
    totalPages,
    page,
    pagingCounter: start + 1,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
  };
}

function filterAndSort(
  items: ContentItem[],
  params: { search?: string; tags?: string[]; sort?: SortOption }
): ContentItem[] {
  let filtered = [...items];

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q)
    );
  }

  if (params.tags && params.tags.length > 0) {
    filtered = filtered.filter((item) =>
      params.tags!.some((t) => item.tag.includes(t))
    );
  }

  switch (params.sort) {
    case 'oldest':
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'most-liked':
      filtered.sort((a, b) => b.likeCount - a.likeCount);
      break;
    case 'newest':
    default:
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  return filtered;
}

// In-memory mutable copies for likes/comments
let blogsData = JSON.parse(JSON.stringify(mockBlogs)) as ContentItem[];
let publicationsData = JSON.parse(JSON.stringify(mockPublications)) as ContentItem[];

function getDataSource(type: 'blog' | 'publication'): ContentItem[] {
  return type === 'blog' ? blogsData : publicationsData;
}

function setDataSource(type: 'blog' | 'publication', data: ContentItem[]) {
  if (type === 'blog') blogsData = data;
  else publicationsData = data;
}

export const api = {
  async getContent(
  type: 'blog' | 'publication',
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: 'newest' | 'oldest' | 'popular';
  } = {}
) {
  const {
    page = 1,
    limit = 10,
    search,
    sort = 'newest',
  } = params;

  const collection = type === 'blog' ? 'blogs' : 'publications';

  const queryParams = new URLSearchParams();
  queryParams.append('page', String(page));
  queryParams.append('limit', String(limit));

  if (search) {
    queryParams.append('where[title][contains]', search);
  }

  switch (sort) {
    case 'newest':
      queryParams.append('sort', '-createdAt');
      break;
    case 'oldest':
      queryParams.append('sort', 'createdAt');
      break;
    case 'popular':
      queryParams.append('sort', '-likeCount');
      break;
  }

  const res = await fetch(
    `http://localhost:3000/api/${collection}?${queryParams.toString()}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error('Failed to fetch content');
  }

  // 🔥 Transform Payload → Your Existing Frontend Shape
  return {
    docs: data.docs.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      thumbnail: doc.thumbnail?.url || '/placeholder.svg',
      tag: doc.tags?.map((t: any) =>
        typeof t === 'string' ? t : t.title
      ) || [],
      excerpt: extractPlainText(doc.content),
      likeCount: doc.likeCount ?? doc.likedBy?.length ?? 0,
      commentedBy: doc.commentedBy ?? [],
      createdAt: doc.createdAt,
    })),
    page: data.page,
    totalPages: data.totalPages,
    totalDocs: data.totalDocs,
    hasNextPage: data.hasNextPage,
    hasPrevPage: data.hasPrevPage,
  };
},

  async getContentById(
  type: 'blog' | 'publication',
  id: number
): Promise<ContentItem> {
  const collection = type === 'blog' ? 'blogs' : 'publications';

  const res = await fetch(
    `http://localhost:3000/api/${collection}/${id}?depth=2`
  );

  if (!res.ok) {
    throw new Error('Not found');
  }

  const doc = await res.json();

  return {
    id: doc.id,
    title: doc.title,
    thumbnail: doc.thumbnail?.url || '/placeholder.svg',
    tag:
      doc.tags?.map((t: any) =>
        typeof t === 'string' ? t : t.title
      ) || [],
    content: doc.content,
    likeCount: doc.likeCount ?? doc.likedBy?.length ?? 0,
    likedBy:
      doc.likedBy?.map((l) => ({
        id: l.id,
        user: l.user?.id
      })) || [],
    commentedBy:
      doc.commentedBy?.map((c) => ({
        id: c.id,
        commentValue: c.commentValue, 
        user: c.user?.id,
        username: c.user?.fullname,
      })) || [],
    createdAt: doc.createdAt,
  };
},

  async toggleLike(
  type: 'blog' | 'publication',
  contentId: number
): Promise<ContentItem> {
  const collection = type === 'blog' ? 'blogs' : 'publications';
  const token = localStorage.getItem('auth_token');

  if (!token) throw new Error('Unauthorized');

  const res = await fetch(
    `http://localhost:3000/api/${collection}/${contentId}/toggle-like`,
    {
      method: 'POST',
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.error || 'Failed to toggle like');
  }

  const updatedDoc = await res.json();
  return this.getContentById(type, contentId);
},

async addComment(
  type: 'blog' | 'publication',
  contentId: number,
  userId: number,
  text: string
): Promise<ContentItem> {
  const collection = type === 'blog' ? 'blogs' : 'publications'
  const token = localStorage.getItem('auth_token')

  if (!token) throw new Error('Unauthorized')

  const res = await fetch(
    `http://localhost:3000/api/${collection}/${contentId}/add-comment`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({ text }),
    }
  )

  if (!res.ok) {
    const error = await res.json().catch(() => null)
    console.error(error)
    throw new Error('Failed to add comment')
  }

  const data = await res.json()

  // 🔥 Normalize Payload response to match UI shape
  return {
    ...data,
    commentedBy: (data.commentedBy || []).map((c: any) => ({
      id: c.id,
      commentValue: c.commentValue ?? '',
      user: typeof c.user === 'object' ? c.user.id : c.user,
      username:
        typeof c.user === 'object'
          ? c.user.fullname
          : 'Anonymous',
    })),
    likedBy: data.likedBy ?? [],
    likeCount: data.likeCount ?? 0,
  }
},

 async deleteComment(
  type: 'blog' | 'publication',
  contentId: number,
  commentId: string,
  userId: number
): Promise<ContentItem> {
  const collection = type === 'blog' ? 'blogs' : 'publications';
  const token = localStorage.getItem('auth_token');

  if (!token) throw new Error('Unauthorized');

  // 1️⃣ Fetch existing document with comments
  const existingRes = await fetch(
    `http://localhost:3000/api/${collection}/${contentId}?depth=2`
  );

  if (!existingRes.ok) throw new Error('Not found');

  const existingDoc = await existingRes.json();

  const existingComments = existingDoc.commentedBy || [];

  const commentToDelete = existingComments.find(
    (c: any) => c.id === commentId
  );

  if (!commentToDelete) {
    throw new Error('Comment not found');
  }

  // 2️⃣ Ownership check (frontend safety)
  if (commentToDelete.user?.id !== userId) {
    throw new Error('Unauthorized');
  }

  // 3️⃣ Filter out comment
  const updatedComments = existingComments.filter(
    (c: any) => c.id !== commentId
  );

  // 4️⃣ PATCH updated array
  const res = await fetch(
    `http://localhost:3000/api/${collection}/${contentId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({
        commentedBy: updatedComments,
      }),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to delete comment');
  }

  // 5️⃣ Return normalized content
  return this.getContentById(type, contentId);
}, 

async getGalleryEvents(
  params: { page?: number; limit?: number; tags?: string[] } = {}
): Promise<PaginatedResponse<GalleryEvent>> {
  const token = localStorage.getItem('auth_token');

  const { page = 1, limit = 6, tags } = params;

  const searchParams = new URLSearchParams();
  searchParams.append('page', page.toString());
  searchParams.append('limit', limit.toString());

  // 🔥 IMPORTANT: populate relations (thumbnail)
  searchParams.append('depth', '1');

  // 🔥 Payload tag filtering (array field)
  if (tags && tags.length > 0) {
    tags.forEach((tag, index) => {
      searchParams.append(`where[tag][in][${index}]`, tag);
    });
  }

  const res = await fetch(
    `http://localhost:3000/api/gallery?${searchParams.toString()}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `JWT ${token}` } : {}),
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch gallery events');
  }

  const data = await res.json();

  // 🔥 Normalize backend shape to frontend shape
  const normalizedDocs = data.docs.map((event: any) => ({
    id: event.id,
    title: event.title,
    description: event.description ?? '',
    createdAt: event.createdAt,
    thumbnail:
      event.thumbnail?.url ??
      '/placeholder.svg',
  }));

  return {
    docs: normalizedDocs,
    totalDocs: data.totalDocs,
    totalPages: data.totalPages,
    page: data.page,
    limit: data.limit,
  };
},
 async getGalleryEventById(id: number): Promise<GalleryEvent> {
  const token = localStorage.getItem('auth_token');

  const res = await fetch(
    `http://localhost:3000/api/gallery/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `JWT ${token}` } : {}),
      },
    }
  );

  if (!res.ok) {
    throw new Error('Gallery event not found');
  }

  const data = await res.json();

  return {
    id: data.id,
    title: data.title,
    description: data.description ?? '',
    createdAt: data.createdAt,

    // thumbnail will now be just an ID (number)
    thumbnail: data.thumbnail, 
  };
},

  async submitContact(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    await delay(800 + Math.random() * 500);
    if (!data.email || !data.name || !data.message) {
      throw new Error('All fields are required');
    }
    return { success: true, message: 'Thank you for your message. We will get back to you shortly.' };
  },

  async login(
  email: string,
  password: string
): Promise<{ user: import('./types').User; token: string }> {
  const response = await fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.errors?.[0]?.message || 'Login failed');
  }

  return {
    user: data.user,
    token: data.token,
  };
},


  async register(
  fullname: string,
  email: string,
  password: string
): Promise<{ user: import('./types').User; token: string }> {
  if (!fullname || !email || !password) {
    throw new Error('All fields are required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const response = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullname,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.errors?.[0]?.message || 'Registration failed');
  }

  // Auto-login after registration
  const loginResponse = await fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const loginData = await loginResponse.json();

  if (!loginResponse.ok) {
    throw new Error('User created but login failed');
  }

  return {
    user: loginData.user,
    token: loginData.token,
  };
}

};

function extractPlainText(content: any): string {
  if (!content?.root?.children) return '';

  return content.root.children
    .map((node: any) =>
      node.children?.map((child: any) => child.text).join(' ')
    )
    .join(' ')
    .slice(0, 150);
}
