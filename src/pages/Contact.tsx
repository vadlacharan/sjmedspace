
/* eslint-disable @typescript-eslint/ban-ts-comment */

//@ts-nocheck
import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { api } from '@/lib/mock-api';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  subject: z.string().trim().min(1, 'Subject is required').max(200),
  message: z.string().trim().min(1, 'Message is required').max(2000),
});

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => { fieldErrors[issue.path[0] as string] = issue.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await api.submitContact(result.data as { name: string; email: string; subject: string; message: string });
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast({ title: 'Message sent!', description: 'We will get back to you shortly.' });
    } catch (err) {
      toast({ title: 'Error', description: err.message || 'Failed to send message.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="hero-gradient py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-bold md:text-5xl">Get in Touch</h1>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Have questions about our research or interested in collaboration? We'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-2xl">
          {success ? (
            <div className="rounded-lg border border-border bg-card p-12 text-center card-shadow animate-fade-in">
              <CheckCircle className="mx-auto h-12 w-12 text-accent" />
              <h2 className="mt-4 font-display text-2xl font-bold text-foreground">Thank You!</h2>
              <p className="mt-2 text-muted-foreground">Your message has been received. We'll respond within 2-3 business days.</p>
              <Button onClick={() => setSuccess(false)} variant="outline" className="mt-6">Send Another Message</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border bg-card p-8 card-shadow">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What is this about?" />
                {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us more..." rows={5} />
                {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
              </div>
              <Button type="submit" disabled={submitting} className="w-full gap-2">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
