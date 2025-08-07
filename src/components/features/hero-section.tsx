'use client';

import { useState, useEffect } from 'react';
import { WillSmithGrid } from './will-smith-grid';

export function HeroSection() {
  const [showTypewriter, setShowTypewriter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTypewriter(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Main Headline */}
        <div className="mb-16 md:mb-24">
          <h1 className="font-display text-hero mb-8 leading-[0.85]">
            <span className="block">Remember</span>
            <span className="block">This?</span>
          </h1>
        </div>

        {/* Will Smith Grid */}
        <div className="mb-16 md:mb-24">
          <WillSmithGrid />
        </div>

        {/* Narrative Section */}
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
          {/* Revelation */}
          <div className="border-l-4 border-black pl-8 md:pl-12">
            <h2 className="font-display text-section mb-4">
              One prompt. Three models.
              <br />
              <span className="highlight">Mind = blown.</span>
            </h2>
            <p className="text-xl leading-relaxed max-w-3xl">
              Someone used the same prompt across every video model: 
              <span className="font-mono bg-gray-100 px-2 py-1 mx-2">
                &ldquo;Will Smith eating spaghetti&rdquo;
              </span>
            </p>
            <p className="text-xl leading-relaxed mt-4 text-gray-600">
              They didn&apos;t plan to create history. They just... didn&apos;t forget to test it.
            </p>
          </div>

          {/* Progress Bar Animation */}
          <div className="my-12 md:my-16">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-sm">MARCH 2023</span>
              <span className="font-mono text-sm">MARCH 2024</span>
            </div>
            <div className="relative h-8 bg-gray-100 border-brutal border-black">
              <div 
                className={`
                  absolute inset-y-0 left-0 bg-black
                  transition-all duration-2000 ease-out
                  ${showTypewriter ? 'w-full' : 'w-0'}
                `}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-sm text-white mix-blend-difference">
                  533% IMPROVEMENT
                </span>
              </div>
            </div>
          </div>

          {/* Scientific Quote */}
          <blockquote className="border-brutal border-black p-8 md:p-12 bg-white shadow-brutal">
            <p className="font-display text-3xl md:text-4xl leading-tight mb-6">
              &ldquo;The Will Smith Phenomenon represents the first 
              <span className="highlight mx-2">accidental longitudinal study</span>
              of AI capability evolution.&rdquo;
            </p>
            <footer className="font-mono text-sm">
              — Journal of AI Progress Tracking, 2024
              <sup className="text-red-600 ml-1">[1]</sup>
            </footer>
          </blockquote>

          {/* Footnote */}
          <div className="text-footnote font-mono text-gray-600 max-w-2xl">
            <sup className="text-red-600">[1]</sup> This journal doesn&apos;t exist yet. 
            But your prompt could be cited in future research on AI evolution. 
            No, seriously.
          </div>
        </div>
      </div>
    </section>
  );
}