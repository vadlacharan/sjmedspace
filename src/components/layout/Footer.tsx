import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="font-display text-xl font-bold text-foreground">
              SJMed<span className="text-accent">Space</span>
            </Link>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Advancing knowledge through rigorous research, community engagement, and evidence-based policy recommendations for sustainable development.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Explore</h4>
            <nav className="flex flex-col gap-2">
              {['Blogs', 'Publications', 'Gallery', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Connect</h4>
            {/* <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>info@researchhub.org</span>
              <span>+1 (555) 234-5678</span>
              <span>Geneva, Switzerland</span>
            </div> */}
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SJMedspace. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
