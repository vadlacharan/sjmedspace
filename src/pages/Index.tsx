import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileText, Image, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/mock-api';
import type { ContentItem } from '@/lib/types';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

export default function Index() {
  const [latestBlogs, setLatestBlogs] = useState<ContentItem[]>([]);
  const [latestPubs, setLatestPubs] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getContent('blog', { limit: 3, sort: 'newest' }),
      api.getContent('publication', { limit: 3, sort: 'newest' }),
    ])
      .then(([blogs, pubs]) => {
        setLatestBlogs(blogs.docs);
        setLatestPubs(pubs.docs);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      {/* ================= HERO ================= */}
      <section className="hero-gradient relative overflow-hidden py-24 md:py-32">
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="font-display text-4xl font-bold leading-tight text-blue-50 md:text-6xl">
              Advancing Knowledge for{' '}
              <span className="text-gradient">
                Sustainable Impact
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-50">
              We are a research-driven organization committed to evidence-based
              solutions for the world's most pressing challenges in development,
              governance, and sustainability.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/publications">
                <Button size="lg" variant="secondary" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Explore Publications
                </Button>
              </Link>

              <Link to="/blogs">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-primary-foreground text-orange-400 hover:bg-primary-foreground/20 hover:text-primary"
                >
                  <BookOpen className="h-4 w-4  " />
                  Read Our Blog
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </section>

      {/* ================= ABOUT ================= */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              About SJMedSpace
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-muted-foreground leading-relaxed">
           Founded by Dr. Sailaja Sanikommu is the CEO and founder of SJMedSpace, dedicated to advancing USMLE education and research.

With over 15 years of experience in medical education, Dr. Sanikommu has been at the forefront of developing innovative approaches to USMLE preparation and research.

Her work has helped thousands of medical students achieve success in their USMLE examinations and advance their medical careers.

Dr. Sanikommu continues to lead research initiatives focused on improving medical education methodologies and creating accessible resources for students worldwide
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: FileText,
                label: 'Publications',
                value: '120+',
                desc: 'Peer-reviewed papers and policy briefs',
              },
              {
                icon: Users,
                label: 'Collaborators',
                value: '45+',
                desc: 'Partner institutions worldwide',
              },
              {
                icon: Image,
                label: 'Events',
                value: '30+',
                desc: 'Conferences, workshops, and field visits',
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg border border-border bg-card p-6 shadow-sm"
              >
                <stat.icon className="mx-auto h-8 w-8 text-accent" />
                <p className="mt-3 font-display text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {stat.label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LATEST BLOGS ================= */}
      

      {/* ================= PUBLICATIONS ================= */}
      

      {/* ================= CTA ================= */}
      <section className="hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold ">
            Get Involved
          </h2>

          <p className="mx-auto mt-4 max-w-xl ">
            Interested in collaboration, partnership, or learning more about our
            work? We'd love to connect.
          </p>

          <Link to="/contact">
            <Button size="lg" variant="secondary" className="mt-6">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
