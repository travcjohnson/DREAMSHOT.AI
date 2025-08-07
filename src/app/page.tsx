'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/features/hero-section';
import { PromptInput } from '@/components/features/prompt-input';
import { ResultsDisplay } from '@/components/features/results-display';
import { EmailCapture } from '@/components/features/email-capture';
import { getTrendingPrompts, recentActivity } from '@/lib/data/example-prompts';

export default function HomePage() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  const handlePromptSubmit = (prompt: string) => {
    setCurrentPrompt(prompt);
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 4500);
  };

  const handleEmailCapture = () => {
    setShowEmailCapture(true);
  };

  const handleEmailSuccess = () => {
    setShowEmailCapture(false);
    // Could show a success message or redirect
  };

  const trendingPrompts = getTrendingPrompts();

  return (
    <div className="min-h-screen bg-[hsl(var(--paper))]">
      {/* Minimal Header */}
      <header className="fixed top-0 w-full z-40 bg-[hsl(var(--paper))]/95 border-b-4 border-black">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="font-display text-2xl font-black">
              MyPromptBench
            </div>
            <div className="font-mono text-sm">
              <span className="hidden md:inline">A Scientific Study of AI Progress</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-20">
        <HeroSection />

        {/* Problem Section */}
        <section className="py-20 md:py-32 bg-white border-t-4 border-black">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="font-display text-display mb-8">
                But here&apos;s what
                <br />
                <span className="highlight">usually happens...</span>
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="text-4xl">😎</div>
                  <div>
                    <p className="text-xl font-bold mb-2">&ldquo;Oh cool, GPT-5 is out!&rdquo;</p>
                    <p className="text-gray-600">You rush to try the new model...</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="text-4xl">🤔</div>
                  <div>
                    <p className="text-xl font-bold mb-2">&ldquo;What was that prompt I used to test GPT-4?&rdquo;</p>
                    <p className="text-gray-600">You search through old chats, notes, everywhere...</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="text-4xl">😩</div>
                  <div>
                    <p className="text-xl font-bold mb-2">&ldquo;...I have no idea.&rdquo;</p>
                    <p className="text-gray-600 text-lg">
                      You lose the magic of seeing AI evolve because you can&apos;t remember your exact words.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-16 p-8 bg-black text-white">
                <p className="font-mono text-lg text-center">
                  FACT: 97% of prompts are lost to history*
                </p>
                <p className="font-mono text-xs text-center mt-2 opacity-70">
                  *We made this up but you know it&apos;s true
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-20 md:py-32 bg-[hsl(var(--paper))]">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="font-display text-display mb-8">
                What if you
                <br />
                <span className="text-red-600">never forgot?</span>
              </h2>
              <p className="text-2xl max-w-3xl mx-auto">
                Set your prompt once. We&apos;ll run it on every new model. 
                <span className="font-bold"> Forever.</span>
              </p>
            </div>

            {/* Prompt Input */}
            <PromptInput 
              onSubmit={handlePromptSubmit}
              isProcessing={isProcessing}
            />

            {/* Results Display */}
            {showResults && (
              <div id="results" className="mt-20">
                <ResultsDisplay 
                  prompt={currentPrompt}
                  onEmailCapture={handleEmailCapture}
                />
              </div>
            )}
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-20 md:py-32 bg-white border-t-4 border-black">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="font-display text-display text-center mb-16">
              Prompts aging like
              <br />
              <span className="highlight">fine wine</span>
            </h2>

            {/* Trending Prompts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {trendingPrompts.map((prompt) => (
                <div 
                  key={prompt.id}
                  className="border-brutal border-black p-6 bg-white shadow-brutal hover:shadow-brutal-lg transition-all"
                >
                  <div className="font-mono text-sm text-gray-600 mb-2">
                    {prompt.category}
                  </div>
                  <p className="font-bold mb-4 line-clamp-2">
                    &ldquo;{prompt.text}&rdquo;
                  </p>
                  <div className="text-3xl font-display font-black text-red-600 mb-2">
                    {prompt.improvement}
                  </div>
                  <div className="font-mono text-xs text-gray-600">
                    {prompt.submissions.toLocaleString()} submissions
                  </div>
                </div>
              ))}
            </div>

            {/* Live Activity Feed */}
            <div className="max-w-2xl mx-auto">
              <h3 className="font-mono text-sm uppercase text-center mb-6">
                Live Activity Feed
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 border-2 border-gray-200"
                  >
                    <span className="font-mono text-sm">
                      Someone {activity.action} a {activity.category} prompt
                    </span>
                    <span className="font-mono text-xs text-gray-600">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-32 bg-black text-white">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="font-display text-display mb-8">
              Create your
              <br />
              Will Smith moment
            </h2>
            <p className="text-2xl mb-12 opacity-90">
              What prompt will YOU watch evolve?
            </p>
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="
                px-12 py-6 text-lg font-bold uppercase
                bg-white text-black border-brutal border-white
                shadow-brutal hover:shadow-brutal-lg
                hover:translate-x-[-2px] hover:translate-y-[-2px]
                transition-all duration-100
              "
            >
              Start Your Benchmark →
            </Button>
            <p className="mt-8 font-mono text-sm opacity-70">
              No sign up. Just enter a prompt and your email. Watch AI grow up.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-white bg-black text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <p className="font-mono text-sm opacity-70">
              A brutalist experiment in tracking AI progress
            </p>
            <p className="font-mono text-xs mt-2 opacity-50">
              Made with ❤️ by people who never want to forget a prompt again
            </p>
          </div>
        </div>
      </footer>

      {/* Email Capture Modal */}
      {showEmailCapture && (
        <EmailCapture
          prompt={currentPrompt}
          onSuccess={handleEmailSuccess}
          onClose={() => setShowEmailCapture(false)}
        />
      )}
    </div>
  );
}