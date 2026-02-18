import { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/mock-api';
import type { ContentItem, ContentType } from '@/lib/types';

interface LikeButtonProps {
  item: ContentItem;
  type: ContentType;
  onUpdate: (updated: ContentItem) => void;
}

export default function LikeButton({ item, type, onUpdate }: LikeButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const isLiked = isAuthenticated && item.likedBy.some((l) => l.user === user?.id);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({ title: 'Please login to continue', description: 'You need to be logged in to like content.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const updated = await api.toggleLike(type, item.id, user!.id);
      onUpdate(updated);
    } catch {
      toast({ title: 'Error', description: 'Could not update like.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isLiked ? 'default' : 'outline'}
      size="sm"
      onClick={handleLike}
      disabled={loading}
      className="gap-1.5"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />}
      {item.likeCount}
    </Button>
  );
}
