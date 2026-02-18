import { useState } from 'react';
import { Trash2, Loader2, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/mock-api';
import { mockUsers } from '@/lib/mock-data';
import type { ContentItem, ContentType } from '@/lib/types';

interface CommentSectionProps {
  item: ContentItem;
  type: ContentType;
  onUpdate: (updated: ContentItem) => void;
}

export default function CommentSection({ item, type, onUpdate }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({ title: 'Please login to continue', description: 'You need to be logged in to comment.', variant: 'destructive' });
      return;
    }
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const updated = await api.addComment(type, item.id, user!.id, text.trim());
      onUpdate(updated);
      setText('');
      toast({ title: 'Comment added' });
    } catch {
      toast({ title: 'Error', description: 'Could not add comment.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    setDeletingId(commentId);
    try {
      const updated = await api.deleteComment(type, item.id, commentId, user!.id);
      onUpdate(updated);
      toast({ title: 'Comment deleted' });
    } catch {
      toast({ title: 'Error', description: 'Could not delete comment.', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  const getUserName = (userId: number) => {
    return mockUsers.find((u) => u.id === userId)?.name ?? 'Anonymous';
  };

  return (
    <section className="space-y-6">
      <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
        <MessageCircle className="h-5 w-5" />
        Comments ({item.commentedBy.length})
      </h3>

      {/* Add comment */}
      <div className="space-y-3">
        <Textarea
          placeholder={isAuthenticated ? 'Share your thoughts...' : 'Please login to comment'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!isAuthenticated}
          rows={3}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={submitting || !text.trim() || !isAuthenticated}
            size="sm"
            className="gap-1.5"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Post Comment
          </Button>
        </div>
      </div>

      {/* Comments list */}
      {item.commentedBy.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No comments yet. Be the first to share your thoughts.</p>
      ) : (
        <div className="space-y-4">
          {item.commentedBy.map((comment) => (
            <div key={comment.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {comment.username.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-foreground">{comment.username}</span>
                </div>
                {isAuthenticated && user?.id === comment.user && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(comment.id)}
                    disabled={deletingId === comment.id}
                  >
                    {deletingId === comment.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{comment.commentValue}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
