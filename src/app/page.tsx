import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="text-xl font-semibold tracking-tight text-foreground">
              DREAMSHOT.AI
            </div>
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6">
        <div className="text-center py-32">
          <h1 className="text-5xl md:text-6xl font-medium text-foreground mb-8 leading-[1.1] tracking-tight">
            Track Your Dreams from
            <br />
            <span className="text-primary">Impossible to Inevitable</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Share your wildest dreams and watch AI analyze their journey from impossible to possible. 
            Every breakthrough started as someone's "impossible" idea.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/dreams/new">
              <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                Submit Your Dream
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="h-12 px-8 border-border hover:bg-muted">
                How It Works
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-32">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6 tracking-tight">
              AI-Powered Dream Analysis
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our advanced AI models track the evolution of impossible ideas into breakthrough realities
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 bg-card/50 hover:bg-card/80 transition-colors duration-200 p-6">
              <CardHeader className="text-center pb-6 px-0">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <CardTitle className="text-xl font-medium">Dream Analysis</CardTitle>
                <CardDescription className="text-muted-foreground">
                  AI models analyze your dreams and track their journey from impossible to possible
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <p className="text-sm text-muted-foreground text-center">
                  Multiple AI models assess feasibility, track progress, and identify breakthrough moments
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 hover:bg-card/80 transition-colors duration-200 p-6">
              <CardHeader className="text-center pb-6 px-0">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <CardTitle className="text-xl font-medium">Progress Tracking</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Watch impossibility scores decrease as technology and understanding advance
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <p className="text-sm text-muted-foreground text-center">
                  Visual timelines show how your dreams evolve from impossible to inevitable
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 hover:bg-card/80 transition-colors duration-200 p-6">
              <CardHeader className="text-center pb-6 px-0">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle className="text-xl font-medium">Community Inspiration</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Share dreams publicly and get inspired by others' impossible journeys
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <p className="text-sm text-muted-foreground text-center">
                  Connect with dreamers worldwide and witness collective human ambition unfold
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-32">
          <div className="text-center bg-muted/30 rounded-3xl p-16 border-0">
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6 tracking-tight">
              What's Your Impossible Dream?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Every breakthrough started as someone's impossible idea. Share yours and watch AI track its journey to reality.
            </p>
            <Link href="/dreams/new">
              <Button size="lg" className="h-14 px-12 text-base bg-primary hover:bg-primary/90">
                Submit Your Dream Now
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">&copy; 2024 DREAMSHOT.AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}