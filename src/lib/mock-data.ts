import type { ContentItem, GalleryEvent, User } from './types';

const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const mockUsers: User[] = [
  { id: 1, name: 'Dr. Sarah Mitchell', email: 'sarah@research.org', avatar: '' },
  { id: 2, name: 'James Chen', email: 'james@institute.org', avatar: '' },
  { id: 3, name: 'Amara Okafor', email: 'amara@university.edu', avatar: '' },
];

const contentTexts = [
  {
    title: 'Advancing Sustainable Development Through Community-Driven Research',
    excerpt: 'Exploring how participatory research methodologies are reshaping the landscape of sustainable development in underserved communities across the globe.',
    tags: ['sustainability', 'research', 'community'],
  },
  {
    title: 'The Future of Digital Governance in Emerging Economies',
    excerpt: 'An in-depth analysis of how digital transformation is reshaping governance structures and public service delivery in developing nations.',
    tags: ['governance', 'digital', 'policy'],
  },
  {
    title: 'Climate Resilience: Lessons from Frontline Communities',
    excerpt: 'Documenting the adaptive strategies and indigenous knowledge systems that communities are leveraging to build climate resilience.',
    tags: ['climate', 'resilience', 'indigenous'],
  },
  {
    title: 'Bridging the Gender Gap in STEM: A Policy Framework',
    excerpt: 'Proposing evidence-based policy interventions to address systemic barriers that limit women\'s participation in science and technology.',
    tags: ['gender', 'STEM', 'policy'],
  },
  {
    title: 'Urban Planning for Inclusive Cities: A Comparative Study',
    excerpt: 'Examining how cities across different continents are incorporating inclusivity principles into their urban development strategies.',
    tags: ['urban', 'inclusivity', 'planning'],
  },
  {
    title: 'Data-Driven Decision Making in Public Health',
    excerpt: 'How emerging data analytics and AI tools are transforming public health surveillance and intervention strategies worldwide.',
    tags: ['health', 'data', 'AI'],
  },
  {
    title: 'Renewable Energy Transitions in Sub-Saharan Africa',
    excerpt: 'Analyzing the technical, economic, and social dimensions of shifting toward renewable energy sources in the African continent.',
    tags: ['energy', 'renewable', 'Africa'],
  },
  {
    title: 'The Role of Education Technology in Post-Pandemic Learning',
    excerpt: 'Evaluating the effectiveness and equity implications of EdTech solutions adopted during and after the global pandemic.',
    tags: ['education', 'technology', 'pandemic'],
  },
  {
    title: 'Water Security and Transboundary Resource Management',
    excerpt: 'Investigating cooperative frameworks for managing shared water resources in regions experiencing increasing scarcity.',
    tags: ['water', 'security', 'cooperation'],
  },
  {
    title: 'Social Innovation and Entrepreneurship in Developing Markets',
    excerpt: 'Profiling innovative social enterprises that are addressing critical development challenges through market-based solutions.',
    tags: ['innovation', 'entrepreneurship', 'social'],
  },
  {
    title: 'Cultural Heritage Preservation in the Digital Age',
    excerpt: 'Exploring how digital technologies are being deployed to document, preserve, and share cultural heritage artifacts globally.',
    tags: ['culture', 'heritage', 'digital'],
  },
  {
    title: 'Mental Health in Conflict Zones: Challenges and Interventions',
    excerpt: 'Examining the mental health impact of prolonged conflict and the psychosocial support mechanisms proving effective in the field.',
    tags: ['health', 'conflict', 'mental-health'],
  },
];

function generateContent(type: 'blog' | 'publication', count: number): ContentItem[] {
  const items: ContentItem[] = [];
  const baseDate = new Date('2025-06-01');

  for (let i = 0; i < count; i++) {
    const textIdx = i % contentTexts.length;
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i * 3);

    const commentCount = Math.floor(Math.random() * 5);
    const likeCount = Math.floor(Math.random() * 20) + 1;
    const comments = Array.from({ length: commentCount }, (_, ci) => ({
      id: generateId(),
      user: (ci % 3) + 1,
      commentvalue: [
        'Excellent research! This is truly groundbreaking work.',
        'Very insightful perspective on this important topic.',
        'I would love to see more data supporting these conclusions.',
        'This aligns with our findings in a related study.',
        'Thank you for sharing this comprehensive analysis.',
      ][ci % 5],
    }));

    const likes = Array.from({ length: likeCount }, (_, li) => ({
      id: generateId(),
      user: (li % 3) + 1,
    }));

    items.push({
      id: i + 1,
      title: `${contentTexts[textIdx].title}`,
      thumbnail: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=800&h=500&fit=crop`,
      likeCount,
      content: {
        root: {
          children: [
            { type: 'paragraph', text: contentTexts[textIdx].excerpt },
            { type: 'paragraph', text: 'This work represents a significant contribution to the field, drawing on extensive fieldwork and collaborative research methodologies. Our findings suggest that integrated approaches yield substantially better outcomes than traditional siloed interventions.' },
            { type: 'paragraph', text: 'The methodology employed in this study combines quantitative analysis with qualitative insights gathered from over 200 interviews with stakeholders across multiple regions. This mixed-methods approach ensures both statistical rigor and contextual depth.' },
          ],
        },
      },
      excerpt: contentTexts[textIdx].excerpt,
      commentedBy: comments,
      tag: contentTexts[textIdx].tags,
      likedBy: likes,
      updatedAt: date.toISOString(),
      createdAt: date.toISOString(),
    });
  }

  return items.reverse();
}

export const mockBlogs: ContentItem[] = generateContent('blog', 12);
export const mockPublications: ContentItem[] = generateContent('publication', 12);

const thumbnailUrls = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=800&h=500&fit=crop',
];

export const mockGalleryEvents: GalleryEvent[] = [
  {
    id: 1,
    title: 'Annual Research Symposium 2025',
    description: 'A gathering of leading researchers and practitioners to present findings on sustainable development, featuring keynote addresses and panel discussions.',
    date: '2025-11-15',
    location: 'Geneva, Switzerland',
    coverImage: thumbnailUrls[0],
    images: [thumbnailUrls[0], thumbnailUrls[1], thumbnailUrls[2], thumbnailUrls[3]],
    tag: ['symposium', 'research'],
  },
  {
    id: 2,
    title: 'Community Workshop: Data Literacy',
    description: 'Hands-on workshop empowering community leaders with data analysis skills for evidence-based decision making.',
    date: '2025-09-20',
    location: 'Nairobi, Kenya',
    coverImage: thumbnailUrls[1],
    images: [thumbnailUrls[1], thumbnailUrls[4], thumbnailUrls[5]],
    tag: ['workshop', 'education'],
  },
  {
    id: 3,
    title: 'Policy Dialogue on Digital Governance',
    description: 'High-level dialogue with policymakers exploring the intersection of technology and governance in emerging economies.',
    date: '2025-08-05',
    location: 'Singapore',
    coverImage: thumbnailUrls[2],
    images: [thumbnailUrls[2], thumbnailUrls[0], thumbnailUrls[3], thumbnailUrls[5]],
    tag: ['policy', 'governance'],
  },
  {
    id: 4,
    title: 'Climate Resilience Field Visit',
    description: 'Documenting community-led climate adaptation strategies through an immersive field visit.',
    date: '2025-07-10',
    location: 'Dhaka, Bangladesh',
    coverImage: thumbnailUrls[3],
    images: [thumbnailUrls[3], thumbnailUrls[1], thumbnailUrls[4]],
    tag: ['climate', 'fieldwork'],
  },
  {
    id: 5,
    title: 'Women in STEM Leadership Summit',
    description: 'Celebrating and advancing the role of women in science, technology, engineering and mathematics across institutions.',
    date: '2025-06-22',
    location: 'London, United Kingdom',
    coverImage: thumbnailUrls[4],
    images: [thumbnailUrls[4], thumbnailUrls[0], thumbnailUrls[2], thumbnailUrls[5]],
    tag: ['gender', 'STEM', 'leadership'],
  },
  {
    id: 6,
    title: 'Innovation Lab Launch',
    description: 'Grand opening of our new innovation laboratory dedicated to social enterprise development and prototyping.',
    date: '2025-05-01',
    location: 'Accra, Ghana',
    coverImage: thumbnailUrls[5],
    images: [thumbnailUrls[5], thumbnailUrls[1], thumbnailUrls[3]],
    tag: ['innovation', 'launch'],
  },
];

export const allTags = Array.from(
  new Set([
    ...mockBlogs.flatMap((b) => b.tag),
    ...mockPublications.flatMap((p) => p.tag),
  ])
).sort();

export const galleryTags = Array.from(
  new Set(mockGalleryEvents.flatMap((e) => e.tag))
).sort();
