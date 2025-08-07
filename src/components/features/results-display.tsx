'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getRandomPrompts } from '@/lib/data/example-prompts';

interface ResultsDisplayProps {
  prompt: string;
  onEmailCapture: () => void;
}

export function ResultsDisplay({ prompt, onEmailCapture }: ResultsDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [improvementScore, setImprovementScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  
  // Get a random example to use as fake results
  const [fakeResults] = useState(() => {
    const examples = getRandomPrompts(1);
    return examples[0];
  });

  useEffect(() => {
    // Trigger animations
    const timer = setTimeout(() => setIsVisible(true), 100);
    const scoreTimer = setTimeout(() => {
      // Animate improvement score
      const targetScore = 250 + Math.floor(Math.random() * 200);
      let current = 0;
      const increment = targetScore / 30;
      
      const interval = setInterval(() => {
        current += increment;
        if (current >= targetScore) {
          setImprovementScore(targetScore);
          clearInterval(interval);
        } else {
          setImprovementScore(Math.floor(current));
        }
      }, 50);
      
      return () => clearInterval(interval);
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(scoreTimer);
    };
  }, []);

  // Generate fake outputs based on the prompt
  const generateFakeOutput = (model: string) => {
    const quality = model === 'gpt4' ? 0.9 : 0.5;
    const complexity = prompt.length * quality;
    
    if (model === 'gpt3') {
      return fakeResults?.gpt3Output || `Basic response to: "${prompt.slice(0, 50)}..."`;
    }
    return fakeResults?.gpt4Output || `Advanced, nuanced response to: "${prompt.slice(0, 50)}..." with deeper understanding and better execution.`;
  };

  return (
    <div className={`
      max-w-6xl mx-auto
      transition-all duration-500
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      {/* Main Results Container */}
      <div className="border-brutal border-black bg-white shadow-brutal-lg p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-title mb-4">
            Analysis Complete
          </h2>
          <div className="font-mono text-sm text-gray-600 mb-8">
            PROMPT ID: #{Math.floor(Math.random() * 50000) + 10000}
          </div>
          
          {/* Big Improvement Score */}
          <div className="mb-8">
            <div className="text-9xl font-display font-black">
              {improvementScore}%
            </div>
            <div className="text-xl font-mono uppercase tracking-wider">
              Improvement Over Time
            </div>
          </div>
        </div>

        {/* Model Comparisons */}
        <div className="space-y-8 mb-12">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-left group"
          >
            <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-black hover:bg-gray-100 transition-colors">
              <span className="font-mono font-bold">
                {showDetails ? 'Hide' : 'Show'} Model Outputs
              </span>
              <span className="text-2xl transform transition-transform group-hover:translate-x-1">
                {showDetails ? '↑' : '↓'}
              </span>
            </div>
          </button>

          {showDetails && (
            <div className="space-y-6 animate-in">
              {/* GPT-3 Output */}
              <div className="border-l-4 border-gray-400 pl-6">
                <h3 className="font-mono text-sm uppercase mb-2">
                  GPT-3 (March 2023)
                </h3>
                <div className="bg-gray-50 p-4 font-mono text-sm">
                  {generateFakeOutput('gpt3')}
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  Quality Score: 42/100
                </div>
              </div>

              {/* GPT-4 Output */}
              <div className="border-l-4 border-black pl-6">
                <h3 className="font-mono text-sm uppercase mb-2">
                  GPT-4 (March 2024)
                </h3>
                <div className="bg-green-50 p-4 font-mono text-sm">
                  {generateFakeOutput('gpt4')}
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  Quality Score: 89/100
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="text-center p-4 border-2 border-black">
            <div className="text-3xl font-bold">{improvementScore}%</div>
            <div className="text-xs font-mono uppercase">Overall</div>
          </div>
          <div className="text-center p-4 border-2 border-black">
            <div className="text-3xl font-bold">{Math.floor(improvementScore * 0.8)}%</div>
            <div className="text-xs font-mono uppercase">Clarity</div>
          </div>
          <div className="text-center p-4 border-2 border-black">
            <div className="text-3xl font-bold">{Math.floor(improvementScore * 1.1)}%</div>
            <div className="text-xs font-mono uppercase">Creativity</div>
          </div>
          <div className="text-center p-4 border-2 border-black">
            <div className="text-3xl font-bold">{Math.floor(improvementScore * 0.9)}%</div>
            <div className="text-xs font-mono uppercase">Accuracy</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center border-t-4 border-black pt-8">
          <h3 className="font-display text-3xl mb-4">
            But here&apos;s the magic part...
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            When GPT-5, Claude 4, or Gemini Ultra launches, 
            we&apos;ll automatically run your prompt and show you the results.
          </p>
          
          <Button
            onClick={onEmailCapture}
            className="
              px-12 py-6 text-lg font-bold uppercase
              bg-red-600 text-white border-brutal border-black
              shadow-brutal-red hover:shadow-brutal-lg
              hover:translate-x-[-2px] hover:translate-y-[-2px]
              active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
              transition-all duration-100
            "
          >
            Track This Prompt Forever →
          </Button>
          
          <p className="mt-4 font-mono text-footnote text-gray-600">
            No spam. Just your prompt&apos;s evolution story.
          </p>
        </div>
      </div>

      {/* Scientific Citation */}
      <div className="mt-8 p-6 bg-gray-50 border-2 border-dashed border-gray-400">
        <p className="font-mono text-sm">
          <strong>To cite this result:</strong><br />
          {prompt.slice(0, 50)}... (2024). <em>MyPromptBench Longitudinal Study</em>. 
          Prompt ID: #{Math.floor(Math.random() * 50000) + 10000}. 
          Improvement Score: {improvementScore}%.
        </p>
      </div>
    </div>
  );
}