'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isProcessing?: boolean;
}

const processingStates = [
  'Analyzing prompt complexity...',
  'Loading historical models...',
  'Running GPT-3 (March 2023)...',
  'Running GPT-3.5 (November 2022)...',
  'Running GPT-4 (March 2023)...',
  'Running Claude 3 (March 2024)...',
  'Calculating improvements...',
  'Generating visualization...'
];

export function PromptInput({ onSubmit, isProcessing = false }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [currentState, setCurrentState] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxChars = 500;

  useEffect(() => {
    if (isProcessing && currentState < processingStates.length) {
      const timer = setTimeout(() => {
        setCurrentState(prev => prev + 1);
      }, 600 + Math.random() * 400); // Variable timing for realism
      return () => clearTimeout(timer);
    }
  }, [isProcessing, currentState]);

  useEffect(() => {
    if (!isProcessing) {
      setCurrentState(0);
    }
  }, [isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isProcessing) {
      onSubmit(prompt.trim());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setPrompt(value);
      setCharCount(value.length);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Input Container */}
        <div className={`
          relative bg-white
          border-brutal border-black
          ${isFocused ? 'shadow-brutal-lg' : 'shadow-brutal'}
          transition-all duration-200
        `}>
          {/* Header */}
          <div className="border-b-4 border-black p-4 flex items-center justify-between">
            <h3 className="font-mono text-sm uppercase tracking-wider">
              Prompt Input Terminal
            </h3>
            <div className="flex items-center gap-2">
              <span className={`
                w-3 h-3 rounded-full
                ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}
              `} />
              <span className="font-mono text-xs text-gray-600">
                {isProcessing ? 'PROCESSING' : 'READY'}
              </span>
            </div>
          </div>

          {/* Textarea */}
          <div className="p-6">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter your prompt here. What impossible thing will become possible?"
              className="
                w-full min-h-[150px] p-4
                font-mono text-lg leading-relaxed
                bg-gray-50 border-2 border-gray-200
                focus:bg-white focus:border-black focus:outline-none
                resize-none transition-colors
                placeholder:text-gray-400
              "
              disabled={isProcessing}
            />
            
            {/* Character Count */}
            <div className="mt-2 flex justify-between items-center">
              <span className="font-mono text-xs text-gray-500">
                {charCount}/{maxChars} characters
              </span>
              {charCount > maxChars * 0.8 && (
                <span className="font-mono text-xs text-red-600">
                  Approaching limit
                </span>
              )}
            </div>
          </div>

          {/* Processing State Display */}
          {isProcessing && (
            <div className="px-6 pb-6">
              <div className="bg-black text-green-400 p-4 font-mono text-sm">
                <div className="space-y-1">
                  {processingStates.slice(0, currentState + 1).map((state, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="mr-2">{'>'}</span>
                      <span className={idx === currentState ? 'animate-pulse' : ''}>
                        {state}
                      </span>
                      {idx < currentState && <span className="ml-2 text-green-300">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={!prompt.trim() || isProcessing}
            className={`
              px-12 py-6 text-lg font-bold uppercase tracking-wider
              bg-black text-white border-brutal border-black
              shadow-brutal hover:shadow-brutal-lg
              hover:translate-x-[-2px] hover:translate-y-[-2px]
              active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:translate-x-0 disabled:hover:translate-y-0
              disabled:hover:shadow-brutal
              transition-all duration-100
            `}
          >
            {isProcessing ? 'Analyzing...' : 'Run My Benchmark →'}
          </Button>
        </div>
      </form>

      {/* Scientific Note */}
      <div className="mt-8 text-center">
        <p className="font-mono text-footnote text-gray-600">
          <span className="text-red-600">*</span>
          Your prompt will be tested across 4+ AI models spanning 2 years of progress
        </p>
      </div>
    </div>
  );
}