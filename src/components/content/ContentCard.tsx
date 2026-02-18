import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Calendar } from 'lucide-react';
import type { ContentItem, ContentType } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface ContentCardProps {
  item: ContentItem;
  type: ContentType;
  index?: number;
}

export default function ContentCard({ item, type, index = 0 }: ContentCardProps) {
  const detailPath = `/${type === 'blog' ? 'blogs' : 'publications'}/${item.id}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group overflow-hidden rounded-lg border border-border bg-card card-shadow transition-all duration-300 hover:card-shadow-hover"
    >
      <Link to={detailPath} className="block">
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
        </div>
      </Link>

      <div className="p-5">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {item.tag.slice(0, 3).map((t) => (
            <Badge key={t} variant="secondary" className="text-xs font-normal">
              {t}
            </Badge>
          ))}
        </div>

        <Link to={detailPath}>
          <h3 className="font-display text-lg font-semibold leading-tight text-card-foreground line-clamp-2 transition-colors group-hover:text-accent">
            {item.title}
          </h3>
        </Link>

        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {item.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" /> {item.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" /> {item.commentedBy.length}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {format(new Date(item.createdAt), 'MMM d, yyyy')}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
